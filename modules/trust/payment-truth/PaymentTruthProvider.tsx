// modules/trust/payment-truth/PaymentTruthProvider.tsx
// Owns: Payment state of truth — single source for payment status and integrity

import { createContext, useContext, useState, useCallback, type PropsWithChildren } from 'react';
import type { PaymentStatus } from '../../../invariants/payment';
import { PAYMENT_INVARIANTS } from '../../../invariants/payment';

type SubmitResult = { success: boolean; error?: string };

type PaymentTruthContextValue = {
  status: PaymentStatus;
  submitPayment: (items: { productId: string; productName: string }[]) => Promise<SubmitResult>;
  reset: () => void;
};

const PaymentTruthContext = createContext<PaymentTruthContextValue | null>(null);

export function PaymentTruthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<PaymentStatus>('idle');

  const submitPayment = useCallback(async (items: { productId: string; productName: string }[]): Promise<SubmitResult> => {
    if (!PAYMENT_INVARIANTS.ALLOWED_STATUSES_FOR_SUBMIT.includes(status)) {
      return { success: false, error: 'Payment already in progress' };
    }

    if (items.length === 0) {
      return { success: false, error: 'No items to pay for' };
    }

    setStatus('pending');

    try {
      setStatus('processing');
      // In-app payment simulation — adapter will replace this
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('confirmed');
      return { success: true };
    } catch {
      setStatus('failed');
      return { success: false, error: 'Payment processing failed' };
    }
  }, [status]);

  const reset = useCallback(() => {
    setStatus('idle');
  }, []);

  return (
    <PaymentTruthContext.Provider value={{ status, submitPayment, reset }}>
      {children}
    </PaymentTruthContext.Provider>
  );
}

export function usePaymentTruth(): PaymentTruthContextValue {
  const ctx = useContext(PaymentTruthContext);
  if (!ctx) throw new Error('usePaymentTruth must be used inside <PaymentTruthProvider>');
  return ctx;
}

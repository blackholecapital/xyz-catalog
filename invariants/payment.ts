// invariants/payment.ts
// Domain invariants for payment truth — enforced by modules/trust/payment-truth

export type PaymentStatus = 'idle' | 'pending' | 'processing' | 'confirmed' | 'failed';

export type PaymentIntent = {
  id: string;
  cartItems: { productId: string; productName: string }[];
  status: PaymentStatus;
  createdAt: number;
  confirmedAt: number | null;
};

export const PAYMENT_INVARIANTS = {
  TIMEOUT_MS: 30_000,
  ALLOWED_STATUSES_FOR_SUBMIT: ['idle', 'failed'] as PaymentStatus[],
} as const;

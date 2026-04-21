// resolver-boundary/ResolverProvider.tsx
// React context that exposes resolver contracts to all modules

import { createContext, useContext, type PropsWithChildren } from 'react';
import type { ProductResolver, CartResolver, PaymentResolver } from './contracts';
import { productResolver } from './productResolver';
import { useCart } from '../modules/conversion/cart/CartProvider';
import { usePaymentTruth } from '../modules/trust/payment-truth/PaymentTruthProvider';

type ResolverContextValue = {
  products: ProductResolver;
  cart: CartResolver;
  payment: PaymentResolver;
};

const ResolverContext = createContext<ResolverContextValue | null>(null);

export function ResolverProvider({ children }: PropsWithChildren) {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { status, submitPayment, reset } = usePaymentTruth();

  const cart: CartResolver = {
    getState: () => cartState,
    addItem: (productName: string, productId: string) => cartDispatch({ type: 'add', productName, productId }),
    removeItem: (productName: string) => cartDispatch({ type: 'remove', productName }),
    clear: () => cartDispatch({ type: 'clear' }),
    setActiveProduct: (productId: string | null) => cartDispatch({ type: 'setActiveProduct', productId }),
  };

  const payment: PaymentResolver = {
    getStatus: () => status,
    submitPayment,
    reset,
  };

  return (
    <ResolverContext.Provider value={{ products: productResolver, cart, payment }}>
      {children}
    </ResolverContext.Provider>
  );
}

export function useResolvers(): ResolverContextValue {
  const ctx = useContext(ResolverContext);
  if (!ctx) throw new Error('useResolvers must be used inside <ResolverProvider>');
  return ctx;
}

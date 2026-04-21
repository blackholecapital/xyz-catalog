// invariants/cart.ts
// Domain invariants for Cart — enforced by modules/conversion/cart

export const CART_INVARIANTS = {
  MAX_ITEMS: 20,
  DEDUP_BY: 'name' as const,
} as const;

export type CartItem = {
  productName: string;
  productId: string;
  addedAt: number;
};

export type CartState = {
  items: CartItem[];
  activeProductId: string | null;
  checkoutProductId: string | null;
};

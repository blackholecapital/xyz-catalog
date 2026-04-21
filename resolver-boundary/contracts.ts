// resolver-boundary/contracts.ts
// Data access boundary — modules request data through resolver contracts, not directly

import type { Product } from '../invariants/product';
import type { CartState } from '../invariants/cart';
import type { PaymentStatus } from '../invariants/payment';

export type ProductResolver = {
  getAll: () => Product[];
  getById: (id: string) => Product | undefined;
};

export type CartResolver = {
  getState: () => CartState;
  addItem: (productName: string, productId: string) => void;
  removeItem: (productName: string) => void;
  clear: () => void;
  setActiveProduct: (productId: string | null) => void;
};

export type PaymentResolver = {
  getStatus: () => PaymentStatus;
  submitPayment: (items: { productId: string; productName: string }[]) => Promise<{ success: boolean; error?: string }>;
  reset: () => void;
};

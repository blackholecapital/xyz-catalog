// modules/conversion/cart/CartProvider.tsx
// Owns: Cart state management — context provider with localStorage persistence

import { createContext, useContext, useReducer, useEffect, type PropsWithChildren } from 'react';
import type { CartState } from '../../../invariants/cart';
import { CART_INVARIANTS } from '../../../invariants/cart';

const CART_STORAGE_KEY = 'showroom.cart.v1';

type CartAction =
  | { type: 'add'; productName: string; productId: string }
  | { type: 'remove'; productName: string }
  | { type: 'clear' }
  | { type: 'setActiveProduct'; productId: string | null }
  | { type: 'setCheckoutProduct'; productId: string | null };

const initialState: CartState = {
  items: [],
  activeProductId: null,
  checkoutProductId: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      if (state.items.some((item) => item.productName === action.productName)) return state;
      if (state.items.length >= CART_INVARIANTS.MAX_ITEMS) return state;
      return {
        ...state,
        items: [...state.items, { productName: action.productName, productId: action.productId, addedAt: Date.now() }],
        activeProductId: action.productId,
      };
    }
    case 'remove': {
      return {
        ...state,
        items: state.items.filter((item) => item.productName !== action.productName),
        checkoutProductId: state.checkoutProductId === state.items.find((i) => i.productName === action.productName)?.productId
          ? null
          : state.checkoutProductId,
      };
    }
    case 'clear':
      return { ...state, items: [], checkoutProductId: null };
    case 'setActiveProduct':
      return { ...state, activeProductId: action.productId };
    case 'setCheckoutProduct':
      return { ...state, checkoutProductId: action.productId };
    default:
      return state;
  }
}

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as CartState;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      activeProductId: parsed.activeProductId ?? null,
      checkoutProductId: parsed.checkoutProductId ?? null,
    };
  } catch {
    return initialState;
  }
}

type CartContextValue = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable or quota exceeded — cart persists in memory only
    }
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

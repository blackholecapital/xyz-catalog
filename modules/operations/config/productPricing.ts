// modules/operations/config/productPricing.ts
// First-pass hardcoded pricing for Showroom products.
// Resolution order: title → productNumber/SKU.

export type ProductPrice = {
  setup: number;
  monthly: number;
};

const CONNECT: ProductPrice = { setup: 99, monthly: 10 };
const PAYME_PRO: ProductPrice = { setup: 199, monthly: 10 };
const GATEWAY: ProductPrice = { setup: 999, monthly: 20 };
const STUDIO: ProductPrice = { setup: 199, monthly: 20 };
const MESSAGE_TRACK: ProductPrice = { setup: 199, monthly: 20 };
const SHOWROOM: ProductPrice = { setup: 199, monthly: 20 };
const GALLERY: ProductPrice = { setup: 199, monthly: 20 };
const BIZ_PAGES: ProductPrice = { setup: 599, monthly: 20 };
const STICKERS: ProductPrice = { setup: 199, monthly: 10 };

// Keyed by product name (title-first resolution).
export const PRODUCT_PRICING: Record<string, ProductPrice> = {
  Connect: CONNECT,
  'PayMe Pro': PAYME_PRO,
  Gateway: GATEWAY,
  Studio: STUDIO,
  'Message Track': MESSAGE_TRACK,
  Showroom: SHOWROOM,
  Gallery: GALLERY,
  'Biz Pages': BIZ_PAGES,
  Stickers: STICKERS,
};

// Fallback keyed by productNumber/SKU.
export const PRODUCT_PRICING_BY_SKU: Record<string, ProductPrice> = {
  'xyz.0446': CONNECT,
  'xyz.0447': PAYME_PRO,
  'xyz.0445': GATEWAY,
  'xyz.0444': STUDIO,
  'xyz.0448': MESSAGE_TRACK,
  'xyz.0449': SHOWROOM,
  'xyz.0450': GALLERY,
  'xyz.0451': BIZ_PAGES,
  'xyz.0452': STICKERS,
};

const ZERO_PRICE: ProductPrice = { setup: 0, monthly: 0 };

export function resolveProductPrice(args: {
  name?: string;
  productNumber?: string;
}): ProductPrice {
  if (args.name) {
    const byName = PRODUCT_PRICING[args.name];
    if (byName) return byName;
  }
  if (args.productNumber) {
    const bySku = PRODUCT_PRICING_BY_SKU[args.productNumber];
    if (bySku) return bySku;
  }
  return ZERO_PRICE;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// --- Coupons ---

export type CouponCode = 'LAUNCH30' | '101010';

export type PaymentMethod = 'card' | 'usdc' | 'applepay' | 'googlepay';

export type AppliedDiscount = {
  code: CouponCode;
  label: string;
  amountOff: number;
};

export type DiscountReport = {
  discounts: AppliedDiscount[];
  totalDiscount: number;
  inputNotice: string | null; // feedback for the user-typed code
};

const LAUNCH30_PCT = 0.3;
const USDC_BONUS_PCT = 0.1;

export const COUPON_COPY = {
  LAUNCH30: {
    title: '🚀 Launch Party',
    code: 'LAUNCH30',
    detail: '30% off',
  },
  USDC_BONUS: {
    title: '🔥 USDC bonus',
    code: '101010',
    detail: 'USDC 10% off site-wide',
  },
} as const;

function round2(value: number): number {
  return +value.toFixed(2);
}

/**
 * Compute every active discount given the user-entered coupon and the
 * currently selected payment method.
 *
 * Discounts apply SEQUENTIALLY on the remainder, not stacked on the full
 * base. If LAUNCH30 is applied first, the USDC 10% bonus is then computed
 * on the post-LAUNCH30 remainder — so the two offers don't double-dip on
 * the original subtotal.
 *
 * 101010 auto-activates whenever the USDC rail is selected, so the user
 * never has to type it. Typing 101010 while not on USDC surfaces a
 * "USDC-only code — select USDC to apply" notice.
 */
export function computeDiscounts(args: {
  userCode: string;
  setupSubtotal: number;
  paymentMethod: PaymentMethod;
}): DiscountReport {
  const code = (args.userCode || '').trim().toUpperCase();
  const discounts: AppliedDiscount[] = [];
  let inputNotice: string | null = null;
  let remainder = args.setupSubtotal;

  // LAUNCH30 — user-typed only, applied first on the full base.
  if (code === 'LAUNCH30') {
    const amountOff = round2(remainder * LAUNCH30_PCT);
    discounts.push({
      code: 'LAUNCH30',
      label: '🚀 LAUNCH30 — 30% off setup',
      amountOff,
    });
    remainder = round2(remainder - amountOff);
  } else if (code === '101010') {
    if (args.paymentMethod !== 'usdc') {
      inputNotice = 'USDC-only code — select USDC to apply';
    }
    // When on USDC the auto-applier below handles it so the user never
    // double-applies by typing it manually.
  } else if (code.length > 0) {
    inputNotice = `Coupon "${code}" is not valid`;
  }

  // 101010 — auto-applies on the USDC rail. IMPORTANT: computed on the
  // *current remainder*, not the original subtotal, so LAUNCH30 + USDC
  // yields 30% + (10% of the 70% remainder) = 37% total — not 40%.
  if (args.paymentMethod === 'usdc') {
    const amountOff = round2(remainder * USDC_BONUS_PCT);
    discounts.push({
      code: '101010',
      label: '🔥 USDC 10% off — auto-applied',
      amountOff,
    });
    remainder = round2(remainder - amountOff);
  }

  const totalDiscount = round2(args.setupSubtotal - remainder);

  return { discounts, totalDiscount, inputNotice };
}

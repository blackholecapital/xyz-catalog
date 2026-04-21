// modules/conversion/cart/CartSurface.tsx
// Owns: Cart/basket display — renders the ported PayMe checkout card
// against live cart items so the Basket tab leads straight into checkout.

import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResolvers } from '../../../resolver-boundary/ResolverProvider';
import { PayMeCheckoutCard } from '../checkout/PayMeCheckoutCard';
import type { Product } from '../../../invariants/product';
import {
  resolveProductPrice,
  computeDiscounts,
  type PaymentMethod,
} from '../../operations/config/productPricing';

const CHECKOUT_API_BASE = 'https://api.xyz-labs.xyz';

export function CartSurface() {
  const navigate = useNavigate();
  const { products, cart } = useResolvers();
  const cartState = cart.getState();

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const checkoutProducts: Product[] = useMemo(() => {
    const resolved: Product[] = [];
    for (const item of cartState.items) {
      const p = products.getById(item.productId);
      if (p) resolved.push(p);
    }
    return resolved;
  }, [cartState.items, products]);

  const handlePay = useCallback(
    async (_totalDueToday: number, couponCode?: string) => {
      setError(null);
      setBusy(true);

      try {
        const checkoutId =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `chk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

        const origin = window.location.origin;

        const setupItems: any[] = [];
        const monthlyItems: any[] = [];

        for (const p of checkoutProducts) {
          const price = resolveProductPrice({
            name: p.name,
            productNumber: p.productNumber,
          });

          const setupCents = Math.round(price.setup * 100);
          const monthlyCents = Math.round(price.monthly * 100);

          if (setupCents > 0) {
            setupItems.push({
              product_id: `${p.productNumber}_setup`,
              name: `${p.name} (Setup)`,
              quantity: 1,
              unit_amount: setupCents,
            });
          }

          if (monthlyCents > 0) {
            monthlyItems.push({
              product_id: `${p.productNumber}_monthly`,
              name: `${p.name} (Monthly)`,
              quantity: 1,
              unit_amount: monthlyCents,
              recurring: { interval: 'month' as const },
            });
          }
        }

        const setupSubtotalUsd = setupItems.reduce((sum, it) => sum + it.unit_amount, 0) / 100;
        const report = computeDiscounts({
          userCode: couponCode || '',
          setupSubtotal: setupSubtotalUsd,
          paymentMethod: 'card' as PaymentMethod,
        });

        let remainingDiscountCents = Math.round((report.totalDiscount || 0) * 100);
        for (const it of setupItems) {
          if (remainingDiscountCents <= 0) break;
          const take = Math.min(it.unit_amount, remainingDiscountCents);
          it.unit_amount = it.unit_amount - take;
          remainingDiscountCents -= take;
        }

        const finalSetupItems = setupItems.filter((it) => it.unit_amount >= 1);

        const response = await fetch(`${CHECKOUT_API_BASE}/checkout/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkout_id: checkoutId,
            mode: 'subscription',
            currency: 'usd',
            success_url: `${origin}/checkout/confirm`,
            cancel_url: `${origin}/cart`,
            metadata: {
              source_origin: origin,
              source_app: 'showroom',
              coupon_code: (couponCode || '').trim(),
            },
            line_items: [...finalSetupItems, ...monthlyItems],
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          setError(data?.error ?? 'Checkout failed. Please try again.');
          return;
        }

        if (data?.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }

        setError('Checkout failed. Missing redirect URL.');
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Checkout failed. Please try again.';
        setError(message);
      } finally {
        setBusy(false);
      }
    },
    [checkoutProducts],
  );

  if (checkoutProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/70 text-sm">
        Your basket is empty.
      </div>
    );
  }

  return (
    <PayMeCheckoutCard
      products={checkoutProducts}
      busy={busy}
      error={error}
      onBack={() => navigate('/browse')}
      onRemove={(productName) => cart.removeItem(productName)}
      onPay={(total, coupon) => handlePay(total, coupon)}
    />
  );
}

# PayMe Checkout Transplant Bundle

This bundle contains the files needed to port the PayMe checkout/admin UI into Showroom or another host app.

## Included
- `payme-checkout-engine/` full checkout/admin/config/lib/types tree
- `src/config/constants.js`
- `src/services/usdcTransfer.js`
- `src/styles/global.css`
- `usdc-fees.json`

## Highest-value files
- `payme-checkout-engine/components/SinglePaymentPage.tsx`
- `payme-checkout-engine/components/BasketDemo.tsx`
- `payme-checkout-engine/admin/settings.tsx`
- `payme-checkout-engine/admin/coupons.tsx`
- `payme-checkout-engine/admin/subscriptions.tsx`
- `payme-checkout-engine/admin/payment-requests.tsx`

## Minimal mount plan
1. Copy the `payme-checkout-engine` folder into the target repo.
2. Copy the included `src/config/constants.js`, `src/services/usdcTransfer.js`, and `src/styles/global.css` into matching paths in the target repo.
3. Mount `SinglePaymentPage.tsx` for the customer checkout view.
4. Mount admin cards from `payme-checkout-engine/admin/` for the pricing/settings surface.
5. Hardcode or inject pricing first. Wire real functions after render is stable.

## Notes
- `global.css` contains the `payme-admin-grid` and `payme-toggle` styles used by admin cards.
- `usdcTransfer.js` requires `wagmi` and wallet connectors in the host app.
- Stripe/USDC libs in `payme-checkout-engine/lib/` are included as-is.
- This is a transplant bundle, not a full merged app.

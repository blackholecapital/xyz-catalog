// modules/conversion/checkout/PayMeCheckoutCard.tsx
// Ported from payme_checkout_transplant_bundle/payme-checkout-engine/components/SinglePaymentPage.tsx
// Stripped of wagmi/stripe/USDC transfer deps — this pass renders UI only against local pricing.

import { useMemo, useState } from 'react';
import type { Product } from '../../../invariants/product';
import {
  resolveProductPrice,
  formatUsd,
  computeDiscounts,
  type DiscountReport,
  type PaymentMethod,
} from '../../../modules/operations/config/productPricing';
import { useWalletConnection } from './useWalletConnection';
import {
  DEFAULT_USDC_WALLET,
  isBaseChain,
  readAdminUsdcWallet,
  sendUsdcTransfer,
} from './usdcWallet';

type CheckoutLine = {
  product: Product;
  setup: number;
  monthly: number;
};

// Showroom shell is a fixed phone-shaped frame (~410px wide), so the card
// always renders in compact stacked layout. Cards render at 90% of the
// parent container width (20% wider than the previous 75%) and are
// centered horizontally via `alignSelf`.
const cardBase: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 14,
  boxShadow:
    '0 4px 24px rgba(47,125,246,.10), 0 16px 40px rgba(10,37,64,.06)',
  display: 'flex',
  flexDirection: 'column',
  width: '90%',
  alignSelf: 'center',
};

type PayMethod = PaymentMethod;

const PAY_WITH_ROW: { id: PayMethod; label: string }[] = [
  { id: 'applepay', label: 'Apple Pay' },
  { id: 'googlepay', label: 'Google Pay' },
];

function UsdcLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      {/* Left arc bracket */}
      <path d="M14.8 6C10.2 7.6 7 11.9 7 17C7 21.5 9.5 25.4 13.2 27.4" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* Right arc bracket */}
      <path d="M17.2 6C21.8 7.6 25 11.9 25 17C25 21.5 22.5 25.4 18.8 27.4" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* Dollar sign — vertical bar */}
      <line x1="16" y1="9" x2="16" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Dollar sign — S curve */}
      <path d="M19.5 12.8C19.5 11.2 17.9 10 16 10C14.1 10 12.5 11.2 12.5 12.8C12.5 14.4 14 15.1 16 15.5C18 15.9 19.5 16.8 19.5 18.5C19.5 20.2 17.9 21.5 16 21.5C14.1 21.5 12.5 20.2 12.5 18.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function CouponField({
  value,
  onChange,
  onApply,
}: {
  value: string;
  onChange: (code: string) => void;
  onApply: () => void;
}) {
  return (
    <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onApply();
          }
        }}
        placeholder="Enter code"
        style={{
          flex: 1,
          minWidth: 0,
          padding: '9px 10px',
          border: '1px solid #d5dce5',
          borderRadius: 10,
          fontSize: 13,
          boxSizing: 'border-box',
        }}
      />
      <button
        type="button"
        onClick={onApply}
        style={{
          padding: '9px 14px',
          borderRadius: 10,
          border: 0,
          background: '#2f7df6',
          color: '#fff',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Apply
      </button>
    </div>
  );
}

function PaymentMethodsShowcase({
  selected,
  onSelect,
}: {
  selected: PayMethod;
  onSelect: (method: PayMethod) => void;
}) {
  const payWithBtnStyle = (id: PayMethod): React.CSSProperties => {
    const isSel = selected === id;
    return {
      flex: '1 1 0',
      minWidth: 0,
      padding: '7px 4px',
      borderRadius: 10,
      border: isSel ? '2px solid #2f7df6' : '1px solid #d5dce5',
      background: '#fff',
      color: '#111827',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 11,
      textAlign: 'center',
    };
  };

  const paymentModeBtnStyle = (id: PayMethod): React.CSSProperties => {
    const isSel = selected === id;
    return {
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '9px 8px',
      borderRadius: 10,
      border: isSel ? '2px solid #2f7df6' : '1px solid #d5dce5',
      background: '#fff',
      color: '#111827',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: 13,
    };
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {PAY_WITH_ROW.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            style={payWithBtnStyle(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button
          type="button"
          onClick={() => onSelect('card')}
          style={paymentModeBtnStyle('card')}
        >
          <span style={{ fontSize: 16 }} aria-hidden="true">
            💳
          </span>
          <span>Card</span>
        </button>

        <button
          type="button"
          onClick={() => onSelect('usdc')}
          style={paymentModeBtnStyle('usdc')}
        >
          <UsdcLogo size={20} />
          <span style={{ fontWeight: 700, fontSize: 13 }}>USDC</span>
        </button>
      </div>
    </div>
  );
}

function PoweredByPayMe() {
  return (
    <div style={{ marginTop: 12, textAlign: 'center', color: '#2f7df6', fontSize: 11 }}>
      Powered by PayMe
    </div>
  );
}

export type PayMeCheckoutCardProps = {
  products: Product[];
  onBack?: () => void;
  onPay?: (total: number, couponCode?: string) => void;
  onRemove?: (productName: string) => void;
  busy?: boolean;
  error?: string | null;
};

export function PayMeCheckoutCard({
  products,
  onBack,
  onPay,
  onRemove,
  busy,
  error,
}: PayMeCheckoutCardProps) {
  const [method, setMethod] = useState<PayMethod>('card');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [isUsdcInfoOpen, setIsUsdcInfoOpen] = useState(false);

  const lines: CheckoutLine[] = useMemo(
    () =>
      products.map((product) => {
        const price = resolveProductPrice({
          name: product.name,
          productNumber: product.productNumber,
        });
        return { product, setup: price.setup, monthly: price.monthly };
      }),
    [products],
  );

  const setupSubtotal = lines.reduce((sum, l) => sum + l.setup, 0);
  const monthlySubtotal = lines.reduce((sum, l) => sum + l.monthly, 0);

  // Stacked discounts — LAUNCH30 + 101010 can apply simultaneously. Selecting
  // USDC auto-applies 101010, and the report re-runs whenever method or
  // subtotal changes.
  const discountReport: DiscountReport = useMemo(
    () =>
      computeDiscounts({
        userCode: appliedCode,
        setupSubtotal,
        paymentMethod: method,
      }),
    [appliedCode, setupSubtotal, method],
  );

  const dueToday = Math.max(
    0,
    +(setupSubtotal + monthlySubtotal - discountReport.totalDiscount).toFixed(2),
  );

  const applyCoupon = () => {
    setAppliedCode(couponInput.trim().toUpperCase());
  };

  // USDC-on-Base wallet state. Active only while the USDC rail is
  // selected — other rails ignore the address/chain entirely.
  const wallet = useWalletConnection();
  const walletConnected = Boolean(wallet.address);
  const onBase = isBaseChain(wallet.chainIdHex);
  const usdcRail = method === 'usdc';
  const [usdcStatus, setUsdcStatus] = useState<string | null>(null);
  const [usdcBusy, setUsdcBusy] = useState(false);

  // CTA copy per rail, always reflecting the real post-discount total.
  // USDC rail swaps copy through Connect → Switch → Pay based on wallet
  // state so the same button drives the whole flow.
  const cta = (() => {
    if (usdcRail) {
      if (!walletConnected) return 'Connect Wallet';
      if (!onBase) return 'Switch to Base Network';
      return `Pay ${formatUsd(dueToday)} with USDC ⚡`;
    }
    switch (method) {
      case 'applepay':
        return `Pay ${formatUsd(dueToday)} with Apple Pay`;
      case 'googlepay':
        return `Pay ${formatUsd(dueToday)} with Google Pay`;
      case 'card':
      default:
        return `Pay ${formatUsd(dueToday)} securely`;
    }
  })();

  const handlePrimaryClick = async () => {
    if (usdcRail) {
      if (!walletConnected) {
        setUsdcStatus(null);
        await wallet.connect();
        return;
      }
      if (!onBase) {
        // Button is visually locked in this state, but if the user does
        // hit it from a keyboard we still nudge the wallet to switch.
        setUsdcStatus(null);
        await wallet.switchNetwork();
        return;
      }
      const storedAdminWallet = readAdminUsdcWallet();
      // Guard against a stale/misconfigured admin wallet pointing at the
      // payer themselves — a self-send leaves the user's balance unchanged
      // minus gas and the merchant never gets paid. Fall back to the
      // canonical default so the transfer always lands at a real
      // recipient.
      const payerAddress = (wallet.address ?? '').toLowerCase();
      const adminWallet =
        storedAdminWallet.toLowerCase() === payerAddress
          ? DEFAULT_USDC_WALLET
          : storedAdminWallet;
      if (!adminWallet) {
        setUsdcStatus('Admin USDC wallet is not configured. Contact support.');
        return;
      }
      setUsdcBusy(true);
      setUsdcStatus('Confirm the transfer in your wallet…');
      try {
        const txHash = await sendUsdcTransfer({
          from: wallet.address as string,
          to: adminWallet,
          amountUsd: dueToday,
        });
        setUsdcStatus(`Payment submitted — tx ${txHash.slice(0, 10)}…`);
        onPay?.(dueToday, appliedCode || undefined);
      } catch (err: unknown) {
        const message =
          (err as { message?: string })?.message ?? 'USDC payment failed.';
        setUsdcStatus(message);
      } finally {
        setUsdcBusy(false);
      }
      return;
    }
    onPay?.(dueToday, appliedCode || undefined);
  };

  const primaryDisabled =
    busy || usdcBusy || lines.length === 0;

  // Whether the user-typed code is currently active. Used to decide
  // between rendering the coupon input vs the applied-pill + Remove.
  const typedCodeIsActive =
    appliedCode === 'LAUNCH30' &&
    discountReport.discounts.some((d) => d.code === 'LAUNCH30');

  const removeCoupon = () => {
    setAppliedCode('');
    setCouponInput('');
  };

  return (
    <div
      style={{
        margin: '0 auto',
        padding: '8px 10px 20px',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Recap card — product rows flow directly under the heading, no
          email prompt and no "Order details" label. */}
      <div style={cardBase}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <h1 style={{ margin: 0, fontSize: 18, color: '#2f7df6', lineHeight: 1.2 }}>
              Review your order
            </h1>
            <button
              type="button"
              onClick={() => setIsUsdcInfoOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 10,
                border: '1px solid #2f7df6',
                background: '#fff',
                color: '#111827',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <UsdcLogo size={16} />
              <span>USDC ?</span>
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            <div
              style={{
                background: '#f7f9fc',
                borderRadius: 12,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {lines.map((line) => (
                <div
                  key={line.product.productNumber}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    columnGap: 10,
                    rowGap: 2,
                    alignItems: 'center',
                    paddingBottom: 6,
                    borderBottom: '1px dashed #e5ebf2',
                  }}
                >
                  {/* Row 1 ─ Product name • SKU on the left, X remove on the
                      right (sitting above the price list in the same column). */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
                    <strong style={{ fontSize: 13 }}>{line.product.name}</strong>
                    <span style={{ color: '#5f6c7b', fontSize: 11, fontWeight: 500 }}>
                      • SKU {line.product.productNumber}
                    </span>
                  </div>
                  {onRemove ? (
                    <button
                      type="button"
                      onClick={() => onRemove(line.product.name)}
                      aria-label={`Remove ${line.product.name}`}
                      style={{
                        justifySelf: 'end',
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        border: 0,
                        background: 'transparent',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: 16,
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ✕
                    </button>
                  ) : (
                    <span />
                  )}

                  {/* Row 2 ─ Setup (one-time) label / amount (no "Setup" word). */}
                  <span style={{ color: '#5f6c7b', fontSize: 11 }}>
                    Setup (one-time)
                  </span>
                  <span style={{ fontSize: 11, color: '#5f6c7b', justifySelf: 'end' }}>
                    {formatUsd(line.setup)}
                  </span>

                  {/* Row 3 ─ Hosting label / monthly amount. */}
                  <span style={{ color: '#2f7df6', fontSize: 11, fontWeight: 600 }}>
                    Hosting
                  </span>
                  <span style={{ fontSize: 11, color: '#2f7df6', fontWeight: 600, justifySelf: 'end' }}>
                    {formatUsd(line.monthly)} / mo
                  </span>
                </div>
              ))}
              {lines.length === 0 && (
                <div style={{ color: '#5f6c7b', fontSize: 12 }}>No items in checkout.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment + summary card */}
      <div style={cardBase}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 6,
              color: '#2f7df6',
            }}
          >
            Summary
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
              fontSize: 13,
            }}
          >
            <span>Setup subtotal</span>
            <span>{formatUsd(setupSubtotal)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
              color: '#2f7df6',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <span>Monthly recurring</span>
            <span>{formatUsd(monthlySubtotal)} / mo</span>
          </div>
          {/* Stacked discount rows — one per active code. Shows two rows
              when LAUNCH30 is typed and USDC is selected. */}
          {discountReport.discounts.length === 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
                color: '#5f6c7b',
                fontSize: 13,
              }}
            >
              <span>Discount</span>
              <span>- $0.00</span>
            </div>
          ) : (
            discountReport.discounts.map((d) => (
              <div
                key={d.code}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  color: '#166534',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <span style={{ marginRight: 8, flex: 1, minWidth: 0 }}>{d.label}</span>
                <span>- {formatUsd(d.amountOff)}</span>
              </div>
            ))
          )}
          {/* Invalid / restricted code feedback lives INSIDE the summary so
              it replaces the noisy below-input notice from the prior pass. */}
          {discountReport.inputNotice && (
            <div
              style={{
                marginBottom: 6,
                fontSize: 12,
                color: '#b45309',
                fontWeight: 600,
              }}
            >
              {discountReport.inputNotice}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: 16,
              paddingTop: 8,
              borderTop: '1px solid #e5ebf2',
            }}
          >
            <span>Total due today</span>
            <span>{formatUsd(dueToday)}</span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#5f6c7b',
              marginTop: 2,
              textAlign: 'right',
            }}
          >
            Then {formatUsd(monthlySubtotal)} / month
          </div>

          {/* You saved $X today — only surfaces when there's a real combined
              discount against the setup subtotal. */}
          {discountReport.totalDiscount > 0 && (
            <div
              style={{
                marginTop: 6,
                padding: '6px 10px',
                borderRadius: 10,
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#166534',
                fontWeight: 700,
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              You saved {formatUsd(discountReport.totalDiscount)} today
            </div>
          )}

          {/* Coupon input — replaced by an applied pill once LAUNCH30 is
              active. The Remove button clears the applied code, which
              cascades through `computeDiscounts` and resets the totals. */}
          {typedCodeIsActive ? (
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 10,
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#166534',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span>✅ {appliedCode} applied</span>
              <button
                type="button"
                onClick={removeCoupon}
                style={{
                  background: 'transparent',
                  border: 0,
                  color: '#166534',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <CouponField
              value={couponInput}
              onChange={setCouponInput}
              onApply={applyCoupon}
            />
          )}

          {/* Promo copy — two distinct offers on their own lines, replacing
              the old run-on banner. Hidden while a code is already applied
              so the customer isn't nagged about what they've already taken. */}
          {!typedCodeIsActive && (
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: '8px 10px',
                background: '#fff6ed',
                border: '1px solid #fde6c9',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                color: '#7c3c00',
                textAlign: 'left',
              }}
            >
              <span>🚀 Launch Party — 30% OFF (LAUNCH30)</span>
              <span>🔥 Extra 10% OFF with USDC on Everything</span>
            </div>
          )}

          <div style={{ marginTop: 8 }}>
            <PaymentMethodsShowcase selected={method} onSelect={setMethod} />
          </div>

          {/* Base-network-only notice + connected address — surfaces above
              the CTA while the USDC rail is selected, so the lock reason
              is obvious before the user taps. */}
          {usdcRail && (
            <div style={{ marginTop: 8, fontSize: 11, color: '#5f6c7b' }}>
              {!walletConnected && <span>USDC on BASE network only.</span>}
              {walletConnected && !onBase && (
                <span style={{ color: '#b45309', fontWeight: 700 }}>
                  ⚠ Base network only — switch networks in your wallet to continue.
                </span>
              )}
              {walletConnected && onBase && wallet.address && (
                <span>
                  Connected{' '}
                  <strong>
                    {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
                  </strong>{' '}
                  on Base.
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            disabled={primaryDisabled}
            onClick={handlePrimaryClick}
            style={{
              width: '100%',
              marginTop: 10,
              padding: 12,
              borderRadius: 12,
              border: 0,
              background: '#2f7df6',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: primaryDisabled ? 'not-allowed' : 'pointer',
              opacity: primaryDisabled ? 0.6 : 1,
            }}
          >
            {busy || usdcBusy || wallet.connecting ? 'Processing…' : cta}
          </button>

          {/* USDC flow feedback — connect errors, network nudges, and the
              tx-hash receipt all surface here so the user gets a single
              status line beneath the CTA. */}
          {usdcRail && (wallet.error || usdcStatus) && (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: wallet.error ? '#dc2626' : '#166534',
                fontWeight: 600,
              }}
            >
              {wallet.error ?? usdcStatus}
            </div>
          )}

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                width: '100%',
                marginTop: 6,
                padding: 8,
                borderRadius: 12,
                border: '1px solid #d5dce5',
                background: '#fff',
                color: '#5f6c7b',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Back to cart
            </button>
          )}

          {error && (
            <div
              style={{
                marginTop: 10,
                color: '#dc2626',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
        </div>
        <PoweredByPayMe />
      </div>

      {/* USDC payments info popup — fires from the "USDC pmts" button next
          to the "Review your order" heading. Bullets walk the user through
          how to pay in USDC on BASE and why mobile browsers don't connect
          from outside a web3 wallet. Backdrop tap or X closes. */}
      {isUsdcInfoOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsUsdcInfoOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              width: '100%',
              maxWidth: 320,
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px 8px',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UsdcLogo size={20} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>
                  USDC payments
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUsdcInfoOpen(false)}
                aria-label="Close USDC info"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  border: 0,
                  background: 'transparent',
                  color: '#5f6c7b',
                  cursor: 'pointer',
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            <ul
              style={{
                margin: 0,
                padding: '4px 20px 16px',
                listStyle: 'disc',
                color: '#111827',
                fontSize: 12,
                lineHeight: 1.45,
              }}
            >
              <li style={{ marginBottom: 6 }}>
                💵 <strong>USDC</strong> is the premier stablecoin — always worth <strong>$1 USD</strong>.
              </li>
              <li style={{ marginBottom: 6 }}>
                ✅ Easy to use once your wallet is connected.
              </li>
              <li style={{ marginBottom: 6 }}>Select <strong>USDC</strong> as your payment method.</li>
              <li style={{ marginBottom: 6 }}>
                Click <strong>Pay with USDC</strong> to connect your wallet.
              </li>
              <li style={{ marginBottom: 6 }}>
                USDC on <strong>BASE network only</strong>.{' '}
                <span style={{ color: '#5f6c7b' }}>(keeps it ez)</span>
              </li>
              <li style={{ marginBottom: 6 }}>
                The pay button is <strong>locked if not on BASE</strong>.{' '}
                <span style={{ color: '#5f6c7b' }}>(keeps it safe)</span>
              </li>
              <li style={{ marginBottom: 6 }}>
                😤 Mobile users must use the{' '}
                <strong>browser inside your web3 wallet</strong>.
              </li>
              <li>
                😠 Mobile web3 wallets will <strong>not connect from outside browsers</strong>.
              </li>
            </ul>

            <div style={{ padding: '0 16px 14px' }}>
              <button
                type="button"
                onClick={() => setIsUsdcInfoOpen(false)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 10,
                  border: 0,
                  background: '#2f7df6',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

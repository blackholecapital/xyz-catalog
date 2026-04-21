// modules/engagement/gallery/GallerySurface.tsx
// Owns: Build surface — Your Build list, dual-format (PC + mobile) product
// preview, Price Quote CTA that hands off to the checkout/pricing page.

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slugifyProductName } from '../../../invariants/product';
import { useResolvers } from '../../../resolver-boundary/ResolverProvider';
import { useAutoScroll } from '../../../hooks/useAutoScroll';
import { resolveProductPrice } from '../../operations/config/productPricing';

export function GallerySurface() {
  const navigate = useNavigate();
  const { products, cart } = useResolvers();
  const allProducts = products.getAll();
  const cartState = cart.getState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isCustomBuildOpen, setIsCustomBuildOpen] = useState(false);

  const product = allProducts[currentIndex];

  // Auto-advance the preview every 5s until the user taps/clicks/keys.
  useAutoScroll(allProducts.length, setCurrentIndex);

  // Track the carousel preview as the nav's active "Add" target
  useEffect(() => {
    if (product) {
      cart.setActiveProduct(slugifyProductName(product.name));
    }
  }, [product, cart]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < allProducts.length - 1 ? i + 1 : i));
  }, [allProducts.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }, []);
  const thumbWindowStart = Math.min(
    Math.max(currentIndex - 1, 0),
    Math.max(allProducts.length - 4, 0),
  );
  const visibleProducts = allProducts.slice(thumbWindowStart, thumbWindowStart + 4);

  if (!product) return null;

  return (
    <div className="flex flex-col min-h-full px-4 py-4 pb-[84px]">
      {/* Your Build — heading row stays pinned at the top. */}
      <div className="flex items-center justify-between gap-2 flex-shrink-0">
        <h2 className="text-lg font-semibold text-[hsl(var(--color-foreground))] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">Your Build</h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsPricingOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 text-white shadow-sm add-ripple-effect"
          >
            Customize It
          </button>
          <button
            type="button"
            onClick={() => setIsCustomBuildOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 text-white shadow-sm add-ripple-effect"
          >
            Custom Build
          </button>
        </div>
      </div>

      {/* Scrollable items + hero image region. Takes all vertical space
          above the fixed preview tiles below (flex-1 + min-h-0 so it can
          shrink within the flex column) and scrolls internally when the
          list grows, so the preview tiles never shift down as more items
          are added. The xyzblue.png hero image sits at the end of the
          list, so it's visible in the empty state and scrolls away
          naturally once the list fills the area. */}
      <div className="flex-1 min-h-0 overflow-y-auto mt-3 space-y-3 thumb-rail">
        {cartState.items.length === 0 ? (
          <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Nothing in your build yet — add a product below.</p>
        ) : (
          <div className="space-y-2">
            {cartState.items.map((item) => {
              const itemProduct = products.getById(item.productId);
              const price = itemProduct
                ? resolveProductPrice({
                    name: itemProduct.name,
                    productNumber: itemProduct.productNumber,
                  })
                : null;
              const goToProduct = () => {
                if (itemProduct) {
                  navigate(`/profile/${slugifyProductName(itemProduct.name)}`);
                }
              };
              return (
                <div
                  key={item.productName}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[hsl(var(--color-surface-raised))] animate-card-enter"
                >
                  {itemProduct && (
                    <button
                      type="button"
                      onClick={goToProduct}
                      className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
                      aria-label={`Open ${itemProduct.name} profile`}
                    >
                      <img
                        src={itemProduct.orderedImages[0]}
                        alt={itemProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={goToProduct}
                    className="flex-1 min-w-0 text-left focus:outline-none"
                  >
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-sm font-semibold text-[hsl(var(--color-foreground))] truncate">{item.productName}</h3>
                      {itemProduct && (
                        <span className="text-[10px] font-medium text-[hsl(var(--color-muted-foreground))] whitespace-nowrap">
                          SKU {itemProduct.productNumber}
                        </span>
                      )}
                    </div>
                    {price && (
                      <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-0.5">
                        Setup ${price.setup} · ${price.monthly}/mo
                      </p>
                    )}
                    <p className="text-[10px] font-semibold text-amber-700 mt-0.5">
                      🚀 30% OFF LAUNCH30 · 🔥 +10% USDC
                    </p>
                  </button>
                  <button
                    onClick={() => cart.removeItem(item.productName)}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[hsl(var(--color-muted-foreground))] hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remove ${item.productName} from build`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Brand hero — xyzblue.png was previously in this scrollable
            region. It's been moved down into the preview row's left
            column so it cleanly fills the dead space above the landscape
            tile and below the top of the portrait tile. */}
      </div>

      {/* Product preview row — PC landscape panel (66% width) with a 9:16
          mobile preview companion on the right. The xyz Labs logo sits
          above the landscape tile, filling the dead space between the
          top of the portrait tile (which is taller) and the top of the
          landscape tile. items-stretch (default) so the left column
          stretches to match the portrait tile's row height and the logo
          region can grow into that dead strip. */}
      <div className="flex gap-5 my-4 px-1">
        {/* Left column: xyz Labs logo over the landscape tile */}
        <div
          className="flex flex-col w-[66%] flex-shrink-0"
        >
          {/* Logo wrapper — fills whatever row height is left over above
              the landscape tile. max-h-full on the img lets it scale
              into that strip without pushing the tile down. pb-0 anchors
              to the tile edge, and the img translateY pulls it lower
              so it reads as sitting on top of the tile rather than
              floating above it. */}
          <div className="flex-1 min-h-0 flex items-end justify-center pb-0">
            <img
              src="/xyzblue.png"
              alt="xyz Labs"
              aria-hidden
              className="max-h-full w-auto max-w-full object-contain pointer-events-none select-none"
              style={{ transform: 'translateY(15%)' }}
            />
          </div>

          {/* PC preview — dominant landscape panel, pinned to column bottom */}
          <div
            className="relative rounded-[1.75rem] overflow-hidden shadow-lg cursor-pointer"
            style={{ aspectRatio: '25 / 14' }}
            onClick={() => navigate(`/profile/${slugifyProductName(product.name)}`)}
          >
            <img
              src={product.orderedImages[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
              <h2 className="text-lg font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{product.name}</h2>
              <p className="text-xs text-white/80 mt-0.5 font-mono tracking-wide">ID {product.productNumber}</p>
            </div>
          </div>
        </div>

        {/* Mobile preview — 9:16 phone-like frame mirroring the same product */}
        <div
          className="relative flex-1 rounded-[1.25rem] overflow-hidden shadow-lg cursor-pointer bg-black border border-neutral-900 self-end"
          style={{ aspectRatio: '9 / 16' }}
          onClick={() => navigate(`/profile/${slugifyProductName(product.name)}`)}
        >
          <img
            src={product.orderedImagesMobile?.[0] ?? product.orderedImages[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
            <h3 className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] truncate">{product.name}</h3>
            <p className="text-[9px] leading-tight text-white/80 mt-0.5 font-mono tracking-wide">ID {product.productNumber}</p>
          </div>
        </div>
      </div>

      {/* Sticky footer — preview pagination, sits above bottom nav */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-[390px] px-4 py-3 bg-[hsl(var(--color-surface))]/95 backdrop-blur-md border-t border-[hsl(var(--color-border))] pointer-events-auto space-y-3">
          {/* Navigation + round preview thumbnails */}
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full border border-[hsl(var(--color-border))] flex items-center justify-center disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex items-center justify-center gap-2 flex-1 px-2">
              {visibleProducts.map((previewProduct, i) => {
                const realIndex = thumbWindowStart + i;
                return (
                  <button
                    key={previewProduct.name}
                    onClick={() => setCurrentIndex(realIndex)}
                    className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                      realIndex === currentIndex
                        ? 'border-[hsl(var(--color-primary))] scale-105'
                        : 'border-[hsl(var(--color-border))]'
                    }`}
                  >
                    <img src={previewProduct.orderedImages[0]} alt={previewProduct.name} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>

            <button
              onClick={goNext}
              disabled={currentIndex === allProducts.length - 1}
              className="w-10 h-10 rounded-full border border-[hsl(var(--color-border))] flex items-center justify-center disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

        </div>
      </div>

      {/* Price Quote popup — pricing breakdown for the current build + an
          inline Request Demo affordance. "Continue to Checkout" hands off
          to the full PayMe card on the /cart route. */}
      {isPricingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setIsPricingOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[330px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[hsl(var(--color-surface))] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <h3 className="text-base font-bold text-[hsl(var(--color-foreground))]">Price Quote</h3>
              <button
                type="button"
                onClick={() => setIsPricingOpen(false)}
                aria-label="Close price quote"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[hsl(var(--color-muted-foreground))] hover:bg-slate-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 pb-4 space-y-3">
              {(() => {
                // Build the line items from what's currently in the cart.
                // Empty cart → fall back to the active showroom/gallery
                // product so the popup still shows meaningful numbers.
                type QuoteLine = {
                  key: string;
                  name: string;
                  sku: string;
                  setup: number;
                  monthly: number;
                };
                const lines: QuoteLine[] = cartState.items.length > 0
                  ? cartState.items
                      .map((item): QuoteLine | null => {
                        const p = products.getById(item.productId);
                        if (!p) return null;
                        const price = resolveProductPrice({ name: p.name, productNumber: p.productNumber });
                        return {
                          key: item.productId,
                          name: p.name,
                          sku: p.productNumber,
                          setup: price.setup,
                          monthly: price.monthly,
                        };
                      })
                      .filter((l): l is QuoteLine => l !== null)
                  : [(() => {
                      const price = resolveProductPrice({ name: product.name, productNumber: product.productNumber });
                      return {
                        key: product.name,
                        name: product.name,
                        sku: product.productNumber,
                        setup: price.setup,
                        monthly: price.monthly,
                      };
                    })()];
                const setupTotal = lines.reduce((sum, l) => sum + l.setup, 0);
                const monthlyTotal = lines.reduce((sum, l) => sum + l.monthly, 0);
                return (
                  <>
                    {/* Pricing breakdown — one row per attached product with
                        its SKU shown in muted text under the name. */}
                    <div className="rounded-xl bg-[hsl(var(--color-surface-raised))] p-3 space-y-1.5">
                      {lines.map((l) => (
                        <div key={l.key} className="flex items-start justify-between gap-2 text-xs">
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-[hsl(var(--color-foreground))] truncate">{l.name}</span>
                            <span className="text-[10px] text-[hsl(var(--color-muted-foreground))] whitespace-nowrap">
                              SKU {l.sku}
                            </span>
                          </div>
                          <span className="text-[hsl(var(--color-muted-foreground))] whitespace-nowrap pt-0.5">
                            ${l.setup} · ${l.monthly}/mo
                          </span>
                        </div>
                      ))}
                      <div className="h-px bg-[hsl(var(--color-border))] my-1.5" />
                      <div className="flex items-baseline justify-between text-xs font-bold">
                        <span>Setup today</span>
                        <span>${setupTotal}</span>
                      </div>
                      <div className="flex items-baseline justify-between text-[11px] text-[hsl(var(--color-muted-foreground))]">
                        <span>Then monthly</span>
                        <span>${monthlyTotal}/mo</span>
                      </div>
                    </div>

                    {/* Customise-this-item prompt — per-item customization
                        ask, scoped to whatever the customer attached. Hard
                        cap at 300 chars so it stays short-form. */}
                    <div className="rounded-xl border border-[hsl(var(--color-border))] p-3 space-y-2">
                      <p className="text-xs font-semibold text-[hsl(var(--color-foreground))]">
                        Customise this item
                      </p>
                      <textarea
                        rows={4}
                        maxLength={300}
                        placeholder={'Tell us how to tailor it:\n• add my logos\n• brand colors: red / blue\n• must-have feature\n• who it\u2019s for'}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs resize-none leading-snug"
                      />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPricingOpen(false)}
                        className="w-full py-2 rounded-lg text-xs font-semibold bg-[hsl(var(--color-surface-raised))] text-[hsl(var(--color-foreground))] border border-[hsl(var(--color-border))]"
                      >
                        Custom Request
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPricingOpen(false);
                        navigate('/cart');
                      }}
                      className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 text-white shadow-md add-ripple-effect"
                    >
                      Continue to Checkout →
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Custom Build popup — free-form brief for a fully custom build.
          Same outer format as the Price Quote popup: dim backdrop, card
          centered in the phone frame, tap-outside or X to close. Body is
          an email field + a 500-char textarea with structured prompts to
          keep the ask tight and answerable. */}
      {isCustomBuildOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setIsCustomBuildOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[330px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[hsl(var(--color-surface))] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <h3 className="text-base font-bold text-[hsl(var(--color-foreground))]">Custom Build</h3>
              <button
                type="button"
                onClick={() => setIsCustomBuildOpen(false)}
                aria-label="Close custom build"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[hsl(var(--color-muted-foreground))] hover:bg-slate-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs text-[hsl(var(--color-muted-foreground))] leading-snug">
                Tell us what to build. We use the items in <strong>Your Build</strong>
                {' '}as reference points so we know the shape of the ask.
              </p>

              {/* Attached items — mirrors the Build page list format. Shows
                  each cart item as a compact row (thumb + name/SKU + price
                  + discount badge). If the cart is empty, prompt the user
                  to add at least one item before sending a custom brief. */}
              {cartState.items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[hsl(var(--color-border))] p-3 text-center space-y-2">
                  <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                    Add at least one product to <strong>Your Build</strong> as a
                    reference point before requesting a custom build.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomBuildOpen(false);
                      navigate('/');
                    }}
                    className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold text-[hsl(var(--color-primary))] border border-[hsl(var(--color-primary))]"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wide font-semibold text-[hsl(var(--color-muted-foreground))]">
                    Reference items
                  </p>
                  {cartState.items.map((item) => {
                    const refProduct = products.getById(item.productId);
                    const refPrice = refProduct
                      ? resolveProductPrice({
                          name: refProduct.name,
                          productNumber: refProduct.productNumber,
                        })
                      : null;
                    return (
                      <div
                        key={item.productName}
                        className="flex items-center gap-3 p-2 rounded-xl bg-[hsl(var(--color-surface-raised))]"
                      >
                        {refProduct && (
                          <img
                            src={refProduct.orderedImages[0]}
                            alt={refProduct.name}
                            className="flex-shrink-0 w-11 h-11 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h4 className="text-xs font-semibold text-[hsl(var(--color-foreground))] truncate">
                              {item.productName}
                            </h4>
                            {refProduct && (
                              <span className="text-[9px] font-medium text-[hsl(var(--color-muted-foreground))] whitespace-nowrap">
                                SKU {refProduct.productNumber}
                              </span>
                            )}
                          </div>
                          {refPrice && (
                            <p className="text-[10px] text-[hsl(var(--color-muted-foreground))] mt-0.5">
                              Setup ${refPrice.setup} · ${refPrice.monthly}/mo
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
              />

              <textarea
                rows={7}
                maxLength={500}
                placeholder={[
                  'What it does: 1 line',
                  'Who it\u2019s for:',
                  'Similar to: software it behaves like',
                  'Phase 1 — bare functions / click-through',
                  'Later phases — how it all ties together',
                ].join('\n')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs resize-none leading-snug"
              />
              <p className="text-[10px] text-[hsl(var(--color-muted-foreground))] text-right">
                500 character limit
              </p>

              <button
                type="button"
                onClick={() => setIsCustomBuildOpen(false)}
                disabled={cartState.items.length === 0}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 text-white shadow-md add-ripple-effect disabled:opacity-40"
              >
                Send Custom Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

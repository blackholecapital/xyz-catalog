// modules/engagement/profile/ProfileExpanded.tsx
// Owns: Product profile expanded view — hero with bottom-left title, demo links,
// pricing, body copy, and a centered preview-card modal for image inspection.

import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { slugifyProductName } from '../../../invariants/product';
import { useResolvers } from '../../../resolver-boundary/ResolverProvider';
import { useAutoScroll } from '../../../hooks/useAutoScroll';
import { resolveProductPrice } from '../../operations/config/productPricing';

export function ProfileExpanded() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, cart } = useResolvers();
  const allProducts = products.getAll();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const product = id ? products.getById(id) : undefined;
  const currentIndex = id ? allProducts.findIndex((p) => slugifyProductName(p.name) === id) : -1;
  const thumbnailCount = Math.min(product?.orderedImages.length ?? 0, 5);
  const productThumbWindowStart = Math.min(
    Math.max(currentIndex - 1, 0),
    Math.max(allProducts.length - 4, 0),
  );
  const visibleProductThumbnails = allProducts.slice(productThumbWindowStart, productThumbWindowStart + 4);

  // Auto-advance the hero image. Locked on (does not stop on taps/keys) so
  // the hero keeps cycling for the viewer. Interval tightens to 3s when the
  // preview modal is open — per spec — so the user sees both the landscape
  // and portrait companion tiles flip through images quickly. 5s otherwise.
  useAutoScroll(thumbnailCount, setHeroIndex, isPreviewOpen ? 3000 : 5000, {
    stopOnUserInput: false,
  });

  // Reset hero image selection whenever the product id changes.
  useEffect(() => {
    setHeroIndex(0);
  }, [id]);

  // Track this profile's product as the nav's active "Add" target
  useEffect(() => {
    if (product) {
      cart.setActiveProduct(slugifyProductName(product.name));
    }
  }, [product, cart]);

  const goPrev = useCallback(() => {
    const prev = currentIndex > 0 ? allProducts[currentIndex - 1] : undefined;
    if (prev) {
      navigate(`/profile/${slugifyProductName(prev.name)}`);
    }
  }, [currentIndex, allProducts, navigate]);

  const goNext = useCallback(() => {
    const next = currentIndex >= 0 && currentIndex < allProducts.length - 1
      ? allProducts[currentIndex + 1]
      : undefined;
    if (next) {
      navigate(`/profile/${slugifyProductName(next.name)}`);
    }
  }, [currentIndex, allProducts, navigate]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[hsl(var(--color-muted-foreground))]">
        <p>Product not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-[hsl(var(--color-primary))] text-sm font-medium">
          Back to Showroom
        </button>
      </div>
    );
  }

  const price = resolveProductPrice({
    name: product.name,
    productNumber: product.productNumber,
  });

  return (
    <div className="pb-40">
      {/* Hero Image — bumped to 50/23 (~+9.5% visible height vs the old
          50/21) now that the inline thumbnail rail is gone. Tapping opens
          the centered preview card modal instead of a fullscreen zoom. */}
      <div
        className="relative cursor-pointer overflow-hidden rounded-b-[1.5rem]"
        onClick={() => setIsPreviewOpen(true)}
      >
        <img
          src={product.orderedImages[heroIndex]}
          alt={product.name}
          className="w-full aspect-[50/23] object-cover"
        />
        <div className="absolute bottom-2 left-2">
          <span className="inline-block px-2 py-0.5 rounded-md bg-black/55 text-white text-xs font-semibold tracking-wide backdrop-blur-sm">
            ID {product.productNumber}
          </span>
        </div>
      </div>

      {/* Pricing + sale callout — everything lives on a single line: the
          regular Setup / monthly pricing, then the promo teaser (3 fires,
          discounted figure, SAVE30 code, rocket) starts immediately
          after the "/mo". */}
      <p className="px-4 pt-3 pb-1 text-sm font-bold text-[hsl(var(--color-foreground))] whitespace-nowrap overflow-hidden">
        Setup ${price.setup} · ${price.monthly}/mo
        <span className="ml-2 text-xs text-amber-700">
          🔥🔥🔥 ${Math.round(price.setup * 0.7)} with SAVE30 🚀
        </span>
      </p>

      {/* Demos row — bold click-off links to live web demo and video demo */}
      <div className="px-4 pb-1 flex items-center gap-5 text-sm font-bold">
        <span className="text-[hsl(var(--color-muted-foreground))] uppercase tracking-wide text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
          Demos:
        </span>
        {product.demoUrl ? (
          <a
            href={product.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--color-primary))] hover:underline inline-flex items-center gap-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          >
            Live <span aria-hidden>🟢</span>
          </a>
        ) : (
          <span className="text-[hsl(var(--color-muted-foreground))] inline-flex items-center gap-1 opacity-50">
            Live <span aria-hidden>🟢</span>
          </span>
        )}
        {product.videoDemoUrl ? (
          <a
            href={product.videoDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--color-primary))] hover:underline inline-flex items-center gap-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          >
            Video <span aria-hidden>📺</span>
          </a>
        ) : (
          <span className="text-[hsl(var(--color-muted-foreground))] inline-flex items-center gap-1 opacity-50">
            Video <span aria-hidden>📺</span>
          </span>
        )}
        {/* Phone demo placeholder — not wired yet, lights up when a
            videoDemoUrl targeted at mobile is added to the product. */}
        <span className="text-[hsl(var(--color-muted-foreground))] inline-flex items-center gap-1 opacity-50">
          Phone <span aria-hidden>📱</span>
        </span>
      </div>

      {/* What you get — bullets + one-liner outcome. */}
      <div className="px-4 pt-1 pb-3 space-y-2">
        <p className="text-xs uppercase tracking-wide font-semibold text-[hsl(var(--color-muted-foreground))]">
          What you get
        </p>
        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">{product.buyerOutcome}</p>

        <ul className="space-y-1.5">
          {product.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2 text-sm text-[hsl(var(--color-foreground))]">
              <span className="text-[hsl(var(--color-primary))] mt-0.5 flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </span>
              {bullet}
            </li>
          ))}
        </ul>

        {/* Promo codes — surfaced directly under the feature bullets so the
            customer sees the active offers before they hit checkout. */}
        <div className="flex flex-col items-start gap-1 pt-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200">
            🚀 Launch Party — 30% OFF (LAUNCH30)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 bg-orange-50 text-orange-800 border border-orange-200">
            🔥 Extra 10% OFF with USDC on Everything
          </span>
        </div>
      </div>

      {/* Sticky footer — product carousel (different products, not image thumbnails) */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-[390px] px-4 py-3 bg-[hsl(var(--color-surface))]/95 backdrop-blur-md border-t border-[hsl(var(--color-border))] pointer-events-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentIndex <= 0}
              className="w-10 h-10 rounded-full border border-[hsl(var(--color-border))] flex items-center justify-center disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex items-center justify-center gap-2 flex-1 px-2">
              {visibleProductThumbnails.map((previewProduct, i) => {
                const realIndex = productThumbWindowStart + i;
                return (
                  <button
                    key={previewProduct.name}
                    onClick={() => navigate(`/profile/${slugifyProductName(previewProduct.name)}`)}
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
              disabled={currentIndex < 0 || currentIndex >= allProducts.length - 1}
              className="w-10 h-10 rounded-full border border-[hsl(var(--color-border))] flex items-center justify-center disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Preview card modal — opens on hero tap. Dim backdrop, centered card
          at ~82% viewport width (cap 340px), 4 thumbnails directly underneath
          for primary navigation. Tapping the backdrop or the close icon
          dismisses. Auto-scroll on the hero is paused via `isPreviewOpen`
          so the user is inspecting a stable frame. */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center bg-black/70 backdrop-blur-sm px-3 animate-slide-in"
          style={{ paddingTop: '10vh' }}
          onClick={() => setIsPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* Dual-tile preview group — portrait companion stacks ABOVE the
              landscape tile, both centered. Both tiles read from the same
              `heroIndex` image so the thumbnail rail drives them together. */}
          <div
            className="relative flex flex-col items-center gap-3 w-full max-w-[362px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Portrait companion tile — sits on top, 9:16, +30% vs prior */}
            <div
              className="relative w-[156px] rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] bg-black border border-neutral-900"
              style={{ aspectRatio: '9 / 16' }}
            >
              <img
                src={
                  product.orderedImagesMobile?.[heroIndex] ??
                  product.orderedImages[heroIndex]
                }
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Landscape tile — dominant, 10:7, full width of the group */}
            <div
              className="relative w-full rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] bg-[hsl(var(--color-surface))]"
              style={{ aspectRatio: '10 / 7' }}
            >
              <img
                src={product.orderedImages[heroIndex]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Close icon — floats over the top-right corner of the group */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-sm shadow-lg"
              aria-label="Close preview"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Thumbnail strip — up to 4 images from this product, primary nav
              for both preview tiles. Tapping a thumb sets heroIndex which
              flows into both the landscape and portrait tiles above.
              Auto-scroll (3s) runs in parallel and will also advance this
              index — the active thumb highlight updates with it. */}
          <div
            className="mt-4 flex items-center justify-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {product.orderedImages.slice(0, 4).map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setHeroIndex(i)}
                className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${
                  i === heroIndex
                    ? 'border-[hsl(var(--color-primary))] shadow-[0_0_0_3px_rgba(59,130,246,0.35)] scale-105'
                    : 'border-white/30'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

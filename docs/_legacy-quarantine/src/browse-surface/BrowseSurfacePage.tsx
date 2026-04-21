import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { InitialSwipeProductCard } from '@/browse-surface/InitialSwipeProductCard';
import { productFixtures, slugifyProductName } from '@/product-intake-model/Product';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';

export function BrowseSurfacePage() {
  const { activeProductId, setActiveProductId } = useEstimate();
  const initialIndex = useMemo(() => {
    if (!activeProductId) return 0;
    const foundIndex = productFixtures.findIndex((product) => slugifyProductName(product.name) === activeProductId);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [activeProductId]);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimer = useRef<number | null>(null);
  const total = productFixtures.length;

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const goTo = useCallback((index: number, dir: 'left' | 'right') => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);

    if (animationTimer.current) {
      window.clearTimeout(animationTimer.current);
    }

    animationTimer.current = window.setTimeout(() => {
      setActiveIndex(index);
      setActiveProductId(slugifyProductName(productFixtures[index].name));
      setDirection(null);
      setIsAnimating(false);
    }, 250);
  }, [isAnimating, setActiveProductId]);

  const goNext = useCallback(() => {
    if (activeIndex < total - 1) goTo(activeIndex + 1, 'left');
  }, [activeIndex, total, goTo]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) goTo(activeIndex - 1, 'right');
  }, [activeIndex, goTo]);

  useEffect(() => {
    return () => {
      if (animationTimer.current) {
        window.clearTimeout(animationTimer.current);
      }
    };
  }, []);

  // Keyboard arrows
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) goNext();
    else if (touchDeltaX.current > threshold) goPrev();
  };

  const product = productFixtures[activeIndex];

  const animClass = direction === 'left'
    ? 'animate-slide-out-left'
    : direction === 'right'
      ? 'animate-slide-out-right'
      : 'animate-card-enter';

  return (
    <div className="flex flex-1 flex-col -mt-2">
      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-3 px-4 pb-1 pt-1.5">
        {productFixtures.map((p, i) => (
          <button
            key={p.name}
            onClick={() => {
              if (i !== activeIndex) goTo(i, i > activeIndex ? 'left' : 'right');
            }}
            className={`text-[14px] font-semibold transition-colors ${
              i === activeIndex
                ? 'text-blue-600'
                : 'text-slate-300 hover:text-slate-400'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Card deck area */}
      <div
        ref={containerRef}
        className="relative flex flex-1 items-start justify-center overflow-hidden px-4 pb-2"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={activeIndex}
          className={`w-full ${animClass}`}
        >
          <InitialSwipeProductCard product={product} />
        </div>

        {/* Desktop arrow controls — positioned outside card edge */}
        {activeIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute -left-0.5 top-1/3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.06)] backdrop-blur-sm transition hover:text-blue-500 hover:shadow-md"
            aria-label="Previous product"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {activeIndex < total - 1 && (
          <button
            onClick={goNext}
            className="absolute -right-0.5 top-1/3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.06)] backdrop-blur-sm transition hover:text-blue-500 hover:shadow-md"
            aria-label="Next product"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 pb-3">
        {productFixtures.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all ${
              i === activeIndex
                ? 'h-1.5 w-4 bg-blue-500'
                : 'h-1.5 w-1.5 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

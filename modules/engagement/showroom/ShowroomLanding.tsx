// modules/engagement/showroom/ShowroomLanding.tsx
// Owns: Showroom mode surface — concept art wallpaper + floating landscape tiles + arrow/thumbnail row

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productFixtures } from './catalog';
import { slugifyProductName } from '../../../invariants/product';
import { useResolvers } from '../../../resolver-boundary/ResolverProvider';
import { useAutoScroll } from '../../../hooks/useAutoScroll';

export function ShowroomLanding() {
  const navigate = useNavigate();
  const { cart } = useResolvers();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const product = productFixtures[selectedIndex];

  // Auto-advance thumbnails every 3s until the user taps/clicks/keys anywhere.
  // State is local, so leaving and returning to this page resets auto-scroll.
  useAutoScroll(productFixtures.length, setSelectedIndex);

  // Track the selected thumbnail as the nav's active "Add" target
  useEffect(() => {
    if (product) {
      cart.setActiveProduct(slugifyProductName(product.name));
    }
  }, [product, cart]);

  const handleThumbnailTap = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleCardTap = useCallback(() => {
    if (product) {
      navigate(`/profile/${slugifyProductName(product.name)}`);
    }
  }, [product, navigate]);

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i < productFixtures.length - 1 ? i + 1 : i));
  }, []);
  const thumbWindowStart = Math.min(
    Math.max(selectedIndex - 1, 0),
    Math.max(productFixtures.length - 4, 0),
  );
  const visibleThumbnails = productFixtures.slice(thumbWindowStart, thumbWindowStart + 4);

  if (!product) return null;

  return (
    <div className="showroom-surface">
      {/* Wallpaper composition stack — each layer is absolute, inset-0, and
          pointer-events:none. The `.showroom-layer-*` classes own their own
          background-image / blend mode in globals.css, so swapping art is
          a CSS change rather than rebaking a single flat wallpaper. */}
      <div className="showroom-layer showroom-layer-base" aria-hidden />
      <div className="showroom-layer showroom-layer-plinth" aria-hidden />
      <div className="showroom-layer showroom-layer-frame" aria-hidden />

      {/* Showroom title — overlaid at the top of the wallpaper, centered,
          brand-blue. Wrapped in a white radial halo so the text lifts off
          the wallpaper even on high-key backgrounds, plus a dark drop
          shadow for separation on brighter areas. Absolute-positioned so
          it doesn't perturb the flex column that lays out the two tiles
          against the baked-in wallpaper targets. */}
      <h1
        className="absolute top-12 left-0 right-0 z-10 text-center text-2xl font-extrabold tracking-wide text-[hsl(var(--color-primary))] pointer-events-none"
        style={{
          textShadow: [
            '0 0 10px rgba(255,255,255,0.95)',
            '0 0 22px rgba(255,255,255,0.75)',
            '0 0 38px rgba(255,255,255,0.45)',
            '0 2px 6px rgba(0,0,0,0.55)',
          ].join(', '),
        }}
      >
        Showroom
      </h1>

      {/* Content layer — floating landscape tiles over the composition.
          pb reserves space for the fixed control footer below. */}
      <div className="relative flex-1 flex flex-col items-center z-10 pb-36">

        {/* Upper breathing room — aligns card over the baked-in phone area */}
        <div className="flex-[1.2_1_0%]" />

        {/* Center Hero Card — top tile now shows the currently selected
            product thumbnail. No key here so React updates the <img src> in
            place instead of remounting the tile and re-triggering the entry
            animation on every thumbnail switch. */}
        <div className="flex-[0_0_auto]" style={{ transform: 'translateY(-5%)' }}>
          <div
            className="showroom-card rounded-[2.5rem] overflow-hidden cursor-pointer bg-black animate-card-enter relative"
            style={{ width: 'clamp(190px, 57.6vw, 253px)', aspectRatio: '8 / 5' }}
            onClick={handleCardTap}
          >
            <img
              src={product.orderedImages[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mid spacer */}
        <div className="flex-[1_1_0%]" />

        {/* Secondary portrait video tile — plays a looping YouTube Shorts
            playlist. The container is rotated 90deg so the pre-rotation 16/9
            landscape iframe renders visually as a 9/16 portrait, which is
            the native Shorts aspect. No key on the iframe so it isn't
            remounted (and the video isn't restarted) when the user taps a
            different thumbnail. Click still navigates because the iframe
            carries pointer-events-none. */}
        <div className="flex-[0_0_auto]" style={{ transform: 'translateY(15%) rotate(90deg)' }}>
          <div
            className="showroom-card rounded-[2rem] overflow-hidden cursor-pointer bg-black relative"
            style={{ width: 'clamp(142px, 43vw, 188px)', aspectRatio: '16 / 9' }}
            onClick={handleCardTap}
          >
            <iframe
              src="https://www.youtube.com/embed/RtTwh6mCVBE?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=RtTwh6mCVBE,ZwUjUMAq4Sc,cVyBPrdisic&rel=0&modestbranding=1"
              title="Showroom hero reel"
              allow="autoplay; encrypted-media; picture-in-picture"
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                border: 0,
                width: 'calc(100% * 9 / 16)',
                height: 'calc(100% * 16 / 9)',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
              }}
            />
          </div>
        </div>

        {/* Lower spacer — pushes the control row down toward the bottom nav */}
        <div className="flex-[1.4_1_0%]" />
      </div>

      {/* Optional foreground FX pass — paints over the tiles but beneath the
          control row. Empty by default; populate via .showroom-layer-fx. */}
      <div className="showroom-layer showroom-layer-fx" aria-hidden />

      {/* Sticky control row — arrows bookend the four thumbnails, no dots.
          Sits just above the bottom nav. */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-center pointer-events-none z-20">
        <div className="w-full max-w-[390px] px-4 py-3 pointer-events-auto">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={goPrev}
              disabled={selectedIndex <= 0}
              className="w-10 h-10 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex items-center gap-3 flex-1 justify-center">
              {visibleThumbnails.map((p, i) => {
                const realIndex = thumbWindowStart + i;
                return (
                <button
                  key={p.name}
                  onClick={() => handleThumbnailTap(realIndex)}
                  className={`flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                    realIndex === selectedIndex
                      ? 'border-white shadow-[0_0_14px_rgba(255,255,255,0.5)] scale-110'
                      : 'border-white/40'
                  }`}
                >
                  <img
                    src={p.orderedImages[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                );
              })}
            </div>

            <button
              onClick={goNext}
              disabled={selectedIndex >= productFixtures.length - 1}
              className="w-10 h-10 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

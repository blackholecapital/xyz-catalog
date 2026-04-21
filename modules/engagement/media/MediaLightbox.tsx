// modules/engagement/media/MediaLightbox.tsx
// Owns: Media lightbox — a medium-sized preview tile with a 4-thumbnail
// rail beneath so users can scrub through a product's images without
// leaving the profile page.

import { useState, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

type MediaLightboxProps = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

const THUMB_WINDOW = 4;

export function MediaLightbox({ images, initialIndex, onClose }: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, images.length - 1));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  // Slide a 4-image window over the full list so the selected thumb stays
  // inside the window.
  const windowStart = useMemo(
    () =>
      Math.min(
        Math.max(index - 1, 0),
        Math.max(images.length - THUMB_WINDOW, 0),
      ),
    [index, images.length],
  );
  const visibleThumbs = images.slice(windowStart, windowStart + THUMB_WINDOW);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] px-4 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — sits above the tile so it never obstructs the image */}
        <div className="w-full flex justify-between items-center text-white/80 text-xs">
          <span>
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label="Close preview"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Medium preview tile — a phone-frame-width landscape image sized
            to roughly the top third of the screen. */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: '4 / 3' }}>
          <img
            src={images[index]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Nav arrows overlaid on the tile */}
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white disabled:opacity-30"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={index === images.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white disabled:opacity-30"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 4-thumbnail rail beneath the tile */}
        <div className="flex items-center justify-center gap-2 w-full">
          {visibleThumbs.map((src, i) => {
            const realIndex = windowStart + i;
            const isActive = realIndex === index;
            return (
              <button
                key={realIndex}
                type="button"
                onClick={() => setIndex(realIndex)}
                className={`flex-1 max-w-[72px] aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  isActive
                    ? 'border-white shadow-[0_0_14px_rgba(255,255,255,0.4)] scale-105'
                    : 'border-white/30'
                }`}
                aria-label={`View image ${realIndex + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

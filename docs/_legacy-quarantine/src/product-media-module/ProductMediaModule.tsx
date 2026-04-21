import { useCallback, useEffect, useState } from 'react';
import { ImageLightbox } from '@/product-media-module/ImageLightbox';

type ProductMediaModuleProps = {
  orderedImages: string[];
  altText: string;
};

export function ProductMediaModule({ orderedImages, altText }: ProductMediaModuleProps) {
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleError = useCallback((src: string) => {
    setFailedSrcs((prev) => new Set(prev).add(src));
  }, []);

  const validImages = orderedImages.filter((src) => !failedSrcs.has(src));

  // Reset active index when product changes
  useEffect(() => {
    setActiveIndex(0);
    setFailedSrcs(new Set());
  }, [orderedImages]);

  if (validImages.length === 0) return null;

  const heroSrc = validImages[activeIndex] ?? validImages[0];

  return (
    <div className="space-y-1.5">
      {/* Hero image — tap to enlarge */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="block w-full overflow-hidden rounded-xl border border-blue-100/30 shadow-[0_2px_10px_-3px_rgba(37,99,235,0.08),0_1px_2px_rgba(0,0,0,0.03)] transition hover:shadow-[0_2px_14px_-3px_rgba(37,99,235,0.14),0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <img
          src={heroSrc}
          alt={`${altText} hero`}
          className="aspect-[16/15] w-full cursor-zoom-in object-cover scale-[1.15]"
          onError={() => handleError(heroSrc)}
        />
      </button>

      {/* Scrollable thumbnail strip — hidden scrollbar */}
      {validImages.length > 1 && (
        <div className="thumb-rail flex gap-1 overflow-x-auto">
          {validImages.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-10 w-14 shrink-0 overflow-hidden rounded-md transition-all ${
                index === activeIndex
                  ? 'ring-2 ring-blue-500/70 ring-offset-1'
                  : 'opacity-50 hover:opacity-90'
              }`}
            >
              <img
                src={img}
                alt={`${altText} ${index + 1}`}
                className="h-full w-full object-cover"
                onError={() => handleError(img)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <ImageLightbox
          images={validImages}
          startIndex={activeIndex}
          altText={altText}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

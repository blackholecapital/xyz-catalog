// modules/conversion/offers/OfferDetail.tsx
// Owns: Offer detail modal — displayed when user inspects an offer

import type { Product } from '../../../invariants/product';

type OfferDetailProps = {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
  isInCart: boolean;
};

export function OfferDetail({ product, onClose, onAddToCart, isInCart }: OfferDetailProps) {
  return (
    <div
      className="bg-[hsl(var(--color-surface))] rounded-[1.75rem] w-[calc(100%-2rem)] max-w-[360px] max-h-[80vh] overflow-y-auto shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <img src={product.orderedImages[0]} alt={product.name} className="w-full aspect-video object-cover rounded-t-[1.75rem]" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-[hsl(var(--color-foreground))]">{product.name}</h3>
        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">{product.buyerOutcome}</p>

        <ul className="space-y-1.5">
          {product.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2 text-sm text-[hsl(var(--color-foreground))]">
              <span className="text-[hsl(var(--color-primary))] flex-shrink-0">
                <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </span>
              {bullet}
            </li>
          ))}
        </ul>

        <button
          onClick={onAddToCart}
          disabled={isInCart}
          className={`w-full py-3 rounded-[1.5rem] font-semibold text-sm ${
            isInCart
              ? 'bg-[hsl(var(--color-surface-raised))] text-[hsl(var(--color-muted-foreground))]'
              : 'bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 text-white shadow-md'
          }`}
        >
          {isInCart ? 'Already in Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

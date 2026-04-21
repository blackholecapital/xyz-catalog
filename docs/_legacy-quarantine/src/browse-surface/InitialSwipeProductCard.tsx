import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { slugifyProductName, type Product } from '@/product-intake-model/Product';
import { ProductMediaModule } from '@/product-media-module/ProductMediaModule';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';

export function InitialSwipeProductCard({ product }: { product: Product }) {
  const { addProduct, hasProduct, setActiveProductId, setCheckoutProductId } = useEstimate();
  const isAdded = hasProduct(product.name);
  const [showConfirm, setShowConfirm] = useState(false);
  const clearConfirmTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (clearConfirmTimer.current) {
        window.clearTimeout(clearConfirmTimer.current);
      }
    };
  }, []);

  const handleAdd = useCallback(() => {
    addProduct(product);
    setActiveProductId(slugifyProductName(product.name));
    setShowConfirm(true);

    if (clearConfirmTimer.current) {
      window.clearTimeout(clearConfirmTimer.current);
    }

    clearConfirmTimer.current = window.setTimeout(() => setShowConfirm(false), 1500);
  }, [addProduct, product, setActiveProductId]);

  const productId = slugifyProductName(product.name);

  return (
    <div className="space-y-1.5 scale-[0.75] origin-top rounded-[1.75rem] border border-white/50 bg-[#f8f9fb] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.08),0_8px_28px_-6px_rgba(37,99,235,0.20),0_0_40px_-8px_rgba(37,99,235,0.15)]">
      <ProductMediaModule orderedImages={product.orderedImages} altText={product.name} />

      <div className="space-y-0.5 px-0.5">
        <p className="text-[14px] font-black leading-snug tracking-[-0.01em] text-blue-600 drop-shadow-[0_1px_2px_rgba(37,99,235,0.35)] transition-colors hover:text-blue-700">{product.name}</p>
        <p className="text-[11px] leading-relaxed text-slate-500">{product.oneLinePromise}</p>
      </div>

      <ul className="space-y-0.5 px-0.5">
        {product.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <svg className="mt-[2px] h-3 w-3 shrink-0 text-blue-500" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0l2.5 5.3L16 6.2l-4 3.8 1 5.5L8 12.8l-5 2.7 1-5.5-4-3.8 5.5-.9z" />
            </svg>
            <span className="text-[11px] leading-snug text-slate-600">{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Action row — clean icon+text, no button chrome */}
      <div className="flex items-center justify-between px-2 pt-1">
        <Link
          to={product.actionPath}
          onClick={() => setActiveProductId(productId)}
          className="flex items-center gap-1 text-[12px] font-semibold text-slate-400 transition-colors hover:text-blue-600 active:scale-95"
        >
          More
        </Link>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdded}
          className="flex items-center gap-1.5 text-[12px] font-bold text-blue-600 transition-all hover:text-blue-700 active:scale-95 disabled:opacity-40"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {showConfirm ? 'Added!' : isAdded ? 'Saved' : 'Build'}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
        </button>
        <Link
          to={`/checkout/${productId}`}
          onClick={() => { setActiveProductId(productId); setCheckoutProductId(productId); }}
          className="flex items-center gap-1 text-[12px] font-semibold text-slate-400 transition-colors hover:text-blue-600 active:scale-95"
        >
          Buy
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
        </Link>
      </div>
    </div>
  );
}

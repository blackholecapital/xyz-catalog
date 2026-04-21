import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/primitives/Button';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';
import { getProductById } from '@/product-intake-model/Product';

export function PayMeBoundary() {
  const { productId } = useParams();
  const { checkoutProduct, setCheckoutProductId } = useEstimate();

  const routeProduct = useMemo(() => (productId ? getProductById(productId) : null), [productId]);

  useEffect(() => {
    if (routeProduct && productId) {
      setCheckoutProductId(productId);
    }
  }, [productId, routeProduct, setCheckoutProductId]);

  const productName = routeProduct?.name ?? checkoutProduct?.name ?? 'Factory Product';

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
      <p className="text-sm font-black text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.25)]">Buy / PayMe Boundary</p>
      <p className="mt-1 text-xs text-mutedForeground">{productName} checkout route is prepared for PayMe stamping.</p>
      <Button className="mt-3 w-full">Buy</Button>
    </div>
  );
}

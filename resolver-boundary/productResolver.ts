// resolver-boundary/productResolver.ts
// Concrete resolver for Product — backed by fixture catalog

import type { ProductResolver } from './contracts';
import { productFixtures } from '../modules/engagement/showroom/catalog';
import { getProductById } from '../invariants/product';

export const productResolver: ProductResolver = {
  getAll: () => productFixtures,
  getById: (id: string) => getProductById(id, productFixtures),
};

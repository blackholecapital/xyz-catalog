// invariants/product.ts
// Domain invariants for Product entity — enforced by all modules

export const PRODUCT_INVARIANTS = {
  MIN_BULLETS: 3,
  MIN_IMAGES: 1,
  NAME_MAX_LENGTH: 64,
  ONE_LINE_PROMISE_MAX_LENGTH: 120,
} as const;

export type Product = {
  name: string;
  productNumber: string;
  oneLinePromise: string;
  buyerOutcome: string;
  actionPath: string;
  orderedImages: string[];
  orderedImagesMobile?: string[];
  bullets: [string, string, string, ...string[]];
  demoUrl?: string;
  videoDemoUrl?: string;
  showroomDescription?: string;
};

export function slugifyProductName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getProductById(id: string, catalog: Product[]): Product | undefined {
  return catalog.find((item) => slugifyProductName(item.name) === id);
}

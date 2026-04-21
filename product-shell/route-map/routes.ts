// product-shell/route-map/routes.ts
// Authoritative route definitions — product-shell owns all routing

import { ROUTES } from '../../factory-language/routes';

export type RouteEntry = {
  path: string;
  module: string;
  surface: string;
};

export const firstSliceRoutes: RouteEntry[] = [
  { path: ROUTES.SHOWROOM, module: 'engagement/showroom', surface: 'ShowroomLanding' },
  { path: ROUTES.GALLERY, module: 'engagement/gallery', surface: 'GallerySurface' },
  { path: ROUTES.PROFILE, module: 'engagement/profile', surface: 'ProfileExpanded' },
  { path: ROUTES.CART, module: 'conversion/cart', surface: 'CartSurface' },
  { path: ROUTES.CHECKOUT, module: 'conversion/checkout', surface: 'CheckoutFlow' },
  { path: ROUTES.CHECKOUT_CONFIRM, module: 'conversion/checkout', surface: 'PaymentConfirmation' },
  { path: ROUTES.ADMIN, module: 'operations/admin', surface: 'AdminSurface' },
];

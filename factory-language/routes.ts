// factory-language/routes.ts
// Canonical route vocabulary for the Showroom chassis

export const ROUTES = {
  SHOWROOM: '/',
  GALLERY: '/gallery',
  PROFILE: '/profile/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_CONFIRM: '/checkout/confirm',
  ADMIN: '/admin',
} as const;

export type RouteName = keyof typeof ROUTES;

// factory-language/touchpoints.ts
// Canonical touchpoint vocabulary for the Showroom chassis

export const TOUCHPOINTS = {
  LANDING_VIEW: 'tp.landing.view',
  GALLERY_BROWSE: 'tp.gallery.browse',
  GALLERY_SELECT: 'tp.gallery.select',
  PROFILE_EXPAND: 'tp.profile.expand',
  MEDIA_VIEW: 'tp.media.view',
  CART_ADD: 'tp.cart.add',
  CART_VIEW: 'tp.cart.view',
  CART_REMOVE: 'tp.cart.remove',
  OFFERS_VIEW: 'tp.offers.view',
  CHECKOUT_START: 'tp.checkout.start',
  CHECKOUT_PAY: 'tp.checkout.pay',
  CHECKOUT_CONFIRM: 'tp.checkout.confirm',
  CHECKOUT_RETURN: 'tp.checkout.return',
  SWIPE_ACTION: 'tp.swipe.action',
  AUTH_CHALLENGE: 'tp.auth.challenge',
  AUTH_RESOLVE: 'tp.auth.resolve',
  NOTIFICATION_SHOW: 'tp.notification.show',
} as const;

export type TouchpointId = typeof TOUCHPOINTS[keyof typeof TOUCHPOINTS];

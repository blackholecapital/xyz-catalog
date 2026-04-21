// product-shell/slot-map/slots.ts
// Authoritative slot definitions — product-shell owns all slot positions

import { SLOTS } from '../../factory-language/slots';
import type { SlotName } from '../../factory-language/slots';

export type SlotClaim = {
  slot: SlotName;
  module: string;
  component: string;
  routeContext: string;
};

export const firstSliceSlotClaims: SlotClaim[] = [
  // Engagement
  { slot: SLOTS.MAIN, module: 'engagement/showroom', component: 'ShowroomLanding', routeContext: '/' },
  { slot: SLOTS.MAIN, module: 'engagement/gallery', component: 'GallerySurface', routeContext: '/gallery' },
  { slot: SLOTS.MAIN, module: 'engagement/profile', component: 'ProfileExpanded', routeContext: '/profile/:id' },
  { slot: SLOTS.MODAL, module: 'engagement/media', component: 'MediaLightbox', routeContext: '*' },
  // Conversion
  { slot: SLOTS.MAIN, module: 'conversion/cart', component: 'CartSurface', routeContext: '/cart' },
  { slot: SLOTS.MAIN, module: 'conversion/checkout', component: 'CheckoutFlow', routeContext: '/checkout' },
  { slot: SLOTS.MAIN, module: 'conversion/checkout', component: 'PaymentConfirmation', routeContext: '/checkout/confirm' },
  { slot: SLOTS.MODAL, module: 'conversion/offers', component: 'OfferDetail', routeContext: '/gallery' },
  // Trust
  { slot: SLOTS.MODAL, module: 'trust/auth-boundary', component: 'AuthChallenge', routeContext: '*' },
  // Operations
  { slot: SLOTS.MODAL, module: 'operations/notifications', component: 'NotificationToast', routeContext: '*' },
];

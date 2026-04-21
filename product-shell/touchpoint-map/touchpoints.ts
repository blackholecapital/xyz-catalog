// product-shell/touchpoint-map/touchpoints.ts
// Authoritative touchpoint definitions — product-shell owns all touchpoint registration

import { TOUCHPOINTS } from '../../factory-language/touchpoints';
import type { TouchpointId } from '../../factory-language/touchpoints';

export type TouchpointEntry = {
  id: TouchpointId;
  type: 'view' | 'action' | 'navigation';
  module: string;
  description: string;
};

export const firstSliceTouchpoints: TouchpointEntry[] = [
  { id: TOUCHPOINTS.LANDING_VIEW, type: 'view', module: 'engagement/showroom', description: 'User sees studio profile card landing' },
  { id: TOUCHPOINTS.GALLERY_BROWSE, type: 'view', module: 'engagement/gallery', description: 'User browses product/offer gallery' },
  { id: TOUCHPOINTS.GALLERY_SELECT, type: 'action', module: 'engagement/gallery', description: 'User selects a product or offer' },
  { id: TOUCHPOINTS.PROFILE_EXPAND, type: 'action', module: 'engagement/profile', description: 'User expands a studio profile' },
  { id: TOUCHPOINTS.MEDIA_VIEW, type: 'action', module: 'engagement/media', description: 'User opens media lightbox' },
  { id: TOUCHPOINTS.CART_ADD, type: 'action', module: 'conversion/cart', description: 'User adds item to cart' },
  { id: TOUCHPOINTS.CART_VIEW, type: 'view', module: 'conversion/cart', description: 'User views cart contents' },
  { id: TOUCHPOINTS.CART_REMOVE, type: 'action', module: 'conversion/cart', description: 'User removes item from cart' },
  { id: TOUCHPOINTS.OFFERS_VIEW, type: 'view', module: 'conversion/offers', description: 'User views offer details' },
  { id: TOUCHPOINTS.CHECKOUT_START, type: 'action', module: 'conversion/checkout', description: 'User initiates in-app pay flow' },
  { id: TOUCHPOINTS.CHECKOUT_PAY, type: 'action', module: 'conversion/checkout', description: 'User submits payment' },
  { id: TOUCHPOINTS.CHECKOUT_CONFIRM, type: 'view', module: 'conversion/checkout', description: 'User sees payment confirmation' },
  { id: TOUCHPOINTS.CHECKOUT_RETURN, type: 'navigation', module: 'conversion/checkout', description: 'User returns to showroom' },
  { id: TOUCHPOINTS.SWIPE_ACTION, type: 'action', module: 'conversion/swipe-card-actions', description: 'User swipes on a product card' },
  { id: TOUCHPOINTS.AUTH_CHALLENGE, type: 'action', module: 'trust/auth-boundary', description: 'Auth challenge presented' },
  { id: TOUCHPOINTS.AUTH_RESOLVE, type: 'action', module: 'trust/auth-boundary', description: 'Auth challenge resolved' },
  { id: TOUCHPOINTS.NOTIFICATION_SHOW, type: 'view', module: 'operations/notifications', description: 'Notification displayed' },
];

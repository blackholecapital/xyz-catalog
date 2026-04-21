// variation-control/flags.ts
// Feature flags — first slice has no variations, all features enabled

export const FEATURE_FLAGS = {
  GALLERY_SWIPE_ENABLED: true,
  CHECKOUT_ENABLED: true,
  LIGHTBOX_ENABLED: true,
  NOTIFICATIONS_ENABLED: true,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

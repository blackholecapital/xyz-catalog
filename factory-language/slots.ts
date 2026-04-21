// factory-language/slots.ts
// Canonical slot vocabulary for the Showroom chassis

export const SLOTS = {
  HEADER: 'shell.header',
  MAIN: 'shell.main',
  BOTTOM_NAV: 'shell.bottom-nav',
  MODAL: 'shell.modal',
} as const;

export type SlotName = typeof SLOTS[keyof typeof SLOTS];

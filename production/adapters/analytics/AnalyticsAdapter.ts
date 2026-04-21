// production/adapters/analytics/AnalyticsAdapter.ts
// Owns: Analytics event emission — observation only, no data mutation

import type { TouchpointId } from '../../../factory-language/touchpoints';

export type AnalyticsEvent = {
  touchpoint: TouchpointId;
  timestamp: number;
  metadata?: Record<string, string>;
};

const eventLog: AnalyticsEvent[] = [];

export function emitTouchpointEvent(touchpoint: TouchpointId, metadata?: Record<string, string>): void {
  const event: AnalyticsEvent = {
    touchpoint,
    timestamp: Date.now(),
    metadata,
  };

  eventLog.push(event);

  // First slice: console log only — replace with analytics provider
  if (import.meta.env.DEV) {
    console.debug('[analytics]', touchpoint, metadata);
  }
}

export function getEventLog(): readonly AnalyticsEvent[] {
  return eventLog;
}

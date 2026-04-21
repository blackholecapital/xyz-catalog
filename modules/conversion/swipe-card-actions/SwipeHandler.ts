// modules/conversion/swipe-card-actions/SwipeHandler.ts
// Owns: Swipe gesture detection for product cards in gallery

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

const SWIPE_THRESHOLD = 50;

export function detectSwipe(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): SwipeDirection {
  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return null;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}

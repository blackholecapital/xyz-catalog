// hooks/useAutoScroll.ts
// Auto-advance an index-based carousel every `intervalMs`.
//
// Default behavior: stops on any deliberate user input (pointer down or key
// press) anywhere in the document. Pointer move alone does not stop it.
// State lives on the calling component, so unmounting and re-mounting
// (e.g. navigating to another page and back) resets auto-scroll.
//
// Callers that want "locked on" auto-scroll can pass
// `{ stopOnUserInput: false }` to disable the input-stop behavior, and
// `{ paused: <boolean> }` to pause while a modal/overlay is open.

import { useEffect, useState } from 'react';

type Advance = (updater: (index: number) => number) => void;

type Options = {
  /** Pause advancing without tearing down the hook. */
  paused?: boolean;
  /** Stop permanently on first deliberate user input. Defaults to true. */
  stopOnUserInput?: boolean;
};

export function useAutoScroll(
  length: number,
  advance: Advance,
  intervalMs: number = 5000,
  options: Options = {},
): void {
  const { paused = false, stopOnUserInput = true } = options;
  const [userStopped, setUserStopped] = useState(false);

  // Stop auto-scroll on any deliberate user input, but only if the caller
  // asked for that behavior.
  useEffect(() => {
    if (!stopOnUserInput || userStopped) return;
    const stop = () => setUserStopped(true);
    document.addEventListener('pointerdown', stop);
    document.addEventListener('keydown', stop);
    return () => {
      document.removeEventListener('pointerdown', stop);
      document.removeEventListener('keydown', stop);
    };
  }, [stopOnUserInput, userStopped]);

  const active = !paused && !(stopOnUserInput && userStopped);

  // Advance the index on an interval while auto-scroll is active.
  useEffect(() => {
    if (!active || length <= 1) return;
    const id = window.setInterval(() => {
      advance((index) => (index + 1) % length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [active, length, intervalMs, advance]);
}

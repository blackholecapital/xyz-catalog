// modules/trust/auth-boundary/AuthBoundary.tsx
// Owns: Authentication challenge and resolution boundary
// First slice: passthrough (no auth required for prototype)

import { type PropsWithChildren } from 'react';

export function AuthBoundary({ children }: PropsWithChildren) {
  // First slice: no auth challenge — passthrough
  return <>{children}</>;
}

// production/adapters/ui/UIAdapter.ts
// Owns: UI rendering adapter — connects chassis to React/Tailwind

export const UI_ADAPTER = {
  framework: 'react' as const,
  version: '18.3',
  styling: 'tailwindcss' as const,
  designTokenSource: 'css-custom-properties' as const,
} as const;

export type UIAdapterConfig = typeof UI_ADAPTER;

// modules/operations/config/appConfig.ts
// Owns: Runtime configuration management

export const APP_CONFIG = {
  appName: 'Showroom',
  version: '0.1.0',
  storagePrefix: 'showroom.',
  defaultTheme: 'light' as const,
} as const;

export type AppConfig = typeof APP_CONFIG;

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WEBSOCKET_URL: string;

  // Micro-Frontend URLs
  readonly VITE_MFE_TOOLBAR_URL: string;
  readonly VITE_MFE_CANVAS_URL: string;

  // App Configuration
  readonly VITE_APP_TITLE: string;
  readonly VITE_LOG_LEVEL: "debug" | "info" | "warn" | "error";
  readonly VITE_ENABLE_DEV_TOOLS: string;
  readonly VITE_APP_VERSION: string;

  // Development Features
  readonly VITE_DEV_FEATURES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type declarations
declare global {
  const __DEV__: boolean;
  const __PROD__: boolean;
  const __APP_VERSION__: string;
}

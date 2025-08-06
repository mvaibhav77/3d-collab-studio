/**
 * Environment configuration utility
 * Centralizes all environment variables with type safety and validation
 */

interface AppConfig {
  // API Configuration
  apiBaseUrl: string;
  websocketUrl: string;

  // Micro-Frontend URLs
  mfeToolbarUrl: string;
  mfeCanvasUrl: string;

  // App Configuration
  appTitle: string;
  logLevel: "debug" | "info" | "warn" | "error";
  enableDevTools: boolean;

  // Environment Info
  isDevelopment: boolean;
  isProduction: boolean;
  isStaging: boolean;
  version: string;
}

// Validate required environment variables
const requiredEnvVars = [
  "VITE_API_BASE_URL",
  "VITE_MFE_TOOLBAR_URL",
  "VITE_MFE_CANVAS_URL",
  "VITE_WEBSOCKET_URL",
] as const;

function validateEnvVars(): void {
  const missing = requiredEnvVars.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file configuration."
    );
  }
}

// Validate environment variables in development
if (import.meta.env.DEV) {
  validateEnvVars();
}

// Create and export the configuration object
const config: AppConfig = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3001",

  // Micro-Frontend URLs
  mfeToolbarUrl:
    import.meta.env.VITE_MFE_TOOLBAR_URL ||
    "http://localhost:5001/assets/remoteEntry.js",
  mfeCanvasUrl:
    import.meta.env.VITE_MFE_CANVAS_URL ||
    "http://localhost:5002/assets/remoteEntry.js",

  // App Configuration
  appTitle: import.meta.env.VITE_APP_TITLE || "3D Collab Studio",
  logLevel: (import.meta.env.VITE_LOG_LEVEL as AppConfig["logLevel"]) || "info",
  enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === "true",

  // Environment Info
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isStaging: import.meta.env.MODE === "staging",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
};

// Development-only logging
if (config.isDevelopment) {
  console.log("🔧 App Configuration:", {
    mode: import.meta.env.MODE,
    apiBaseUrl: config.apiBaseUrl,
    websocketUrl: config.websocketUrl,
    enableDevTools: config.enableDevTools,
    logLevel: config.logLevel,
  });
}

// Export individual values for convenience
export const {
  apiBaseUrl,
  websocketUrl,
  mfeToolbarUrl,
  mfeCanvasUrl,
  appTitle,
  logLevel,
  enableDevTools,
  isDevelopment,
  isProduction,
  isStaging,
  version,
} = config;

export default config;

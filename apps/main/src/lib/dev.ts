/**
 * Development utilities and helpers
 * Only included in development builds
 */

import config from "./config";

// Development logger with levels
class DevLogger {
  private logLevel: number;

  constructor() {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.logLevel = levels[config.logLevel] || 1;
  }

  debug(...args: unknown[]): void {
    if (this.logLevel <= 0) {
      console.debug("🐛 [DEBUG]", ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.logLevel <= 1) {
      console.info("ℹ️ [INFO]", ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.logLevel <= 2) {
      console.warn("⚠️ [WARN]", ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.logLevel <= 3) {
      console.error("❌ [ERROR]", ...args);
    }
  }

  apiCall(method: string, url: string, data?: unknown): void {
    this.debug(`API ${method}:`, url, data ? { data } : "");
  }

  storeAction(action: string, payload?: unknown): void {
    this.debug(`Store Action:`, action, payload ? { payload } : "");
  }

  socketEvent(event: string, data?: unknown): void {
    this.debug(`Socket Event:`, event, data ? { data } : "");
  }
}

// Development performance monitor
class DevPerformance {
  private marks = new Map<string, number>();

  start(label: string): void {
    if (config.isDevelopment) {
      this.marks.set(label, performance.now());
      performance.mark(`${label}-start`);
    }
  }

  end(label: string): number {
    if (!config.isDevelopment) return 0;

    const startTime = this.marks.get(label);
    if (!startTime) {
      logger.warn(`Performance mark "${label}" not found`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);

    logger.debug(`⏱️ Performance: ${label} took ${duration.toFixed(2)}ms`);

    this.marks.delete(label);
    return duration;
  }

  measure(label: string, fn: () => void): void {
    this.start(label);
    fn();
    this.end(label);
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    const result = await fn();
    this.end(label);
    return result;
  }
}

// Development error boundary helper
export function logError(
  error: Error,
  errorInfo?: { componentStack?: string }
): void {
  logger.error("React Error:", {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
  });

  // In development, also log to console for easier debugging
  if (config.isDevelopment) {
    console.group("🚨 React Error Details");
    console.error("Error:", error);
    if (errorInfo?.componentStack) {
      console.error("Component Stack:", errorInfo.componentStack);
    }
    console.groupEnd();
  }
}

// Development hot reload utilities
export function enableHotReload(): void {
  if (config.isDevelopment && import.meta.hot) {
    import.meta.hot.accept();

    // Store state preservation during hot reload
    import.meta.hot.dispose(() => {
      logger.debug("Hot reload: disposing module");
    });

    logger.info("🔥 Hot reload enabled");
  }
}

// Environment info helper
export function logEnvironmentInfo(): void {
  if (!config.isDevelopment) return;

  console.group("🌍 Environment Information");
  console.table({
    "App Version": config.version,
    "Environment Mode": import.meta.env.MODE,
    "API Base URL": config.apiBaseUrl,
    "WebSocket URL": config.websocketUrl,
    "Dev Tools Enabled": config.enableDevTools,
    "Log Level": config.logLevel,
    "Build Timestamp": new Date().toISOString(),
  });
  console.groupEnd();
}

// Feature flag helper (for development)
export function isFeatureEnabled(feature: string): boolean {
  const devFeatures = import.meta.env.VITE_DEV_FEATURES?.split(",") || [];
  return config.isDevelopment && devFeatures.includes(feature);
}

// Export instances
export const logger = new DevLogger();
export const perf = new DevPerformance();

// Auto-initialize in development
if (config.isDevelopment) {
  logEnvironmentInfo();
  enableHotReload();
}

export default {
  logger,
  perf,
  logError,
  enableHotReload,
  logEnvironmentInfo,
  isFeatureEnabled,
};

export interface ToolbarConfig {
  apiBaseUrl: string;
}

export const config: ToolbarConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
}

export const {
  apiBaseUrl,
} = config;
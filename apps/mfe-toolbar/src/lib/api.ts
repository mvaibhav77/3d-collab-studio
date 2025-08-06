import { apiBaseUrl } from "./config";
import ApiClient from "@repo/api-client";

// Export singleton instance
export const apiClient = new ApiClient(apiBaseUrl);

// Export types for convenience
export type { ApiClient };

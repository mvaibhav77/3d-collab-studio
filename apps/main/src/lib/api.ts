import type {
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
  CollaborativeSession,
} from "@repo/types";
import { config } from "./config";

// HTTP client wrapper
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Session API methods
  async createSession(
    request: CreateSessionRequest
  ): Promise<CreateSessionResponse> {
    return this.request<CreateSessionResponse>("/api/sessions", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async joinSession(request: JoinSessionRequest): Promise<JoinSessionResponse> {
    return this.request<JoinSessionResponse>("/api/sessions/join", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getSession(sessionId: string): Promise<CollaborativeSession> {
    return this.request<CollaborativeSession>(`/api/sessions/${sessionId}`);
  }

  async updateSession(
    sessionId: string,
    sceneData: Record<string, unknown>
  ): Promise<void> {
    return this.request<void>(`/api/sessions/${sessionId}`, {
      method: "PUT",
      body: JSON.stringify({ sceneData }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(config.apiBaseUrl);

// Export types for convenience
export type { ApiClient };

import type {
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
  CollaborativeSession,
  CustomModel,
} from "@repo/types";

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

  // Health check
  async health(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
  }> {
    return this.request("/health");
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
    return this.request<JoinSessionResponse>(
      `/api/sessions/${request.sessionId}/join`,
      {
        method: "POST",
        body: JSON.stringify({ userName: request.userName }),
      }
    );
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

  async add3dModel(
    sessionId: string,
    modelName: string,
    appwriteId: string
  ): Promise<CustomModel> {
    return this.request<CustomModel>(`/api/sessions/${sessionId}/models`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: modelName, appwriteId }),
    });
  }

  async remove3dModel(sessionId: string, modelId: string): Promise<void> {
    return this.request<void>(`/api/sessions/${sessionId}/models/${modelId}`, {
      method: "DELETE",
    });
  }
}

// Export types for convenience
export default ApiClient;

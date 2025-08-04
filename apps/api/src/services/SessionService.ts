import { v4 as uuidv4 } from "uuid";
import type {
  CollaborativeSession,
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
} from "@repo/types";
import { databaseService } from "../database/DatabaseService.js";
import { logger } from "../utils/logger.js";

export class SessionService {
  // Create a new session
  async createSession(
    request: CreateSessionRequest
  ): Promise<CreateSessionResponse> {
    try {
      logger.info(`Creating new session: ${request.name}`);

      const session = await databaseService.createSession(request.name);

      return {
        sessionId: session.id,
        session,
      };
    } catch (error) {
      logger.error("Failed to create session:", error);
      throw new Error("Failed to create session");
    }
  }

  // Join a session by ID
  async joinSession(request: JoinSessionRequest): Promise<JoinSessionResponse> {
    try {
      const session = await databaseService.getSession(request.sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      // Generate a unique user ID for this session
      const userId = uuidv4();

      logger.info(`User joining session`, {
        sessionId: request.sessionId,
        userName: request.userName,
        userId,
      });

      return {
        session,
        userId,
      };
    } catch (error) {
      logger.error("Failed to join session:", error);
      throw error;
    }
  }

  // Get session details
  async getSession(sessionId: string): Promise<CollaborativeSession | null> {
    try {
      return await databaseService.getSession(sessionId);
    } catch (error) {
      logger.error("Failed to get session:", error);
      throw error;
    }
  }

  // Update session scene data
  async updateSession(
    sessionId: string,
    sceneData: Record<string, any>
  ): Promise<void> {
    try {
      await databaseService.updateSession(sessionId, sceneData);
    } catch (error) {
      logger.error("Failed to update session:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const sessionService = new SessionService();

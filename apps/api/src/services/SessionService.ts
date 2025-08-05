import { v4 as uuidv4 } from "uuid";
import type {
  CollaborativeSession,
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
  SessionUser,
} from "@repo/types";
import type { DatabaseService } from "../database/DatabaseService.js";
import { logger } from "../utils/logger.js";
import { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents } from "@repo/types";

export class SessionService {
  // Track participants per session
  private sessionParticipants: Record<string, SessionUser[]> = {};
  private db: DatabaseService;
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(
    db: DatabaseService,
    io: Server<ClientToServerEvents, ServerToClientEvents>
  ) {
    this.db = db;
    this.io = io;
  }

  /**
   * Get the list of current participants in a session
   */
  getParticipants(sessionId: string): SessionUser[] {
    return this.sessionParticipants[sessionId] || [];
  }

  // Remove a participant from a session
  removeParticipant(sessionId: string, userId: string): void {
    if (!this.sessionParticipants[sessionId]) return;
    this.sessionParticipants[sessionId] = this.sessionParticipants[
      sessionId
    ].filter((p) => p.id !== userId);
    logger.info(`Participant removed: `, { sessionId, userId });
  }

  // Add Participant to a session
  addParticipant(sessionId: string, user: SessionUser): void {
    if (!this.sessionParticipants[sessionId])
      this.sessionParticipants[sessionId] = [];
    if (!this.sessionParticipants[sessionId].some((p) => p.id === user.id)) {
      this.sessionParticipants[sessionId].push(user);
      logger.info(`Participant added: `, { sessionId, user });
    }
  }

  // Create a new session
  async createSession(
    request: CreateSessionRequest
  ): Promise<CreateSessionResponse> {
    try {
      logger.info(`Creating new session: ${request.name}`);

      const session = await this.db.createSession(request.name);

      // add user to participant list
      const userId = uuidv4();
      const owner: SessionUser = {
        id: userId,
        name: request.userName,
      };

      this.addParticipant(session.id, owner);

      return {
        sessionId: session.id,
        session,
        owner,
      };
    } catch (error) {
      logger.error("Failed to create session:", error);
      throw new Error("Failed to create session");
    }
  }

  // Join a session by ID
  async joinSession(request: JoinSessionRequest): Promise<JoinSessionResponse> {
    try {
      const session = await this.db.getSession(request.sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      // Generate a unique user ID for this session
      const userId = uuidv4();

      // Create a new participant entry
      const participant: SessionUser = {
        id: userId,
        name: request.userName,
      };

      // Add participant to the session's participants list
      this.addParticipant(request.sessionId, participant);

      logger.info(`User joining session`, {
        sessionId: request.sessionId,
        participant: participant,
      });

      return {
        session,
        userId,
        participant,
      };
    } catch (error) {
      logger.error("Failed to join session:", error);
      throw error;
    }
  }

  // Get session details
  async getSession(sessionId: string): Promise<CollaborativeSession | null> {
    try {
      return await this.db.getSession(sessionId);
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
      await this.db.updateSession(sessionId, sceneData);
    } catch (error) {
      logger.error("Failed to update session:", error);
      throw error;
    }
  }
}

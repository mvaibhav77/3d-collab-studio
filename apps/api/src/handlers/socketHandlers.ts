import { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  ColorChangeData,
  SceneObject,
  TransformChangeData,
  SessionUser,
} from "@repo/types";
import { config } from "../config/index";
import { logger } from "../utils/logger";
import type { SessionService } from "../services/SessionService";

type SocketServer = Server<ClientToServerEvents, ServerToClientEvents>;
type SocketClient = Socket<ClientToServerEvents, ServerToClientEvents>;

export class SocketHandlers {
  private updateTimers = new Map<string, NodeJS.Timeout>();
  private sessionService: SessionService;

  constructor(
    private io: SocketServer,
    private socket: SocketClient,
    sessionService: SessionService
  ) {
    this.sessionService = sessionService;
  }

  /**
   * Register all socket event handlers
   */
  public registerHandlers(): void {
    this.socket.on("object:color_change", this.handleColorChange.bind(this));
    this.socket.on("scene:add_object", this.handleAddObject.bind(this));
    this.socket.on(
      "object:transform_change",
      this.handleTransformChange.bind(this)
    );
    this.socket.on("object:remove", this.handleRemoveObject.bind(this));
    this.socket.on("disconnect", this.handleDisconnect.bind(this));
    this.socket.on("session:join", this.handleJoinSession.bind(this));
  }

  /**
   * Handle color change events
   */
  private async handleColorChange(
    data: ColorChangeData & { sessionId: string }
  ): Promise<void> {
    // Validate color data
    if (!data.color || data.color.length < 3 || !data.sessionId) {
      logger.warn(`Invalid color data received`, data);
      return;
    }

    logger.debug(`Received color change`, data);

    this.clearTimer(data.id);

    const timer = setTimeout(async () => {
      this.socket.broadcast.emit("object:color_change", data);
      // Persist to DB
      try {
        const session = await this.sessionService.getSession(data.sessionId);
        if (session) {
          const sceneData = { ...session.sceneData };
          if (sceneData[data.id]) {
            sceneData[data.id].color = data.color;
            await this.sessionService.updateSession(data.sessionId, sceneData);
          }
        }
      } catch (err) {
        logger.error("Failed to persist color change to DB", err);
      }
      this.updateTimers.delete(data.id);
    }, config.socket.throttle.colorUpdateDelay);

    this.updateTimers.set(data.id, timer);
  }

  /**
   * Handle scene object addition
   */
  private async handleAddObject(
    data: SceneObject & { sessionId: string }
  ): Promise<void> {
    logger.info(`Adding object`, { id: data.id, type: data.type });

    if (!data.id || !data.type || !data.sessionId) {
      logger.warn(`Invalid object data received`, data);
      return;
    }

    // Broadcast to all clients including sender
    this.io.emit("scene:add_object", data);

    // Persist to DB
    try {
      const session = await this.sessionService.getSession(data.sessionId);
      if (session) {
        const sceneData = { ...session.sceneData };
        sceneData[data.id] = {
          id: data.id,
          type: data.type,
          position: data.position,
          rotation: data.rotation,
          scale: data.scale,
          color: data.color,
        };
        await this.sessionService.updateSession(data.sessionId, sceneData);
      }
    } catch (err) {
      logger.error("Failed to persist add object to DB", err);
    }
  }

  /**
   * Handle transform (position, rotation, scale) changes
   */
  private async handleTransformChange(
    data: TransformChangeData & { sessionId: string }
  ): Promise<void> {
    logger.debug(`Received transform change`, data);

    if (!data.id || !data.sessionId) {
      logger.warn(`Invalid transform data received`, data);
      return;
    }

    this.clearTimer(data.id);

    const timer = setTimeout(async () => {
      this.socket.broadcast.emit("object:transform_change", data);
      // Persist to DB
      try {
        const session = await this.sessionService.getSession(data.sessionId);
        if (session) {
          const sceneData = { ...session.sceneData };
          if (sceneData[data.id]) {
            sceneData[data.id].position = data.position;
            sceneData[data.id].rotation = data.rotation;
            sceneData[data.id].scale = data.scale;
            await this.sessionService.updateSession(data.sessionId, sceneData);
          }
        }
      } catch (err) {
        logger.error("Failed to persist transform change to DB", err);
      }
      this.updateTimers.delete(data.id);
    }, config.socket.throttle.transformUpdateDelay);

    this.updateTimers.set(data.id, timer);
  }

  /**
   * Handle object removal
   */
  private async handleRemoveObject(data: {
    id: string;
    sessionId: string;
  }): Promise<void> {
    logger.info(`Removing object`, { id: data.id });

    if (!data.id || !data.sessionId) {
      logger.warn(`Invalid object ID received for removal`, data);
      return;
    }

    this.io.emit("object:remove", { id: data.id });

    // Persist to DB
    try {
      const session = await this.sessionService.getSession(data.sessionId);
      if (session) {
        const sceneData = { ...session.sceneData };
        delete sceneData[data.id];
        await this.sessionService.updateSession(data.sessionId, sceneData);
      }
    } catch (err) {
      logger.error("Failed to persist remove object to DB", err);
    }
  }

  /**
   * Handle session join event
   * data: { sessionId: string, id: string, name: string }
   */
  private handleJoinSession(data: {
    sessionId: string;
    id: string;
    name: string;
  }) {
    const { sessionId, id, name } = data;

    logger.info(`User joining session`, {
      userName: name,
      sessionId: sessionId,
    });

    if (!sessionId || !id || !name) {
      logger.warn(`Invalid session join data received`, data);
      return;
    }

    // Track session and user on socket for disconnect
    this.socket.data.sessionId = sessionId;
    this.socket.data.userId = id;
    this.socket.join(sessionId);

    // Add user to session participants (per session), prevent duplicates
    this.sessionService.addParticipant(sessionId, { id, name });

    // Emit updated participant list to all in session
    const users = this.sessionService.getParticipants(sessionId);
    this.io.to(sessionId).emit("session:user_joined", { users });
  }

  /**
   * Handle client disconnection
   */
  private handleDisconnect(): void {
    logger.info(`User disconnected`, { socketId: this.socket.id });
    const sessionId = this.socket.data.sessionId;
    const userId = this.socket.data.userId;
    if (sessionId && userId) {
      this.sessionService.removeParticipant(sessionId, userId);
      const users = this.sessionService.getParticipants(sessionId);
      this.io.to(sessionId).emit("session:user_left", { userId, users });
    }
    this.cleanup();
  }

  /**
   * Clear a specific timer for an object
   */
  private clearTimer(objectId: string): void {
    const existingTimer = this.updateTimers.get(objectId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
  }

  /**
   * Clean up all pending timers
   */
  private cleanup(): void {
    this.updateTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    this.updateTimers.clear();
  }
}

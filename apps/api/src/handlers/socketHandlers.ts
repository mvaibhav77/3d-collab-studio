import { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  ColorChangeData,
  SceneObject,
  TransformChangeData,
} from "@repo/types";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { sessionService } from "../services/SessionService.js";

type SocketServer = Server<ClientToServerEvents, ServerToClientEvents>;
type SocketClient = Socket<ClientToServerEvents, ServerToClientEvents>;

export class SocketHandlers {
  private updateTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private io: SocketServer,
    private socket: SocketClient
  ) {}

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
        const session = await sessionService.getSession(data.sessionId);
        if (session) {
          const sceneData = { ...session.sceneData };
          if (sceneData[data.id]) {
            sceneData[data.id].color = data.color;
            await sessionService.updateSession(data.sessionId, sceneData);
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
      const session = await sessionService.getSession(data.sessionId);
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
        await sessionService.updateSession(data.sessionId, sceneData);
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
        const session = await sessionService.getSession(data.sessionId);
        if (session) {
          const sceneData = { ...session.sceneData };
          if (sceneData[data.id]) {
            sceneData[data.id].position = data.position;
            sceneData[data.id].rotation = data.rotation;
            sceneData[data.id].scale = data.scale;
            await sessionService.updateSession(data.sessionId, sceneData);
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
      const session = await sessionService.getSession(data.sessionId);
      if (session) {
        const sceneData = { ...session.sceneData };
        delete sceneData[data.id];
        await sessionService.updateSession(data.sessionId, sceneData);
      }
    } catch (err) {
      logger.error("Failed to persist remove object to DB", err);
    }
  }

  /**
   * Handle client disconnection
   */
  private handleDisconnect(): void {
    logger.info(`User disconnected`, { socketId: this.socket.id });
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

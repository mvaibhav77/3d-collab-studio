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
    this.socket.on("disconnect", this.handleDisconnect.bind(this));
  }

  /**
   * Handle color change events
   */
  private handleColorChange(data: ColorChangeData): void {
    // Validate color data
    if (!data.color || data.color.length < 3) {
      logger.warn(`Invalid color data received`, data);
      return;
    }

    logger.debug(`Received color change`, data);

    // Clear existing timer for this object
    this.clearTimer(data.id);

    // Throttle color updates to prevent spam
    const timer = setTimeout(() => {
      this.socket.broadcast.emit("object:color_change", data);
      this.updateTimers.delete(data.id);
    }, config.socket.throttle.colorUpdateDelay);

    this.updateTimers.set(data.id, timer);
  }

  /**
   * Handle scene object addition
   */
  private handleAddObject(data: SceneObject): void {
    logger.info(`Adding object`, { id: data.id, type: data.type });

    // Validate object data
    if (!data.id || !data.type) {
      logger.warn(`Invalid object data received`, data);
      return;
    }

    // Broadcast to all clients including sender
    this.io.emit("scene:add_object", data);
  }

  /**
   * Handle transform (position, rotation, scale) changes
   */
  private handleTransformChange(data: TransformChangeData): void {
    logger.debug(`Received transform change`, data);

    // Validate transform data
    if (!data.id) {
      logger.warn(`Invalid transform data received`, data);
      return;
    }

    // Clear existing timer for this object
    this.clearTimer(data.id);

    // Throttle transform updates to prevent spam
    const timer = setTimeout(() => {
      this.socket.broadcast.emit("object:transform_change", data);
      this.updateTimers.delete(data.id);
    }, config.socket.throttle.transformUpdateDelay);

    this.updateTimers.set(data.id, timer);
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

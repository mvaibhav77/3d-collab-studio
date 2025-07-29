import express from "express";
import http from "http";
import { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents } from "@repo/types";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { SocketHandlers } from "../handlers/socketHandlers.js";

export class ApiServer {
  private app: express.Application;
  private server: http.Server;
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server<ClientToServerEvents, ServerToClientEvents>(
      this.server,
      {
        cors: config.socket.cors,
      }
    );

    this.setupMiddleware();
    this.setupSocketHandlers();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // Add any Express middleware here if needed
    this.app.use(express.json());

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      logger.info(`User connected`, { socketId: socket.id });

      // Create handlers instance for this socket
      const handlers = new SocketHandlers(this.io, socket);
      handlers.registerHandlers();
    });
  }

  /**
   * Start the server
   */
  public start(): void {
    this.server.listen(config.server.port, () => {
      logger.info(`✅ API server listening on port ${config.server.port}`);
    });

    // Graceful shutdown handling
    this.setupGracefulShutdown();
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupGracefulShutdown(): void {
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      this.server.close(() => {
        logger.info("HTTP server closed.");
        this.io.close(() => {
          logger.info("Socket.IO server closed.");
          process.exit(0);
        });
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  }
}

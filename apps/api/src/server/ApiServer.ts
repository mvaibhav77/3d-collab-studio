import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents } from "@repo/types";
import { config } from "../config/index";
import { logger } from "../utils/logger";
import { SocketHandlers } from "../handlers/socketHandlers";
import { SessionService } from "../services/SessionService";
import { DatabaseService } from "../database/DatabaseService";

export class ApiServer {
  private app: express.Application;
  private server: http.Server;
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private sessionService: SessionService;
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server<ClientToServerEvents, ServerToClientEvents>(
      this.server,
      {
        cors: config.socket.cors,
      }
    );
    this.setupSocketHandlers();

    this.db = db;
    this.sessionService = new SessionService(this.db);

    this.setupMiddleware();
    this.setupApiRoutes();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // Enable CORS for all routes
    this.app.use(cors(config.cors));

    // Parse JSON bodies
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
   * Setup API routes
   */
  private setupApiRoutes(): void {
    // Sessions API routes
    this.app.post("/api/sessions", async (req, res) => {
      try {
        const { name, userName } = req.body;
        const response = await this.sessionService.createSession({
          name,
          userName,
        });

        res.status(201).json(response);
      } catch (error) {
        logger.error("Error creating session", { error });
        res.status(500).json({ error: "Failed to create session" });
      }
    });

    this.app.get("/api/sessions/:id", async (req, res) => {
      try {
        const session = await this.sessionService.getSession(req.params.id);
        if (!session) {
          return res.status(404).json({ error: "Session not found" });
        }
        res.json(session);
      } catch (error) {
        logger.error("Error fetching session", {
          error,
          sessionId: req.params.id,
        });
        res.status(500).json({ error: "Failed to fetch session" });
      }
    });

    this.app.post("/api/sessions/:id/join", async (req, res) => {
      try {
        const { userName } = req.body;
        const response = await this.sessionService.joinSession({
          sessionId: req.params.id,
          userName,
        });
        res.json(response);
      } catch (error) {
        logger.error("Error joining session", {
          error,
          sessionId: req.params.id,
        });
        res.status(500).json({ error: "Failed to join session" });
      }
    });

    this.app.put("/api/sessions/:id", async (req, res) => {
      try {
        const { sceneData } = req.body;
        await this.sessionService.updateSession(req.params.id, sceneData);
        res.status(200).json({ success: true });
      } catch (error) {
        logger.error("Error updating session", {
          error,
          sessionId: req.params.id,
        });
        res.status(500).json({ error: "Failed to update session" });
      }
    });

    this.app.post("/api/sessions/:id/models", async (req, res) => {
      try {
        const sessionId = req.params.id;
        const { name, appwriteId } = req.body;

        if (!name || !appwriteId) {
          return res.status(400).json({ error: "Missing name or appwriteId" });
        }

        const newModel = await this.db.createCustomModel(
          name,
          appwriteId,
          sessionId
        );

        res.status(201).json(newModel);
      } catch (error) {
        logger.error("Error creating custom model", { error });
        res.status(500).json({ error: "Failed to create custom model" });
      }
    });
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      logger.info(`User connected`, { socketId: socket.id });

      // Create handlers instance for this socket
      const handlers = new SocketHandlers(this.io, socket, this.sessionService);
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

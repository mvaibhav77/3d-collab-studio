import express from "express";
import http from "http";
import { Server } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  ColorChangeData,
  PositionChangeData,
  SceneObject,
} from "@repo/types";

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS policies and TypeScript types
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Listen for new connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Store throttled position updates per object
  const positionUpdateTimers = new Map<string, NodeJS.Timeout>();

  // LISTENERS

  // Listen for color change events from the client
  socket.on("object:color_change", (data: ColorChangeData) => {
    // Broadcast the event to all OTHER clients
    console.log(`Received color change:`, data);
    socket.broadcast.emit("object:color_change", data);
  });

  // Listen for position change events from the client
  socket.on("object:position_change", (data: PositionChangeData) => {
    // Clear any existing timer for this object
    const existingTimer = positionUpdateTimers.get(data.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Throttle position updates to avoid spamming (30ms delay)
    const timer = setTimeout(() => {
      console.log(`Broadcasting position change:`, data);
      socket.broadcast.emit("object:position_change", data);
      positionUpdateTimers.delete(data.id);
    }, 30);

    positionUpdateTimers.set(data.id, timer);
  });

  // Listen for scene object addition events from the client
  socket.on("scene:add_object", (data: SceneObject) => {
    console.log(`Adding object:`, data);
    // Use io.emit to send to all clients, including the sender
    io.emit("scene:add_object", data);
  });

  // Listen for a 'disconnect' event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Clean up any pending position update timers
    positionUpdateTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    positionUpdateTimers.clear();
  });
});

server.listen(PORT, () => {
  console.log(`✅ API server listening on port ${PORT}`);
});

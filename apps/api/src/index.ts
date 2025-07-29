import express from "express";
import http from "http";
import { Server } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  ColorChangeData,
  SceneObject,
  TransformChangeData,
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
  const updateTimers = new Map<string, NodeJS.Timeout>();

  // LISTENERS
  // Listen for color change events from the client
  socket.on("object:color_change", (data: ColorChangeData) => {
    // Broadcast the event to all OTHER clients
    console.log(`Received color change:`, data);
    socket.broadcast.emit("object:color_change", data);
  });

  // Listen for scene object addition events from the client
  socket.on("scene:add_object", (data: SceneObject) => {
    console.log(`Adding object:`, data);
    // Use io.emit to send to all clients, including the sender
    io.emit("scene:add_object", data);
  });

  // Listen for position change events from the client
  socket.on("object:transform_change", (data: TransformChangeData) => {
    // Clear any existing timer for this object
    const existingTimer = updateTimers.get(data.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Throttle position updates to avoid spamming (30ms delay)
    const timer = setTimeout(() => {
      console.log(`Broadcasting position change:`, data);
      socket.broadcast.emit("object:transform_change", data);
      updateTimers.delete(data.id);
    }, 30);

    updateTimers.set(data.id, timer);
  });

  // Listen for color change events
  socket.on("object:color_change", (data: ColorChangeData) => {
    if (data.color.length < 3) return; // Ignore invalid colors

    // Throttle color change events to avoid spamming

    const existingTimer = updateTimers.get(data.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Throttle position updates to avoid spamming (30ms delay)
    const timer = setTimeout(() => {
      // Broadcast the event to all OTHER clients
      socket.broadcast.emit("object:color_change", data);
      updateTimers.delete(data.id);
    }, 30);

    updateTimers.set(data.id, timer);
  });

  // Listen for a 'disconnect' event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Clean up any pending position update timers
    updateTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    updateTimers.clear();
  });
});

server.listen(PORT, () => {
  console.log(`✅ API server listening on port ${PORT}`);
});

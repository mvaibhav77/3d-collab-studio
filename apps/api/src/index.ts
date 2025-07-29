import express from "express";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS policies
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Listen for new connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // LISTENERS

  // Listen for color change events from the client
  socket.on("object:color_change", (data) => {
    // Broadcast the event to all OTHER clients
    console.log(`Received color change:`, data);
    socket.broadcast.emit("object:color_change", data);
  });

  // Listen for a 'disconnect' event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ API server listening on port ${PORT}`);
});

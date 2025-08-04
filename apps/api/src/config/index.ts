import { config as dotenvConfig } from "dotenv";

// Load environment variables from .env file
dotenvConfig();

export const config = {
  server: {
    port: process.env.PORT || 3001,
  },
  cors: {
    origin:
      process.env.NODE_ENV === "development" ? "*" : process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  socket: {
    cors: {
      origin:
        process.env.NODE_ENV === "development"
          ? process.env.FRONTEND_URL || "*"
          : process.env.FRONTEND_URL,
      methods: ["GET", "POST"] as string[],
    },
    throttle: {
      transformUpdateDelay: 30, // ms
      colorUpdateDelay: 30, // ms
    },
  },
};

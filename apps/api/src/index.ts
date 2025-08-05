import { DatabaseService } from "./database/DatabaseService.js";
import { ApiServer } from "./server/ApiServer.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Start the server
try {
  const db = new DatabaseService();
  await db.connect();

  const server = new ApiServer(db);
  server.start();
} catch (error) {
  console.error("Error starting server:", error);
}

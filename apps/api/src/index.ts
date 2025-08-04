import { ApiServer } from "./server/ApiServer.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Start the server
const server = new ApiServer();
server.start();

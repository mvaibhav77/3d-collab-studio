import { io } from "socket.io-client";

// Use VITE_WEBSOCKET_URL if set, otherwise default to localhost
const URL = import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3001";
export const socket = io(URL);

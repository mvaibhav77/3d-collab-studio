import { io } from "socket.io-client";

// Connect to the API server we created
const URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const socket = io(URL);

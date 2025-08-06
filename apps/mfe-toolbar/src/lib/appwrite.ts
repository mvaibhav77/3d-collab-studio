import { Client, Storage, ID } from "appwrite";

// Initialize the Appwrite Client
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Create a new Storage instance
export const storage = new Storage(client);

// Export the ID helper for creating unique IDs
export { ID };

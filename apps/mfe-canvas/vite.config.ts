// apps/mfe-canvas/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    cors: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "mfe_canvas",
      filename: "remoteEntry.js",
      exposes: {
        "./Scene": "./src/Scene.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});

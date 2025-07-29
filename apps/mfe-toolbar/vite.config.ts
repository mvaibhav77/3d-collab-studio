import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Add this server block
  server: {
    cors: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "mfe_toolbar",
      filename: "remoteEntry.js",
      exposes: {
        "./Toolbar": "./src/Toolbar.tsx",
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

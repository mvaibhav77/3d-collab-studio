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
      shared: [
        "react",
        "react-dom",
        "@repo/three-wrapper",
        "@repo/types",
        "@react-three/fiber",
        "@react-three/drei",
        "@repo/store",
        "appwrite",
      ],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});

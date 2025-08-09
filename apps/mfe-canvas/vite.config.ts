import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const isProduction = mode === "production";
  return {
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
      outDir: "dist",
      sourcemap: !isProduction,
      minify: isProduction ? "esbuild" : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            three: ["@react-three/fiber", "@react-three/drei"],
          },
        },
      },
    },
  };
});

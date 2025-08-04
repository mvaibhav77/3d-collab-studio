import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";
  const isProduction = mode === "production";

  return {
    // Development server configuration
    server: {
      port: 3000,
      host: true,
      cors: true,
      hmr: {
        port: 3003,
      },
    },

    // Preview server configuration
    preview: {
      port: 3000,
      host: true,
    },

    // Build configuration
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

    // Define global constants
    define: {
      __DEV__: JSON.stringify(isDev),
      __PROD__: JSON.stringify(isProduction),
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version || "1.0.0"
      ),
    },

    plugins: [
      react({
        // Enable Fast Refresh in development
        devTarget: isDev ? "esnext" : "es2015",
      }),
      tailwindcss(),
      federation({
        name: "main_host",
        remotes: {
          mfe_toolbar:
            env.VITE_MFE_TOOLBAR_URL ||
            "http://localhost:5001/assets/remoteEntry.js",
          mfe_canvas:
            env.VITE_MFE_CANVAS_URL ||
            "http://localhost:5002/assets/remoteEntry.js",
        },
        shared: [
          "react",
          "react-dom",
          "@repo/three-wrapper",
          "@repo/types",
          "@react-three/fiber",
          "@react-three/drei",
          "@repo/store",
        ],
      }),
    ],

    // Resolve configuration
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@lib": "/src/lib",
        "@hooks": "/src/hooks",
        "@utils": "/src/utils",
        "@types": "/src/types",
      },
    },

    // Environment variables
    envPrefix: "VITE_",
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "main_host",
      remotes: {
        mfe_toolbar: "http://localhost:5001/assets/remoteEntry.js",
        mfe_canvas: "http://localhost:5002/assets/remoteEntry.js",
      },
      shared: [
        "react",
        "react-dom",
        "@react-three/fiber",
        "@react-three/drei",
      ],
    }),
  ],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react()],
    server: {
      port: 5173,
      host: "localhost",
      proxy: {
        "/api": {
          target: "https://localhost:8443",
          changeOrigin: true,
          secure: false, // Permite certificados auto-firmados
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };

  if (command === "serve") {
    config.server.https = {
      key: fs.readFileSync(
        path.resolve(__dirname, "../../backend/config/ssl/server.key")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "../../backend/config/ssl/server.cert")
      ),
    };
  }

  return config;
});

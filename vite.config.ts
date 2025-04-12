import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: "localhost",
    port: 10002,
    proxy: {
      "/api/generate": {
        target: "http://localhost:10001",
        changeOrigin: true,
      },
    },
  },
});

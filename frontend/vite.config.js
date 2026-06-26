import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), visualizer({ open: true })],
  base: "/",
  server: {
    host: true, // allows access from network & ngrok
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "uninthralled-gropingly-crew.ngrok-free.dev",
      "localhost",
      "127.0.0.1",
    ],
  },
});

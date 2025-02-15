import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/": {
        target: "https://twilight-chat-app.onrender.com", // Backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: rewrite the path if needed
      },
    },
  },
});

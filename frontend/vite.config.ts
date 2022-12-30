import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/guess": {
        target: "http://localhost:8899/",
        changeOrigin: true,
      },
      "/yesterday": {
        target: "http://localhost:8899/",
        changeOrigin: true,
      },
      "/similarity": {
        target: "http://localhost:8899/",
        changeOrigin: true,
      },
      "/giveup": {
        target: "http://localhost:8899/",
        changeOrigin: true,
      },
      "/nearest1k-data": {
        target: "http://localhost:8899/",
        changeOrigin: true,
      },
    },
  },
});

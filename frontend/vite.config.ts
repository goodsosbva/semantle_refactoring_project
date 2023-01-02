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
        target: "https://semantle-ko.newsjel.ly/",
        changeOrigin: true,
      },
      "/yesterday": {
        target: "https://semantle-ko.newsjel.ly/",
        changeOrigin: true,
      },
      "/similarity": {
        target: "https://semantle-ko.newsjel.ly/",
        changeOrigin: true,
      },
      "/giveup": {
        target: "https://semantle-ko.newsjel.ly/",
        changeOrigin: true,
      },
      "/nearest1k-data": {
        target: "https://semantle-ko.newsjel.ly/",
        changeOrigin: true,
      },
    },
  },
});

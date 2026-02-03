import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
    host: true,
    port: 5173,
  },
});

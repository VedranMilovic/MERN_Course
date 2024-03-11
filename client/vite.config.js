import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // config file of vite
  plugins: [react()], //  react plugin od Vite
  server: {
    // development server configurations
    proxy: {
      // redirekta req. s pathom /api na target
      "/api": {
        target: "http://localhost:5100/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // miče api iz targeta, s početka patha
      },
    },
  },
});

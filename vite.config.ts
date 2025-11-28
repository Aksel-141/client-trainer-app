import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router"],
          "mui-vendor": ["@mui/joy", "@emotion/react", "@emotion/styled"],
          "utils-vendor": ["axios", "react-toastify"],
        },
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "./assets"), // IMPORTANT: this is where your built files go
    emptyOutDir: true,
  },
  define: {
    "process.env": {
      DFX_NETWORK: JSON.stringify(process.env.DFX_NETWORK || "local"),
      CANISTER_ID_APP_BACKEND: JSON.stringify(
        process.env.CANISTER_ID_APP_BACKEND,
      ),
      CANISTER_ID_INTERNET_IDENTITY: JSON.stringify(
        process.env.CANISTER_ID_INTERNET_IDENTITY,
      ),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4943",
        changeOrigin: true,
      },
    },
  },
});

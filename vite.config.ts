// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // wichtig für LAN/Tunnel
    port: 8081,          // MUSS zu deinem "npm run dev" Port passen
    strictPort: true,
    allowedHosts: "all", // Quick-Fix für trycloudflare/ngrok
  },
});

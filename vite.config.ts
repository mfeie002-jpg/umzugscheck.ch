// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // wichtig für Tunnel/Netzwerk
    port: 8081,           // dein aktueller Port
    strictPort: true,
    allowedHosts: "all",  // DEV ONLY: erlaubt trycloudflare host header
  },
});

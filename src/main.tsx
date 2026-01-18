import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure users always get the latest build (avoids stale cached UI on mobile)
import { registerSW } from "virtual:pwa-register";

// Auto-update service worker and reload when a new version is available
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
    // Small delay to allow the new SW to activate before reload
    setTimeout(() => window.location.reload(), 50);
  },
});

createRoot(document.getElementById("root")!).render(<App />);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ Set this to your real published domain (no protocol, no path)
const PUBLISHED_HOSTNAME = "umzugscheckv2.lovable.app";

function setupServiceWorkerPolicy() {
  // Never block rendering on SW ops.
  if (!("serviceWorker" in navigator)) return;

  const hostname = window.location.hostname;
  const isPublishedHost = hostname === PUBLISHED_HOSTNAME;
  const isProdBuild = import.meta.env.PROD === true;

  if (isProdBuild && isPublishedHost) {
    // ✅ Only register SW on the real published host.
    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {
        // swallow errors; do not affect app boot
      });
    return;
  }

  // ✅ On preview/staging/anything else:
  // - unregister any existing SW registrations
  // - clear Cache Storage (prevents mixed JS chunks)
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.allSettled(registrations.map((reg) => reg.unregister()))
    )
    .catch(() => {
      // swallow errors
    });

  if ("caches" in window) {
    caches
      .keys()
      .then((keys) => Promise.allSettled(keys.map((k) => caches.delete(k))))
      .catch(() => {
        // swallow errors
      });
  }
}

setupServiceWorkerPolicy();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

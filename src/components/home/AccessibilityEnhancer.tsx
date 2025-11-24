import { useEffect } from "react";

// This component adds accessibility enhancements globally
export const AccessibilityEnhancer = () => {
  useEffect(() => {
    // Add skip to main content link
    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.textContent = "Skip to main content";
    skipLink.className = "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg";
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark if not exists
    const main = document.querySelector("main");
    if (!main) {
      const appDiv = document.getElementById("root");
      if (appDiv) {
        const mainElement = document.createElement("main");
        mainElement.id = "main-content";
        mainElement.setAttribute("role", "main");
        while (appDiv.firstChild) {
          mainElement.appendChild(appDiv.firstChild);
        }
        appDiv.appendChild(mainElement);
      }
    }

    // Enhance keyboard navigation
    const handleKeyboardNavigation = (e: KeyboardEvent) => {
      // Add visual focus indicator on tab
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-nav");
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove("keyboard-nav");
    };

    document.addEventListener("keydown", handleKeyboardNavigation);
    document.addEventListener("mousedown", handleMouseDown);

    // Add focus-visible polyfill styles
    const style = document.createElement("style");
    style.textContent = `
      body:not(.keyboard-nav) *:focus {
        outline: none;
      }
      body.keyboard-nav *:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("keydown", handleKeyboardNavigation);
      document.removeEventListener("mousedown", handleMouseDown);
      skipLink.remove();
      style.remove();
    };
  }, []);

  return null;
};

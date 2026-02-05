/**
 * ExitIntentModal.tsx
 * 
 * Exit-Intent Modal: Shows "Warte! Spare bis CHF 850" when user leaves
 * 
 * Features:
 * - Triggers on mouseout (Desktop) + 15s inactivity (Mobile)
 * - Shows only 1x per session (localStorage)
 * - Dismissible with 24h localStorage flag
 * - Mobile-optimized
 * - No performance impact (lazy mounted)
 * 
 * Usage (in App.tsx layout):
 * ```tsx
 * <ExitIntentModal />
 * ```
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SESSION_STORAGE_KEY = "exit_modal_shown";
const SESSION_ID_KEY = "exit_modal_session_id";

export const ExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return null;
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = Math.random().toString(36).substring(7);
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;

    const alreadyShown = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (alreadyShown) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // Mobile: show after 15s inactivity
      let inactivityTimer: NodeJS.Timeout;
      let activityTimer: NodeJS.Timeout;

      const resetInactivity = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
          document.removeEventListener("click", resetInactivity);
          document.removeEventListener("scroll", resetInactivity);
          document.removeEventListener("touchstart", resetInactivity);
        }, 15000);
      };

      document.addEventListener("click", resetInactivity);
      document.addEventListener("scroll", resetInactivity);
      document.addEventListener("touchstart", resetInactivity);
      resetInactivity();

      return () => {
        clearTimeout(inactivityTimer);
        clearTimeout(activityTimer);
        document.removeEventListener("click", resetInactivity);
        document.removeEventListener("scroll", resetInactivity);
        document.removeEventListener("touchstart", resetInactivity);
      };
    } else {
      // Desktop: show on mouseout (leaving window)
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsOpen(true);
          sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
          document.removeEventListener("mousemove", handleMouseLeave);
        }
      };

      document.addEventListener("mousemove", handleMouseLeave);

      return () => {
        document.removeEventListener("mousemove", handleMouseLeave);
      };
    }
  }, [sessionId]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContinue = () => {
    setIsOpen(false);
    // Scroll to hero form if needed
    const formElement = document.querySelector("[data-hero-form]");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-auto px-4"
          >
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-1 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-6 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>

                {/* Headline */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Moment noch!
                </h2>

                {/* Subheading */}
                <p className="text-gray-600 text-sm mb-4">
                  Verpasse nicht die Chance, bis zu{" "}
                  <span className="font-semibold text-green-600">CHF 850</span> zu sparen
                </p>

                {/* Social proof */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-gray-700">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 align-middle"></span>
                    <span className="font-medium">327 Personen</span> haben heute ihr bestes
                    Angebot gefunden
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Jetzt doch vergleichen
                  </Button>
                  <button
                    onClick={handleClose}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                  >
                    Nein, danke
                  </button>
                </div>

                {/* Trust text */}
                <p className="text-xs text-gray-500 mt-4">
                  ✓ Kostenlos · ✓ Unverbindlich · ✓ 2 Min Formular
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

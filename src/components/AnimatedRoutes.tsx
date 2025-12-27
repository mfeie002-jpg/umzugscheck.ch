import { Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useMemo } from "react";

interface AnimatedRoutesProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -12,
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.25,
};

export const AnimatedRoutes = ({ children }: AnimatedRoutesProps) => {
  const location = useLocation();

  // ✅ Key darf search enthalten (für Animationen), aber pathname MUSS sauber bleiben
  const routeKey = useMemo(
    () => `${location.pathname}${location.search}`,
    [location.pathname, location.search]
  );

  // DEV-Tripwire: wenn das jemals feuert, mutiert irgendwer Location
  if (import.meta.env.DEV && location.pathname.includes("?")) {
    console.warn("[AnimatedRoutes] Invalid pathname contains '?'. Location was mutated:", location);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {/* ✅ Routes bekommt die echte Location (pathname + search getrennt) */}
        <Routes location={location}>
          {children}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;

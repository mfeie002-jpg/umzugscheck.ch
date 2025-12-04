import { Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          {children}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;

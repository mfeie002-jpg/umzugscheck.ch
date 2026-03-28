import { motion, useScroll, useSpring } from "framer-motion";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

export const ScrollProgress = () => {
  // Screenshot tools can capture during RAF-updated transforms; disable this indicator in screenshot mode.
  if (isScreenshotRenderMode()) return null;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
      style={{ scaleX }}
    />
  );
};


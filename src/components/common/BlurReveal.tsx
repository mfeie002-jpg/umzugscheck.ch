import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

interface BlurRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const BlurReveal = memo(function BlurReveal({
  children,
  className,
  delay = 0,
}: BlurRevealProps) {
  const screenshotMode = isScreenshotRenderMode();

  if (screenshotMode) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
});


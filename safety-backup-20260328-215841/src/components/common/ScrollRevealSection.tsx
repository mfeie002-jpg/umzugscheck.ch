import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealSectionProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}

export const ScrollRevealSection = memo(function ScrollRevealSection({
  children,
  className,
  stagger = false
}: ScrollRevealSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: stagger
        ? { staggerChildren: 0.1, delayChildren: 0.1 }
        : { duration: 0.6 }
    }
  };

  return (
    <motion.section
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {children}
    </motion.section>
  );
});
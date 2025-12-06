import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  background?: "default" | "muted" | "gradient";
  id?: string;
  ariaLabel?: string;
}

const bgStyles = {
  default: "bg-background",
  muted: "bg-muted/30",
  gradient: "bg-gradient-to-b from-muted/30 to-background"
};

export const SectionWrapper = memo(({
  children,
  className,
  background = "default",
  id,
  ariaLabel
}: SectionWrapperProps) => {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "py-12 md:py-16 lg:py-20 relative overflow-hidden",
        bgStyles[background],
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4"
      >
        {children}
      </motion.div>
    </section>
  );
});

SectionWrapper.displayName = 'SectionWrapper';

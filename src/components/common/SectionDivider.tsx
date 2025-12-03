import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "dots" | "line" | "wave";
  className?: string;
}

export const SectionDivider = ({ variant = "dots", className = "" }: SectionDividerProps) => {
  if (variant === "line") {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className={`overflow-hidden ${className}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 text-muted/30"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  // Default: dots
  return (
    <div className={`flex items-center justify-center gap-2 py-8 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="w-1.5 h-1.5 rounded-full bg-primary/30"
        />
      ))}
    </div>
  );
};

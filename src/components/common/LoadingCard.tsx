import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingCardProps {
  className?: string;
  variant?: "default" | "compact" | "wide";
}

export const LoadingCard = ({ className, variant = "default" }: LoadingCardProps) => {
  const variants = {
    default: "p-6",
    compact: "p-4",
    wide: "p-8"
  };

  return (
    <div className={cn(
      "bg-card rounded-2xl border border-border/50 overflow-hidden",
      variants[variant],
      className
    )}>
      {/* Image placeholder */}
      <div className="relative h-40 bg-muted rounded-lg overflow-hidden mb-4">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Title placeholder */}
      <div className="h-6 bg-muted rounded-lg w-3/4 mb-3 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
        />
      </div>
      
      {/* Description placeholder */}
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded-lg w-full relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
          />
        </div>
        <div className="h-4 bg-muted rounded-lg w-5/6 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.3 }}
          />
        </div>
      </div>
      
      {/* Button placeholder */}
      <div className="h-10 bg-muted rounded-lg w-32 mt-4 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.4 }}
        />
      </div>
    </div>
  );
};

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePerformance } from "@/contexts/PerformanceContext";

interface DockItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export const FloatingDock = memo(function FloatingDock({
  items,
  className
}: FloatingDockProps) {
  const { isMobile, shouldReduceAnimations } = usePerformance();

  // Don't render on mobile - too heavy for small screens
  if (isMobile) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-2 p-2 rounded-2xl",
        "bg-background/80 backdrop-blur-xl border border-border/50",
        "shadow-lg",
        className
      )}
      initial={shouldReduceAnimations ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={shouldReduceAnimations ? { duration: 0 } : { delay: 0.5, type: "spring", stiffness: 200 }}
    >
      {items.map((item, i) => (
        <motion.a
          key={i}
          href={item.href}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl",
            "bg-muted/50 hover:bg-primary hover:text-primary-foreground",
            "transition-colors duration-200"
          )}
          whileHover={shouldReduceAnimations ? {} : { scale: 1.2, y: -4 }}
          whileTap={shouldReduceAnimations ? {} : { scale: 0.95 }}
          title={item.label}
        >
          <item.icon className="h-5 w-5" />
        </motion.a>
      ))}
    </motion.div>
  );
});

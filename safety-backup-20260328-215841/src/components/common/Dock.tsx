import { memo, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface DockProps {
  children: ReactNode;
  className?: string;
}

interface DockIconProps {
  children: ReactNode;
  className?: string;
  mouseX?: any;
}

export const Dock = memo(function Dock({ children, className }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className={cn(
        "flex items-end gap-2 p-2 rounded-2xl",
        "bg-background/80 backdrop-blur-xl border border-border/50",
        className
      )}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {children}
    </motion.div>
  );
});

export const DockIcon = memo(function DockIcon({
  children,
  className,
  mouseX
}: DockIconProps) {
  const ref = useMotionValue<HTMLDivElement | null>(null);
  
  const distance = useTransform(mouseX || useMotionValue(Infinity), (val: number) => {
    const el = ref.get();
    if (!el) return 150;
    const bounds = el.getBoundingClientRect();
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={(el) => ref.set(el)}
      className={cn(
        "aspect-square rounded-xl bg-muted/50",
        "flex items-center justify-center",
        className
      )}
      style={{ width, height: width }}
    >
      {children}
    </motion.div>
  );
});

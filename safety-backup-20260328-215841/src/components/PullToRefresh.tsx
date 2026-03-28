import { ReactNode } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const PullToRefresh = ({
  children,
  onRefresh,
  disabled = false,
  className,
}: PullToRefreshProps) => {
  const { isPulling, isRefreshing, pullDistance, pullProgress } = usePullToRefresh({
    onRefresh,
    disabled,
  });

  return (
    <div className={cn("relative", className)}>
      {/* Pull indicator */}
      <motion.div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 z-50 flex items-center justify-center",
          "w-10 h-10 rounded-full bg-background shadow-lg border border-border",
          "md:hidden" // Only show on mobile
        )}
        style={{
          top: Math.max(pullDistance - 50, -50),
          opacity: pullProgress,
        }}
        animate={{
          scale: isRefreshing ? 1 : 0.8 + pullProgress * 0.2,
        }}
      >
        <motion.div
          animate={{
            rotate: isRefreshing ? 360 : pullProgress * 180,
          }}
          transition={{
            rotate: isRefreshing
              ? { duration: 1, repeat: Infinity, ease: "linear" }
              : { duration: 0 },
          }}
        >
          <RefreshCw
            className={cn(
              "h-5 w-5 text-primary",
              isRefreshing && "animate-spin"
            )}
          />
        </motion.div>
      </motion.div>

      {/* Content with transform during pull */}
      <motion.div
        style={{
          transform: `translateY(${isPulling || isRefreshing ? pullDistance : 0}px)`,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

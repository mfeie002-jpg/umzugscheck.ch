import { memo } from "react";
import { motion } from "framer-motion";
import { CountUpNumber } from "./CountUpNumber";
import { cn } from "@/lib/utils";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}

interface StatsRowProps {
  stats: StatItemProps[];
  variant?: "compact" | "full";
  className?: string;
}

export const StatsRow = memo(({
  stats,
  variant = "compact",
  className
}: StatsRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-wrap justify-center gap-6 md:gap-12",
        className
      )}
    >
      {stats.map((stat, idx) => (
        <div key={idx} className="text-center">
          <div className={cn(
            "font-bold text-primary",
            variant === "compact" ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
          )}>
            <CountUpNumber value={stat.value} suffix={stat.suffix || ""} />
          </div>
          <div className={cn(
            "text-muted-foreground",
            variant === "compact" ? "text-xs md:text-sm" : "text-sm"
          )}>
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
});

StatsRow.displayName = 'StatsRow';

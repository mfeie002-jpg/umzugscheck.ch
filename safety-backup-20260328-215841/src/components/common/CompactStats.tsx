import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  color?: string;
}

interface CompactStatsProps {
  stats: StatItem[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export const CompactStats = memo(({ 
  stats, 
  className = "",
  columns = 4
}: CompactStatsProps) => {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-3",
      gridCols[columns],
      className
    )}>
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/40"
        >
          <stat.icon 
            className={cn("h-5 w-5 flex-shrink-0", stat.color || "text-primary")} 
            aria-hidden="true"
          />
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground truncate">
              {stat.value}
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

CompactStats.displayName = 'CompactStats';

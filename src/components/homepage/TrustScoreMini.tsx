/**
 * TrustScoreMini - Compact trust score badge for Hero integration
 * Shows the platform's trust score in a minimal format
 */

import { memo } from "react";
import { cn } from "@/lib/utils";

interface TrustScoreMiniProps {
  score?: number;
  className?: string;
  showLabel?: boolean;
}

export const TrustScoreMini = memo(function TrustScoreMini({
  score = 94,
  className,
  showLabel = true,
}: TrustScoreMiniProps) {
  // Determine color based on score
  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-emerald-500";
    if (s >= 75) return "text-amber-500";
    return "text-red-500";
  };

  const getBgColor = (s: number) => {
    if (s >= 90) return "bg-emerald-500/10";
    if (s >= 75) return "bg-amber-500/10";
    return "bg-red-500/10";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full",
        getBgColor(score),
        className
      )}
    >
      {/* Mini SVG ring */}
      <svg className="w-5 h-5" viewBox="0 0 36 36">
        {/* Background circle */}
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted/30"
        />
        {/* Score arc */}
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${score}, 100`}
          strokeLinecap="round"
          className={getScoreColor(score)}
        />
      </svg>
      
      <span className={cn("text-xs font-bold", getScoreColor(score))}>
        {score}
      </span>
      
      {showLabel && (
        <span className="text-[10px] text-muted-foreground">
          Trust
        </span>
      )}
    </div>
  );
});

export default TrustScoreMini;

/**
 * Launch Status Badge - Shows P0 readiness status
 */

import { Badge } from "@/components/ui/badge";
import { Rocket, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePaidLaunchStats } from "@/hooks/usePaidLaunchChecklist";

interface LaunchStatusBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export function LaunchStatusBadge({ className, showDetails = true }: LaunchStatusBadgeProps) {
  const { data: stats, isLoading } = usePaidLaunchStats();

  if (isLoading) {
    return (
      <Badge variant="outline" className={cn("gap-1.5", className)}>
        <Loader2 className="w-3 h-3 animate-spin" />
        Loading...
      </Badge>
    );
  }

  if (!stats) {
    return null;
  }

  const canLaunch = stats.p0Done === stats.p0Total && stats.p0Total > 0;
  const progress = stats.p0Total > 0 ? Math.round((stats.p0Done / stats.p0Total) * 100) : 0;

  if (canLaunch) {
    return (
      <Badge 
        className={cn(
          "gap-1.5 bg-green-600 hover:bg-green-700 text-white border-green-600",
          className
        )}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="font-semibold">READY TO LAUNCH</span>
        {showDetails && (
          <span className="text-green-200 ml-1">
            {stats.p0Total}/{stats.p0Total} P0
          </span>
        )}
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1.5 border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
        className
      )}
    >
      <Rocket className="w-3.5 h-3.5" />
      <span className="font-semibold">PRE-LAUNCH</span>
      {showDetails && (
        <span className="text-amber-500 ml-1">
          {stats.p0Done}/{stats.p0Total} P0 ({progress}%)
        </span>
      )}
    </Badge>
  );
}

export default LaunchStatusBadge;

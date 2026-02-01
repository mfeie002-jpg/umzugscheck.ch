/**
 * P0 Blocker Alert - Floating alert showing critical P0 blockers
 */

import { useState } from "react";
import { AlertTriangle, X, ChevronDown, ChevronUp, Rocket, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePaidLaunchTasks, usePaidLaunchStats } from "@/hooks/usePaidLaunchChecklist";

interface P0BlockerAlertProps {
  className?: string;
  onNavigateToLaunch?: () => void;
}

export function P0BlockerAlert({ className, onNavigateToLaunch }: P0BlockerAlertProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const { data: stats } = usePaidLaunchStats();
  const { data: tasks } = usePaidLaunchTasks({ priority: 'p0' });

  // Don't show if all P0 are done or if dismissed
  if (!stats || stats.p0Done === stats.p0Total || isDismissed) {
    return null;
  }

  const pendingP0 = tasks?.filter(t => t.status !== 'done') || [];
  const remainingCount = stats.p0Total - stats.p0Done;

  return (
    <Card 
      className={cn(
        "border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-lg",
        className
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                  {remainingCount} P0 Blocker{remainingCount > 1 ? 's' : ''} verbleibend
                </span>
                <Badge 
                  variant="outline" 
                  className="text-[10px] border-amber-500 text-amber-600 bg-amber-100 dark:bg-amber-900/50"
                >
                  Ads blockiert
                </Badge>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-amber-500 hover:text-amber-700 hover:bg-amber-100"
                  onClick={() => setIsDismissed(true)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="mt-2 space-y-2">
                <ul className="space-y-1">
                  {pendingP0.slice(0, 3).map(task => (
                    <li 
                      key={task.id} 
                      className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span className="truncate">{task.title}</span>
                      <Badge 
                        variant="outline" 
                        className="text-[9px] px-1 py-0 border-amber-400 text-amber-600"
                      >
                        {task.owner || task.category}
                      </Badge>
                    </li>
                  ))}
                  {pendingP0.length > 3 && (
                    <li className="text-xs text-amber-600 italic">
                      +{pendingP0.length - 3} weitere...
                    </li>
                  )}
                </ul>

                {onNavigateToLaunch && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-amber-500 text-amber-700 hover:bg-amber-100 gap-1.5"
                    onClick={onNavigateToLaunch}
                  >
                    <Rocket className="w-3 h-3" />
                    Zum Launch Cockpit
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default P0BlockerAlert;

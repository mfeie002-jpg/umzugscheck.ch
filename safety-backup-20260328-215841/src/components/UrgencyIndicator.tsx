import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, Users, TrendingUp, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface UrgencyIndicatorProps {
  type?: "high" | "medium" | "low";
  viewersCount?: number;
  recentBookings?: number;
  availableSlots?: number;
}

export const UrgencyIndicator = ({
  type = "medium",
  viewersCount = 12,
  recentBookings = 3,
  availableSlots = 2,
}: UrgencyIndicatorProps) => {
  const urgencyConfig = {
    high: {
      color: "bg-red-50 border-red-200",
      textColor: "text-red-700",
      badgeColor: "bg-red-500",
      icon: <Flame className="h-4 w-4" />,
      label: "Hohe Nachfrage",
    },
    medium: {
      color: "bg-amber-50 border-amber-200",
      textColor: "text-amber-700",
      badgeColor: "bg-amber-500",
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Steigende Nachfrage",
    },
    low: {
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
      badgeColor: "bg-green-500",
      icon: <Clock className="h-4 w-4" />,
      label: "Gute Verfügbarkeit",
    },
  };

  const config = urgencyConfig[type];

  return (
    <Card className={`border ${config.color}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: type === "high" ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: type === "high" ? Infinity : 0, duration: 1 }}
              className={`p-1.5 rounded-full ${config.badgeColor} text-white`}
            >
              {config.icon}
            </motion.div>
            <div>
              <p className={`text-sm font-semibold ${config.textColor}`}>
                {config.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {type === "high" 
                  ? "Buchen Sie jetzt, bevor es zu spät ist!"
                  : type === "medium"
                    ? "Empfohlen: Bald anfragen"
                    : "Flexible Terminwahl möglich"
                }
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Users className="h-3 w-3" />
              {viewersCount} schauen
            </Badge>
            {type === "high" && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                Nur {availableSlots} Plätze
              </Badge>
            )}
          </div>
        </div>

        {type !== "low" && (
          <div className="mt-2 pt-2 border-t border-dashed flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {recentBookings} Buchungen heute
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {availableSlots} Termine diese Woche
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UrgencyIndicator;

import { Calendar, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AvailabilityStatus {
  status: "available" | "limited" | "busy";
  nextAvailable?: string;
  slotsThisWeek?: number;
}

interface CompanyAvailabilityPreviewProps {
  availability?: AvailabilityStatus;
  className?: string;
  compact?: boolean;
}

export const CompanyAvailabilityPreview = ({
  availability,
  className,
  compact = false,
}: CompanyAvailabilityPreviewProps) => {
  if (!availability) {
    return null;
  }

  const statusConfig = {
    available: {
      icon: CheckCircle,
      label: "Verfügbar",
      color: "text-green-600",
      bgColor: "bg-green-100",
      badgeVariant: "default" as const,
    },
    limited: {
      icon: AlertCircle,
      label: "Begrenzt verfügbar",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      badgeVariant: "secondary" as const,
    },
    busy: {
      icon: XCircle,
      label: "Ausgebucht",
      color: "text-red-600",
      bgColor: "bg-red-100",
      badgeVariant: "outline" as const,
    },
  };

  const config = statusConfig[availability.status];
  const Icon = config.icon;

  if (compact) {
    return (
      <Badge
        variant={config.badgeVariant}
        className={cn("gap-1", className)}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="font-semibold text-sm">Verfügbarkeit</span>
      </div>

      <div className="space-y-3">
        <div className={cn("flex items-center gap-2 p-2 rounded-md", config.bgColor)}>
          <Icon className={cn("h-5 w-5", config.color)} />
          <span className={cn("font-medium text-sm", config.color)}>
            {config.label}
          </span>
        </div>

        {availability.nextAvailable && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {availability.status === "busy"
                ? `Nächster freier Termin: ${availability.nextAvailable}`
                : `Termine ab ${availability.nextAvailable}`}
            </span>
          </div>
        )}

        {availability.slotsThisWeek !== undefined && availability.slotsThisWeek > 0 && (
          <div className="text-sm">
            <span className="font-medium text-green-600">
              {availability.slotsThisWeek} Slots
            </span>
            <span className="text-muted-foreground"> diese Woche frei</span>
          </div>
        )}

        {availability.status === "limited" && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚡ Schnell buchen – nur noch wenige Termine verfügbar!
          </p>
        )}
      </div>
    </div>
  );
};

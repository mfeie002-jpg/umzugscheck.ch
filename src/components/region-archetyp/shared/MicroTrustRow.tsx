import { memo } from "react";
import { Shield, Star, Clock, CheckCircle } from "lucide-react";

interface MicroTrustRowProps {
  className?: string;
}

export const MicroTrustRow = memo(({ className = "" }: MicroTrustRowProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground ${className}`}>
      <span className="flex items-center gap-1">
        <Shield className="w-4 h-4 text-green-600" />
        Kostenlos
      </span>
      <span className="flex items-center gap-1">
        <CheckCircle className="w-4 h-4 text-green-600" />
        Unverbindlich
      </span>
      <span className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500" />
        4.8/5 Bewertung
      </span>
      <span className="flex items-center gap-1">
        <Clock className="w-4 h-4 text-primary" />
        24h Offerten
      </span>
    </div>
  );
});

MicroTrustRow.displayName = 'MicroTrustRow';

import { memo } from "react";
import { Shield, Star, Clock, CheckCircle } from "lucide-react";

interface MicroTrustRowProps {
  className?: string;
}

export const MicroTrustRow = memo(({ className = "" }: MicroTrustRowProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-white/80 ${className}`}>
      <span className="flex items-center gap-1">
        <Shield className="w-4 h-4 text-green-400" />
        Kostenlos
      </span>
      <span className="flex items-center gap-1">
        <CheckCircle className="w-4 h-4 text-green-400" />
        Unverbindlich
      </span>
      <span className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400" />
        4.8/5 Bewertung
      </span>
      <span className="flex items-center gap-1">
        <Clock className="w-4 h-4 text-white" />
        24h Offerten
      </span>
    </div>
  );
});

MicroTrustRow.displayName = 'MicroTrustRow';

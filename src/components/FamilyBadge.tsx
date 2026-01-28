import { Users, Heart } from "lucide-react";

interface FamilyBadgeProps {
  variant?: "default" | "compact" | "inline" | "hero";
  className?: string;
}

const FamilyBadge = ({ variant = "default", className = "" }: FamilyBadgeProps) => {
  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm/10 border border-warm/20 ${className}`}>
        <Users className="h-3.5 w-3.5 text-warm" />
        <span className="text-xs font-semibold text-warm uppercase tracking-wide">Familienunternehmen</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-1 text-warm font-medium ${className}`}>
        <Heart className="h-4 w-4 fill-warm" />
        <span>Familie Feierabend</span>
      </span>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-warm/10 to-warm/5 border border-warm/20 shadow-warm ${className}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center shadow-md">
          <Users className="h-5 w-5 text-warm-foreground" />
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold text-warm uppercase tracking-wider">Seit 1980</p>
          <p className="text-sm font-bold text-foreground">Familie Feierabend</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-warm/10 to-transparent border-l-4 border-warm ${className}`}>
      <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center shadow-warm">
        <Users className="h-6 w-6 text-warm-foreground" />
      </div>
      <div>
        <p className="text-xs font-semibold text-warm uppercase tracking-wider mb-0.5">Schweizer Familienunternehmen</p>
        <p className="text-base font-bold text-foreground">Familie Feierabend · Seit 1980</p>
        <p className="text-xs text-muted-foreground">Drei Generationen Umzugserfahrung</p>
      </div>
    </div>
  );
};

export default FamilyBadge;
import { TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PopularBadgeProps {
  variant?: "popular" | "trending" | "recommended";
  className?: string;
}

export const PopularBadge = ({ variant = "popular", className }: PopularBadgeProps) => {
  const config = {
    popular: {
      icon: Star,
      text: "Beliebte Funktion",
      color: "bg-accent/10 text-accent border-accent/20"
    },
    trending: {
      icon: TrendingUp,
      text: "Oft genutzt",
      color: "bg-success/10 text-success border-success/20"
    },
    recommended: {
      icon: Star,
      text: "Empfohlen",
      color: "bg-primary/10 text-primary border-primary/20"
    }
  };

  const { icon: Icon, text, color } = config[variant];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold",
      color,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {text}
    </span>
  );
};

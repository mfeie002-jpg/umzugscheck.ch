import { Badge } from "@/components/ui/badge";
import { Star, Shield, Clock, Award, Zap, Leaf, TrendingUp, CheckCircle } from "lucide-react";

interface CompanyBadgesProps {
  badges: string[];
  size?: "sm" | "md";
}

const badgeConfig: Record<string, { icon: typeof Star; color: string; label: string }> = {
  "Top bewertet": { icon: Star, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", label: "Top bewertet" },
  "Preistipp": { icon: TrendingUp, color: "bg-green-500/10 text-green-600 border-green-500/30", label: "Preistipp" },
  "Premium": { icon: Award, color: "bg-purple-500/10 text-purple-600 border-purple-500/30", label: "Premium" },
  "Express": { icon: Zap, color: "bg-orange-500/10 text-orange-600 border-orange-500/30", label: "Express" },
  "Beliebt": { icon: CheckCircle, color: "bg-blue-500/10 text-blue-600 border-blue-500/30", label: "Beliebt" },
  "Lokal": { icon: Shield, color: "bg-primary/10 text-primary border-primary/30", label: "Lokal" },
  "Schnell": { icon: Clock, color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30", label: "Schnell" },
  "Eco": { icon: Leaf, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", label: "Eco-Friendly" },
};

export const ZuerichCompanyBadges = ({ badges, size = "sm" }: CompanyBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge) => {
        const config = badgeConfig[badge];
        if (!config) return null;

        const Icon = config.icon;
        return (
          <Badge
            key={badge}
            variant="outline"
            className={`${config.color} ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}`}
          >
            <Icon className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
};

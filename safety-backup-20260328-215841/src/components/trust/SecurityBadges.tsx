import { Shield, Lock, Award, BadgeCheck } from "lucide-react";

const badges = [
  {
    icon: Shield,
    label: "DSGVO-konform"
  },
  {
    icon: Lock,
    label: "SSL-verschlüsselt"
  },
  {
    icon: Award,
    label: "Geprüfte Partner"
  },
  {
    icon: BadgeCheck,
    label: "Schweizer Qualität"
  }
];

export const SecurityBadges = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3">
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50"
        >
          <badge.icon className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">{badge.label}</span>
        </div>
      ))}
    </div>
  );
};

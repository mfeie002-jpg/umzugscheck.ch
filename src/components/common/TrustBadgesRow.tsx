import { Shield, Award, CheckCircle, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { icon: Shield, text: "Geprüfte Partner", color: "text-emerald-600" },
  { icon: Award, text: "Swiss Quality", color: "text-primary" },
  { icon: Lock, text: "SSL-verschlüsselt", color: "text-blue-600" },
  { icon: Star, text: "4.8/5 Bewertung", color: "text-amber-500" },
];

export const TrustBadgesRow = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
    >
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-full border border-border/50 text-sm"
          >
            <Icon className={`h-4 w-4 ${badge.color}`} />
            <span className="font-medium text-foreground">{badge.text}</span>
          </div>
        );
      })}
    </motion.div>
  );
};

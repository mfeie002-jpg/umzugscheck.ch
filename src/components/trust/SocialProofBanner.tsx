import { motion } from "framer-motion";
import { PulsingDot } from "@/components/common/PulsingDot";

const stats = [
  { emoji: "⭐", value: "4.8/5", label: "Bewertung" },
  { emoji: "👥", value: "15'000+", label: "Umzüge" },
  { emoji: "🛡️", value: "100%", label: "Geprüft" },
  { emoji: "🏆", value: "200+", label: "Partner" }
];

export const SocialProofBanner = () => {
  return (
    <div className="bg-muted/50 border-y border-border/50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {/* Live Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-2 pr-6 border-r border-border"
          >
            <PulsingDot color="success" />
            <span className="text-sm font-medium text-muted-foreground">
              Live-Vergleich
            </span>
          </motion.div>

          {/* Stats */}
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{stat.emoji}</span>
              <span className="font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground hidden sm:inline">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, ThumbsUp, Shield } from "lucide-react";

const quickStats = [
  { icon: TrendingUp, label: "Ø Ersparnis", value: "CHF 850" },
  { icon: Clock, label: "Ø Antwortzeit", value: "4 Std." },
  { icon: ThumbsUp, label: "Zufriedenheit", value: "98%" },
  { icon: Shield, label: "Versichert", value: "100%" },
];

export const QuickStatsBar = memo(function QuickStatsBar() {
  return (
    <section className="py-6 border-b border-border/50">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

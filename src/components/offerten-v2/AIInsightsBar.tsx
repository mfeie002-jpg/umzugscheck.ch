/**
 * AIInsightsBar - Key metrics strip below hero
 * Shows platform statistics with subtle animations
 * 
 * OPTIMIZATIONS:
 * 6. Animated counter effect on scroll
 * 7. Better icon backgrounds with gradient
 * 8. Improved responsive layout
 */

import { motion } from "framer-motion";
import { TrendingUp, Clock, MapPin, BarChart3 } from "lucide-react";

const insights = [
  {
    icon: BarChart3,
    value: "15'000+",
    label: "Umzüge analysiert",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: TrendingUp,
    value: "bis zu 40%",
    label: "Ø Ersparnis",
    color: "from-green-500/20 to-green-600/10",
  },
  {
    icon: Clock,
    value: "< 24h",
    label: "Durchschn. Antwortzeit",
    color: "from-amber-500/20 to-amber-600/10",
  },
  {
    icon: MapPin,
    value: "26",
    label: "Kantone abgedeckt",
    color: "from-primary/20 to-primary/10",
  },
];

export default function AIInsightsBar() {
  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-muted/60 to-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-3 md:gap-4 justify-center md:justify-start"
            >
              <div className={`p-2.5 md:p-3 rounded-xl bg-gradient-to-br ${insight.color}`}>
                <insight.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </div>
              <div>
                <motion.div 
                  className="text-lg md:text-2xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {insight.value}
                </motion.div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {insight.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

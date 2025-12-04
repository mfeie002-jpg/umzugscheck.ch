/**
 * AIInsightsBar - Key metrics strip below hero
 * Shows platform statistics with subtle animations
 */

import { motion } from "framer-motion";
import { TrendingUp, Clock, MapPin, BarChart3 } from "lucide-react";

const insights = [
  {
    icon: BarChart3,
    value: "15'000+",
    label: "Umzüge analysiert",
  },
  {
    icon: TrendingUp,
    value: "bis zu 40%",
    label: "Ø Ersparnis",
  },
  {
    icon: Clock,
    value: "< 24h",
    label: "Durchschn. Antwortzeit",
  },
  {
    icon: MapPin,
    value: "26",
    label: "Kantone abgedeckt",
  },
];

export default function AIInsightsBar() {
  return (
    <section className="py-8 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <insight.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold text-foreground">
                  {insight.value}
                </div>
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

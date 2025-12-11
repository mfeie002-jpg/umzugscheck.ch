import { memo } from "react";
import { motion } from "framer-motion";
import { Users, Award, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    value: "15'000+",
    label: "Umzüge begleitet",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Award,
    value: "200+",
    label: "Geprüfte Partner",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Star,
    value: "4.8 / 5",
    label: "Kundenbewertung",
    color: "text-swiss-gold",
    bgColor: "bg-swiss-gold/10",
  },
  {
    icon: TrendingUp,
    value: "40%",
    label: "Ersparnis möglich",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
];

export const TrustBand = memo(function TrustBand() {
  return (
    <section className="py-8 md:py-10 bg-muted/30 border-y border-border/30">
      <div className="container">
        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <div 
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  stat.bgColor
                )}
              >
                <stat.icon className={cn("w-5 h-5 md:w-6 md:h-6", stat.color)} />
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
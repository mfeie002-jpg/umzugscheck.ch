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
    label: "Partnerfirmen",
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
    <section className="py-8 md:py-12 bg-muted/30 border-y border-border/50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-3", stat.bgColor)}>
                <stat.icon className={cn("w-6 h-6 md:w-7 md:h-7", stat.color)} />
              </div>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

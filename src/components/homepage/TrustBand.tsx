import { memo } from "react";
import { motion } from "framer-motion";
import { Users, Award, Star, TrendingUp, Shield, Clock } from "lucide-react";
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
    <section className="py-10 md:py-14 bg-gradient-to-b from-muted/50 to-background border-y border-border/30">
      <div className="container">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div 
                className={cn(
                  "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                  stat.bgColor
                )}
                whileHover={{ rotate: 5 }}
              >
                <stat.icon className={cn("w-7 h-7 md:w-8 md:h-8", stat.color)} />
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10 pt-8 border-t border-border/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>100% kostenlos & unverbindlich</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-secondary" />
            <span>Offerten in 24-48h</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4 text-swiss-gold" />
            <span>Schweizer Qualität</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
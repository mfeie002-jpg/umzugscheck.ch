/**
 * Zug Stats Counter Component
 * #79-85: Animated statistics with counting effect
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Users, Star, TrendingDown, Clock, Shield, 
  Award, Truck, CheckCircle2 
} from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  description: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: 15847,
    suffix: "+",
    label: "Umzüge vermittelt",
    description: "in der Schweiz",
    color: "text-blue-500",
  },
  {
    icon: Star,
    value: 4.8,
    suffix: "/5",
    label: "Kundenzufriedenheit",
    description: "über 2'800 Bewertungen",
    color: "text-yellow-500",
  },
  {
    icon: TrendingDown,
    value: 40,
    suffix: "%",
    prefix: "bis zu ",
    label: "Ersparnis",
    description: "durch Vergleich",
    color: "text-green-500",
  },
  {
    icon: Clock,
    value: 2,
    suffix: " Min.",
    label: "bis zur Offerte",
    description: "schnell & einfach",
    color: "text-purple-500",
  },
  {
    icon: Truck,
    value: 156,
    suffix: "+",
    label: "Partner-Firmen",
    description: "schweizweit geprüft",
    color: "text-orange-500",
  },
  {
    icon: Shield,
    value: 100,
    suffix: "%",
    label: "Kostenlos",
    description: "und unverbindlich",
    color: "text-primary",
  },
];

const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      if (end < 10) {
        // For small numbers (like 4.8), use decimal precision
        setCount(parseFloat((easeOutQuart * end).toFixed(1)));
      } else {
        setCount(Math.floor(easeOutQuart * end));
      }
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);
  
  return count;
};

const StatCard = ({ stat, index }: { stat: StatItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCountUp(stat.value, 2000, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center group"
    >
      <motion.div
        className={`w-16 h-16 mx-auto rounded-2xl bg-background shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        whileHover={{ rotate: [0, -5, 5, 0] }}
      >
        <stat.icon className={`w-8 h-8 ${stat.color}`} />
      </motion.div>
      
      <div className="space-y-1">
        <p className="text-3xl sm:text-4xl font-bold text-foreground">
          {stat.prefix}
          <span className={stat.color}>
            {stat.value < 10 ? count.toFixed(1) : count.toLocaleString("de-CH")}
          </span>
          {stat.suffix}
        </p>
        <p className="font-medium text-foreground">{stat.label}</p>
        <p className="text-sm text-muted-foreground">{stat.description}</p>
      </div>
    </motion.div>
  );
};

export const ZugStatsCounter = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Zahlen, die überzeugen
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Tausende zufriedene Kunden vertrauen auf umzugscheck.ch
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Trust badges row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-12 pt-8 border-t border-border/50"
        >
          {[
            { icon: CheckCircle2, text: "Geprüfte Firmen" },
            { icon: Shield, text: "Datenschutz garantiert" },
            { icon: Award, text: "Swiss Made" },
          ].map((badge, i) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <badge.icon className="w-4 h-4 text-primary" />
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

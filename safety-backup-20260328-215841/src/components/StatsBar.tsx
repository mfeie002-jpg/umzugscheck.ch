import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsBarProps {
  stats: Stat[];
  variant?: "light" | "dark" | "gradient";
  className?: string;
}

const StatsBar = ({ stats, variant = "gradient", className = "" }: StatsBarProps) => {
  const variants = {
    light: "bg-muted/50",
    dark: "bg-primary text-primary-foreground",
    gradient: "bg-gradient-to-r from-primary via-primary/90 to-alpine text-primary-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`py-8 md:py-12 ${variants[variant]} ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix || ""}
                label={stat.label}
                duration={2}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsBar;

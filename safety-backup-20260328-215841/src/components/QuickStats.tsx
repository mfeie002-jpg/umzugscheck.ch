import { motion } from "framer-motion";
import { Truck, Users, Star, Calendar, Award, MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface QuickStatsProps {
  variant?: "default" | "compact" | "inline";
}

const QuickStats = ({ variant = "default" }: QuickStatsProps) => {
  const stats = [
    { icon: Calendar, value: "40+", label: "Jahre Erfahrung", suffix: "" },
    { icon: Truck, value: "5000+", label: "Erfolgreiche Umzüge", suffix: "" },
    { icon: Star, value: "5.0", label: "Google Bewertung", suffix: "/5" },
    { icon: Users, value: "30+", label: "Mitarbeiter", suffix: "" },
    { icon: MapPin, value: "26", label: "Kantone", suffix: "" },
    { icon: Award, value: "100%", label: "Zufriedenheit", suffix: "" },
  ];

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
        {stats.slice(0, 4).map((stat, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl font-bold font-display text-alpine">
              {stat.value}{stat.suffix}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-sm">
        {stats.slice(0, 3).map((stat, index) => (
          <div key={index} className="flex items-center gap-2 text-muted-foreground">
            <stat.icon className="h-4 w-4 text-alpine" />
            <span className="font-semibold text-foreground">{stat.value}</span>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl bg-alpine/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-alpine" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold font-display text-foreground">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default QuickStats;

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Building2, Star, TrendingUp, Award, Shield } from "lucide-react";

const stats = [
  { icon: Users, value: 52847, suffix: "+", label: "Zufriedene Kunden", color: "text-blue-500" },
  { icon: Building2, value: 248, suffix: "", label: "Geprüfte Firmen", color: "text-purple-500" },
  { icon: Star, value: 4.8, suffix: "/5", label: "Durchschnittsbewertung", color: "text-yellow-500", decimals: 1 },
  { icon: TrendingUp, value: 35, suffix: "%", label: "Durchschnittl. Ersparnis", color: "text-green-500" },
];

const AnimatedCounter = ({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};

export const PremiumStatistics = () => {
  return (
    <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-4">
            <Award className="w-4 h-4" />
            <span>Die Nr. 1 in der Schweiz</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Zahlen, die überzeugen
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Vertrauen Sie dem Marktführer für Umzugsvergleiche in der Schweiz
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 h-full">
                <div className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-2 md:mb-4 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div className="text-xl md:text-4xl font-bold mb-1 md:mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </div>
                <p className="text-xs md:text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-6 mt-12 pt-12 border-t border-white/20"
        >
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-5 h-5" />
            <span>SSL verschlüsselt</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-5 h-5" />
            <span>Swiss Made</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-5 h-5" />
            <span>Datenschutz garantiert</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

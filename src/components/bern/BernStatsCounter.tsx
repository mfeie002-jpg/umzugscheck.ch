import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Users, Star, Clock } from "lucide-react";

const stats = [
  { icon: Building2, value: 85, suffix: "", label: "Umzugsfirmen in Bern", duration: 2 },
  { icon: Users, value: 18500, suffix: "+", label: "Erfolgreiche Umzüge", duration: 2.5 },
  { icon: Star, value: 4.7, suffix: "/5", label: "Durchschnittsbewertung", duration: 1.5, decimals: 1 },
  { icon: Clock, value: 24, suffix: "h", label: "Schnelle Offerten", duration: 1 },
];

const Counter = ({ value, suffix, duration, decimals = 0 }: { value: number; suffix: string; duration: number; decimals?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); } else { setCount(start); }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("de-CH")}{suffix}</span>;
};

export const BernStatsCounter = () => (
  <section className="py-12 bg-primary text-primary-foreground">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <Icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
              <p className="text-3xl md:text-4xl font-bold mb-1"><Counter value={stat.value} suffix={stat.suffix} duration={stat.duration} decimals={stat.decimals} /></p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

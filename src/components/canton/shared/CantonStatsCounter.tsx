import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, Users, Star, Clock } from "lucide-react";

interface CantonStatsCounterProps {
  companies?: number;
  customers?: number;
  rating?: number;
  responseTime?: number;
}

const useCountUp = (end: number, duration: number = 2000, startCounting: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!startCounting) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);
  
  return count;
};

export const CantonStatsCounter = ({ 
  companies = 45, 
  customers = 2850, 
  rating = 4.8, 
  responseTime = 24 
}: CantonStatsCounterProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const companiesCount = useCountUp(companies, 1500, isInView);
  const customersCount = useCountUp(customers, 2000, isInView);
  
  const stats = [
    { icon: Truck, value: companiesCount, suffix: "+", label: "Umzugsfirmen" },
    { icon: Users, value: customersCount, suffix: "+", label: "Zufriedene Kunden" },
    { icon: Star, value: rating, suffix: "/5", label: "Durchschnittsbewertung" },
    { icon: Clock, value: responseTime, suffix: "h", label: "Antwortzeit" },
  ];

  return (
    <section ref={ref} className="py-10 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">
                  {typeof stat.value === 'number' && stat.value % 1 !== 0 
                    ? stat.value.toFixed(1) 
                    : stat.value}
                  {stat.suffix}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

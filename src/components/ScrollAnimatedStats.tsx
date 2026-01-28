import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Truck, 
  Users, 
  Star, 
  Clock, 
  MapPin, 
  Award,
  Heart,
  TrendingUp
} from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  { icon: Truck, value: 15000, suffix: '+', label: 'Erfolgreiche Umzüge', color: 'text-primary' },
  { icon: Users, value: 98, suffix: '%', label: 'Zufriedene Kunden', color: 'text-green-500' },
  { icon: Star, value: 5, suffix: '.0', label: 'Google Bewertung', color: 'text-warning' },
  { icon: Clock, value: 44, suffix: '+', label: 'Jahre Erfahrung', color: 'text-blue-500' },
  { icon: MapPin, value: 26, suffix: '', label: 'Kantone abgedeckt', color: 'text-purple-500' },
  { icon: Award, value: 100, suffix: '%', label: 'Versicherungsschutz', color: 'text-teal-500' },
];

const AnimatedCounter = ({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
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
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, inView]);
  
  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const ScrollAnimatedStats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Unsere Erfolgsbilanz</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Zahlen, die überzeugen
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Über vier Jahrzehnte Erfahrung und Tausende zufriedene Kunden sprechen für sich
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <motion.div 
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <stat.icon className="w-8 h-8" />
              </motion.div>
              <div className="text-3xl md:text-4xl font-bold mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
              </div>
              <div className="text-sm text-primary-foreground/70">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-primary-foreground/80">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Familienunternehmen seit 1980</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollAnimatedStats;

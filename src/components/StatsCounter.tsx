import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Truck, Users, Star, MapPin, Calendar, ThumbsUp } from 'lucide-react';

const stats = [
  { icon: Truck, value: 5000, suffix: '+', label: 'Umzüge durchgeführt', color: 'text-blue-500' },
  { icon: Users, value: 98, suffix: '%', label: 'Zufriedene Kunden', color: 'text-green-500' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'Durchschnittsbewertung', color: 'text-yellow-500' },
  { icon: MapPin, value: 26, suffix: '', label: 'Kantone abgedeckt', color: 'text-red-500' },
  { icon: Calendar, value: 10, suffix: '+', label: 'Jahre Erfahrung', color: 'text-purple-500' },
  { icon: ThumbsUp, value: 99.2, suffix: '%', label: 'Pünktlichkeitsrate', color: 'text-orange-500' },
];

interface AnimatedNumberProps {
  value: number;
  suffix: string;
  duration?: number;
}

const AnimatedNumber = ({ value, suffix, duration = 2000 }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const isDecimal = value % 1 !== 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = value * easeOut;
      
      setDisplayValue(isDecimal ? parseFloat(currentValue.toFixed(1)) : Math.floor(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString('de-CH')}{suffix}
    </span>
  );
};

interface StatsCounterProps {
  variant?: 'default' | 'compact' | 'cards';
  limit?: number;
}

const StatsCounter = ({ variant = 'default', limit }: StatsCounterProps) => {
  const displayStats = limit ? stats.slice(0, limit) : stats;

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap justify-center gap-6 md:gap-12">
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-lg transition-all text-center"
          >
            <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-12 bg-muted/30 rounded-2xl">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="text-center"
          >
            <div className={`w-14 h-14 rounded-full bg-background shadow-md flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-1">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsCounter;

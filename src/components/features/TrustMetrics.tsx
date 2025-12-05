import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Users, Star, Truck, Shield, Award, ThumbsUp } from "lucide-react";

interface Metric {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const metrics: Metric[] = [
  {
    icon: <Users className="h-8 w-8" />,
    value: 50000,
    suffix: '+',
    label: 'Zufriedene Kunden',
    description: 'haben mit uns umgezogen'
  },
  {
    icon: <Star className="h-8 w-8" />,
    value: 4.8,
    suffix: '/5',
    label: 'Durchschnittsbewertung',
    description: 'basierend auf 12\'000+ Bewertungen'
  },
  {
    icon: <Truck className="h-8 w-8" />,
    value: 200,
    suffix: '+',
    label: 'Geprüfte Partner',
    description: 'in der ganzen Schweiz'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    value: 100,
    suffix: '%',
    label: 'Versichert',
    description: 'alle Umzüge sind versichert'
  },
  {
    icon: <Award className="h-8 w-8" />,
    value: 10,
    suffix: '+',
    label: 'Jahre Erfahrung',
    description: 'in der Umzugsbranche'
  },
  {
    icon: <ThumbsUp className="h-8 w-8" />,
    value: 98,
    suffix: '%',
    label: 'Weiterempfehlung',
    description: 'würden uns weiterempfehlen'
  }
];

const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return val.toLocaleString('de-CH');
    }
    return val % 1 === 0 ? val.toString() : val.toFixed(1);
  };

  return (
    <span className="tabular-nums">
      {formatValue(displayValue)}{suffix}
    </span>
  );
};

export const TrustMetrics = () => {
  const controls = useAnimation();

  return (
    <section className="py-20 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Vertrauen durch Zahlen
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Die Schweiz vertraut auf umzugscheck.ch - die führende Plattform für Umzugsvergleiche
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {metric.icon}
              </motion.div>
              <div className="text-3xl md:text-4xl font-bold mb-1">
                <AnimatedNumber value={metric.value} suffix={metric.suffix} />
              </div>
              <div className="font-medium mb-1">{metric.label}</div>
              <div className="text-xs text-muted-foreground">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8 items-center opacity-60"
        >
          <img src="/placeholder.svg" alt="TCS Partner" className="h-10 grayscale hover:grayscale-0 transition-all" />
          <img src="/placeholder.svg" alt="Swiss Made" className="h-10 grayscale hover:grayscale-0 transition-all" />
          <img src="/placeholder.svg" alt="Trusted Shops" className="h-10 grayscale hover:grayscale-0 transition-all" />
          <img src="/placeholder.svg" alt="SSL Secured" className="h-10 grayscale hover:grayscale-0 transition-all" />
        </motion.div>
      </div>
    </section>
  );
};

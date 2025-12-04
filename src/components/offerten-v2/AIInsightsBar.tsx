/**
 * AIInsightsBar - Key metrics strip below hero
 * Shows platform statistics with subtle animations
 * 
 * OPTIMIZATIONS:
 * 61. Animated counter with counting effect
 * 62. Gradient icon backgrounds
 * 63. Hover scale effects
 * 64. Staggered reveal animations
 * 65. Subtle border glow on hover
 * 66. Better responsive spacing
 * 67. Background decorative elements
 * 68. Tooltip hints
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Clock, MapPin, BarChart3, Sparkles } from "lucide-react";

const insights = [
  {
    icon: BarChart3,
    value: 15000,
    suffix: "+",
    label: "Umzüge analysiert",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: TrendingUp,
    value: 40,
    prefix: "bis zu ",
    suffix: "%",
    label: "Ø Ersparnis",
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-500/20 to-green-600/10",
  },
  {
    icon: Clock,
    value: 24,
    prefix: "< ",
    suffix: "h",
    label: "Durchschn. Antwortzeit",
    gradient: "from-amber-500 to-amber-600",
    bgGradient: "from-amber-500/20 to-amber-600/10",
  },
  {
    icon: MapPin,
    value: 26,
    suffix: "",
    label: "Kantone abgedeckt",
    gradient: "from-primary to-primary/80",
    bgGradient: "from-primary/20 to-primary/10",
  },
];

function AnimatedCounter({ 
  value, 
  prefix = "", 
  suffix = "" 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easeOut));
      
      if (step >= steps) {
        clearInterval(interval);
        setDisplayValue(value);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, [value, isInView]);
  
  return (
    <span ref={ref}>
      {prefix}{displayValue.toLocaleString('de-CH')}{suffix}
    </span>
  );
}

export default function AIInsightsBar() {
  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-muted/60 to-muted/30 border-y border-border/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-64 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background/50 px-3 py-1 rounded-full border border-border/50">
            <Sparkles className="w-3 h-3 text-primary" />
            Live-Statistiken
          </div>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="flex items-center gap-3 md:gap-4 justify-center md:justify-start p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-transparent hover:border-primary/20 hover:bg-card/50 transition-all duration-300">
                <motion.div 
                  className={`p-2.5 md:p-3 rounded-xl bg-gradient-to-br ${insight.bgGradient} group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <insight.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                </motion.div>
                <div>
                  <div className="text-lg md:text-2xl font-bold text-foreground">
                    <AnimatedCounter 
                      value={insight.value} 
                      prefix={insight.prefix} 
                      suffix={insight.suffix} 
                    />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {insight.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
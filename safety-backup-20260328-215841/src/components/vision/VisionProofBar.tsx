/**
 * Vision Proof Bar - Live Stats with Count-Up Animation
 * Gemini Feedback: "Proof-Bar direkt unter Hero" with animated counters
 */

import { memo, useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Rocket, Clock, Users, Shield, TrendingUp,
  Globe, CheckCircle2
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionProofBarProps {
  language: VisionLanguage;
}

// Count-up animation hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView || !isInView || hasStarted.current) return;
    hasStarted.current = true;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (now < endTime) {
        requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };

    tick();
  }, [end, duration, isInView, startOnView]);

  return { count, ref };
}

const content = {
  de: {
    live: "LIVE",
    stats: [
      { key: "pages", value: 130, suffix: "+", label: "SEO-Seiten", icon: Globe },
      { key: "response", value: 24, suffix: "h", label: "Ø Antwortzeit", icon: Clock },
      { key: "partners", value: 200, suffix: "+", label: "Partner CH", icon: Users },
      { key: "secure", value: 100, suffix: "%", label: "Schweizer Hosting", icon: Shield },
    ],
    trust: [
      "DSG/DSGVO konform",
      "Schweizer Datenhoheit",
      "Treuhand-geschützt"
    ]
  },
  bg: {
    live: "LIVE",
    stats: [
      { key: "pages", value: 130, suffix: "+", label: "SEO-страници", icon: Globe },
      { key: "response", value: 24, suffix: "h", label: "Ø Време за отговор", icon: Clock },
      { key: "partners", value: 200, suffix: "+", label: "Партньори CH", icon: Users },
      { key: "secure", value: 100, suffix: "%", label: "Швейцарски хостинг", icon: Shield },
    ],
    trust: [
      "DSG/GDPR съвместим",
      "Швейцарска защита",
      "Escrow защитен"
    ]
  },
  it: {
    live: "LIVE",
    stats: [
      { key: "pages", value: 130, suffix: "+", label: "Pagine SEO", icon: Globe },
      { key: "response", value: 24, suffix: "h", label: "Ø Tempo risposta", icon: Clock },
      { key: "partners", value: 200, suffix: "+", label: "Partner CH", icon: Users },
      { key: "secure", value: 100, suffix: "%", label: "Hosting svizzero", icon: Shield },
    ],
    trust: [
      "DSG/GDPR conforme",
      "Sovranità dati svizzera",
      "Protezione Escrow"
    ]
  }
};

export const VisionProofBar = memo(({ language }: VisionProofBarProps) => {
  const t = content[language] || content.de;

  return (
    <section className="py-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Live Status Indicator */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-sm font-bold text-green-600">{t.live}</span>
            <span className="text-xs text-muted-foreground">umzugscheck.ch</span>
          </motion.div>

          {/* Stats with Count-Up */}
          <div className="flex items-center gap-4 md:gap-8">
            {t.stats.map((stat, i) => {
              const { count, ref } = useCountUp(stat.value, 2000);
              return (
                <motion.div
                  key={stat.key}
                  ref={ref}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <stat.icon className="w-4 h-4 text-primary hidden sm:block" />
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-foreground">
                      {count}{stat.suffix}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <div className="hidden lg:flex items-center gap-3">
            {t.trust.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                {item}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
});

VisionProofBar.displayName = 'VisionProofBar';

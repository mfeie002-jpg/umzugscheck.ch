import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Handshake, Star, Lock } from "lucide-react";

interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
}

const TRUST_CATEGORIES: CategoryScore[] = [
  { name: "Transparenz", score: 23, maxScore: 25, icon: <Shield className="w-4 h-4" /> },
  { name: "Partnerschaften", score: 25, maxScore: 25, icon: <Handshake className="w-4 h-4" /> },
  { name: "Bewertungen", score: 24, maxScore: 25, icon: <Star className="w-4 h-4" /> },
  { name: "Datensicherheit", score: 22, maxScore: 25, icon: <Lock className="w-4 h-4" /> },
];

const TOTAL_SCORE = 94;
const MAX_SCORE = 100;

export const TrustScoreWidget = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate the score number
  useEffect(() => {
    if (isInView) {
      const duration = 1500;
      const steps = 60;
      const increment = TOTAL_SCORE / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= TOTAL_SCORE) {
          setAnimatedScore(TOTAL_SCORE);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView]);

  // SVG Ring calculations
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (TOTAL_SCORE / MAX_SCORE) * circumference;
  const offset = circumference - progress;

  return (
    <section ref={ref} className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Unser Vertrauens-Score
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Transparente Bewertung unserer Plattform-Qualität
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* SVG Ring Chart */}
            <div className="relative flex-shrink-0">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
              >
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={isInView ? { strokeDashoffset: offset } : {}}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              {/* Score text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">
                  {animatedScore}
                </span>
                <span className="text-sm text-muted-foreground">/ {MAX_SCORE}</span>
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="flex-1 w-full space-y-4">
              {TRUST_CATEGORIES.map((category, index) => {
                const percentage = (category.score / category.maxScore) * 100;
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <span className="text-primary">{category.icon}</span>
                        {category.name}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {category.score}/{category.maxScore}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${percentage}%` } : {}}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Trust badge footer */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Basierend auf Kundenbewertungen, Partner-Zertifizierungen und Sicherheitsaudits
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustScoreWidget;

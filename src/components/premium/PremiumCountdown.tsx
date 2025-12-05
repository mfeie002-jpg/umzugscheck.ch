import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const PremiumCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 27,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div className="bg-card rounded-lg md:rounded-xl p-2 md:p-4 shadow-lg border min-w-[50px] md:min-w-[80px]">
        <span className="text-xl md:text-4xl font-bold text-primary">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] md:text-sm text-muted-foreground mt-1 md:mt-2 block">{label}</span>
    </div>
  );

  return (
    <section className="py-10 md:py-12 bg-gradient-to-r from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
            <Zap className="w-3 h-3 md:w-4 md:h-4" />
            Limitiertes Angebot
          </div>

          <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">
            Frühbucher-Rabatt endet in:
          </h2>

          <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-8">
            <TimeBlock value={timeLeft.days} label="Tage" />
            <div className="text-xl md:text-4xl font-bold text-muted-foreground self-start pt-2 md:pt-4">:</div>
            <TimeBlock value={timeLeft.hours} label="Std" />
            <div className="text-xl md:text-4xl font-bold text-muted-foreground self-start pt-2 md:pt-4">:</div>
            <TimeBlock value={timeLeft.minutes} label="Min" />
          </div>

          <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
            Sichern Sie sich jetzt <span className="font-bold text-primary">20% Rabatt</span> auf alle Buchungen
          </p>

          <Button asChild size="lg" className="px-6 md:px-8 h-10 md:h-12 text-sm md:text-base">
            <Link to="/umzugsofferten">
              Jetzt Rabatt sichern
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

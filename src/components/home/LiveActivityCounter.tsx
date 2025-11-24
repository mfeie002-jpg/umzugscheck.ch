import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, Calendar, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedNumber = ({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span className="font-bold">
      {prefix}
      {count.toLocaleString('de-CH')}
      {suffix}
    </span>
  );
};

const liveActivities = [
  "Familie Müller hat soeben ihren Umzugspreis berechnet",
  "Neue Offerte für Zürich → Basel versendet",
  "Umzug in Bern erfolgreich abgeschlossen",
  "Familie Schmidt plant gerade ihren Umzug",
  "Neue Preisberechnung aus Luzern erhalten",
  "Umzugstermin in Genf bestätigt"
];

export const LiveActivityCounter = () => {
  const [currentActivity, setCurrentActivity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % liveActivities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/20 via-background to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4">
        {/* Live Activity Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-center"
        >
          <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg max-w-2xl w-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-3 h-3 bg-success rounded-full animate-ping absolute" />
                  <div className="w-3 h-3 bg-success rounded-full" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground text-xs">LIVE:</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentActivity}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="truncate"
                    >
                      {liveActivities[currentActivity]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-border hover:border-primary/30 hover-lift transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-all">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  <AnimatedNumber end={87} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Berechnungen heute
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-border hover:border-accent/30 hover-lift transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-3 transition-all">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  <AnimatedNumber end={234} />
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Umzüge diese Woche
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-border hover:border-success/30 hover-lift transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-success/10 group-hover:bg-success/20 flex items-center justify-center mb-3 transition-all">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  <AnimatedNumber end={8200} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Umzüge seit 2016
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-border hover:border-warning/30 hover-lift transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-warning/10 group-hover:bg-warning/20 flex items-center justify-center mb-3 transition-all">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  <AnimatedNumber end={98} suffix="%" />
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Zufriedenheit
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Big aggregate stat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-lg text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 inline-block mr-2 text-success" />
            <strong className="text-foreground">Über 8'200 erfolgreiche Umzüge</strong> seit unserer Gründung 2016
          </p>
        </motion.div>
      </div>
    </section>
  );
};

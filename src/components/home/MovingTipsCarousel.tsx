import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tip {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const tips: Tip[] = [
  {
    id: 1,
    title: "Früh planen",
    description: "Beginnen Sie mindestens 4-6 Wochen vor dem Umzug mit der Planung. So sichern Sie sich die besten Termine.",
    icon: "📅",
  },
  {
    id: 2,
    title: "Kartons beschriften",
    description: "Markieren Sie jeden Karton mit Raum und Inhalt. Das spart beim Auspacken viel Zeit.",
    icon: "📦",
  },
  {
    id: 3,
    title: "Wichtige Dokumente separat",
    description: "Transportieren Sie Ausweise, Verträge und Wertgegenstände selbst im Auto.",
    icon: "📋",
  },
  {
    id: 4,
    title: "Adressänderung",
    description: "Melden Sie Ihre neue Adresse rechtzeitig bei Post, Bank und Behörden.",
    icon: "✉️",
  },
  {
    id: 5,
    title: "Entrümpelung",
    description: "Nutzen Sie den Umzug, um sich von ungenutzten Dingen zu trennen. Das spart Kosten!",
    icon: "🗑️",
  },
];

export const MovingTipsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Umzugs-Tipps vom Profi
            </h3>
          </motion.div>

          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-start gap-6">
                  <div className="text-6xl flex-shrink-0">
                    {tips[currentIndex].icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground mb-3">
                      {tips[currentIndex].title}
                    </h4>
                    <p className="text-muted-foreground">
                      {tips[currentIndex].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex gap-2">
                {tips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary w-6"
                        : "bg-border hover:bg-border/70"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

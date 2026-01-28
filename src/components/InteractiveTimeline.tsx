import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image?: string;
}

interface InteractiveTimelineProps {
  items?: TimelineItem[];
}

const defaultItems: TimelineItem[] = [
  { year: "1980", title: "Gründung", description: "Familie Feierabend startet mit einem LKW" },
  { year: "1995", title: "Expansion", description: "Erste Filiale in Basel eröffnet" },
  { year: "2010", title: "Modernisierung", description: "Digitale Prozesse eingeführt" },
  { year: "2024", title: "Heute", description: "Marktführer in der Schweiz" },
];

export const InteractiveTimeline = ({ items = defaultItems }: InteractiveTimelineProps) => {
  const [activeIndex, setActiveIndex] = useState(items.length - 1);

  return (
    <div className="relative">
      {/* Timeline Navigation */}
      <div className="flex justify-between items-center mb-12 relative">
        {/* Line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-primary via-alpine to-warm top-1/2 -translate-y-1/2 rounded-full" />
        
        {items.map((item, index) => (
          <motion.button
            key={item.year}
            onClick={() => setActiveIndex(index)}
            className="relative z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-display font-bold text-sm md:text-lg transition-all ${
                activeIndex === index
                  ? "bg-gradient-hero text-primary-foreground shadow-strong"
                  : "bg-card border-2 border-border hover:border-alpine"
              }`}
              animate={{
                scale: activeIndex === index ? 1.1 : 1,
              }}
            >
              {item.year}
            </motion.div>
            {activeIndex === index && (
              <motion.div
                layoutId="timeline-indicator"
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-alpine rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 bg-gradient-hero text-primary-foreground text-sm font-bold rounded-full">
                  {items[activeIndex].year}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold">
                  {items[activeIndex].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {items[activeIndex].description}
                </p>
              </div>
              {items[activeIndex].image && (
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                  <img
                    src={items[activeIndex].image}
                    alt={items[activeIndex].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots (Mobile) */}
      <div className="flex justify-center gap-2 mt-6 md:hidden">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeIndex === index ? "bg-alpine w-6" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;

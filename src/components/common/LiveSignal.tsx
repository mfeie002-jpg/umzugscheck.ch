import { useEffect, useState } from "react";
import { Users, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Signal {
  id: number;
  text: string;
  icon: "users" | "clock";
}

const signals: Signal[] = [
  { id: 1, text: "12 Personen vergleichen gerade Umzüge", icon: "users" },
  { id: 2, text: "3 neue Offerten in den letzten 15 Minuten", icon: "clock" },
  { id: 3, text: "8 Personen haben heute bereits Offerten angefordert", icon: "users" },
  { id: 4, text: "Letzte Offerte vor 3 Minuten erhalten", icon: "clock" },
];

/**
 * Live Signal Component
 * Shows dynamic activity signals to build trust
 */
export const LiveSignal = () => {
  const [currentSignal, setCurrentSignal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSignal((prev) => (prev + 1) % signals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const signal = signals[currentSignal];
  const IconComponent = signal.icon === "users" ? Users : Clock;

  return (
    <div className="flex justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={signal.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full text-sm text-success"
        >
          <IconComponent className="h-4 w-4 animate-pulse" />
          <span>{signal.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

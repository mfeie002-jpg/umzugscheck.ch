import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileCheck } from "lucide-react";

const signals = [
  { icon: Users, text: "12 Personen vergleichen gerade Umzüge", color: "text-green-500" },
  { icon: FileCheck, text: "3 neue Offerten in den letzten 15 Minuten", color: "text-blue-500" },
  { icon: Users, text: "8 Personen aus Zürich vergleichen", color: "text-purple-500" },
  { icon: FileCheck, text: "15 Offerten heute versandt", color: "text-orange-500" }
];

export const LiveActivitySignal = () => {
  const [currentSignal, setCurrentSignal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSignal((prev) => (prev + 1) % signals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const signal = signals[currentSignal];
  const Icon = signal.icon;

  return (
    <div className="flex justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSignal}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-border"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className={`w-4 h-4 ${signal.color}`} />
          </motion.div>
          <span className="text-sm font-medium text-foreground">
            {signal.text}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

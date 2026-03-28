import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export const LiveSignals = () => {
  const [count, setCount] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => Math.floor(Math.random() * 5) + 10);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12 flex flex-wrap gap-4 justify-center"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 flex items-center gap-3">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <Users className="h-4 w-4 text-white" />
        <span className="text-white font-medium">
          {count} Personen vergleichen gerade Umzugsfirmen
        </span>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 flex items-center gap-3">
        <TrendingUp className="h-4 w-4 text-green-400" />
        <span className="text-white font-medium">
          3 Offerten in den letzten 15 Minuten versendet
        </span>
      </div>
    </motion.div>
  );
};

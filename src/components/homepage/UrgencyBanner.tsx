import { motion } from "framer-motion";
import { Clock, TrendingUp, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const UrgencyBanner = () => {
  const [spotsLeft, setSpotsLeft] = useState(7);
  
  useEffect(() => {
    // Simulating dynamic availability
    const interval = setInterval(() => {
      setSpotsLeft((prev) => Math.max(3, prev - Math.floor(Math.random() * 2)));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Hohe Nachfrage im Dezember</span>
          </div>
          <span className="hidden md:inline text-white/80">|</span>
          <div className="hidden md:flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Nur noch {spotsLeft} freie Termine diese Woche</span>
          </div>
          <span className="hidden lg:inline text-white/80">|</span>
          <div className="hidden lg:flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>23 Anfragen heute</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

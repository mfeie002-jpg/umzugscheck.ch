import { motion } from "framer-motion";
import { Users, Clock, MessageCircle } from "lucide-react";

export const LiveSupportIndicator = () => {
  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 8 && currentHour < 18;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-20 right-6 z-30 hidden lg:block"
    >
      <div className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          {/* Status Indicator */}
          <div className="relative">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            {isBusinessHours && (
              <>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full" />
              </>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-foreground text-sm">
                {isBusinessHours ? "Wir sind online!" : "Wir sind bald zurück"}
              </h4>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {isBusinessHours
                    ? "Antwortzeit: ~2 Min"
                    : "Mo-Fr: 08:00-18:00"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>3 Berater verfügbar</span>
              </div>
            </div>

            {isBusinessHours && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-2 text-xs text-primary font-semibold"
              >
                → Jetzt chatten
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

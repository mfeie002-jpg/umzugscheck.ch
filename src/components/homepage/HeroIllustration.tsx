import { memo } from "react";
import { motion } from "framer-motion";
import { Truck, Package, Home, CheckCircle, Star, MapPin } from "lucide-react";

/**
 * Animated hero illustration showing moving process
 * Provides visual context for the moving service
 */
export const HeroIllustration = memo(function HeroIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main illustration container */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
        
        {/* Animated elements */}
        <div className="absolute inset-0 p-6">
          {/* House from */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-8 left-4"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Start</span>
            </div>
          </motion.div>

          {/* House to */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-8 right-4"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Home className="w-8 h-8 text-green-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Ziel</span>
            </div>
          </motion.div>

          {/* Animated truck */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ 
              x: [0, 80, 160],
              opacity: 1
            }}
            transition={{
              x: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              },
              opacity: { duration: 0.5 }
            }}
            className="absolute top-1/2 left-8 transform -translate-y-1/2"
          >
            <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center shadow-md">
              <Truck className="w-6 h-6 text-secondary" />
            </div>
          </motion.div>

          {/* Dotted path */}
          <svg className="absolute top-1/2 left-16 right-16 h-2 transform -translate-y-1/2" style={{ width: 'calc(100% - 8rem)' }}>
            <motion.line
              x1="0"
              y1="4"
              x2="100%"
              y2="4"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              strokeDasharray="8 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </svg>

          {/* Floating boxes */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-16 left-1/4"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute bottom-12 right-1/4"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Package className="w-4 h-4 text-amber-600" />
            </div>
          </motion.div>

          {/* Success indicators */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.3, type: "spring" }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-medium border border-border">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Vergleich starten</span>
            </div>
          </motion.div>
        </div>

        {/* Rating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="absolute -bottom-3 -right-3 bg-card rounded-xl shadow-medium border border-border px-3 py-2"
        >
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold">4.8</span>
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
        </motion.div>

        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="absolute -top-2 -left-2 bg-card rounded-lg shadow-soft border border-border px-2.5 py-1.5"
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium">Schweizweit</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

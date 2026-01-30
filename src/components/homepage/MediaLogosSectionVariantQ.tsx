/**
 * Social Proof Variant Q (V17): Bandwagon Effect
 * 
 * Live activity simulation - "Bandwagon Effect" psychology:
 * "4 Personen aus Zug vergleichen gerade Umzüge"
 */

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Clock, MapPin, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const SWISS_CITIES = [
  'Zürich', 'Bern', 'Basel', 'Luzern', 'Zug', 'Winterthur', 
  'St. Gallen', 'Lausanne', 'Genf', 'Chur', 'Thun', 'Aarau'
];

const ACTIVITY_MESSAGES = [
  { action: 'vergleichen gerade Umzugsofferten', icon: Users },
  { action: 'haben eine Offerte angefordert', icon: TrendingUp },
  { action: 'nutzen den Preisrechner', icon: Activity },
];

export const MediaLogosSectionVariantQ = memo(function MediaLogosSectionVariantQ({ className }: Props) {
  const [currentActivity, setCurrentActivity] = useState({
    city: SWISS_CITIES[0],
    count: 4,
    message: ACTIVITY_MESSAGES[0],
    time: 'vor 2 Min.'
  });
  
  // Simulate live activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity({
        city: SWISS_CITIES[Math.floor(Math.random() * SWISS_CITIES.length)],
        count: Math.floor(Math.random() * 8) + 2,
        message: ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)],
        time: `vor ${Math.floor(Math.random() * 10) + 1} Min.`
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className={cn("py-8 bg-gradient-to-b from-muted/50 to-background", className)}>
      <div className="container mx-auto px-4">
        {/* Live Activity Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="bg-background rounded-2xl border-2 border-green-500/30 shadow-lg overflow-hidden">
            {/* Live indicator header */}
            <div className="bg-green-500/10 px-4 py-2 flex items-center justify-between border-b border-green-500/20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">LIVE</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Aktualisiert {currentActivity.time}</span>
            </div>
            
            {/* Activity content */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentActivity.city}-${currentActivity.count}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <currentActivity.message.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold">
                      <span className="text-primary">{currentActivity.count} Personen</span>
                      <span className="text-muted-foreground">aus</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-red-500" />
                        {currentActivity.city}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentActivity.message.action}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: '47', label: 'Anfragen heute', trend: '+12%' },
            { value: '15\'234', label: 'Vergleiche diesen Monat', trend: '+8%' },
            { value: '4.9', label: 'Ø Bewertung', trend: '★' },
            { value: '89%', label: 'Empfehlungsrate', trend: '↗' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-background rounded-xl border p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              <div className="text-[10px] text-green-600 mt-1">{stat.trend}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Trust line */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Echtzeitdaten • Schweizer Server • Keine Werbeanrufe
        </p>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantQ;

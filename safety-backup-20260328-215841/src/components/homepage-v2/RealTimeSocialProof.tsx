/**
 * Real-Time Social Proof V2
 * Dezente Popups: "Vor 5 Min. hat Anna aus Bern..."
 */
import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, X } from 'lucide-react';

const activities = [
  { name: 'Anna', city: 'Bern', action: 'Umzug inkl. Reinigung gebucht', time: 5 },
  { name: 'Marco', city: 'Zürich', action: '3 Offerten verglichen', time: 12 },
  { name: 'Sarah', city: 'Basel', action: 'CHF 720 gespart', time: 18 },
  { name: 'Thomas', city: 'Luzern', action: 'Video-Scan abgeschlossen', time: 23 },
  { name: 'Lisa', city: 'Genf', action: 'Umzug gebucht', time: 31 },
];

export const RealTimeSocialProof = memo(function RealTimeSocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show first popup after 5 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(initialTimeout);
  }, [isDismissed]);

  useEffect(() => {
    if (isDismissed) return;
    if (!isVisible) return;

    // Hide after 4 seconds
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    // Show next after 15 seconds
    const nextTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
      setIsVisible(true);
    }, 15000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextTimeout);
    };
  }, [isVisible, currentIndex, isDismissed]);

  const activity = activities[currentIndex];

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-20 md:bottom-6 left-4 z-40 max-w-xs"
        >
          <div className="bg-card rounded-xl shadow-xl border border-border p-3 pr-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-secondary font-bold text-sm">
                  {activity.name[0]}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-sm">{activity.name}</span>
                  <span className="text-muted-foreground text-xs">aus</span>
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {activity.city}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground truncate">{activity.action}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Vor {activity.time} Minuten
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

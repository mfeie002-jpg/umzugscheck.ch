/**
 * Social Proof Ticker
 * Shows live notifications of recent activity
 * "Max aus Zürich hat gerade 3 Offerten erhalten"
 */

import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  name: string;
  city: string;
  action: string;
  count?: number;
  timeAgo: string;
}

// Swiss first names for realistic feel
const SWISS_NAMES = [
  "Max", "Anna", "Thomas", "Sarah", "Michael", "Laura", "Daniel", "Julia",
  "David", "Sandra", "Martin", "Nicole", "Stefan", "Andrea", "Christian", "Claudia",
  "Peter", "Maria", "Marco", "Lisa", "Patrick", "Sabrina", "Reto", "Melanie"
];

// Swiss cities
const SWISS_CITIES = [
  "Zürich", "Bern", "Basel", "Luzern", "Winterthur", "St. Gallen", "Lausanne",
  "Genf", "Lugano", "Biel", "Thun", "Köniz", "Fribourg", "Schaffhausen",
  "Chur", "Uster", "Sion", "Neuchâtel", "Zug", "Aarau"
];

const ACTIONS = [
  { text: "hat gerade {} Offerten erhalten", hasCount: true, minCount: 2, maxCount: 5 },
  { text: "hat eine Offerte angefragt", hasCount: false },
  { text: "hat {} Firmen verglichen", hasCount: true, minCount: 3, maxCount: 6 },
  { text: "hat gerade gespart", hasCount: false }
];

const TIME_AGOS = [
  "vor 1 Min.", "vor 2 Min.", "vor 3 Min.", "vor 5 Min.", 
  "vor 8 Min.", "vor 12 Min.", "vor 15 Min."
];

function generateNotification(): Notification {
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const count = action.hasCount 
    ? Math.floor(Math.random() * (action.maxCount! - action.minCount! + 1)) + action.minCount!
    : undefined;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: SWISS_NAMES[Math.floor(Math.random() * SWISS_NAMES.length)],
    city: SWISS_CITIES[Math.floor(Math.random() * SWISS_CITIES.length)],
    action: action.hasCount ? action.text.replace("{}", String(count)) : action.text,
    count,
    timeAgo: TIME_AGOS[Math.floor(Math.random() * TIME_AGOS.length)]
  };
}

interface SocialProofTickerProps {
  /** Initial delay before first notification (ms) */
  initialDelay?: number;
  /** Interval between notifications (ms) */
  interval?: number;
  /** Duration each notification is visible (ms) */
  displayDuration?: number;
  /** Position on screen */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /** Max notifications to show before stopping */
  maxNotifications?: number;
  /** Custom class name */
  className?: string;
}

export const SocialProofTicker = memo(({
  initialDelay = 5000,
  interval = 12000,
  displayDuration = 5000,
  position = 'bottom-left',
  maxNotifications = 8,
  className
}: SocialProofTickerProps) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const showNotification = useCallback(() => {
    if (count >= maxNotifications || isDismissed) return;
    
    const newNotification = generateNotification();
    setNotification(newNotification);
    setIsVisible(true);
    setCount(c => c + 1);

    // Hide after display duration
    setTimeout(() => {
      setIsVisible(false);
    }, displayDuration);
  }, [count, maxNotifications, displayDuration, isDismissed]);

  useEffect(() => {
    // Check if user dismissed in this session
    if (sessionStorage.getItem('uc_social_proof_dismissed')) {
      setIsDismissed(true);
      return;
    }

    // Initial delay
    const initialTimer = setTimeout(() => {
      showNotification();
    }, initialDelay);

    // Regular interval
    const intervalTimer = setInterval(() => {
      showNotification();
    }, interval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [initialDelay, interval, showNotification]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('uc_social_proof_dismissed', 'true');
  };

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6',
    'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6',
    'top-left': 'top-4 left-4 sm:top-6 sm:left-6',
    'top-right': 'top-4 right-4 sm:top-6 sm:right-6'
  };

  // Don't show on mobile to avoid overlap with sticky CTA
  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "fixed z-40 hidden sm:flex",
            positionClasses[position],
            className
          )}
        >
          <div className="bg-white rounded-xl shadow-xl border border-border/50 p-4 pr-10 max-w-xs relative overflow-hidden">
            {/* Accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              aria-label="Schliessen"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-semibold">{notification.name}</span>
                  {" "}
                  {notification.action}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{notification.city}</span>
                  <span className="mx-1">•</span>
                  <span>{notification.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SocialProofTicker.displayName = 'SocialProofTicker';

export default SocialProofTicker;

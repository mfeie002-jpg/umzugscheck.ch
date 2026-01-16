/**
 * REALTIME SOCIAL PROOF
 * 
 * Shows live activity notifications to create urgency and FOMO.
 * Displays: Recent leads, active users, recent comparisons.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface ActivityNotification {
  id: string;
  type: 'lead' | 'comparison' | 'rating';
  city: string;
  timeAgo: string;
  message: string;
}

// Simulated Swiss cities for demo
const SWISS_CITIES = [
  'Zürich', 'Bern', 'Basel', 'Genf', 'Lausanne', 'Winterthur',
  'St. Gallen', 'Luzern', 'Lugano', 'Biel', 'Thun', 'Köniz',
  'Freiburg', 'Schaffhausen', 'Chur', 'Neuchâtel', 'Uster', 'Zug'
];

const generateNotification = (): ActivityNotification => {
  const types = ['lead', 'comparison', 'rating'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const city = SWISS_CITIES[Math.floor(Math.random() * SWISS_CITIES.length)];
  const minutes = Math.floor(Math.random() * 15) + 1;
  
  const messages = {
    lead: `Neue Anfrage aus ${city}`,
    comparison: `3 Offerten verglichen in ${city}`,
    rating: `5-Sterne Bewertung aus ${city}`,
  };
  
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    city,
    timeAgo: `vor ${minutes} Min.`,
    message: messages[type],
  };
};

interface RealtimeSocialProofProps {
  position?: 'bottom-left' | 'bottom-right';
  interval?: number;
  maxVisible?: number;
}

export const RealtimeSocialProof = ({
  position = 'bottom-left',
  interval = 8000,
  maxVisible = 1,
}: RealtimeSocialProofProps) => {
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  
  // Don't show on mobile (too distracting)
  useEffect(() => {
    const checkMobile = () => {
      setIsVisible(window.innerWidth >= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Generate notifications periodically
  useEffect(() => {
    if (!isVisible) return;
    
    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      setNotifications([generateNotification()]);
    }, 3000);
    
    // Recurring notifications
    const intervalId = setInterval(() => {
      const newNotif = generateNotification();
      setNotifications(prev => {
        const updated = [newNotif, ...prev].slice(0, maxVisible);
        return updated;
      });
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
      }, 5000);
    }, interval);
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(intervalId);
    };
  }, [isVisible, interval, maxVisible]);
  
  if (!isVisible) return null;
  
  const positionClasses = {
    'bottom-left': 'left-4 bottom-4',
    'bottom-right': 'right-4 bottom-4',
  };
  
  const getIcon = (type: ActivityNotification['type']) => {
    switch (type) {
      case 'lead': return <MapPin className="h-4 w-4 text-primary" />;
      case 'comparison': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'rating': return <CheckCircle className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-40 pointer-events-none`}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto mb-2"
          >
            <div className="bg-background border border-border rounded-lg shadow-lg p-3 flex items-center gap-3 min-w-[280px] max-w-[320px]">
              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {getIcon(notif.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {notif.message}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{notif.timeAgo}</span>
                </div>
              </div>
              
              {/* Swiss flag */}
              <div className="flex-shrink-0 text-lg">🇨🇭</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

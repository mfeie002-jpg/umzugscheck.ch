import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin, Clock } from "lucide-react";

interface Notification {
  id: number;
  name: string;
  location: string;
  action: string;
  timeAgo: string;
}

const notifications: Notification[] = [
  { id: 1, name: "Maria S.", location: "Zürich", action: "hat gerade eine Offerte angefordert", timeAgo: "vor 2 Minuten" },
  { id: 2, name: "Thomas K.", location: "Bern", action: "hat den Preis berechnet", timeAgo: "vor 5 Minuten" },
  { id: 3, name: "Julia M.", location: "Basel", action: "hat eine Umzugsfirma gebucht", timeAgo: "vor 8 Minuten" },
  { id: 4, name: "Andreas B.", location: "Luzern", action: "vergleicht gerade Angebote", timeAgo: "vor 12 Minuten" },
  { id: 5, name: "Sophie L.", location: "Genf", action: "hat den KI-Rechner genutzt", timeAgo: "vor 15 Minuten" },
  { id: 6, name: "Michael P.", location: "Lausanne", action: "hat 3 Offerten erhalten", timeAgo: "vor 18 Minuten" },
];

export const SocialProofNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    
    const showNotification = () => {
      setCurrentNotification(notifications[currentIndex]);
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      
      currentIndex = (currentIndex + 1) % notifications.length;
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showNotification, 3000);
    
    // Then show every 8 seconds
    const interval = setInterval(showNotification, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-card border-2 border-primary/30 rounded-lg shadow-2xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {currentNotification.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentNotification.action}
                </p>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{currentNotification.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{currentNotification.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, TrendingUp, Users } from "lucide-react";

interface Activity {
  id: string;
  type: 'quote' | 'booking' | 'review' | 'comparison';
  location: string;
  time: string;
  message: string;
}

const activities: Activity[] = [
  { id: '1', type: 'quote', location: 'Zürich', time: '2 Min', message: 'Neue Offerte angefordert' },
  { id: '2', type: 'booking', location: 'Bern', time: '5 Min', message: 'Umzug gebucht' },
  { id: '3', type: 'review', location: 'Basel', time: '8 Min', message: '5-Sterne Bewertung' },
  { id: '4', type: 'comparison', location: 'Luzern', time: '12 Min', message: 'Preise verglichen' },
  { id: '5', type: 'quote', location: 'St. Gallen', time: '15 Min', message: 'Neue Offerte angefordert' },
  { id: '6', type: 'booking', location: 'Winterthur', time: '18 Min', message: 'Firmenumzug gebucht' },
  { id: '7', type: 'review', location: 'Genf', time: '22 Min', message: '4-Sterne Bewertung' },
  { id: '8', type: 'comparison', location: 'Lausanne', time: '25 Min', message: '6 Firmen verglichen' },
];

export const LiveActivityFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentIndex];

  const getIcon = (type: string) => {
    switch (type) {
      case 'quote': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'booking': return <Clock className="h-4 w-4 text-green-500" />;
      case 'review': return <Users className="h-4 w-4 text-yellow-500" />;
      case 'comparison': return <MapPin className="h-4 w-4 text-purple-500" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-background/95 backdrop-blur-lg border border-border/50 rounded-xl p-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.message}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{activity.location}</span>
                  <span>•</span>
                  <span>vor {activity.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

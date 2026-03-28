/**
 * HeroLiveActivityLine - Compact rotating live activity indicator
 * Shows real-time activity like "Letzte Anfrage vor 2 Min aus Zürich"
 * Designed for integration within hero form cards
 */

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

// Swiss cities for realistic feel
const SWISS_CITIES = [
  'Zürich', 'Bern', 'Basel', 'Luzern', 'Winterthur', 
  'St. Gallen', 'Lausanne', 'Genf', 'Aarau', 'Thun',
  'Zug', 'Chur', 'Schaffhausen', 'Baden', 'Olten'
];

// Activity templates
const ACTIVITIES = [
  { template: 'Letzte Anfrage vor {} Min aus {}', timeMin: 1, timeMax: 8 },
  { template: '{} → {} vor {} Min', isRoute: true, timeMin: 2, timeMax: 12 },
  { template: 'Jemand aus {} vergleicht gerade', timeMin: 0, timeMax: 0 },
];

interface Activity {
  text: string;
  key: string;
}

function generateActivity(): Activity {
  const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
  const city1 = SWISS_CITIES[Math.floor(Math.random() * SWISS_CITIES.length)];
  const city2 = SWISS_CITIES.filter(c => c !== city1)[Math.floor(Math.random() * (SWISS_CITIES.length - 1))];
  const time = activity.timeMin + Math.floor(Math.random() * (activity.timeMax - activity.timeMin + 1));
  
  let text: string;
  if (activity.isRoute) {
    text = activity.template
      .replace('{}', city1)
      .replace('{}', city2)
      .replace('{}', time.toString());
  } else if (activity.timeMax === 0) {
    text = activity.template.replace('{}', city1);
  } else {
    text = activity.template
      .replace('{}', time.toString())
      .replace('{}', city1);
  }
  
  return {
    text,
    key: `${Date.now()}-${Math.random()}`
  };
}

interface HeroLiveActivityLineProps {
  className?: string;
  rotationInterval?: number;
}

export const HeroLiveActivityLine = memo(function HeroLiveActivityLine({
  className = '',
  rotationInterval = 5000
}: HeroLiveActivityLineProps) {
  const [activity, setActivity] = useState<Activity>(() => generateActivity());

  useEffect(() => {
    const interval = setInterval(() => {
      setActivity(generateActivity());
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [rotationInterval]);

  return (
    <div className={`flex items-center justify-center gap-2 py-2 ${className}`}>
      {/* Green pulse indicator */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activity.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
          <span className="font-medium">{activity.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

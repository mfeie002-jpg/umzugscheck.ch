/**
 * Zug Social Proof Component
 * #101+: Live activity and social proof indicators
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: "quote" | "booking" | "review";
  location: string;
  time: string;
}

const activities: Activity[] = [
  { id: "1", type: "quote", location: "Zug", time: "vor 2 Min." },
  { id: "2", type: "booking", location: "Baar", time: "vor 5 Min." },
  { id: "3", type: "review", location: "Cham", time: "vor 8 Min." },
  { id: "4", type: "quote", location: "Steinhausen", time: "vor 12 Min." },
  { id: "5", type: "booking", location: "Rotkreuz", time: "vor 15 Min." },
];

const getActivityText = (activity: Activity) => {
  switch (activity.type) {
    case "quote":
      return "Neue Offerte angefordert";
    case "booking":
      return "Umzug gebucht";
    case "review":
      return "Bewertung abgegeben";
    default:
      return "";
  }
};

export const ZugSocialProof = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [liveCount, setLiveCount] = useState(23);

  // Rotate through activities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentActivity];

  return (
    <section className="py-8 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Live Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <Users className="w-5 h-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="text-sm">
              <span className="font-bold text-primary">{liveCount}</span>
              <span className="text-muted-foreground"> Personen vergleichen gerade</span>
            </div>
          </motion.div>

          {/* Live Activity Feed */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <Badge variant="outline" className="bg-background">
                <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                {getActivityText(activity)}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {activity.location}
              </span>
              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Trend Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-sm"
          >
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">
              <span className="font-medium text-green-500">+18%</span> Anfragen diese Woche
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

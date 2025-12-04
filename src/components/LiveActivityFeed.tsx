import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityItem {
  id: string;
  type: "quote_request" | "booking" | "review" | "comparison";
  location: string;
  time: string;
  message: string;
}

const SWISS_CITIES = ["Zürich", "Bern", "Basel", "Genf", "Lausanne", "Luzern", "St. Gallen", "Winterthur", "Lugano", "Zug"];

const generateActivity = (): ActivityItem => {
  const types: ActivityItem["type"][] = ["quote_request", "booking", "review", "comparison"];
  const type = types[Math.floor(Math.random() * types.length)];
  const city = SWISS_CITIES[Math.floor(Math.random() * SWISS_CITIES.length)];
  
  const messages = {
    quote_request: `Neue Offertanfrage aus ${city}`,
    booking: `Umzug gebucht in ${city}`,
    review: `Neue 5-Sterne Bewertung aus ${city}`,
    comparison: `3 Firmen verglichen in ${city}`,
  };

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    location: city,
    time: "Gerade eben",
    message: messages[type],
  };
};

export const LiveActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Initialize with some activities
    const initial = Array.from({ length: 3 }, generateActivity);
    setActivities(initial);

    // Add new activity every 5-10 seconds
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateActivity();
        return [newActivity, ...prev.slice(0, 4)];
      });
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "quote_request": return <Activity className="h-4 w-4 text-primary" />;
      case "booking": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "review": return <MapPin className="h-4 w-4 text-amber-500" />;
      case "comparison": return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: ActivityItem["type"]) => {
    const labels = {
      quote_request: "Anfrage",
      booking: "Buchung",
      review: "Bewertung",
      comparison: "Vergleich",
    };
    return labels[type];
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live Aktivität
          <Badge variant="secondary" className="ml-auto animate-pulse">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
            >
              {getTypeIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {getTypeBadge(activity.type)}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default LiveActivityFeed;

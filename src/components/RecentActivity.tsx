import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Package, FileText, MessageCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityItem {
  id: string;
  type: "move" | "document" | "message" | "booking";
  title: string;
  description: string;
  timestamp: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch recent moves
      const { data: moves } = await supabase
        .from("moves")
        .select("id, title, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent documents
      const { data: docs } = await supabase
        .from("documents")
        .select("id, name, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      const activityList: ActivityItem[] = [];

      if (moves) {
        moves.forEach((move) => {
          activityList.push({
            id: `move-${move.id}`,
            type: "move",
            title: move.title,
            description: `Status: ${move.status}`,
            timestamp: move.created_at,
          });
        });
      }

      if (docs) {
        docs.forEach((doc) => {
          activityList.push({
            id: `doc-${doc.id}`,
            type: "document",
            title: "Dokument hochgeladen",
            description: doc.name,
            timestamp: doc.created_at,
          });
        });
      }

      // Sort by timestamp
      activityList.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(activityList.slice(0, 10));
      setLoading(false);
    };

    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "move":
        return <Package className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "message":
        return <MessageCircle className="w-4 h-4" />;
      case "booking":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "move":
        return "bg-blue-500/20 text-blue-600";
      case "document":
        return "bg-green-500/20 text-green-600";
      case "message":
        return "bg-purple-500/20 text-purple-600";
      case "booking":
        return "bg-orange-500/20 text-orange-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5" />
          Letzte Aktivitäten
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Lade Aktivitäten...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Keine Aktivitäten vorhanden</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(
                      activity.type
                    )}`}
                  >
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString("de-CH")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
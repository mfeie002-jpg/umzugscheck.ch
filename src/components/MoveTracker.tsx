import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Truck, CheckCircle, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MoveUpdate {
  id: string;
  status: string;
  message: string;
  location: string | null;
  created_at: string;
}

interface Move {
  id: string;
  title: string;
  from_address: string;
  to_address: string;
  moving_date: string;
  status: string;
}

interface MoveTrackerProps {
  moveId: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5" />,
  confirmed: <CheckCircle className="w-5 h-5" />,
  in_progress: <Truck className="w-5 h-5" />,
  completed: <Package className="w-5 h-5" />,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  in_progress: "bg-primary/20 text-primary",
  completed: "bg-green-500/20 text-green-700 dark:text-green-400",
  cancelled: "bg-destructive/20 text-destructive",
};

export default function MoveTracker({ moveId }: MoveTrackerProps) {
  const [move, setMove] = useState<Move | null>(null);
  const [updates, setUpdates] = useState<MoveUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoveData = async () => {
      const { data: moveData } = await supabase
        .from("moves")
        .select("*")
        .eq("id", moveId)
        .single();

      if (moveData) {
        setMove(moveData);
      }

      const { data: updatesData } = await supabase
        .from("move_updates")
        .select("*")
        .eq("move_id", moveId)
        .order("created_at", { ascending: false });

      if (updatesData) {
        setUpdates(updatesData);
      }

      setLoading(false);
    };

    fetchMoveData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`move-${moveId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "move_updates",
          filter: `move_id=eq.${moveId}`,
        },
        (payload) => {
          setUpdates((prev) => [payload.new as MoveUpdate, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [moveId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Lade Tracking-Daten...</div>
        </CardContent>
      </Card>
    );
  }

  if (!move) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Umzug nicht gefunden
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{move.title}</CardTitle>
            <Badge className={statusColors[move.status]}>
              {statusIcons[move.status]}
              <span className="ml-2 capitalize">{move.status.replace("_", " ")}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Von</p>
                <p className="font-medium">{move.from_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Nach</p>
                <p className="font-medium">{move.to_address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live-Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Noch keine Updates verfügbar
            </p>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {updates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {statusIcons[update.status] || <Clock className="w-5 h-5" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{update.message}</p>
                      {update.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {update.location}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(update.created_at).toLocaleString("de-CH")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
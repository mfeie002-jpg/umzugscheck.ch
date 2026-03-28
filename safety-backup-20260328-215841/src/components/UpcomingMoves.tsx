import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInDays, format } from "date-fns";
import { de } from "date-fns/locale";

interface Move {
  id: string;
  title: string;
  from_address: string;
  to_address: string;
  moving_date: string;
  status: string;
}

export default function UpcomingMoves() {
  const navigate = useNavigate();
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - moves table not available
    setTimeout(() => {
      setMoves([]);
      setLoading(false);
    }, 300);
  }, []);

  const getDaysUntil = (date: string) => {
    const days = differenceInDays(new Date(date), new Date());
    if (days === 0) return "Heute";
    if (days === 1) return "Morgen";
    return `In ${days} Tagen`;
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    confirmed: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
    in_progress: "bg-primary/20 text-primary",
    completed: "bg-green-500/20 text-green-700 dark:text-green-400",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5" />
          Anstehende Umzüge
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/my-moves")}>
          Alle anzeigen
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Lade Umzüge...
          </div>
        ) : moves.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-4">Keine anstehenden Umzüge</p>
            <Button onClick={() => navigate("/booking")} size="sm">
              Umzug planen
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {moves.map((move, index) => (
              <motion.div
                key={move.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/move/${move.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{move.title}</h4>
                  <Badge className={statusColors[move.status] || "bg-muted"}>
                    {getDaysUntil(move.moving_date)}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{move.from_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-600" />
                    <span className="truncate">{move.to_address}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {format(new Date(move.moving_date), "EEEE, d. MMMM yyyy", {
                        locale: de,
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
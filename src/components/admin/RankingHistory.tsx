import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { History, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RankingHistoryEntry {
  id: string;
  company_id: string;
  company_name: string;
  position: number;
  is_featured: boolean;
  changed_at: string;
  changed_by: string;
}

export function RankingHistory() {
  const [history, setHistory] = useState<RankingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ranking_history")
        .select("*")
        .order("changed_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      if (data) setHistory(data);
    } catch (error) {
      console.error("Error fetching ranking history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionChange = (currentIndex: number) => {
    if (currentIndex === 0) return null;
    
    const current = history[currentIndex];
    const previous = history.slice(currentIndex + 1).find(
      h => h.company_id === current.company_id && h.is_featured === current.is_featured
    );
    
    if (!previous) return null;
    
    const change = previous.position - current.position;
    if (change > 0) return { type: "up", value: change };
    if (change < 0) return { type: "down", value: Math.abs(change) };
    return { type: "same", value: 0 };
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        Ranking-Verlauf
      </h3>

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">Kein Verlauf verfügbar</p>
      ) : (
        <div className="space-y-3">
          {history.map((entry, index) => {
            const change = getPositionChange(index);
            return (
              <div key={entry.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      {entry.position}
                    </div>
                    <div>
                      <h4 className="font-semibold">{entry.company_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.changed_at).toLocaleString("de-CH")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {entry.is_featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    {change && (
                      <Badge
                        variant={
                          change.type === "up" ? "default" :
                          change.type === "down" ? "destructive" :
                          "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {change.type === "up" && <TrendingUp className="w-3 h-3" />}
                        {change.type === "down" && <TrendingDown className="w-3 h-3" />}
                        {change.type === "same" && <Minus className="w-3 h-3" />}
                        {change.value > 0 && change.value}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {entry.changed_by && (
                  <p className="text-xs text-muted-foreground">
                    Geändert von: {entry.changed_by}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

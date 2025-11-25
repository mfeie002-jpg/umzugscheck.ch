import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScheduledRanking {
  id: string;
  scheduled_date: string;
  configuration: any;
  description: string;
  status: string;
  created_at: string;
}

interface RankingSchedulerProps {
  currentFeatured: any[];
  currentOrganic: any[];
}

export function RankingScheduler({ currentFeatured, currentOrganic }: RankingSchedulerProps) {
  const [scheduledRankings, setScheduledRankings] = useState<ScheduledRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const fetchScheduledRankings = async () => {
    try {
      const { data, error } = await supabase
        .from("scheduled_rankings")
        .select("*")
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      if (data) setScheduledRankings(data);
    } catch (error) {
      console.error("Error fetching scheduled rankings:", error);
    }
  };

  const createScheduledRanking = async () => {
    if (!scheduledDate || !description) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte Datum und Beschreibung angeben",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const configuration = {
        featured: currentFeatured.map((c, i) => ({ id: c.id, position: i + 1 })),
        organic: currentOrganic.map((c, i) => ({ id: c.id, position: i + 1 })),
      };

      const { error } = await supabase
        .from("scheduled_rankings")
        .insert({
          scheduled_date: scheduledDate,
          configuration,
          description,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Geplant",
        description: "Ranking-Änderung wurde geplant",
      });

      setScheduledDate("");
      setDescription("");
      fetchScheduledRankings();
    } catch (error) {
      console.error("Error creating scheduled ranking:", error);
      toast({
        title: "Fehler",
        description: "Planung konnte nicht erstellt werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteScheduledRanking = async (id: string) => {
    try {
      const { error } = await supabase
        .from("scheduled_rankings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Gelöscht",
        description: "Geplante Änderung wurde gelöscht",
      });

      fetchScheduledRankings();
    } catch (error) {
      console.error("Error deleting scheduled ranking:", error);
      toast({
        title: "Fehler",
        description: "Löschen fehlgeschlagen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Neue Ranking-Änderung planen
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="scheduled-date">Datum & Uhrzeit</Label>
            <Input
              id="scheduled-date"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              placeholder="z.B. Kampagne Winteraktion, Neue Partner-Promotion"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={createScheduledRanking} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Planen
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Geplante Änderungen
        </h3>

        {scheduledRankings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine geplanten Änderungen</p>
        ) : (
          <div className="space-y-3">
            {scheduledRankings.map((ranking) => (
              <div key={ranking.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{ranking.description}</h4>
                    <Badge variant={ranking.status === "pending" ? "secondary" : "default"}>
                      {ranking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ranking.scheduled_date).toLocaleString("de-CH")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteScheduledRanking(ranking.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

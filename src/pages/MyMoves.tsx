import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, MapPin, Calendar, Eye, Trash2, Package } from "lucide-react";
import { motion } from "framer-motion";

interface Move {
  id: string;
  title: string;
  from_address: string;
  to_address: string;
  moving_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  in_progress: "bg-primary/20 text-primary",
  completed: "bg-green-500/20 text-green-700 dark:text-green-400",
  cancelled: "bg-destructive/20 text-destructive",
};

const statusLabels: Record<string, string> = {
  pending: "Ausstehend",
  confirmed: "Bestätigt",
  in_progress: "In Bearbeitung",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

export default function MyMoves() {
  const navigate = useNavigate();
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    from_address: "",
    to_address: "",
    moving_date: "",
    notes: "",
  });

  const handleRefresh = useCallback(async () => {
    await fetchMoves();
    toast.success("Umzüge aktualisiert");
  }, []);

  const { containerRef, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
  });

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    fetchMoves();
  };

  const fetchMoves = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("moves")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setMoves(data);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Bitte melden Sie sich an");
      return;
    }

    const { error } = await supabase.from("moves").insert({
      user_id: user.id,
      ...formData,
    });

    if (error) {
      toast.error("Fehler beim Erstellen");
      return;
    }

    toast.success("Umzug erfolgreich erstellt");
    setDialogOpen(false);
    setFormData({
      title: "",
      from_address: "",
      to_address: "",
      moving_date: "",
      notes: "",
    });
    fetchMoves();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("moves").delete().eq("id", id);
    if (error) {
      toast.error("Fehler beim Löschen");
      return;
    }
    toast.success("Umzug gelöscht");
    fetchMoves();
  };

  return (
    <>
      <Header />
      <main 
        className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12"
        ref={containerRef}
      >
        {/* Pull to Refresh Indicator */}
        {(pullDistance > 0 || isRefreshing) && (
          <div 
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-background border rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
            style={{ 
              opacity: Math.min(pullDistance / 80, 1),
              transform: `translateX(-50%) translateY(${Math.min(pullDistance / 2, 40)}px)`
            }}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: pullDistance * 3 }}
              transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 }}
              className="w-5 h-5 border-2 border-alpine border-t-transparent rounded-full"
            />
            <span className="text-sm font-medium">
              {isRefreshing ? "Wird aktualisiert..." : pullDistance > 80 ? "Loslassen" : "Ziehen zum Aktualisieren"}
            </span>
          </div>
        )}
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Meine Umzüge</h1>
              <p className="text-muted-foreground mt-1">
                Verwalten und verfolgen Sie Ihre Umzüge
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Neuer Umzug
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neuen Umzug erstellen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="z.B. Umzug nach Zürich"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from">Von</Label>
                    <Input
                      id="from"
                      value={formData.from_address}
                      onChange={(e) => setFormData({ ...formData, from_address: e.target.value })}
                      placeholder="Aktuelle Adresse"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">Nach</Label>
                    <Input
                      id="to"
                      value={formData.to_address}
                      onChange={(e) => setFormData({ ...formData, to_address: e.target.value })}
                      placeholder="Neue Adresse"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Umzugsdatum</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.moving_date}
                      onChange={(e) => setFormData({ ...formData, moving_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notizen (optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Zusätzliche Informationen..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Umzug erstellen
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Lade Umzüge...</div>
            </div>
          ) : moves.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">Keine Umzüge vorhanden</h3>
                <p className="text-muted-foreground mb-4">
                  Erstellen Sie Ihren ersten Umzug, um zu beginnen
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Umzug erstellen
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {moves.map((move, index) => (
                <motion.div
                  key={move.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-1">{move.title}</CardTitle>
                        <Badge className={statusColors[move.status]}>
                          {statusLabels[move.status]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{move.from_address}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{move.to_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(move.moving_date).toLocaleDateString("de-CH")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/move/${move.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(move.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
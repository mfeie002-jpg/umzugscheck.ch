import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Loader2, Package, Plus, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/pricing";

interface EstimateSession {
  id: string;
  move_details: any;
  estimate: any;
}

export default function BundleEstimates() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<EstimateSession[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const sessionIds = searchParams.get('sessions')?.split(',') || [];
    if (sessionIds.length === 0) {
      toast.error('Keine Sessions ausgewählt');
      navigate('/');
      return;
    }
    fetchSessions(sessionIds);
  }, [searchParams]);

  const fetchSessions = async (sessionIds: string[]) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('estimate_sessions')
        .select('*')
        .in('id', sessionIds);

      if (error) throw error;

      setSessions(data || []);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast.error('Fehler beim Laden der Sessions');
    } finally {
      setLoading(false);
    }
  };

  const removeSession = (sessionId: string) => {
    const remaining = sessions.filter(s => s.id !== sessionId);
    if (remaining.length === 0) {
      toast.error('Mindestens eine Session erforderlich');
      return;
    }
    setSessions(remaining);
  };

  const createBundle = async () => {
    try {
      setCreating(true);
      
      const { data, error } = await supabase.functions.invoke('create-bundled-estimate', {
        body: {
          estimateSessionIds: sessions.map(s => s.id),
        },
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        toast.success('Bundle erstellt!');
        navigate(`/offerte-anfordern/${data.data.id}?bundled=true`);
      } else {
        throw new Error(data?.error?.message || 'Failed to create bundle');
      }
    } catch (error: any) {
      console.error('Error creating bundle:', error);
      toast.error(error.message || 'Fehler beim Erstellen des Bundles');
    } finally {
      setCreating(false);
    }
  };

  const totalMin = sessions.reduce((sum, s) => sum + (s.estimate.priceMin || 0), 0);
  const totalMax = sessions.reduce((sum, s) => sum + (s.estimate.priceMax || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Services kombinieren
            </h1>
            <p className="text-muted-foreground">
              Kombinieren Sie mehrere Services für ein Gesamtangebot
            </p>
          </div>

          {/* Sessions List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ausgewählte Services ({sessions.length})</span>
                <Badge variant="outline" className="text-lg">
                  {formatCurrency(totalMin)} - {formatCurrency(totalMax)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session) => {
                const type = session.move_details.calculatorType || 'quick';
                const typeLabels: Record<string, string> = {
                  quick: 'Umzug',
                  advanced: 'Umzug (Detailliert)',
                  cleaning: 'Reinigung',
                  disposal: 'Entsorgung',
                  storage: 'Lagerung',
                  packing: 'Packservice',
                  assembly: 'Montage',
                  video: 'Video-Analyse',
                };

                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Package className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">{typeLabels[type] || 'Service'}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(session.estimate.priceMin)} - {formatCurrency(session.estimate.priceMax)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSession(session.id)}
                      disabled={sessions.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Bundle Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Vorteile eines Gesamtangebots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                ✓ Koordination aller Services aus einer Hand
              </div>
              <div className="flex items-center gap-2">
                ✓ Potenzielle Rabatte bei Kombination mehrerer Services
              </div>
              <div className="flex items-center gap-2">
                ✓ Zeitersparnis durch zentrale Kommunikation
              </div>
              <div className="flex items-center gap-2">
                ✓ Optimierte Logistik und Terminplanung
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Zurück
            </Button>
            <Button
              size="lg"
              onClick={createBundle}
              disabled={creating || sessions.length === 0}
              className="flex-1 gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                <>
                  Gesamtangebot anfordern
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

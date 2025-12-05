import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Mail, Clock, CheckCircle, Send, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  provider_id: string;
  lead_id: string;
  request_sent_at: string | null;
  reminder_sent_at: string | null;
  review_submitted: boolean;
}

export const ReviewRequestSystem = ({ providerId }: { providerId?: string }) => {
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendReviewRequest = async (leadId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-review-request', {
        body: { leadId, providerId }
      });

      if (error) throw error;

      toast({
        title: "Bewertungsanfrage gesendet",
        description: "Der Kunde erhält eine E-Mail mit der Bitte um Bewertung.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Anfrage konnte nicht gesendet werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    sent: requests.filter(r => r.request_sent_at).length,
    pending: requests.filter(r => !r.review_submitted && r.request_sent_at).length,
    completed: requests.filter(r => r.review_submitted).length,
    responseRate: requests.length > 0 
      ? Math.round((requests.filter(r => r.review_submitted).length / requests.length) * 100) 
      : 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardContent className="p-4 text-center">
            <Send className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.sent}</div>
            <div className="text-sm text-muted-foreground">Gesendet</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Ausstehend</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Erhalten</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <div className="text-sm text-muted-foreground">Antwortrate</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Automatische Bewertungsanfragen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium">Nach Umzugsabschluss</h4>
                <p className="text-sm text-muted-foreground">
                  Automatische E-Mail 7 Tage nach erfolgreichem Umzug
                </p>
              </div>
              <Badge variant="default" className="bg-green-500">Aktiv</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium">Erinnerung</h4>
                <p className="text-sm text-muted-foreground">
                  Freundliche Erinnerung nach 14 Tagen ohne Bewertung
                </p>
              </div>
              <Badge variant="default" className="bg-green-500">Aktiv</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium">Dankeschön-E-Mail</h4>
                <p className="text-sm text-muted-foreground">
                  Automatische Dankes-E-Mail nach erhaltener Bewertung
                </p>
              </div>
              <Badge variant="default" className="bg-green-500">Aktiv</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manuelle Anfrage senden</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Senden Sie eine individuelle Bewertungsanfrage an einen Kunden nach erfolgreichem Umzug.
          </p>
          <Button disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Neue Anfrage erstellen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

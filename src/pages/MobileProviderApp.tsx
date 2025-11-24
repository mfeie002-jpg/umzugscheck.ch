import { useState, useEffect } from "react";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileOptimizedLeadCard } from "@/components/MobileOptimizedLeadCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Bell, Zap, Menu } from "lucide-react";
import { toast } from "sonner";

export default function MobileProviderApp() {
  const { provider } = useProviderAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (provider) {
      loadLeads();
    }
  }, [provider]);

  const loadLeads = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .contains('assigned_provider_ids', [provider?.id])
        .order('created_at', { ascending: false })
        .limit(20);

      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBid = async (leadId: string) => {
    toast.success("Quick-Bid platziert!");
  };

  const handleViewLead = (leadId: string) => {
    toast.info("Lead-Details anzeigen");
  };

  if (!provider) {
    return <Navigate to="/anbieter/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-light pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <h1 className="font-semibold">Umzugscheck Pro</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Card className="shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Neue Leads</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-xs text-muted-foreground">Aktive</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">89%</p>
              <p className="text-xs text-muted-foreground">Match</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new" className="text-xs">
              Neu (12)
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              Aktiv (8)
            </TabsTrigger>
            <TabsTrigger value="won" className="text-xs">
              Gewonnen (5)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-3 mt-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Lädt...</p>
            ) : leads.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Keine neuen Leads</p>
                </CardContent>
              </Card>
            ) : (
              leads.map((lead) => (
                <MobileOptimizedLeadCard
                  key={lead.id}
                  lead={lead}
                  onView={handleViewLead}
                  onQuickBid={handleQuickBid}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-3 mt-4">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Aktive Leads werden hier angezeigt</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="won" className="space-y-3 mt-4">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Gewonnene Leads werden hier angezeigt</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4">
        <Button size="lg" className="rounded-full shadow-lg h-14 w-14 p-0">
          <Zap className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

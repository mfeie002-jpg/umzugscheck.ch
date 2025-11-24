import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";
import { Helmet } from "react-helmet";
import { Loader2, TrendingUp, Calendar, Users, Settings, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableLeadsMarket } from "@/components/AvailableLeadsMarket";
import { ProfileOptimizationSuggestions } from "@/components/provider/ProfileOptimizationSuggestions";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { provider, token, loading: authLoading, signOut } = useProviderAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    if (!authLoading && !provider) {
      navigate('/anbieter/login');
    }
  }, [provider, authLoading, navigate]);

  useEffect(() => {
    if (provider && token) {
      fetchLeads();
    }
  }, [provider, token]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('provider-leads', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!error && data?.leads) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/anbieter/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!provider) {
    return null;
  }

  const isPending = provider.verification_status === 'pending';
  const isRejected = provider.verification_status === 'rejected';
  const isApproved = provider.verification_status === 'approved';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Dashboard - {provider.company_name} | Umzugscheck.ch</title>
      </Helmet>

      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Willkommen, {provider.company_name}
              </h1>
              <p className="text-muted-foreground">
                {provider.contact_person_name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/anbieter/profil">
                  <Settings className="w-4 h-4 mr-2" />
                  Profil bearbeiten
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Abmelden
              </Button>
            </div>
          </div>

          {/* Verification Status Alert */}
          {isPending && (
            <Alert className="mb-6">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Ihr Account wird gerade geprüft. Sie erhalten eine E-Mail, sobald Ihr Account freigeschaltet ist.
              </AlertDescription>
            </Alert>
          )}

          {isRejected && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ihr Account wurde abgelehnt. Bitte kontaktieren Sie uns für weitere Informationen.
              </AlertDescription>
            </Alert>
          )}

          {isApproved && (
            <Alert className="mb-6 border-primary bg-primary/5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription>
                Ihr Account ist aktiv. Sie können jetzt Leads empfangen!
              </AlertDescription>
            </Alert>
          )}

          {/* Subscription Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Abonnement & Zahlungen</CardTitle>
              <CardDescription>Verwalten Sie Ihr Abo und sehen Sie Ihre Transaktionen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Aktueller Plan</p>
                    <p className="text-2xl font-bold">Keine aktive Subscription</p>
                  </div>
                  <Button asChild>
                    <Link to="/anbieter/preise">
                      Plan auswählen
                    </Link>
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Wählen Sie einen passenden Tarif und erhalten Sie automatisch qualifizierte Umzugs-Leads.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Alternativ können Sie einzelne Leads kaufen (CHF 15-45 pro Lead).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Leads diesen Monat</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leads.length}</div>
                <p className="text-xs text-muted-foreground">
                  {isPending ? 'Warten auf Freischaltung' : 'Neue Anfragen'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Durchschn. Auftragswert</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">CHF --</div>
                <p className="text-xs text-muted-foreground">
                  Wird berechnet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Aktive Regionen</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{provider.cantons_served.length}</div>
                <p className="text-xs text-muted-foreground">
                  Kantone
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profil-Übersicht</CardTitle>
              <CardDescription>Ihre wichtigsten Informationen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Verifizierungsstatus</p>
                  <Badge variant={isApproved ? "default" : isPending ? "secondary" : "destructive"}>
                    {provider.verification_status === 'approved' && 'Verifiziert'}
                    {provider.verification_status === 'pending' && 'Ausstehend'}
                    {provider.verification_status === 'rejected' && 'Abgelehnt'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Preisniveau</p>
                  <Badge variant="outline">{provider.price_level}</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Leistungen</p>
                <div className="flex flex-wrap gap-2">
                  {provider.services_offered.map((service: string) => (
                    <Badge key={service} variant="secondary">{service}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Aktive Kantone</p>
                <div className="flex flex-wrap gap-2">
                  {provider.cantons_served.slice(0, 6).map((canton: string) => (
                    <Badge key={canton} variant="outline">{canton}</Badge>
                  ))}
                  {provider.cantons_served.length > 6 && (
                    <Badge variant="outline">+{provider.cantons_served.length - 6} weitere</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Optimization */}
          {isApproved && (
            <div className="mb-8">
              <ProfileOptimizationSuggestions provider={{
                id: provider.id,
                cantons_served: provider.cantons_served,
                preferred_regions: provider.preferred_regions,
                min_job_value: provider.min_job_value,
                max_leads_per_month: provider.max_leads_per_month,
                price_level: provider.price_level,
                services_offered: provider.services_offered
              }} />
            </div>
          )}

          {/* Leads Section with Tabs */}
          <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="assigned">Zugewiesene Leads</TabsTrigger>
              <TabsTrigger value="marketplace">Lead-Marktplatz</TabsTrigger>
            </TabsList>

            <TabsContent value="assigned">
              <Card>
                <CardHeader>
                  <CardTitle>Zugewiesene Leads</CardTitle>
                  <CardDescription>
                    {isPending ? 'Leads werden nach Freischaltung angezeigt' : 'Ihre automatisch zugewiesenen Anfragen'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingLeads ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : isPending ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Leads werden nach Freischaltung Ihres Accounts angezeigt</p>
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Noch keine Leads vorhanden</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leads.map((lead: any) => (
                        <div key={lead.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.email}</p>
                            </div>
                            <Badge>{lead.status || 'neu'}</Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Von:</span> {lead.from_postal} {lead.from_city}</p>
                            <p><span className="font-medium">Nach:</span> {lead.to_postal} {lead.to_city}</p>
                            {lead.move_date && (
                              <p><span className="font-medium">Datum:</span> {new Date(lead.move_date).toLocaleDateString('de-CH')}</p>
                            )}
                            <p><span className="font-medium">Rechner:</span> {lead.calculator_type}</p>
                          </div>
                          {lead.comments && (
                            <p className="text-sm mt-2 text-muted-foreground">{lead.comments}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketplace">
              <Card>
                <CardHeader>
                  <CardTitle>Lead-Marktplatz</CardTitle>
                  <CardDescription>
                    Kaufen Sie einzelne Leads, die zu Ihren Kantonen passen (CHF 15-45 pro Lead)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPending ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Lead-Marktplatz wird nach Freischaltung verfügbar</p>
                    </div>
                  ) : (
                    <AvailableLeadsMarket />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderDashboard;

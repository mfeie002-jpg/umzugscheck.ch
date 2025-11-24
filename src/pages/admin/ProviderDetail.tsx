import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone as PhoneIcon,
  Globe,
  MapPin,
  Users,
  Truck,
  Package,
  Euro,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ServiceProvider {
  id: string;
  company_name: string;
  contact_person_name: string;
  email: string;
  phone: string;
  website: string | null;
  street: string;
  zip: string;
  city: string;
  country: string;
  cantons_served: string[];
  services_offered: string[];
  description: string | null;
  fleet_size: number | null;
  employees_count: number | null;
  price_level: "günstig" | "fair" | "premium" | null;
  logo_url: string | null;
  verification_status: "pending" | "approved" | "rejected";
  account_status: "active" | "inactive";
  max_leads_per_month: number | null;
  preferred_regions: string[] | null;
  min_job_value: number | null;
  created_at: string;
  updated_at: string;
}

const ProviderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [isLoadingProvider, setIsLoadingProvider] = useState(true);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    if (!loading && user && isAdmin && id) {
      fetchProvider();
    }
  }, [loading, user, isAdmin, id]);

  const fetchProvider = async () => {
    if (!id) return;

    setIsLoadingProvider(true);
    try {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setProvider(data);
    } catch (error) {
      console.error("Error fetching provider:", error);
      toast({
        title: "Fehler",
        description: "Anbieter konnte nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProvider(false);
    }
  };

  const handleVerificationAction = async () => {
    if (!provider || !actionType) return;

    const newStatus = actionType === "approve" ? "approved" : "rejected";

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Keine aktive Session");

      const response = await supabase.functions.invoke("admin-verify-provider", {
        body: {
          providerId: provider.id,
          verificationStatus: newStatus,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Status aktualisiert",
        description: `Anbieter wurde ${newStatus === "approved" ? "genehmigt" : "abgelehnt"}`,
      });

      fetchProvider();
      setActionDialogOpen(false);
      setActionType(null);
    } catch (error) {
      console.error("Error updating provider status:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    }
  };

  const openActionDialog = (type: "approve" | "reject") => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  if (loading || isLoadingProvider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Anbieter nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">
              Der angeforderte Anbieter existiert nicht oder wurde gelöscht.
            </p>
            <Button onClick={() => navigate("/admin/providers")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ausstehend";
      case "approved":
        return "Genehmigt";
      case "rejected":
        return "Abgelehnt";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPriceLevelLabel = (level: string | null) => {
    switch (level) {
      case "günstig":
        return "Günstig";
      case "fair":
        return "Fair";
      case "premium":
        return "Premium";
      default:
        return "Nicht angegeben";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-gradient-light">
        {/* Header */}
        <section className="gradient-hero text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <Link to="/admin/providers">
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              
              {provider.verification_status === "pending" && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => openActionDialog("reject")}
                    variant="outline"
                    className="border-red-300/50 bg-red-500/20 hover:bg-red-500/30 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Ablehnen
                  </Button>
                  <Button
                    onClick={() => openActionDialog("approve")}
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Genehmigen
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{provider.company_name}</h1>
                <p className="text-white/80 mb-4">{provider.contact_person_name}</p>
                <Badge className={getStatusColor(provider.verification_status)}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(provider.verification_status)}
                    {getStatusLabel(provider.verification_status)}
                  </div>
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="services">Services & Regionen</TabsTrigger>
                <TabsTrigger value="leads">Leads & Statistiken</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
                <TabsTrigger value="history">Verlauf</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Kontaktinformationen
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">E-Mail</p>
                          <a href={`mailto:${provider.email}`} className="font-medium text-primary hover:underline">
                            {provider.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <PhoneIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Telefon</p>
                          <a href={`tel:${provider.phone}`} className="font-medium hover:text-primary">
                            {provider.phone}
                          </a>
                        </div>
                      </div>
                      {provider.website && (
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Website</p>
                            <a
                              href={provider.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline"
                            >
                              {provider.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Company Address */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Firmenadresse
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-medium">{provider.company_name}</p>
                      <p className="text-muted-foreground">{provider.street}</p>
                      <p className="text-muted-foreground">
                        {provider.zip} {provider.city}
                      </p>
                      <p className="text-muted-foreground">{provider.country}</p>
                    </CardContent>
                  </Card>

                  {/* Business Details */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Firmendetails
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Flottengrösse</span>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {provider.fleet_size ? `${provider.fleet_size} Fahrzeuge` : "Nicht angegeben"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Mitarbeiter</span>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {provider.employees_count ? `${provider.employees_count} Mitarbeiter` : "Nicht angegeben"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Preisstufe</span>
                        <div className="flex items-center gap-2">
                          <Euro className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{getPriceLevelLabel(provider.price_level)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Status */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Account Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Verifizierung</span>
                        <Badge className={getStatusColor(provider.verification_status)}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(provider.verification_status)}
                            {getStatusLabel(provider.verification_status)}
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Account Status</span>
                        <Badge variant={provider.account_status === "active" ? "default" : "secondary"}>
                          {provider.account_status === "active" ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Registriert</span>
                        <span className="font-medium">{format(new Date(provider.created_at), "dd.MM.yyyy")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Zuletzt aktualisiert</span>
                        <span className="font-medium">{format(new Date(provider.updated_at), "dd.MM.yyyy")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                {provider.description && (
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>Firmenbeschreibung</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">{provider.description}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Services & Regions Tab */}
              <TabsContent value="services" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Angebotene Services
                      </CardTitle>
                      <CardDescription>
                        {provider.services_offered.length} Service{provider.services_offered.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {provider.services_offered.map((service) => (
                          <Badge key={service} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Bediente Kantone
                      </CardTitle>
                      <CardDescription>
                        {provider.cantons_served.length} Kanton{provider.cantons_served.length !== 1 ? "e" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {provider.cantons_served.map((canton) => (
                          <Badge key={canton} variant="outline">
                            {canton}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Lead-Präferenzen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max. Leads pro Monat</span>
                      <span className="font-medium">{provider.max_leads_per_month || "Nicht angegeben"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Min. Auftragswert</span>
                      <span className="font-medium">
                        {provider.min_job_value ? `CHF ${provider.min_job_value}` : "Nicht angegeben"}
                      </span>
                    </div>
                    {provider.preferred_regions && provider.preferred_regions.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-2">Bevorzugte Regionen</span>
                        <div className="flex flex-wrap gap-2">
                          {provider.preferred_regions.map((region) => (
                            <Badge key={region} variant="secondary">
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Leads & Statistics Tab */}
              <TabsContent value="leads" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="shadow-medium">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-1">0</div>
                      <div className="text-sm text-muted-foreground">Zugewiesene Leads</div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-medium">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-success/10">
                          <CheckCircle2 className="w-6 h-6 text-success" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-1">0</div>
                      <div className="text-sm text-muted-foreground">Konvertiert</div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-medium">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-yellow-100">
                          <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-1">0%</div>
                      <div className="text-sm text-muted-foreground">Konversionsrate</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Lead-Verlauf</CardTitle>
                    <CardDescription>Liste der zugewiesenen Leads und deren Status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">Noch keine Leads zugewiesen</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Leads werden automatisch zugewiesen, wenn der Anbieter genehmigt ist
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Dokumente & Zertifikate</CardTitle>
                    <CardDescription>Hochgeladene Dokumente und Verifizierungen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">Keine Dokumente hochgeladen</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dokument-Upload-Funktion wird in Kürze verfügbar sein
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Aktivitätsverlauf</CardTitle>
                    <CardDescription>Chronologie aller Aktionen und Änderungen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 pb-4 border-b">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Account erstellt</p>
                          <p className="text-sm text-muted-foreground">
                            {provider.contact_person_name} hat einen neuen Account für {provider.company_name} registriert
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(provider.created_at), "dd.MM.yyyy HH:mm")}
                          </p>
                        </div>
                      </div>

                      <div className="text-center py-8">
                        <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">Weitere Aktivitäten werden hier angezeigt</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Anbieter genehmigen" : "Anbieter ablehnen"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve"
                ? `Möchten Sie ${provider.company_name} als Partner genehmigen? Der Anbieter erhält Zugang zu Leads und kann mit der Plattform arbeiten.`
                : `Möchten Sie ${provider.company_name} ablehnen? Der Anbieter wird benachrichtigt und erhält keinen Zugang zu Leads.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionType(null)}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVerificationAction}
              className={actionType === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {actionType === "approve" ? "Genehmigen" : "Ablehnen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProviderDetail;

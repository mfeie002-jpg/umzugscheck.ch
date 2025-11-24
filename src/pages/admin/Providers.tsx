import { useEffect, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  Mail,
  Phone as PhoneIcon,
  Globe,
  MapPin,
  Package,
  Truck,
  Eye,
  ArrowLeft,
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
  verification_status: "pending" | "approved" | "rejected";
  account_status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

const ProvidersAdmin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [stats, setStats] = useState({
    totalProviders: 0,
    pendingApplications: 0,
    approvedProviders: 0,
    rejectedProviders: 0,
  });

  useEffect(() => {
    if (!loading && user && isAdmin) {
      fetchProviders();
    }
  }, [loading, user, isAdmin]);

  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, statusFilter]);

  const fetchProviders = async () => {
    setIsLoadingProviders(true);
    try {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProviders(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter((p) => p.verification_status === "pending").length || 0;
      const approved = data?.filter((p) => p.verification_status === "approved").length || 0;
      const rejected = data?.filter((p) => p.verification_status === "rejected").length || 0;

      setStats({
        totalProviders: total,
        pendingApplications: pending,
        approvedProviders: approved,
        rejectedProviders: rejected,
      });
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast({
        title: "Fehler",
        description: "Anbieter konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const filterProviders = () => {
    let filtered = providers;

    if (searchTerm) {
      filtered = filtered.filter(
        (provider) =>
          provider.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.contact_person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((provider) => provider.verification_status === statusFilter);
    }

    setFilteredProviders(filtered);
  };

  const handleVerificationAction = async () => {
    if (!selectedProvider || !actionType) return;

    const newStatus = actionType === "approve" ? "approved" : "rejected";

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Keine aktive Session");

      const response = await supabase.functions.invoke("admin-verify-provider", {
        body: {
          providerId: selectedProvider.id,
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

      fetchProviders();
      setActionDialogOpen(false);
      setSelectedProvider(null);
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

  const openActionDialog = (provider: ServiceProvider, type: "approve" | "reject") => {
    setSelectedProvider(provider);
    setActionType(type);
    setActionDialogOpen(true);
  };

  if (loading) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-gradient-light">
        {/* Header */}
        <section className="gradient-hero text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Anbieter verwalten</h1>
                <p className="text-white/80">Bewerbungen prüfen & Partner verwalten</p>
              </div>
              <Link to="/admin">
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.totalProviders}</div>
                  <div className="text-sm text-muted-foreground">Gesamt Anbieter</div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-yellow-100">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.pendingApplications}</div>
                  <div className="text-sm text-muted-foreground">Ausstehende Bewerbungen</div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.approvedProviders}</div>
                  <div className="text-sm text-muted-foreground">Genehmigte Partner</div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-red-100">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.rejectedProviders}</div>
                  <div className="text-sm text-muted-foreground">Abgelehnte Bewerbungen</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="shadow-strong mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Alle Anbieter</CardTitle>
                    <CardDescription>
                      {filteredProviders.length} von {providers.length} Anbieter
                    </CardDescription>
                  </div>
                  <Button
                    onClick={fetchProviders}
                    variant="outline"
                    size="sm"
                    disabled={isLoadingProviders}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingProviders ? "animate-spin" : ""}`} />
                    Aktualisieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Suchen nach Firma, E-Mail oder Ort..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Status Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="approved">Genehmigt</SelectItem>
                      <SelectItem value="rejected">Abgelehnt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Firma</TableHead>
                        <TableHead>Kontakt</TableHead>
                        <TableHead>Standort</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Erstellt</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingProviders ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                            <p className="text-muted-foreground">Anbieter werden geladen...</p>
                          </TableCell>
                        </TableRow>
                      ) : filteredProviders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-muted-foreground font-medium">Keine Anbieter gefunden</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {searchTerm || statusFilter !== "all"
                                ? "Versuchen Sie, die Filter anzupassen"
                                : "Es wurden noch keine Anbieter registriert"}
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProviders.map((provider) => (
                          <TableRow key={provider.id}>
                            <TableCell>
                              <div className="font-medium">{provider.company_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {provider.contact_person_name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3 text-muted-foreground" />
                                  <span className="truncate max-w-[200px]">{provider.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <PhoneIcon className="w-3 h-3 text-muted-foreground" />
                                  <span>{provider.phone}</span>
                                </div>
                                {provider.website && (
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-3 h-3 text-muted-foreground" />
                                    <a
                                      href={provider.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline truncate max-w-[150px]"
                                    >
                                      Website
                                    </a>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span>{provider.city}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  {provider.cantons_served.slice(0, 2).join(", ")}
                                  {provider.cantons_served.length > 2 && ` +${provider.cantons_served.length - 2}`}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-sm">
                                {provider.employees_count && (
                                  <div className="flex items-center gap-2">
                                    <Users className="w-3 h-3 text-muted-foreground" />
                                    <span>{provider.employees_count} Mitarbeiter</span>
                                  </div>
                                )}
                                {provider.fleet_size && (
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-3 h-3 text-muted-foreground" />
                                    <span>{provider.fleet_size} Fahrzeuge</span>
                                  </div>
                                )}
                                {provider.price_level && (
                                  <div className="flex items-center gap-2">
                                    <Package className="w-3 h-3 text-muted-foreground" />
                                    <Badge variant="secondary" className="text-xs">
                                      {provider.price_level}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(provider.verification_status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(provider.verification_status)}
                                  {getStatusLabel(provider.verification_status)}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {format(new Date(provider.created_at), "dd.MM.yyyy")}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {provider.verification_status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="bg-success hover:bg-success/90"
                                      onClick={() => openActionDialog(provider, "approve")}
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-1" />
                                      Genehmigen
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => openActionDialog(provider, "reject")}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Ablehnen
                                    </Button>
                                  </>
                                )}
                                {provider.verification_status === "approved" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate(`/anbieter/profil/${provider.id}`)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Ansehen
                                  </Button>
                                )}
                                {provider.verification_status === "rejected" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openActionDialog(provider, "approve")}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Genehmigen
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Anbieter genehmigen?" : "Anbieter ablehnen?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve"
                ? `Möchten Sie ${selectedProvider?.company_name} als Partner genehmigen? Der Anbieter erhält Zugriff auf Leads und kann sein Profil verwalten.`
                : `Möchten Sie die Bewerbung von ${selectedProvider?.company_name} wirklich ablehnen? Diese Aktion kann später rückgängig gemacht werden.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVerificationAction}
              className={actionType === "approve" ? "bg-success hover:bg-success/90" : ""}
            >
              {actionType === "approve" ? "Ja, genehmigen" : "Ja, ablehnen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProvidersAdmin;

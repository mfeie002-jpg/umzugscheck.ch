import { useEffect, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
  Users, 
  FileText, 
  TrendingUp, 
  Download,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  MapPin,
  Mail,
  Phone as PhoneIcon,
  Eye,
  Building2,
  Settings,
  ArrowRight,
  MessageSquare,
  Star,
  Brain,
  Wrench,
  Sparkles,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/pricing";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  from_postal: string;
  from_city: string;
  to_postal: string;
  to_city: string;
  calculator_type: string;
  calculator_output: any;
  move_date: string | null;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0,
  });

  useEffect(() => {
    if (!loading && user && isAdmin) {
      fetchLeads();
    }
  }, [loading, user, isAdmin]);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter]);

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLeads(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const newCount = data?.filter(l => l.status === "new").length || 0;
      const contactedCount = data?.filter(l => l.status === "contacted").length || 0;
      const convertedCount = data?.filter(l => l.status === "converted").length || 0;

      setStats({
        totalLeads: total,
        newLeads: newCount,
        contacted: contactedCount,
        converted: convertedCount,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Fehler",
        description: "Leads konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.from_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.to_city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;

      toast({
        title: "Status aktualisiert",
        description: "Der Lead-Status wurde erfolgreich geändert",
      });

      fetchLeads();
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "E-Mail", "Telefon", "Von", "Nach", "Datum", "Status", "Preis (Min)", "Preis (Max)", "Erstellt am"];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.phone || "",
      `${lead.from_postal} ${lead.from_city}`,
      `${lead.to_postal} ${lead.to_city}`,
      lead.move_date || "",
      lead.status,
      lead.calculator_output?.priceMin || "",
      lead.calculator_output?.priceMax || "",
      format(new Date(lead.created_at), "dd.MM.yyyy HH:mm"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export erfolgreich",
      description: `${filteredLeads.length} Leads wurden exportiert`,
    });
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
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "converted":
        return "bg-green-100 text-green-800 border-green-200";
      case "lost":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Neu";
      case "contacted":
        return "Kontaktiert";
      case "converted":
        return "Konvertiert";
      case "lost":
        return "Verloren";
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 bg-gradient-light">
        {/* Header */}
        <section className="gradient-hero text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-white/80">Lead-Management & Statistiken</p>
              </div>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
              >
                Zur Website
              </Button>
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
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.totalLeads}</div>
                  <div className="text-sm text-muted-foreground">Gesamt Leads</div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.newLeads}</div>
                  <div className="text-sm text-muted-foreground">Neue Leads</div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-yellow-100">
                      <Mail className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.contacted}</div>
                  <div className="text-sm text-muted-foreground">Kontaktiert</div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.converted}</div>
                  <div className="text-sm text-muted-foreground">Konvertiert</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <Link to="/admin/leads">
                <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-blue-500/10">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Leads verwalten</h3>
                    <p className="text-sm text-muted-foreground">
                      Anfragen verwalten und Status aktualisieren
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/companies">
                <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Firmen verwalten</h3>
                    <p className="text-sm text-muted-foreground">
                      Umzugsfirmen hinzufügen und bearbeiten
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/reviews">
                <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-yellow-400/10">
                        <MessageSquare className="w-6 h-6 text-yellow-600" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Bewertungen verwalten</h3>
                    <p className="text-sm text-muted-foreground">
                      Bewertungen ansehen und beantworten
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/analytics">
                <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-purple-500/10">
                        <Star className="w-6 h-6 text-purple-600" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Detaillierte Performance-Einblicke
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/funnel">
                <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-green-500/10">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Funnel Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      User Journey & Conversion-Tracking
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* ML Analytics Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">KI & Machine Learning</h2>
              <div className="grid md:grid-cols-1 gap-6">
                <Link to="/admin/ml-analytics">
                  <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Brain className="w-6 h-6 text-primary" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">KI-Analytics</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Machine Learning basierte Vorhersagen, Lead-Qualität-Scores und optimale Preisempfehlungen
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-muted-foreground">Lead-Vorhersagen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          <span className="text-muted-foreground">Preis-Optimierung</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Provider Management Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Anbieter-Verwaltung</h2>
              <div className="grid md:grid-cols-1 gap-6">
                <Link to="/admin/providers">
                  <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Partner verwalten</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Bewerbungen prüfen, Anbieter genehmigen und Partner-Status verwalten
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span className="text-muted-foreground">Ausstehende Bewerbungen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          <span className="text-muted-foreground">Aktive Partner</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Developer Tools Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Entwickler-Tools & Onboarding</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/admin/code-export">
                  <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-slate-500/10">
                          <Download className="w-6 h-6 text-slate-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Code Export</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Design System und Komponenten für ChatGPT-Reviews exportieren
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                          <span className="text-muted-foreground">Design System</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                          <span className="text-muted-foreground">Komponenten</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/admin/tools">
                  <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-orange-500/10">
                          <Wrench className="w-6 h-6 text-orange-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Analyse Tools</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        AI Feedback Package, Screenshot Machine & Downloads
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span className="text-muted-foreground">Screenshots</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                          <span className="text-muted-foreground">AI Prompts</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/admin/ai-export">
                  <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <Badge className="bg-primary">Neu</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">KI-Analyse & Export</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        ChatGPT-Prompts generieren und Website analysieren lassen
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-muted-foreground">Quick Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                          <span className="text-muted-foreground">Deep Audit</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/kunden-onboarding">
                  <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-500/10">
                          <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Kunden-Onboarding</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Schritt-für-Schritt Anleitung für Partner zur Website-Analyse
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-muted-foreground">5 Schritte</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span className="text-muted-foreground">Video-Tutorials</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Filters and Actions */}
            <Card className="shadow-strong mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Leads verwalten</CardTitle>
                    <CardDescription>
                      {filteredLeads.length} von {leads.length} Leads
                    </CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={fetchLeads}
                      variant="outline"
                      size="sm"
                      disabled={isLoadingLeads}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingLeads ? "animate-spin" : ""}`} />
                      Aktualisieren
                    </Button>
                    <Button
                      onClick={exportToCSV}
                      variant="outline"
                      size="sm"
                      disabled={filteredLeads.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Suchen nach Name, E-Mail oder Ort..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="new">Neu</SelectItem>
                      <SelectItem value="contacted">Kontaktiert</SelectItem>
                      <SelectItem value="converted">Konvertiert</SelectItem>
                      <SelectItem value="lost">Verloren</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Kontakt</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead>Preis</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Erstellt</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingLeads ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                            <p className="text-muted-foreground">Leads werden geladen...</p>
                          </TableCell>
                        </TableRow>
                      ) : filteredLeads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-muted-foreground">Keine Leads gefunden</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-muted-foreground" />
                                  <a href={`mailto:${lead.email}`} className="hover:text-primary">
                                    {lead.email}
                                  </a>
                                </div>
                                {lead.phone && (
                                  <div className="flex items-center gap-1">
                                    <PhoneIcon className="w-3 h-3 text-muted-foreground" />
                                    <a href={`tel:${lead.phone}`} className="hover:text-primary">
                                      {lead.phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  {lead.from_postal} {lead.from_city}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <span>→</span>
                                  {lead.to_postal} {lead.to_city}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {lead.move_date ? (
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  {format(new Date(lead.move_date), "dd.MM.yyyy")}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {lead.calculator_output?.priceMin && lead.calculator_output?.priceMax ? (
                                  <>
                                    <div className="font-medium">
                                      {formatCurrency(lead.calculator_output.priceMin)}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                      - {formatCurrency(lead.calculator_output.priceMax)}
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={lead.status}
                                onValueChange={(value) => updateLeadStatus(lead.id, value)}
                              >
                                <SelectTrigger className={`w-[130px] h-8 text-xs ${getStatusColor(lead.status)}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">Neu</SelectItem>
                                  <SelectItem value="contacted">Kontaktiert</SelectItem>
                                  <SelectItem value="converted">Konvertiert</SelectItem>
                                  <SelectItem value="lost">Verloren</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(lead.created_at), "dd.MM.yy HH:mm")}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Could implement a detailed view modal here
                                  toast({
                                    title: "Lead Details",
                                    description: `Weitere Details für ${lead.name}`,
                                  });
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

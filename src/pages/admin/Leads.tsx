import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowLeft, MapPin, Calendar, Download, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  calculator_output: any;
  status: string;
  created_at: string;
}

const LeadsAdmin = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Fehler",
        description: "Leads konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "contacted":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "converted":
        return "bg-success/10 text-success border-success/20";
      case "lost":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: "Neu",
      contacted: "Kontaktiert",
      converted: "Konvertiert",
      lost: "Verloren",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 py-8 bg-gradient-light">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link to="/admin">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zum Dashboard
                </Button>
              </Link>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Leads verwalten</h1>
                  <p className="text-muted-foreground">
                    Alle Anfragen und deren Status im Überblick
                  </p>
                </div>
                <Button onClick={fetchLeads} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Aktualisieren
                </Button>
              </div>
            </div>

            {/* Search & Filter */}
            <Card className="mb-6 shadow-medium">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Lead suchen (Name, E-Mail, Ort)..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
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
              </CardContent>
            </Card>

            {/* Leads Table */}
            <Card className="shadow-strong">
              <CardHeader>
                <CardTitle>
                  Alle Leads ({filteredLeads.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lead ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Preis (CHF)</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeads.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              Keine Leads gefunden
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredLeads.map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell className="font-mono text-sm">
                                {lead.id.substring(0, 8)}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{lead.name}</div>
                                  <div className="text-sm text-muted-foreground">{lead.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-start gap-1 text-sm">
                                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div>{lead.from_postal} {lead.from_city}</div>
                                    <div className="text-muted-foreground">↓</div>
                                    <div>{lead.to_postal} {lead.to_city}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {lead.calculator_output?.priceMin && lead.calculator_output?.priceMax ? (
                                  <div className="text-sm">
                                    <div className="font-medium">
                                      {formatCurrency(lead.calculator_output.priceMin)}
                                    </div>
                                    <div className="text-muted-foreground">
                                      bis {formatCurrency(lead.calculator_output.priceMax)}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(lead.created_at), "dd.MM.yyyy")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={lead.status}
                                  onValueChange={(value) => updateLeadStatus(lead.id, value)}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <Badge className={getStatusColor(lead.status)} variant="outline">
                                      {getStatusLabel(lead.status)}
                                    </Badge>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">Neu</SelectItem>
                                    <SelectItem value="contacted">Kontaktiert</SelectItem>
                                    <SelectItem value="converted">Konvertiert</SelectItem>
                                    <SelectItem value="lost">Verloren</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadsAdmin;

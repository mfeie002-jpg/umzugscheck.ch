import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, MapPin, Calendar, User, Mail, Phone, FileText, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  move_date: string | null;
  status: string;
  created_at: string;
  comments: string | null;
  calculator_input: any;
  calculator_output: any;
}

export function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Fehler beim Laden der Leads");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", leadId);

      if (error) throw error;
      toast.success(`Status auf "${status}" geändert`);
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId);

      if (error) throw error;
      toast.success("Lead gelöscht");
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Fehler beim Löschen");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.from_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.to_city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesType = typeFilter === "all" || lead.calculator_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">Neu</Badge>;
      case "contacted":
        return <Badge className="bg-amber-500">Kontaktiert</Badge>;
      case "converted":
        return <Badge className="bg-green-500">Konvertiert</Badge>;
      case "lost":
        return <Badge variant="destructive">Verloren</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculatorTypes = [...new Set(leads.map((l) => l.calculator_type))];

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Gesamt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <p className="text-sm text-muted-foreground">Neu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{stats.contacted}</div>
            <p className="text-sm text-muted-foreground">Kontaktiert</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.converted}</div>
            <p className="text-sm text-muted-foreground">Konvertiert</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lead-Verwaltung</CardTitle>
          <CardDescription>Alle eingegangenen Anfragen verwalten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Name, E-Mail oder Stadt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="new">Neu</SelectItem>
                <SelectItem value="contacted">Kontaktiert</SelectItem>
                <SelectItem value="converted">Konvertiert</SelectItem>
                <SelectItem value="lost">Verloren</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Rechner-Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen</SelectItem>
                {calculatorTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">Laden...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.from_postal} {lead.from_city}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        → {lead.to_postal} {lead.to_city}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.calculator_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {lead.move_date
                        ? new Date(lead.move_date).toLocaleDateString("de-CH")
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status || "new")}</TableCell>
                    <TableCell>
                      {new Date(lead.created_at).toLocaleDateString("de-CH")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Lead-Details: {lead.name}</DialogTitle>
                              <DialogDescription>
                                Erstellt am{" "}
                                {new Date(lead.created_at).toLocaleString("de-CH")}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">Name</p>
                                    <p>{lead.name}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">E-Mail</p>
                                    <p>{lead.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">Telefon</p>
                                    <p>{lead.phone || "-"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">Umzugsdatum</p>
                                    <p>
                                      {lead.move_date
                                        ? new Date(lead.move_date).toLocaleDateString(
                                            "de-CH"
                                          )
                                        : "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Route</p>
                                  <p>
                                    {lead.from_postal} {lead.from_city} →{" "}
                                    {lead.to_postal} {lead.to_city}
                                  </p>
                                </div>
                              </div>
                              {lead.comments && (
                                <div className="flex items-start gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                                  <div>
                                    <p className="text-sm font-medium">Kommentar</p>
                                    <p className="text-sm">{lead.comments}</p>
                                  </div>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium mb-2">Status ändern</p>
                                <div className="flex gap-2">
                                  {["new", "contacted", "converted", "lost"].map(
                                    (status) => (
                                      <Button
                                        key={status}
                                        variant={
                                          lead.status === status
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                          updateLeadStatus(lead.id, status)
                                        }
                                      >
                                        {status === "new"
                                          ? "Neu"
                                          : status === "contacted"
                                          ? "Kontaktiert"
                                          : status === "converted"
                                          ? "Konvertiert"
                                          : "Verloren"}
                                      </Button>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Lead löschen?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Diese Aktion kann nicht rückgängig gemacht werden.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteLead(lead.id)}
                              >
                                Löschen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

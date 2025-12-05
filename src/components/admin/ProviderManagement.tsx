import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, CheckCircle2, XCircle, Clock, Building2, Mail, Phone, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Provider {
  id: string;
  company_name: string;
  contact_person_name: string;
  email: string;
  phone: string;
  city: string;
  cantons_served: string[];
  services_offered: string[];
  verification_status: string;
  account_status: string;
  created_at: string;
}

export function ProviderManagement() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast.error("Fehler beim Laden der Anbieter");
    } finally {
      setLoading(false);
    }
  };

  const updateProviderStatus = async (providerId: string, status: "approved" | "pending" | "rejected") => {
    try {
      const { error } = await supabase
        .from("service_providers")
        .update({ verification_status: status })
        .eq("id", providerId);

      if (error) throw error;
      toast.success(`Status auf "${status}" geändert`);
      fetchProviders();
    } catch (error) {
      console.error("Error updating provider:", error);
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || provider.verification_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Genehmigt</Badge>;
      case "pending":
        return <Badge variant="secondary">Ausstehend</Badge>;
      case "rejected":
        return <Badge variant="destructive">Abgelehnt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: providers.length,
    approved: providers.filter((p) => p.verification_status === "approved").length,
    pending: providers.filter((p) => p.verification_status === "pending").length,
    rejected: providers.filter((p) => p.verification_status === "rejected").length,
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
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-sm text-muted-foreground">Genehmigt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Ausstehend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-sm text-muted-foreground">Abgelehnt</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Anbieter-Verwaltung</CardTitle>
          <CardDescription>Verwalten Sie alle registrierten Umzugsunternehmen</CardDescription>
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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="approved">Genehmigt</SelectItem>
                <SelectItem value="rejected">Abgelehnt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">Laden...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unternehmen</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Standort</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registriert</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="font-medium">{provider.company_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {provider.contact_person_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{provider.email}</div>
                      <div className="text-sm text-muted-foreground">{provider.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{provider.city}</div>
                      <div className="text-sm text-muted-foreground">
                        {provider.cantons_served?.slice(0, 3).join(", ")}
                        {provider.cantons_served?.length > 3 && "..."}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(provider.verification_status)}</TableCell>
                    <TableCell>
                      {new Date(provider.created_at).toLocaleDateString("de-CH")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProvider(provider)}
                            >
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{provider.company_name}</DialogTitle>
                              <DialogDescription>Provider-Details</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Kontaktperson</p>
                                  <p>{provider.contact_person_name}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">E-Mail</p>
                                  <p>{provider.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Telefon</p>
                                  <p>{provider.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Stadt</p>
                                  <p>{provider.city}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">Kantone</p>
                                <div className="flex flex-wrap gap-1">
                                  {provider.cantons_served?.map((canton) => (
                                    <Badge key={canton} variant="outline">
                                      {canton}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">Services</p>
                                <div className="flex flex-wrap gap-1">
                                  {provider.services_offered?.map((service) => (
                                    <Badge key={service} variant="secondary">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {provider.verification_status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateProviderStatus(provider.id, "approved")}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateProviderStatus(provider.id, "rejected")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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

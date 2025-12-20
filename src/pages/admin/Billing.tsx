import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DollarSign, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { Helmet } from "react-helmet";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface BillingRecord {
  id: string;
  provider_id: string;
  lead_id: string | null;
  price_chf: number;
  billing_model: string;
  status: string;
  billing_period: string | null;
  created_at: string;
  paid_at: string | null;
  service_providers: {
    company_name: string;
    email: string;
  };
}

export default function Billing() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchBillingRecords();
  }, [filter]);

  const fetchBillingRecords = async () => {
    try {
      let query = supabase
        .from("billing_records")
        .select(`
          *,
          service_providers(company_name, email)
        `)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBillingRecords(data || []);
    } catch (error: any) {
      console.error("Error fetching billing records:", error);
      toast.error("Fehler beim Laden der Abrechnungen");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from("billing_records")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", recordId);

      if (error) throw error;

      toast.success("Rechnung als bezahlt markiert");
      fetchBillingRecords();
    } catch (error: any) {
      console.error("Error marking as paid:", error);
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const exportToCSV = () => {
    const csv = [
      ["Firma", "E-Mail", "Betrag (CHF)", "Modell", "Status", "Datum", "Bezahlt am"].join(","),
      ...billingRecords.map(record =>
        [
          record.service_providers.company_name,
          record.service_providers.email,
          record.price_chf,
          record.billing_model,
          record.status,
          new Date(record.created_at).toLocaleDateString("de-CH"),
          record.paid_at ? new Date(record.paid_at).toLocaleDateString("de-CH") : "-"
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const totalOpen = billingRecords
    .filter(r => r.status === "open")
    .reduce((sum, r) => sum + r.price_chf, 0);

  const totalPaid = billingRecords
    .filter(r => r.status === "paid")
    .reduce((sum, r) => sum + r.price_chf, 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      open: { variant: "outline", icon: Clock },
      paid: { variant: "default", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle }
    };

    const config = variants[status] || variants.open;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status === "open" ? "Offen" : status === "paid" ? "Bezahlt" : "Storniert"}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Abrechnungen | Admin</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Abrechnungen & Billing</h1>
          <p className="text-muted-foreground">Verwalten Sie alle Provider-Rechnungen und Zahlungen</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Offene Rechnungen</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">CHF {totalOpen.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {billingRecords.filter(r => r.status === "open").length} Rechnungen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bezahlte Rechnungen</CardTitle>
              <CheckCircle className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">CHF {totalPaid.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {billingRecords.filter(r => r.status === "paid").length} Rechnungen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gesamt</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">CHF {(totalOpen + totalPaid).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {billingRecords.length} Rechnungen total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex justify-between items-center mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle anzeigen</SelectItem>
              <SelectItem value="open">Offene</SelectItem>
              <SelectItem value="paid">Bezahlte</SelectItem>
              <SelectItem value="cancelled">Stornierte</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            CSV Export
          </Button>
        </div>

        {/* Billing Table */}
        <Card>
          <CardHeader>
            <CardTitle>Alle Abrechnungen</CardTitle>
            <CardDescription>Übersicht aller Provider-Rechnungen und Transaktionen</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Laden...</div>
            ) : billingRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Keine Abrechnungen gefunden</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firma</TableHead>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Modell</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.service_providers.company_name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.service_providers.email}
                        </TableCell>
                        <TableCell className="font-bold">
                          CHF {record.price_chf.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{record.billing_model}</Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(record.created_at).toLocaleDateString("de-CH")}
                        </TableCell>
                        <TableCell>
                          {record.status === "open" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsPaid(record.id)}
                            >
                              Als bezahlt markieren
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

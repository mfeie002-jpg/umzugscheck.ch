import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, DollarSign, CreditCard, TrendingUp, Download, CheckCircle2 } from "lucide-react";

interface BillingRecord {
  id: string;
  provider_id: string;
  lead_id: string | null;
  price_chf: number;
  billing_model: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  invoice_number: string | null;
  provider?: {
    company_name: string;
  };
}

interface PaymentHistory {
  id: string;
  provider_id: string;
  amount: number;
  currency: string;
  payment_type: string;
  status: string;
  created_at: string;
  provider?: {
    company_name: string;
  };
}

export function PaymentManagement() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"billing" | "payments">("billing");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch billing records
      const { data: billingData, error: billingError } = await supabase
        .from("billing_records")
        .select(`
          *,
          provider:service_providers(company_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (billingError) throw billingError;
      setBillingRecords(billingData || []);

      // Fetch payment history
      const { data: paymentData, error: paymentError } = await supabase
        .from("payment_history")
        .select(`
          *,
          provider:service_providers(company_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (paymentError) throw paymentError;
      setPaymentHistory(paymentData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Fehler beim Laden");
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
      toast.success("Als bezahlt markiert");
      fetchData();
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <Badge className="bg-green-500">Bezahlt</Badge>;
      case "open":
      case "pending":
        return <Badge variant="secondary">Offen</Badge>;
      case "overdue":
        return <Badge variant="destructive">Überfällig</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate stats
  const totalRevenue = billingRecords
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + Number(r.price_chf), 0);
  
  const pendingRevenue = billingRecords
    .filter((r) => r.status === "open")
    .reduce((sum, r) => sum + Number(r.price_chf), 0);

  const thisMonthRevenue = billingRecords
    .filter((r) => {
      const recordDate = new Date(r.created_at);
      const now = new Date();
      return (
        r.status === "paid" &&
        recordDate.getMonth() === now.getMonth() &&
        recordDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, r) => sum + Number(r.price_chf), 0);

  const filteredBilling = billingRecords.filter((record) => {
    const matchesSearch = record.provider?.company_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = paymentHistory.filter((payment) => {
    const matchesSearch = payment.provider?.company_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">CHF {totalRevenue.toLocaleString()}</div>
            </div>
            <p className="text-sm text-muted-foreground">Gesamtumsatz</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold">CHF {thisMonthRevenue.toLocaleString()}</div>
            </div>
            <p className="text-sm text-muted-foreground">Diesen Monat</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-amber-600" />
              <div className="text-2xl font-bold">CHF {pendingRevenue.toLocaleString()}</div>
            </div>
            <p className="text-sm text-muted-foreground">Ausstehend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{billingRecords.length}</div>
            <p className="text-sm text-muted-foreground">Transaktionen</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Zahlungs-Verwaltung</CardTitle>
              <CardDescription>Alle Rechnungen und Zahlungen verwalten</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "billing" ? "default" : "outline"}
                onClick={() => setActiveTab("billing")}
              >
                Rechnungen
              </Button>
              <Button
                variant={activeTab === "payments" ? "default" : "outline"}
                onClick={() => setActiveTab("payments")}
              >
                Zahlungen
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Anbieter..."
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
                <SelectItem value="open">Offen</SelectItem>
                <SelectItem value="paid">Bezahlt</SelectItem>
                <SelectItem value="overdue">Überfällig</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Laden...</div>
          ) : activeTab === "billing" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rechnung</TableHead>
                  <TableHead>Anbieter</TableHead>
                  <TableHead>Modell</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBilling.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {record.invoice_number || record.id.slice(0, 8)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.provider?.company_name || "Unbekannt"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.billing_model}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      CHF {Number(record.price_chf).toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status || "open")}</TableCell>
                    <TableCell>
                      {new Date(record.created_at).toLocaleDateString("de-CH")}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.status === "open" && (
                        <Button
                          size="sm"
                          onClick={() => markAsPaid(record.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Als bezahlt
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Anbieter</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-mono text-sm">{payment.id.slice(0, 8)}</div>
                    </TableCell>
                    <TableCell>
                      {payment.provider?.company_name || "Unbekannt"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.payment_type}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {payment.currency} {Number(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString("de-CH")}
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

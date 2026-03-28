import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Receipt, Download, Eye, Send, CheckCircle2, Clock, 
  AlertCircle, FileText, Calendar, CreditCard
} from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  issuedDate: string;
  dueDate: string;
  moveId: string;
}

const InvoiceManager = () => {
  const [invoices] = useState<Invoice[]>([
    {
      id: "inv1",
      number: "INV-2024-001",
      customer: "Familie Müller",
      amount: 4500,
      status: "paid",
      issuedDate: "2024-03-01",
      dueDate: "2024-03-11",
      moveId: "m1"
    },
    {
      id: "inv2",
      number: "INV-2024-002",
      customer: "Firma ABC GmbH",
      amount: 12800,
      status: "sent",
      issuedDate: "2024-03-05",
      dueDate: "2024-03-15",
      moveId: "m2"
    },
    {
      id: "inv3",
      number: "INV-2024-003",
      customer: "Herr Schmidt",
      amount: 2200,
      status: "overdue",
      issuedDate: "2024-02-15",
      dueDate: "2024-02-25",
      moveId: "m3"
    },
    {
      id: "inv4",
      number: "INV-2024-004",
      customer: "Frau Weber",
      amount: 3800,
      status: "draft",
      issuedDate: "2024-03-10",
      dueDate: "2024-03-20",
      moveId: "m4"
    }
  ]);

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      draft: { color: "bg-gray-100 text-gray-800", icon: FileText, label: "Entwurf" },
      sent: { color: "bg-blue-100 text-blue-800", icon: Send, label: "Versendet" },
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "Bezahlt" },
      overdue: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Überfällig" }
    };
    const { color, icon: Icon, label } = variants[status];
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === "sent" || i.status === "draft").reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);

  const handleDownload = (invoiceNumber: string) => {
    toast.success(`${invoiceNumber} wird heruntergeladen...`);
  };

  const handleSend = (invoiceNumber: string) => {
    toast.success(`${invoiceNumber} wurde versendet`);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Bezahlt</span>
            </div>
            <p className="text-2xl font-bold mt-1">CHF {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Ausstehend</span>
            </div>
            <p className="text-2xl font-bold mt-1">CHF {pendingAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className={overdueAmount > 0 ? "border-red-200 bg-red-50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Überfällig</span>
            </div>
            <p className="text-2xl font-bold mt-1">CHF {overdueAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Rechnungen
              </CardTitle>
              <CardDescription>Verwalten Sie alle Rechnungen</CardDescription>
            </div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Neue Rechnung
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nummer</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fällig am</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono">{invoice.number}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell className="font-medium">
                    CHF {invoice.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {invoice.dueDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Anzeigen">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Herunterladen"
                        onClick={() => handleDownload(invoice.number)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status === "draft" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Versenden"
                          onClick={() => handleSend(invoice.number)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {invoice.status === "sent" && (
                        <Button variant="ghost" size="icon" title="Als bezahlt markieren">
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManager;

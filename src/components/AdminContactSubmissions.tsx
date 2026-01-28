import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { 
  Mail, Phone, MapPin, RefreshCw, Eye, CheckCircle, Clock, XCircle, User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  move_from: string | null;
  move_to: string | null;
  move_type: string | null;
  message: string | null;
  status: string;
  created_at: string;
  processed_at: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: "Neu", color: "bg-blue-500", icon: Clock },
  in_progress: { label: "In Bearbeitung", color: "bg-yellow-500", icon: RefreshCw },
  contacted: { label: "Kontaktiert", color: "bg-purple-500", icon: Phone },
  completed: { label: "Abgeschlossen", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Abgesagt", color: "bg-red-500", icon: XCircle },
};

// Mock data since contact_submissions table doesn't exist
const mockSubmissions: ContactSubmission[] = [];

const AdminContactSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(mockSubmissions);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadSubmissions = async () => {
    setLoading(true);
    // Using mock data since table doesn't exist
    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    setSubmissions(prev => 
      prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
    );
    toast({
      title: "Status aktualisiert",
      description: `Status wurde auf "${statusConfig[newStatus]?.label}" geändert`,
    });
    
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getMoveTypeLabel = (type: string | null) => {
    switch (type) {
      case "single": return "Einzelperson";
      case "family": return "Familie";
      case "office": return "Büro";
      default: return type || "-";
    }
  };

  const statusCounts = submissions.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredSubmissions = statusFilter === "all" 
    ? submissions 
    : submissions.filter(s => s.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold">Kontaktanfragen</h2>
          <p className="text-sm text-muted-foreground">
            {submissions.length} Anfragen insgesamt
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label} ({statusCounts[key] || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadSubmissions} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(statusConfig).map(([key, config]) => (
          <Card 
            key={key} 
            className={`cursor-pointer transition-all ${statusFilter === key ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <span className="text-sm font-medium">{config.label}</span>
              </div>
              <p className="text-2xl font-bold mt-1">{statusCounts[key] || 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Anfragen</CardTitle>
          <CardDescription>Klicken Sie auf eine Anfrage für Details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Laden...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Keine Anfragen gefunden</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => {
                    const config = statusConfig[submission.status] || statusConfig.new;
                    return (
                      <TableRow 
                        key={submission.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(submission.created_at), "dd.MM.yyyy HH:mm", { locale: de })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {submission.first_name} {submission.last_name}
                        </TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{getMoveTypeLabel(submission.move_type)}</TableCell>
                        <TableCell>
                          <Badge className={`${config.color} text-white`}>{config.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedSubmission(submission); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedSubmission?.first_name} {selectedSubmission?.last_name}
            </DialogTitle>
            <DialogDescription>
              Eingegangen am {selectedSubmission && format(new Date(selectedSubmission.created_at), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={selectedSubmission.status} onValueChange={(value) => updateStatus(selectedSubmission.id, value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${config.color}`} />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Kontaktdaten</h4>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">{selectedSubmission.email}</a>
                  </div>
                  {selectedSubmission.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedSubmission.phone}`} className="text-primary hover:underline">{selectedSubmission.phone}</a>
                    </div>
                  )}
                </div>
              </div>

              {selectedSubmission.message && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Nachricht</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button asChild className="flex-1">
                  <a href={`mailto:${selectedSubmission.email}`}><Mail className="h-4 w-4 mr-2" />E-Mail senden</a>
                </Button>
                {selectedSubmission.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${selectedSubmission.phone}`}><Phone className="h-4 w-4 mr-2" />Anrufen</a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContactSubmissions;

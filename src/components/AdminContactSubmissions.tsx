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
  Mail, Phone, MapPin, Calendar, RefreshCw, Eye, CheckCircle, Clock, XCircle, User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

const AdminContactSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast({
        title: "Fehler",
        description: "Kontaktanfragen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ 
          status: newStatus,
          processed_at: newStatus === "completed" || newStatus === "cancelled" 
            ? new Date().toISOString() 
            : null
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status aktualisiert",
        description: `Status wurde auf "${statusConfig[newStatus]?.label}" geändert`,
      });

      loadSubmissions();
      
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden",
        variant: "destructive",
      });
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

  const filteredSubmissions = submissions;

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(statusConfig).map(([key, config]) => {
          const StatusIcon = config.icon;
          return (
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
          );
        })}
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Anfragen</CardTitle>
          <CardDescription>Klicken Sie auf eine Anfrage für Details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Laden...
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Keine Anfragen gefunden
            </div>
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
                          <Badge className={`${config.color} text-white`}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubmission(submission);
                            }}
                          >
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

      {/* Detail Dialog */}
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
              {/* Status Update */}
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select 
                  value={selectedSubmission.status} 
                  onValueChange={(value) => updateStatus(selectedSubmission.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Kontaktdaten
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </div>
                  {selectedSubmission.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedSubmission.phone}`} className="text-primary hover:underline">
                        {selectedSubmission.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Move Details */}
              {(selectedSubmission.move_from || selectedSubmission.move_to) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Umzugsdetails
                  </h4>
                  <div className="grid gap-3">
                    {selectedSubmission.move_type && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{getMoveTypeLabel(selectedSubmission.move_type)}</span>
                      </div>
                    )}
                    {selectedSubmission.move_from && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground block">Von</span>
                          <span>{selectedSubmission.move_from}</span>
                        </div>
                      </div>
                    )}
                    {selectedSubmission.move_to && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground block">Nach</span>
                          <span>{selectedSubmission.move_to}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message */}
              {selectedSubmission.message && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Nachricht
                  </h4>
                  <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button asChild className="flex-1">
                  <a href={`mailto:${selectedSubmission.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    E-Mail senden
                  </a>
                </Button>
                {selectedSubmission.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${selectedSubmission.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Anrufen
                    </a>
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

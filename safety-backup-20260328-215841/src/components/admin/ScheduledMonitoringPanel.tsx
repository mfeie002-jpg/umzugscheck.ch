import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, RefreshCw, ExternalLink, Image, FileText, 
  Calendar, Download, FolderOpen, Play, CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface MonitoredUrl {
  url: string;
  name: string;
  category: string;
}

interface CaptureSession {
  timestamp: string;
  files: string[];
  successful: number;
  total: number;
}

const MONITORED_URLS: MonitoredUrl[] = [
  { url: "https://umzugscheck.ch", name: "Homepage", category: "Core" },
  { url: "https://umzugscheck.ch/umzugsofferten", name: "Offerten Funnel", category: "Core" },
  { url: "https://umzugscheck.ch/preisrechner", name: "Preisrechner", category: "Core" },
  { url: "https://umzugscheck.ch/firmen", name: "Firmenverzeichnis", category: "Rankings" },
  { url: "https://umzugscheck.ch/beste-umzugsfirma", name: "Beste Umzugsfirma", category: "Rankings" },
  { url: "https://umzugscheck.ch/guenstige-umzugsfirma", name: "Günstige Umzugsfirma", category: "Rankings" },
  { url: "https://umzugscheck.ch/umzugsfirmen/zuerich", name: "Zürich", category: "Regionen" },
  { url: "https://umzugscheck.ch/umzugsfirmen/bern", name: "Bern", category: "Regionen" },
  { url: "https://umzugscheck.ch/umzugsfirmen/basel", name: "Basel", category: "Regionen" },
  { url: "https://umzugscheck.ch/umzugsfirmen/aargau", name: "Aargau", category: "Regionen" },
  { url: "https://umzugscheck.ch/umzugsfirmen/luzern", name: "Luzern", category: "Regionen" },
  { url: "https://umzugscheck.ch/umzugsfirmen/st-gallen", name: "St. Gallen", category: "Regionen" },
  { url: "https://umzugscheck.ch/privatumzug", name: "Privatumzug", category: "Services" },
  { url: "https://umzugscheck.ch/firmenumzug", name: "Firmenumzug", category: "Services" },
  { url: "https://umzugscheck.ch/reinigung", name: "Reinigung", category: "Services" },
  { url: "https://umzugscheck.ch/entsorgung", name: "Entsorgung", category: "Services" },
  { url: "https://umzugscheck.ch/umzugskosten", name: "Umzugskosten", category: "Content" },
  { url: "https://umzugscheck.ch/ratgeber", name: "Ratgeber", category: "Content" },
  { url: "https://umzugscheck.ch/checkliste", name: "Checkliste", category: "Content" },
  { url: "https://umzugscheck.ch/fuer-firmen", name: "Für Firmen (B2B)", category: "B2B" },
];

export function ScheduledMonitoringPanel() {
  const [sessions, setSessions] = useState<CaptureSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // List folders in screenshots-archive bucket
      const { data: folders, error } = await supabase.storage
        .from('screenshots-archive')
        .list('', { limit: 20, sortBy: { column: 'name', order: 'desc' } });

      if (error) throw error;

      // Get unique timestamps (folder names)
      const uniqueTimestamps = [...new Set(
        (folders || [])
          .filter(f => f.name.match(/^\d{4}-\d{2}-\d{2}T/))
          .map(f => f.name.split('/')[0])
      )].slice(0, 10);

      const sessionList: CaptureSession[] = [];
      
      for (const timestamp of uniqueTimestamps) {
        const { data: files } = await supabase.storage
          .from('screenshots-archive')
          .list(timestamp, { limit: 100 });

        if (files) {
          sessionList.push({
            timestamp,
            files: files.map(f => f.name),
            successful: files.filter(f => f.name.endsWith('.png')).length / 2, // Desktop + Mobile
            total: 20
          });
        }
      }

      setSessions(sessionList);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const runManualCapture = async () => {
    setRunning(true);
    setProgress(0);
    setStatus("Starte Erfassung...");

    try {
      const { data, error } = await supabase.functions.invoke('scheduled-screenshots');

      if (error) throw error;

      if (data?.success) {
        toast.success(`Erfassung abgeschlossen: ${data.successful}/${data.total} Screenshots`);
        loadSessions();
      } else {
        throw new Error(data?.error || 'Unbekannter Fehler');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erfassung fehlgeschlagen');
    } finally {
      setRunning(false);
      setProgress(100);
      setStatus("Fertig!");
    }
  };

  const downloadSession = async (timestamp: string) => {
    toast.info(`Lade Session ${timestamp}...`);
    
    try {
      const { data: files } = await supabase.storage
        .from('screenshots-archive')
        .list(timestamp, { limit: 100 });

      if (!files || files.length === 0) {
        toast.error('Keine Dateien gefunden');
        return;
      }

      const zip = new JSZip();

      for (const file of files) {
        const { data: fileData } = await supabase.storage
          .from('screenshots-archive')
          .download(`${timestamp}/${file.name}`);

        if (fileData) {
          zip.file(file.name, fileData);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `screenshots-${timestamp}.zip`);
      toast.success('Download gestartet!');
    } catch (error) {
      toast.error('Download fehlgeschlagen');
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts.replace(/-/g, ':').replace('T', ' '));
      return date.toLocaleString('de-CH');
    } catch {
      return ts;
    }
  };

  const groupedUrls = MONITORED_URLS.reduce((acc, url) => {
    if (!acc[url.category]) acc[url.category] = [];
    acc[url.category].push(url);
    return acc;
  }, {} as Record<string, MonitoredUrl[]>);

  return (
    <div className="space-y-6">
      {/* Manual Trigger */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Manuelle Erfassung
          </CardTitle>
          <CardDescription>
            Erfasse Screenshots aller 20 überwachten URLs (Desktop + Mobile + HTML)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {running && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">{status}</p>
            </div>
          )}
          <Button onClick={runManualCapture} disabled={running}>
            {running ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Jetzt erfassen (ca. 2-3 Min)
          </Button>
        </CardContent>
      </Card>

      {/* Monitored URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Überwachte URLs ({MONITORED_URLS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(groupedUrls).map(([category, urls]) => (
              <div key={category}>
                <h4 className="font-medium mb-2 text-sm text-muted-foreground">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {urls.map(url => (
                    <div 
                      key={url.url}
                      className="flex items-center justify-between p-2 border rounded text-sm"
                    >
                      <span className="truncate">{url.name}</span>
                      <a 
                        href={url.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Capture History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Erfassungs-Historie
          </CardTitle>
          <CardDescription>
            Letzte Screenshot-Sessions aus dem Storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Noch keine Erfassungen vorhanden. Starte eine manuelle Erfassung oben.
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => (
                <div 
                  key={session.timestamp}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{formatTimestamp(session.timestamp)}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Image className="h-3 w-3" />
                          {session.files.filter(f => f.endsWith('.png')).length} Screenshots
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {session.files.filter(f => f.endsWith('.html')).length} HTML
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.successful >= session.total * 0.9 ? "default" : "secondary"}>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {session.successful}/{session.total}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadSession(session.timestamp)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={loadSessions}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

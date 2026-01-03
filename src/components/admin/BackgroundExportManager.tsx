import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/data/constants";
import {
  Download,
  Play,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Trash2,
  StopCircle,
  Link as LinkIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface ExportJob {
  id: string;
  job_type: string;
  status: string;
  progress: number;
  progress_message: string | null;
  include_sub_variants: boolean;
  download_url: string | null;
  file_size_bytes: number | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export function BackgroundExportManager() {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingExport, setIsStartingExport] = useState(false);
  const [includeSubVariants, setIncludeSubVariants] = useState(true);

  const defaultPublicBaseUrl = useMemo(() => {
    return SITE_CONFIG.previewUrl.replace(/\/$/, "");
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("export_jobs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Failed to fetch export jobs:", error);
      return;
    }

    setJobs(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("export-jobs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "export_jobs" },
        () => fetchJobs()
      )
      .subscribe();

    // Poll for updates every 5 seconds (backup for realtime)
    const interval = setInterval(fetchJobs, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const startExport = async () => {
    setIsStartingExport(true);

    try {
      // Create job in database
      const { data: job, error: insertError } = await supabase
        .from("export_jobs")
        .insert({
          job_type: "all_flows",
          status: "pending",
          include_sub_variants: includeSubVariants,
          config: { includeSubVariants },
        })
        .select()
        .single();

      if (insertError || !job) throw insertError;

      // Trigger background function
      const { error: fnError } = await supabase.functions.invoke(
        "background-export",
        {
          body: {
            jobId: job.id,
            baseUrl: defaultPublicBaseUrl,
            includeSubVariants,
          },
        }
      );

      if (fnError) throw fnError;

      toast.success("Export gestartet! Du kannst die Seite jetzt verlassen.");
      fetchJobs();
    } catch (error) {
      console.error("Failed to start export:", error);
      toast.error("Export konnte nicht gestartet werden");
    } finally {
      setIsStartingExport(false);
    }
  };

  const abortJob = async (jobId: string) => {
    const { error } = await supabase
      .from("export_jobs")
      .update({
        status: "failed",
        error_message: "Manuell abgebrochen",
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) {
      toast.error("Abbrechen fehlgeschlagen");
      return;
    }

    toast.success("Export abgebrochen");
    fetchJobs();
  };

  const deleteJob = async (jobId: string) => {
    const { error } = await supabase.from("export_jobs").delete().eq("id", jobId);

    if (error) {
      toast.error("Löschen fehlgeschlagen");
      return;
    }

    toast.success("Export gelöscht");
    fetchJobs();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" /> Wartend
          </Badge>
        );
      case "running":
        return (
          <Badge variant="default" className="bg-blue-500">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Läuft
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" /> Fertig
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Fehler
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const runningJobs = jobs.filter((j) => j.status === "running" || j.status === "pending");
  const hasRunningJob = runningJobs.length > 0;

  // Safe download via blob fetch - prevents page refresh
  const openDownload = async (url: string, filename?: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || url.split('/').pop() || 'download.zip';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Download-Link kopiert");
    } catch {
      toast.error("Link konnte nicht kopiert werden");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Background Export Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Starte einen Export im Hintergrund. Du kannst die Seite verlassen und später
          zurückkommen, um den Download-Link zu erhalten.
        </p>

        {/* Start Export Section */}
        <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-sub-variants"
                checked={includeSubVariants}
                onCheckedChange={(checked) => setIncludeSubVariants(!!checked)}
              />
              <label
                htmlFor="include-sub-variants"
                className="text-sm font-medium cursor-pointer"
              >
                Inkl. Sub-Varianten (v2a-e, v3a-g, v4a-e, v5a-e)
              </label>
            </div>
          </div>

          <Button
            onClick={startExport}
            disabled={isStartingExport || hasRunningJob}
            className="bg-gradient-to-r from-primary to-blue-600"
          >
            {isStartingExport ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Export wird gestartet...
              </>
            ) : hasRunningJob ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Export läuft bereits...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Background Export starten
              </>
            )}
          </Button>

          {hasRunningJob && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Ein Export läuft gerade. Du kannst diese Seite verlassen - der Export läuft
                weiter.
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Base URL: <span className="font-mono">{defaultPublicBaseUrl}</span>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Export-Jobs</h3>
            <Button variant="ghost" size="sm" onClick={fetchJobs}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Lade Export-Jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Keine Export-Jobs vorhanden</div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status)}
                        {job.include_sub_variants && (
                          <Badge variant="outline" className="text-xs">
                            + Sub-Varianten
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(job.created_at), {
                            addSuffix: true,
                            locale: de,
                          })}
                        </span>
                      </div>

                      {job.status === "running" && (
                        <div className="space-y-1">
                          <Progress value={job.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {job.progress}% - {job.progress_message || "Läuft..."}
                          </p>
                        </div>
                      )}

                      {job.status === "pending" && (
                        <p className="text-xs text-muted-foreground">Wartet auf Start...</p>
                      )}

                      {job.status === "completed" && job.download_url && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => openDownload(job.download_url!)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download ({job.file_size_bytes ? formatBytes(job.file_size_bytes) : "..."})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyLink(job.download_url!)}
                          >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Link kopieren
                          </Button>
                        </div>
                      )}

                      {job.status === "failed" && job.error_message && (
                        <p className="text-sm text-destructive">Fehler: {job.error_message}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {(job.status === "running" || job.status === "pending") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abortJob(job.id)}
                          className="text-muted-foreground hover:text-destructive"
                          title="Abbrechen"
                        >
                          <StopCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {(job.status === "completed" || job.status === "failed") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteJob(job.id)}
                          className="text-muted-foreground hover:text-destructive"
                          title="Löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


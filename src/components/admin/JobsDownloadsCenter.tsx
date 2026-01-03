/**
 * Jobs & Downloads Center
 * 
 * Unified view for all export jobs with download links.
 * Shows background exports, ultimate exports, and other async jobs.
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Trash2,
  StopCircle,
  Link as LinkIcon,
  FileArchive,
  Sparkles,
  Zap,
  FolderOpen,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { de } from "date-fns/locale";

interface ExportJob {
  id: string;
  job_type: string;
  status: string;
  progress: number | null;
  progress_message: string | null;
  include_sub_variants: boolean | null;
  download_url: string | null;
  file_size_bytes: number | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  config: Record<string, unknown> | null;
}

export function JobsDownloadsCenter() {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("export_jobs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Failed to fetch export jobs:", error);
      return;
    }

    setJobs((data as ExportJob[]) || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("jobs-center-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "export_jobs" },
        () => fetchJobs()
      )
      .subscribe();

    // Poll for updates every 10 seconds (backup for realtime)
    const interval = setInterval(fetchJobs, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

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

    toast.success("Job abgebrochen");
    fetchJobs();
  };

  const deleteJob = async (jobId: string) => {
    const { error } = await supabase.from("export_jobs").delete().eq("id", jobId);

    if (error) {
      toast.error("Löschen fehlgeschlagen");
      return;
    }

    toast.success("Job gelöscht");
    fetchJobs();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getJobTypeIcon = (jobType: string) => {
    switch (jobType) {
      case "all_flows":
        return <Package className="w-4 h-4" />;
      case "ultimate_flow_export":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <FileArchive className="w-4 h-4" />;
    }
  };

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case "all_flows":
        return "Background Export";
      case "ultimate_flow_export":
        return "Ultimate Export";
      default:
        return jobType;
    }
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
      case "processing":
        return (
          <Badge variant="default" className="bg-blue-500">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Läuft
          </Badge>
        );
      case "completed":
      case "done":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" /> Fertig
          </Badge>
        );
      case "failed":
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Fehler
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Safe download that never causes page refresh
  const openDownload = async (url: string, filename?: string) => {
    try {
      // Fetch the file first to create a local blob URL
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || url.split('/').pop() || 'download';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Revoke after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      // Fallback: open in new tab
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

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "running") return job.status === "running" || job.status === "pending" || job.status === "processing";
    if (activeFilter === "completed") return job.status === "completed" || job.status === "done";
    if (activeFilter === "failed") return job.status === "failed" || job.status === "error";
    return job.job_type === activeFilter;
  });

  // Stats
  const runningCount = jobs.filter(j => j.status === "running" || j.status === "pending" || j.status === "processing").length;
  const completedCount = jobs.filter(j => j.status === "completed" || j.status === "done").length;
  const failedCount = jobs.filter(j => j.status === "failed" || j.status === "error").length;
  const downloadableJobs = jobs.filter(j => j.download_url && (j.status === "completed" || j.status === "done"));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Jobs & Downloads Center
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchJobs}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 border rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-500">{runningCount}</div>
            <div className="text-xs text-muted-foreground">Laufend</div>
          </div>
          <div className="p-3 border rounded-lg text-center">
            <div className="text-2xl font-bold text-green-500">{completedCount}</div>
            <div className="text-xs text-muted-foreground">Fertig</div>
          </div>
          <div className="p-3 border rounded-lg text-center">
            <div className="text-2xl font-bold text-red-500">{failedCount}</div>
            <div className="text-xs text-muted-foreground">Fehler</div>
          </div>
          <div className="p-3 border rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{downloadableJobs.length}</div>
            <div className="text-xs text-muted-foreground">Downloads</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Alle ({jobs.length})</TabsTrigger>
            <TabsTrigger value="running">Laufend ({runningCount})</TabsTrigger>
            <TabsTrigger value="completed">Fertig ({completedCount})</TabsTrigger>
            <TabsTrigger value="failed">Fehler ({failedCount})</TabsTrigger>
            <TabsTrigger value="all_flows">Background</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Jobs List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Lade Jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Keine Jobs gefunden
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getJobTypeIcon(job.job_type)}
                        {getJobTypeLabel(job.job_type)}
                      </Badge>
                      {getStatusBadge(job.status)}
                      {job.include_sub_variants && (
                        <Badge variant="outline" className="text-xs">
                          + Sub-Varianten
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Erstellt: {format(new Date(job.created_at), "dd.MM.yyyy HH:mm", { locale: de })}
                      </span>
                      {job.completed_at && (
                        <span>
                          Fertig: {formatDistanceToNow(new Date(job.completed_at), { addSuffix: true, locale: de })}
                        </span>
                      )}
                    </div>

                    {(job.status === "running" || job.status === "processing") && (
                      <div className="space-y-1">
                        <Progress value={job.progress || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {job.progress || 0}% - {job.progress_message || "Läuft..."}
                        </p>
                      </div>
                    )}

                    {job.status === "pending" && (
                      <p className="text-xs text-muted-foreground">Wartet auf Start...</p>
                    )}

                    {(job.status === "completed" || job.status === "done") && job.download_url && (
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

                    {(job.status === "failed" || job.status === "error") && job.error_message && (
                      <p className="text-sm text-destructive">Fehler: {job.error_message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {(job.status === "running" || job.status === "pending" || job.status === "processing") && (
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

                    {(job.status === "completed" || job.status === "done" || job.status === "failed" || job.status === "error") && (
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

        {/* Quick Download Section */}
        {downloadableJobs.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Letzte Downloads
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {downloadableJobs.slice(0, 6).map((job) => (
                <Button
                  key={job.id}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2"
                  onClick={() => openDownload(job.download_url!)}
                >
                  <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                    <span className="text-xs font-medium truncate w-full">
                      {getJobTypeLabel(job.job_type)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(job.created_at), "dd.MM. HH:mm")}
                      {job.file_size_bytes && ` • ${formatBytes(job.file_size_bytes)}`}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

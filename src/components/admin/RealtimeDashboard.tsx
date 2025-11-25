import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Eye, MousePointerClick, TrendingUp, Zap } from "lucide-react";

interface RealtimeMetric {
  id: string;
  metric_type: string;
  company_id: string | null;
  value: number;
  metadata: any;
  recorded_at: string;
}

export function RealtimeDashboard() {
  const [metrics, setMetrics] = useState<RealtimeMetric[]>([]);
  const [liveStats, setLiveStats] = useState({
    pageViews: 0,
    clicks: 0,
    conversions: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Fetch initial metrics
    fetchRecentMetrics();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("realtime-ranking-metrics")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "realtime_ranking_metrics",
        },
        (payload) => {
          const newMetric = payload.new as RealtimeMetric;
          setMetrics((prev) => [newMetric, ...prev.slice(0, 49)]);
          updateLiveStats(newMetric);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from("realtime_ranking_metrics")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      if (data) {
        setMetrics(data);
        calculateLiveStats(data);
      }
    } catch (error) {
      console.error("Error fetching realtime metrics:", error);
    }
  };

  const calculateLiveStats = (metricsData: RealtimeMetric[]) => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const recentMetrics = metricsData.filter(
      (m) => new Date(m.recorded_at) >= fiveMinutesAgo
    );

    const stats = {
      pageViews: recentMetrics.filter((m) => m.metric_type === "page_view").length,
      clicks: recentMetrics.filter((m) => m.metric_type === "click").length,
      conversions: recentMetrics.filter((m) => m.metric_type === "conversion").length,
      activeUsers: new Set(recentMetrics.map((m) => m.metadata?.user_id).filter(Boolean)).size,
    };

    setLiveStats(stats);
  };

  const updateLiveStats = (newMetric: RealtimeMetric) => {
    setLiveStats((prev) => {
      const updated = { ...prev };
      
      switch (newMetric.metric_type) {
        case "page_view":
          updated.pageViews += 1;
          break;
        case "click":
          updated.clicks += 1;
          break;
        case "conversion":
          updated.conversions += 1;
          break;
      }

      return updated;
    });
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case "page_view":
        return <Eye className="w-4 h-4" />;
      case "click":
        return <MousePointerClick className="w-4 h-4" />;
      case "conversion":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case "page_view":
        return "bg-blue-500/10 text-blue-500";
      case "click":
        return "bg-green-500/10 text-green-500";
      case "conversion":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Seitenaufrufe</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{liveStats.pageViews}</p>
          <p className="text-xs text-muted-foreground">Letzte 5 Min</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Klicks</span>
            <MousePointerClick className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{liveStats.clicks}</p>
          <p className="text-xs text-muted-foreground">Letzte 5 Min</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Conversions</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">{liveStats.conversions}</p>
          <p className="text-xs text-muted-foreground">Letzte 5 Min</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Aktive User</span>
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold">{liveStats.activeUsers}</p>
          <p className="text-xs text-muted-foreground">Jetzt online</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live-Activity Feed
          </h3>
          <Badge variant="outline" className="animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {metrics.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Warte auf Aktivität...
            </p>
          ) : (
            metrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded ${getMetricColor(metric.metric_type)}`}>
                  {getMetricIcon(metric.metric_type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {metric.metric_type === "page_view" && "Seite angesehen"}
                    {metric.metric_type === "click" && "Firma angeklickt"}
                    {metric.metric_type === "conversion" && "Lead erstellt"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(metric.recorded_at).toLocaleTimeString("de-CH")}
                    {metric.metadata?.company_name && ` • ${metric.metadata.company_name}`}
                  </p>
                </div>
                <Badge variant="secondary">{metric.value}</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

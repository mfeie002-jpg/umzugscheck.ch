/**
 * SentimentInsights - Provider Sentiment Analysis Display
 * Shows radar chart + keyword cloud from AI-analyzed reviews
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProviderSentimentData {
  provider_id: string;
  total_reviews_analyzed: number;
  avg_sentiment: number | null;
  punctuality_avg: number | null;
  professionalism_avg: number | null;
  value_avg: number | null;
  communication_avg: number | null;
  care_avg: number | null;
  top_positive_keywords: string[];
  top_negative_keywords: string[];
  last_updated: string;
}

interface SentimentInsightsProps {
  providerId: string;
  showTitle?: boolean;
  compact?: boolean;
}

function useProviderSentiment(providerId: string) {
  return useQuery({
    queryKey: ["provider-sentiment", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_sentiment_summary")
        .select("*")
        .eq("provider_id", providerId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }

      return data as ProviderSentimentData;
    },
    enabled: !!providerId,
  });
}

function getSentimentLabel(sentiment: number | null): { label: string; color: string; icon: typeof TrendingUp } {
  if (sentiment === null) return { label: "Keine Daten", color: "text-muted-foreground", icon: Minus };
  if (sentiment >= 0.5) return { label: "Sehr positiv", color: "text-green-600", icon: TrendingUp };
  if (sentiment >= 0.2) return { label: "Positiv", color: "text-emerald-500", icon: TrendingUp };
  if (sentiment >= -0.2) return { label: "Neutral", color: "text-yellow-600", icon: Minus };
  if (sentiment >= -0.5) return { label: "Negativ", color: "text-orange-500", icon: TrendingDown };
  return { label: "Sehr negativ", color: "text-red-600", icon: TrendingDown };
}

function formatScore(score: number | null): number {
  if (score === null) return 0;
  return Math.round(score * 10) / 10;
}

export function SentimentInsights({ providerId, showTitle = true, compact = false }: SentimentInsightsProps) {
  const { data: sentiment, isLoading, error } = useProviderSentiment(providerId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !sentiment) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Noch keine Sentiment-Analyse verfügbar
          </p>
        </CardContent>
      </Card>
    );
  }

  const { label, color, icon: SentimentIcon } = getSentimentLabel(sentiment.avg_sentiment);

  // Prepare radar chart data
  const radarData = [
    { category: "Pünktlichkeit", score: formatScore(sentiment.punctuality_avg), fullMark: 10 },
    { category: "Professionalität", score: formatScore(sentiment.professionalism_avg), fullMark: 10 },
    { category: "Preis-Leistung", score: formatScore(sentiment.value_avg), fullMark: 10 },
    { category: "Kommunikation", score: formatScore(sentiment.communication_avg), fullMark: 10 },
    { category: "Sorgfalt", score: formatScore(sentiment.care_avg), fullMark: 10 },
  ];

  const positiveKeywords = Array.isArray(sentiment.top_positive_keywords) 
    ? sentiment.top_positive_keywords 
    : [];
  const negativeKeywords = Array.isArray(sentiment.top_negative_keywords) 
    ? sentiment.top_negative_keywords 
    : [];

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
        <Sparkles className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <SentimentIcon className={`w-4 h-4 ${color}`} />
            <span className={`font-medium ${color}`}>{label}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Basierend auf {sentiment.total_reviews_analyzed} analysierten Bewertungen
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            KI-Sentiment-Analyse
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">
        {/* Overall Sentiment */}
        <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/30">
          <div>
            <p className="text-sm text-muted-foreground">Gesamtstimmung</p>
            <div className="flex items-center gap-2">
              <SentimentIcon className={`w-5 h-5 ${color}`} />
              <span className={`font-semibold ${color}`}>{label}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {sentiment.avg_sentiment !== null 
                ? (sentiment.avg_sentiment > 0 ? "+" : "") + (sentiment.avg_sentiment * 100).toFixed(0) + "%"
                : "-"
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {sentiment.total_reviews_analyzed} Bewertungen
            </p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 10]} 
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}/10`, "Score"]}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Keywords */}
        <div className="grid grid-cols-2 gap-4">
          {/* Positive Keywords */}
          <div>
            <div className="flex items-center gap-1 mb-2 text-sm font-medium text-green-600">
              <ThumbsUp className="w-4 h-4" />
              <span>Stärken</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {positiveKeywords.length > 0 ? (
                positiveKeywords.slice(0, 5).map((keyword, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Keine Keywords</span>
              )}
            </div>
          </div>

          {/* Negative Keywords */}
          <div>
            <div className="flex items-center gap-1 mb-2 text-sm font-medium text-red-600">
              <ThumbsDown className="w-4 h-4" />
              <span>Verbesserungspotential</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {negativeKeywords.length > 0 ? (
                negativeKeywords.slice(0, 5).map((keyword, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Keine Keywords</span>
              )}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Letzte Analyse: {new Date(sentiment.last_updated).toLocaleDateString("de-CH")}
        </p>
      </CardContent>
    </Card>
  );
}

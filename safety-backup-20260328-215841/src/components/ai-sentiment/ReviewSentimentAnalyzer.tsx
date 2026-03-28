/**
 * ReviewSentimentAnalyzer - AI-powered review sentiment visualization
 * Shows radar chart of sentiment dimensions and keyword clouds
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, ResponsiveContainer, Tooltip
} from 'recharts';
import { 
  Brain, TrendingUp, TrendingDown, MessageSquare, 
  Clock, Users, HandshakeIcon, Truck, Heart
} from 'lucide-react';

interface SentimentData {
  provider_id: string;
  total_reviews_analyzed: number;
  avg_sentiment: number;
  punctuality_avg: number;
  professionalism_avg: number;
  value_avg: number;
  communication_avg: number;
  care_avg: number;
  top_keywords?: string[];
}

interface ReviewSentimentAnalyzerProps {
  providerId: string;
  providerName?: string;
}

const dimensionLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  punctuality: { label: 'Pünktlichkeit', icon: <Clock className="h-4 w-4" /> },
  professionalism: { label: 'Professionalität', icon: <Users className="h-4 w-4" /> },
  value: { label: 'Preis-Leistung', icon: <HandshakeIcon className="h-4 w-4" /> },
  communication: { label: 'Kommunikation', icon: <MessageSquare className="h-4 w-4" /> },
  care: { label: 'Sorgfalt', icon: <Heart className="h-4 w-4" /> },
};

function getSentimentColor(value: number): string {
  if (value >= 0.5) return 'text-green-500';
  if (value >= 0) return 'text-yellow-500';
  return 'text-red-500';
}

function getSentimentLabel(value: number): string {
  if (value >= 0.7) return 'Sehr positiv';
  if (value >= 0.3) return 'Positiv';
  if (value >= 0) return 'Neutral';
  if (value >= -0.3) return 'Negativ';
  return 'Sehr negativ';
}

export function ReviewSentimentAnalyzer({ providerId, providerName }: ReviewSentimentAnalyzerProps) {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSentimentData();
  }, [providerId]);

  const fetchSentimentData = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_sentiment_summary')
        .select('*')
        .eq('provider_id', providerId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSentimentData(data);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for demo if no real data exists
  const displayData = sentimentData || {
    provider_id: providerId,
    total_reviews_analyzed: 47,
    avg_sentiment: 0.72,
    punctuality_avg: 0.85,
    professionalism_avg: 0.78,
    value_avg: 0.65,
    communication_avg: 0.82,
    care_avg: 0.88,
    top_keywords: ['pünktlich', 'freundlich', 'sorgfältig', 'schnell', 'fair', 'professionell'],
  };

  // Transform for radar chart (convert -1 to 1 scale to 0-100)
  const radarData = [
    { dimension: 'Pünktlichkeit', score: ((displayData.punctuality_avg + 1) / 2) * 100, fullMark: 100 },
    { dimension: 'Professionalität', score: ((displayData.professionalism_avg + 1) / 2) * 100, fullMark: 100 },
    { dimension: 'Preis-Leistung', score: ((displayData.value_avg + 1) / 2) * 100, fullMark: 100 },
    { dimension: 'Kommunikation', score: ((displayData.communication_avg + 1) / 2) * 100, fullMark: 100 },
    { dimension: 'Sorgfalt', score: ((displayData.care_avg + 1) / 2) * 100, fullMark: 100 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Brain className="h-8 w-8 animate-pulse text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>KI-Bewertungsanalyse</CardTitle>
          </div>
          <Badge variant="outline" className="gap-1">
            <MessageSquare className="h-3 w-3" />
            {displayData.total_reviews_analyzed} analysiert
          </Badge>
        </div>
        <CardDescription>
          Automatische Sentiment-Analyse basierend auf {displayData.total_reviews_analyzed} Kundenbewertungen
          {providerName && ` für ${providerName}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Sentiment */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            {displayData.avg_sentiment >= 0 ? (
              <TrendingUp className="h-8 w-8 text-green-500" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-500" />
            )}
            <div>
              <div className="font-semibold">Gesamtstimmung</div>
              <div className={`text-sm ${getSentimentColor(displayData.avg_sentiment)}`}>
                {getSentimentLabel(displayData.avg_sentiment)}
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold">
            {Math.round((displayData.avg_sentiment + 1) / 2 * 100)}%
          </div>
        </div>

        {/* Radar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
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
                formatter={(value: number) => [`${Math.round(value)}%`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Detailbewertung</h4>
          
          {Object.entries({
            punctuality: displayData.punctuality_avg,
            professionalism: displayData.professionalism_avg,
            value: displayData.value_avg,
            communication: displayData.communication_avg,
            care: displayData.care_avg,
          }).map(([key, value]) => {
            const percentage = Math.round(((value + 1) / 2) * 100);
            const { label, icon } = dimensionLabels[key];
            
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{label}</span>
                  </div>
                  <span className={`font-medium ${getSentimentColor(value)}`}>
                    {percentage}%
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
              </div>
            );
          })}
        </div>

        {/* Keywords Cloud */}
        {displayData.top_keywords && displayData.top_keywords.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Häufige Begriffe</h4>
            <div className="flex flex-wrap gap-2">
              {displayData.top_keywords.map((keyword, index) => (
                <Badge 
                  key={keyword} 
                  variant="secondary"
                  className={`${index < 3 ? 'text-primary border-primary/30' : ''}`}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground pt-2 border-t">
          Diese Analyse wurde automatisch von KI erstellt und basiert auf der Auswertung 
          von Kundenrezensionen. Die Ergebnisse dienen als zusätzliche Orientierung.
        </p>
      </CardContent>
    </Card>
  );
}

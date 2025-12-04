import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown, TrendingUp, MessageSquare, Award } from "lucide-react";

interface ReviewStat {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

interface CompanyReviewSummaryProps {
  companyName: string;
  rating: number;
  reviewCount: number;
  responseRate?: number;
  avgResponseTime?: string;
}

const reviewStats: ReviewStat[] = [
  { category: "Pünktlichkeit", score: 4.8, trend: "up" },
  { category: "Sorgfalt", score: 4.7, trend: "stable" },
  { category: "Preis-Leistung", score: 4.5, trend: "up" },
  { category: "Kommunikation", score: 4.6, trend: "stable" },
  { category: "Freundlichkeit", score: 4.9, trend: "up" },
];

const recentHighlights = [
  { type: "positive", text: "Sehr professionell und pünktlich", count: 45 },
  { type: "positive", text: "Faire Preise", count: 38 },
  { type: "positive", text: "Sorgfältiger Umgang", count: 32 },
  { type: "neutral", text: "Kommunikation könnte besser sein", count: 8 },
];

export const CompanyReviewSummary = ({
  companyName,
  rating,
  reviewCount,
  responseRate = 92,
  avgResponseTime = "< 24h"
}: CompanyReviewSummaryProps) => {
  const ratingDistribution = [
    { stars: 5, percentage: 68, count: Math.round(reviewCount * 0.68) },
    { stars: 4, percentage: 22, count: Math.round(reviewCount * 0.22) },
    { stars: 3, percentage: 7, count: Math.round(reviewCount * 0.07) },
    { stars: 2, percentage: 2, count: Math.round(reviewCount * 0.02) },
    { stars: 1, percentage: 1, count: Math.round(reviewCount * 0.01) },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Bewertungsübersicht
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{rating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {reviewCount} Bewertungen
            </p>
          </div>
          
          <div className="flex-1 space-y-1">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2">
                <span className="text-xs w-8 text-right">{dist.stars} ★</span>
                <Progress value={dist.percentage} className="h-2 flex-1" />
                <span className="text-xs w-16 text-muted-foreground">
                  {dist.percentage}% ({dist.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Bewertung nach Kategorien</h4>
          <div className="grid gap-2">
            {reviewStats.map((stat) => (
              <div key={stat.category} className="flex items-center gap-3">
                <span className="text-sm flex-1">{stat.category}</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(stat.score / 5) * 100} 
                    className="w-20 h-2"
                  />
                  <span className={`text-sm font-medium w-8 ${
                    stat.score >= 4.5 ? 'text-green-600' : 
                    stat.score >= 4 ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {stat.score.toFixed(1)}
                  </span>
                  {stat.trend === 'up' && (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Highlights */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Häufig erwähnt</h4>
          <div className="flex flex-wrap gap-2">
            {recentHighlights.map((highlight, idx) => (
              <Badge 
                key={idx}
                variant="outline"
                className={`gap-1 ${
                  highlight.type === 'positive' 
                    ? 'border-green-200 text-green-700 bg-green-50' 
                    : 'border-amber-200 text-amber-700 bg-amber-50'
                }`}
              >
                {highlight.type === 'positive' ? (
                  <ThumbsUp className="h-3 w-3" />
                ) : (
                  <MessageSquare className="h-3 w-3" />
                )}
                {highlight.text}
                <span className="text-xs opacity-70">({highlight.count})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Response Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{responseRate}%</div>
            <div className="text-xs text-muted-foreground">Antwortrate</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{avgResponseTime}</div>
            <div className="text-xs text-muted-foreground">Ø Antwortzeit</div>
          </div>
        </div>

        {/* Award Badge */}
        {rating >= 4.5 && reviewCount >= 50 && (
          <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <Award className="h-8 w-8 text-amber-500" />
            <div>
              <div className="font-medium text-amber-700 dark:text-amber-400">
                Top-bewertete Firma
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-500">
                Gehört zu den bestbewerteten Umzugsfirmen der Schweiz
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyReviewSummary;

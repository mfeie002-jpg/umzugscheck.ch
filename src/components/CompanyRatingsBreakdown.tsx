import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RatingCategory {
  name: string;
  score: number;
  trend: "up" | "down" | "stable";
}

interface CompanyRatingsBreakdownProps {
  companyName: string;
  overallRating: number;
  totalReviews: number;
  categories?: RatingCategory[];
}

const defaultCategories: RatingCategory[] = [
  { name: "Pünktlichkeit", score: 4.8, trend: "up" },
  { name: "Sorgfalt", score: 4.6, trend: "stable" },
  { name: "Preis-Leistung", score: 4.4, trend: "up" },
  { name: "Kommunikation", score: 4.7, trend: "stable" },
  { name: "Freundlichkeit", score: 4.9, trend: "up" },
];

const ratingDistribution = [
  { stars: 5, percentage: 68 },
  { stars: 4, percentage: 22 },
  { stars: 3, percentage: 7 },
  { stars: 2, percentage: 2 },
  { stars: 1, percentage: 1 },
];

export const CompanyRatingsBreakdown = ({
  companyName,
  overallRating,
  totalReviews,
  categories = defaultCategories,
}: CompanyRatingsBreakdownProps) => {
  const getTrendIcon = (trend: RatingCategory["trend"]) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "down": return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 4.0) return "text-blue-600";
    if (score >= 3.5) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Bewertungen für {companyName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{overallRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(overallRating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalReviews} Bewertungen
            </p>
          </div>
          
          {/* Rating Distribution */}
          <div className="flex-1 space-y-1">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2">
                <span className="text-xs w-8 text-right">{dist.stars} ★</span>
                <Progress value={dist.percentage} className="h-2 flex-1" />
                <span className="text-xs w-10 text-muted-foreground">
                  {dist.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Bewertung nach Kategorien</h4>
          <div className="grid gap-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center gap-3">
                <span className="text-sm flex-1">{category.name}</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(category.score / 5) * 100} 
                    className="w-24 h-2"
                  />
                  <span className={`text-sm font-medium w-8 ${getScoreColor(category.score)}`}>
                    {category.score.toFixed(1)}
                  </span>
                  {getTrendIcon(category.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyRatingsBreakdown;

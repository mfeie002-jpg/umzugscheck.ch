import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { rating: number; count: number }[];
  serviceRatings?: {
    punctuality?: number;
    professionalism?: number;
    careOfItems?: number;
    communication?: number;
    value?: number;
  };
}

export const ReviewStats = ({
  averageRating,
  totalReviews,
  ratingDistribution,
  serviceRatings,
}: ReviewStatsProps) => {
  const maxCount = Math.max(...ratingDistribution.map((d) => d.count));

  const serviceRatingLabels = {
    punctuality: "Pünktlichkeit",
    professionalism: "Professionalität",
    careOfItems: "Sorgfalt",
    communication: "Kommunikation",
    value: "Preis-Leistung",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Overall Rating */}
        <div className="flex-shrink-0 text-center md:text-left">
          <div className="text-5xl font-bold text-foreground mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Basierend auf {totalReviews} Bewertungen
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const dist = ratingDistribution.find((d) => d.rating === rating);
            const count = dist?.count || 0;
            const percentage = maxCount > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Ratings */}
      {serviceRatings && Object.keys(serviceRatings).length > 0 && (
        <div className="pt-6 border-t border-border">
          <h4 className="font-semibold mb-4">Detailbewertungen</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(serviceRatings).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    {serviceRatingLabels[key as keyof typeof serviceRatingLabels]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={value * 20} className="w-24 h-2" />
                    <span className="text-sm font-medium w-8">
                      {value.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

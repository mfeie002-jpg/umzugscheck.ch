import { motion } from "framer-motion";
import { Star, CheckCircle, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  verified: boolean;
  helpful_count: number;
  profiles?: { full_name: string | null };
}

interface CompanyReviewsProps {
  reviews: Review[];
  companyId: string;
  companyName: string;
}

export const CompanyReviews = ({ reviews, companyName }: CompanyReviewsProps) => {
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => Math.round(r.rating) === stars).length / reviews.length) * 100
      : 0
  }));

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-foreground mb-2">{avgRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${i < Math.round(avgRating) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">{reviews.length} Bewertungen</p>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-3">
                <span className="text-sm w-8">{dist.stars}★</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dist.percentage}%` }}
                    className="h-full bg-yellow-500 rounded-full"
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{dist.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4">Bewertung schreiben</h3>
          <p className="text-muted-foreground mb-4">
            Haben Sie {companyName} für Ihren Umzug genutzt? Teilen Sie Ihre Erfahrung!
          </p>
          <Button className="w-fit gap-2">
            <MessageSquare className="h-4 w-4" />
            Bewertung schreiben
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Noch keine Bewertungen vorhanden</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {review.profiles?.full_name || "Anonymer Nutzer"}
                    </span>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Verifiziert
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(review.created_at), "dd. MMMM yyyy", { locale: de })}
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="font-medium mb-2">{review.title}</h4>
              <p className="text-muted-foreground">{review.comment}</p>

              <div className="mt-4 pt-4 border-t border-border flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                  <ThumbsUp className="h-4 w-4" />
                  Hilfreich ({review.helpful_count || 0})
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

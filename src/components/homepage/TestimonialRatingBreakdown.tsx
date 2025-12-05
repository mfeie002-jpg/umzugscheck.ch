import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ratingData = [
  { stars: 5, count: 1847, percentage: 65 },
  { stars: 4, count: 712, percentage: 25 },
  { stars: 3, count: 199, percentage: 7 },
  { stars: 2, count: 57, percentage: 2 },
  { stars: 1, count: 32, percentage: 1 }
];

export const TestimonialRatingBreakdown = () => {
  const totalReviews = ratingData.reduce((sum, r) => sum + r.count, 0);
  const avgRating = (ratingData.reduce((sum, r) => sum + r.stars * r.count, 0) / totalReviews).toFixed(1);

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">{avgRating}</div>
          <div className="flex items-center gap-1 justify-center my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(Number(avgRating)) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{totalReviews.toLocaleString()} Bewertungen</p>
        </div>

        <div className="flex-1 space-y-2">
          {ratingData.map((rating) => (
            <div key={rating.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{rating.stars}</span>
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${rating.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 * (5 - rating.stars) }}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {rating.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">98%</div>
          <p className="text-xs text-muted-foreground">Würden empfehlen</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">4.2h</div>
          <p className="text-xs text-muted-foreground">Ø Antwortzeit</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">100%</div>
          <p className="text-xs text-muted-foreground">Verifiziert</p>
        </div>
      </div>
    </div>
  );
};

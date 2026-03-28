import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ThumbsUp, Calendar } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
  highlight?: string;
}

interface ReviewHighlightsProps {
  companyName: string;
  reviews?: Review[];
}

const defaultReviews: Review[] = [
  {
    id: "1",
    author: "M. Keller",
    rating: 5,
    text: "Absolut professioneller Umzug! Das Team war pünktlich, freundlich und hat alles sorgfältig behandelt. Kann ich nur weiterempfehlen!",
    date: "vor 2 Wochen",
    helpful: 12,
    highlight: "Professionell",
  },
  {
    id: "2",
    author: "S. Brunner",
    rating: 5,
    text: "Sehr zufrieden mit dem Service. Faire Preise und schnelle Arbeit. Die Möbel waren alle unbeschädigt.",
    date: "vor 1 Monat",
    helpful: 8,
    highlight: "Faire Preise",
  },
  {
    id: "3",
    author: "P. Schmid",
    rating: 4,
    text: "Guter Service insgesamt. Kleine Verzögerung am Anfang, aber danach lief alles reibungslos.",
    date: "vor 2 Monaten",
    helpful: 5,
    highlight: "Zuverlässig",
  },
];

const ReviewHighlights = ({ companyName, reviews = defaultReviews }: ReviewHighlightsProps) => {
  const topReviews = reviews.slice(0, 3);
  const avgRating = topReviews.reduce((acc, r) => acc + r.rating, 0) / topReviews.length;

  // Extract common positive themes
  const themes = ["Pünktlich", "Professionell", "Sorgfältig", "Freundlich"];

  return (
    <Card className="border bg-gradient-to-br from-white to-accent/5">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-accent" />
            <span className="font-medium text-sm">Kundenstimmen</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-semibold">{avgRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Theme Tags */}
        <div className="flex flex-wrap gap-1">
          {themes.map(theme => (
            <Badge key={theme} variant="secondary" className="text-xs bg-accent/10 text-accent-foreground">
              {theme}
            </Badge>
          ))}
        </div>

        {/* Featured Reviews */}
        <div className="space-y-3">
          {topReviews.map((review, index) => (
            <div 
              key={review.id}
              className={`p-3 rounded-lg ${index === 0 ? "bg-accent/10 border border-accent/20" : "bg-muted/30"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{review.author}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    "{review.text}"
                  </p>
                </div>
                {review.highlight && index === 0 && (
                  <Badge className="bg-green-100 text-green-700 text-xs shrink-0">
                    {review.highlight}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {review.date}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {review.helpful} fanden dies hilfreich
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* See All Link */}
        <button className="text-sm text-primary hover:underline w-full text-center">
          Alle {reviews.length} Bewertungen ansehen →
        </button>
      </CardContent>
    </Card>
  );
};

export default ReviewHighlights;

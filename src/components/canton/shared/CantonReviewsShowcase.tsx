import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, MapPin, CheckCircle } from "lucide-react";

interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  company: string;
  verified: boolean;
}

interface CantonReviewsShowcaseProps {
  cantonName: string;
  reviews: Review[];
}

export const CantonReviewsShowcase = ({ cantonName, reviews }: CantonReviewsShowcaseProps) => (
  <section className="py-12 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Kundenbewertungen aus {cantonName}</h2>
        <p className="text-muted-foreground">Echte Erfahrungen von Kunden aus der Region</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((review, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <Quote className="h-6 w-6 text-primary/20 mb-2" />
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{review.text}</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{review.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {review.location}
                    </div>
                  </div>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-xs text-success">
                      <CheckCircle className="h-3 w-3" />
                      Verifiziert
                    </div>
                  )}
                </div>
                <p className="text-xs text-primary mt-2">{review.company}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

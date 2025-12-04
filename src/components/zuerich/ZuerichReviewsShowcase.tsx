import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, CheckCircle, ThumbsUp } from "lucide-react";

const reviews = [
  { author: "M. Keller", rating: 5, text: "Bester Umzugsservice in Zürich! Pünktlich, freundlich und professionell.", company: "Zürich Umzüge AG", date: "vor 1 Woche", helpful: 12, verified: true },
  { author: "S. Meier", rating: 5, text: "Preis-Leistung top! Haben alles sorgfältig transportiert.", company: "Limmattal Moving", date: "vor 2 Wochen", helpful: 8, verified: true },
  { author: "T. Brunner", rating: 4, text: "Sehr zufrieden, kleine Verspätung aber sonst alles perfekt.", company: "Zürisee Transporte", date: "vor 3 Wochen", helpful: 5, verified: true },
  { author: "A. Lehmann", rating: 5, text: "Absolute Empfehlung! Das Team war super organisiert.", company: "Glatttal Umzüge", date: "vor 1 Monat", helpful: 15, verified: true },
];

export const ZuerichReviewsShowcase = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Aktuelle Bewertungen aus Zürich</h2>
            <p className="text-muted-foreground">Was Kunden über Zürcher Umzugsfirmen sagen</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">4.8</span>
            <span className="text-muted-foreground">/ 5 (1'234 Bewertungen)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{review.author}</span>
                          {review.verified && <CheckCircle className="h-3 w-3 text-success" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{review.company}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`h-4 w-4 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm mb-3">"{review.text}"</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{review.date}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{review.helpful} hilfreich</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

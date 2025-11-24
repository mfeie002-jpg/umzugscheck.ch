import { Star, Quote, CheckCircle2, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  {
    name: "Familie Müller",
    location: "Zürich",
    rating: 5,
    text: "Der KI-Preisrechner war unglaublich genau! Wir haben genau die Offerte erhalten, die prognostiziert wurde. Sehr transparent und professionell.",
    date: "vor 2 Wochen",
    verified: true
  },
  {
    name: "Thomas K.",
    location: "Bern",
    rating: 5,
    text: "Familienunternehmen mit Herz! Die persönliche Betreuung war top, und durch den Vergleich haben wir 30% gespart. Absolut empfehlenswert!",
    date: "vor 1 Monat",
    verified: true
  },
  {
    name: "Sarah L.",
    location: "Basel",
    rating: 5,
    text: "Schnell, einfach und transparent. Die Umzugsfirma war pünktlich, freundlich und professionell. Der ganze Prozess war stressfrei.",
    date: "vor 3 Wochen",
    verified: true
  }
];

export const ReviewsShowcase = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-warning/10 px-4 py-2 rounded-full text-sm font-semibold text-warning mb-6">
            <Award className="w-5 h-5" />
            <span>Verifizierte Bewertungen</span>
          </div>
          <h2 className="mb-6">Was unsere Kunden sagen</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-warning text-warning" />
              ))}
            </div>
            <span className="text-3xl font-bold">4.9/5</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Basierend auf <strong className="text-foreground">2'847 echten Kundenbewertungen</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="border-2 border-border hover:border-warning/30 hover-lift transition-all relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-warning/20 mb-4" />
                
                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                
                {/* Review text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{review.text}"
                </p>
                
                {/* Reviewer info */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {review.name}
                      {review.verified && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{review.location}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{review.date}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Weiterempfehlung</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">2'847</div>
            <div className="text-sm text-muted-foreground">Bewertungen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-success mb-2">4.9</div>
            <div className="text-sm text-muted-foreground">Durchschnitt</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-warning mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Verifiziert</div>
          </div>
        </div>
      </div>
    </section>
  );
};
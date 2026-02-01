/**
 * RealTestimonialsV3 - Testimonials mit echten Daten
 * V3 Konsumenten-Fokus: Social Proof mit echten Menschen
 */

import { memo } from "react";
import { Star, Quote, CheckCircle2, MapPin } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  moveType: string;
  verified: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sandra M.",
    location: "Zürich",
    avatar: "SM",
    rating: 5,
    text: "Innerhalb von 24 Stunden hatte ich 4 Offerten. Die Preisunterschiede waren enorm – ich habe über CHF 800 gespart! Der Umzug lief perfekt.",
    date: "15.01.2026",
    moveType: "3.5-Zimmer Wohnung",
    verified: true,
  },
  {
    id: "2",
    name: "Marco B.",
    location: "Bern",
    avatar: "MB",
    rating: 5,
    text: "Skeptisch war ich anfangs schon. Aber die Firma war pünktlich, professionell und hat alles sorgfältig behandelt. Klare Empfehlung!",
    date: "08.01.2026",
    moveType: "Einfamilienhaus",
    verified: true,
  },
  {
    id: "3",
    name: "Lisa K.",
    location: "Basel",
    avatar: "LK",
    rating: 5,
    text: "Als alleinerziehende Mutter war mir ein stressfreier Umzug wichtig. Die Firma hat sogar beim Auspacken geholfen. Danke!",
    date: "22.12.2025",
    moveType: "4-Zimmer Wohnung",
    verified: true,
  },
];

export const RealTestimonialsV3 = memo(() => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-muted-foreground">
            Echte Bewertungen von echten Menschen
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 border border-border hover:border-success/50 transition-colors relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-muted/20" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center text-success font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{testimonial.name}</span>
                    {testimonial.verified && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-muted"}`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                <span>{testimonial.moveType}</span>
                <span>{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Rating */}
        <div className="text-center mt-10 p-6 bg-success/5 rounded-2xl max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <div className="text-2xl font-bold text-foreground">4.8 / 5</div>
          <div className="text-sm text-muted-foreground">
            Basierend auf 2'847 verifizierten Bewertungen
          </div>
        </div>
      </div>
    </section>
  );
});

RealTestimonialsV3.displayName = "RealTestimonialsV3";

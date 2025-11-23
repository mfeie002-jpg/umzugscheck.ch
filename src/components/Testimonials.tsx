import { Star, Quote, CheckCircle2, TrendingDown, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Zürich → Bern",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    date: "Vor 2 Wochen",
    comment: "Ich konnte CHF 850 bei meinem Umzug sparen! Die Vergleichsplattform hat mir in nur 2 Minuten 5 Offerten geliefert. Alle Firmen waren professionell und der Service war top.",
    highlight: "CHF 850 gespart",
    highlightIcon: TrendingDown,
    verified: true
  },
  {
    id: 2,
    name: "Michael K.",
    location: "Basel → Winterthur",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    date: "Vor 1 Woche",
    comment: "Super einfach und transparent! Keine versteckten Kosten. Die Umzugsfirma war pünktlich, freundlich und hat alles perfekt erledigt. Würde ich jederzeit wieder nutzen.",
    highlight: "5 Sterne Service",
    highlightIcon: Star,
    verified: true
  },
  {
    id: 3,
    name: "Anna L.",
    location: "Luzern → Genf",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    date: "Vor 3 Tagen",
    comment: "Innerhalb von 24 Stunden hatte ich bereits 4 konkrete Angebote. Die Preisunterschiede waren enorm! Dank Umzugscheck.ch habe ich die beste Firma zum besten Preis gefunden.",
    highlight: "In 24h Angebote",
    highlightIcon: Clock,
    verified: true
  }
];

export const Testimonials = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verifizierte Kundenbewertungen</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Das sagen unsere zufriedenen Kunden
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Über 12'000 Kunden haben bereits erfolgreich verglichen und gespart
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-accent" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-foreground leading-relaxed text-sm">
                  "{testimonial.comment}"
                </p>

                {/* Highlight Badge */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-success/10 to-success/5 border border-success/20">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <testimonial.highlightIcon className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm font-semibold text-success">
                    {testimonial.highlight}
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      {testimonial.verified && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-white border border-border">
            <div className="text-3xl font-bold text-primary mb-1">4.8/5</div>
            <div className="text-sm text-muted-foreground">Ø Bewertung</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-border">
            <div className="text-3xl font-bold text-primary mb-1">12'000+</div>
            <div className="text-sm text-muted-foreground">Zufriedene Kunden</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-border">
            <div className="text-3xl font-bold text-primary mb-1">98%</div>
            <div className="text-sm text-muted-foreground">Weiterempfehlung</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-border">
            <div className="text-3xl font-bold text-primary mb-1">CHF 700</div>
            <div className="text-sm text-muted-foreground">Ø Ersparnis</div>
          </div>
        </div>
      </div>
    </section>
  );
};

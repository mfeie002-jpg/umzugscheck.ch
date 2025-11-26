import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const reviews = [
  {
    name: "Sarah M.",
    location: "Zürich",
    rating: 5,
    text: "Sehr einfach und transparent. Habe 35% gespart im Vergleich zur ersten Offerte!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
  },
  {
    name: "Thomas K.",
    location: "Bern",
    rating: 5,
    text: "Schnell, unkompliziert und die Firmen waren wirklich top. Kann ich nur empfehlen.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
  },
  {
    name: "Maria L.",
    location: "Basel",
    rating: 5,
    text: "Endlich kann man Umzugsfirmen einfach vergleichen. Hat mir viel Zeit gespart!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
  },
  {
    name: "Andreas F.",
    location: "Luzern",
    rating: 5,
    text: "Professioneller Service und faire Preise. Die Firma war pünktlich und zuverlässig.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
  },
  {
    name: "Julia S.",
    location: "St. Gallen",
    rating: 5,
    text: "Kostenlos und ohne versteckte Gebühren. Genau was ich gesucht habe!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"
  },
];

export const SocialProofBlock = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Was unsere Nutzer sagen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Über 15'000 zufriedene Kunden vertrauen auf Umzugscheck.ch
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {reviews.slice(0, 3).map((review, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-foreground">{review.name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
              </div>
              <Quote className="h-6 w-6 text-primary/20 mb-2" />
              <p className="text-foreground/80 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Bekannt aus & geprüft von:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <img src="/lovable-uploads/d4aa8c36-01f9-47b7-8e18-bd2a8e22467a.png" alt="Google" className="h-8 grayscale hover:grayscale-0 transition-all" />
            <span className="text-2xl font-bold text-foreground/40">ProvenExpert</span>
            <span className="text-2xl font-bold text-foreground/40">Trustpilot</span>
          </div>
        </div>
      </div>
    </section>
  );
};

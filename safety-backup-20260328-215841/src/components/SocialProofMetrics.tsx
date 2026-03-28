import { TrendingUp, Users, Star, CheckCircle } from "lucide-react";

const metrics = [
  {
    icon: Users,
    value: "15'000+",
    label: "Vermittelte Umzüge",
    description: "Zufriedene Kunden schweizweit"
  },
  {
    icon: Star,
    value: "4.8/5",
    label: "Durchschnittsbewertung",
    description: "Über 3'200 echte Kundenbewertungen"
  },
  {
    icon: CheckCircle,
    value: "150+",
    label: "Geprüfte Umzugsfirmen",
    description: "In allen 26 Kantonen"
  },
  {
    icon: TrendingUp,
    value: "40%",
    label: "Durchschnittliche Ersparnis",
    description: "Im Vergleich zu Direktbuchung"
  }
];

const testimonials = [
  {
    name: "M. Weber",
    location: "Zürich",
    rating: 5,
    text: "Super Service! Innert weniger Stunden hatte ich 4 Offerten. Die Firma war pünktlich und professionell. Absolut empfehlenswert!",
    date: "vor 2 Wochen"
  },
  {
    name: "S. Müller",
    location: "Bern",
    rating: 5,
    text: "Dank Umzugscheck.ch habe ich über 600 CHF gespart. Der Vergleich war einfach und schnell. Würde ich jederzeit wieder nutzen!",
    date: "vor 1 Monat"
  },
  {
    name: "A. Schneider",
    location: "Basel",
    rating: 5,
    text: "Transparente Preise und hervorragende Beratung. Die empfohlene Firma hat alle Erwartungen übertroffen. Danke!",
    date: "vor 3 Wochen"
  },
  {
    name: "L. Fischer",
    location: "Luzern",
    rating: 5,
    text: "Unkompliziert und zuverlässig. Von der Anfrage bis zum Umzug lief alles perfekt. Sehr zu empfehlen!",
    date: "vor 1 Woche"
  }
];

export const SocialProofMetrics = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Metrics Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="mb-4">Umzugscheck.ch in Zahlen</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Vertrauen Sie der führenden Vergleichsplattform für Umzüge in der Schweiz
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 border border-border hover:shadow-medium transition-smooth"
              >
                <div className="inline-flex w-16 h-16 rounded-2xl gradient-hero items-center justify-center mb-4">
                  <metric.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {metric.value}
                </div>
                <div className="font-semibold text-lg mb-1">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Das sagen unsere Kunden</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Echte Bewertungen von echten Kunden – transparent und unverfälscht
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white border border-border rounded-xl p-6 shadow-soft hover:shadow-medium transition-smooth"
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground leading-relaxed mb-4 italic">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{testimonial.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

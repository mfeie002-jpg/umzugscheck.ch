import { Link } from "react-router-dom";
import { Star, ArrowRight, Quote } from "lucide-react";
import { Card } from "./ui/card";
import AnimatedSection from "./AnimatedSection";

interface TestimonialData {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  date: string;
}

const testimonials: TestimonialData[] = [
  {
    name: "Familie Müller",
    location: "Zürich → Winterthur",
    rating: 5,
    text: "Ein perfekt organisierter Umzug! Das Team war pünktlich, freundlich und hat alles mit grösster Sorgfalt behandelt. Wir würden Feierabend Umzüge jederzeit weiterempfehlen.",
    service: "Familienumzug",
    date: "November 2024"
  },
  {
    name: "Dr. Thomas Keller",
    location: "Basel",
    rating: 5,
    text: "Als Sammler von Antiquitäten war ich zunächst skeptisch. Aber das Team hat alle meine wertvollen Stücke mit höchster Professionalität behandelt. Absolut empfehlenswert!",
    service: "VIP Service",
    date: "Oktober 2024"
  },
  {
    name: "Startup Hub AG",
    location: "Bern → Zürich",
    rating: 5,
    text: "Unser Büroumzug verlief reibungslos. Das Team hat die IT-Infrastruktur fachmännisch ab- und wieder aufgebaut. Am Montag konnten alle produktiv arbeiten.",
    service: "Büroumzug",
    date: "September 2024"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            Kundenstimmen
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
            Das sagen unsere <span className="text-gradient">Kunden</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Über 10'000 zufriedene Kunden vertrauen uns seit 1980
          </p>
        </AnimatedSection>

        {/* Rating summary */}
        <AnimatedSection delay={0.1} className="flex justify-center items-center gap-4 mb-12">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-lg">
            <span className="font-bold">4.9/5</span>
            <span className="text-muted-foreground"> basierend auf 247 Bewertungen</span>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Card className="p-6 h-full flex flex-col">
                <Quote className="w-10 h-10 text-alpine/20 mb-4" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 flex-grow">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t border-border pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-alpine/10 text-alpine rounded">
                      {testimonial.service}
                    </span>
                    <span>{testimonial.date}</span>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center">
          <Link
            to="/references"
            className="inline-flex items-center text-alpine font-medium hover:underline"
          >
            Alle Referenzen ansehen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

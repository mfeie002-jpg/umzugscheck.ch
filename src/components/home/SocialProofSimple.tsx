import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Zürich",
    rating: 5,
    text: "Super Service! Habe 3 Offerten erhalten und über CHF 800 gespart. Kann ich nur empfehlen!",
  },
  {
    name: "Marco B.",
    location: "Bern",
    rating: 5,
    text: "Sehr einfach und schnell. Innerhalb von 24 Stunden hatte ich mehrere Angebote und konnte vergleichen.",
  },
  {
    name: "Julia K.",
    location: "Basel",
    rating: 5,
    text: "Professionelle Firmen, faire Preise. Der Umzug lief reibungslos. Danke!",
  },
];

export const SocialProofSimple = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Was unsere Nutzer sagen
          </h2>
          <p className="text-lg text-muted-foreground">
            Über 15'000 zufriedene Kunden in der ganzen Schweiz
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-medium transition-shadow duration-300 border-border/50">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-accent/30" />
                  
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-foreground/90 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Review Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 opacity-60"
        >
          <div className="text-sm font-medium">Bewertet auf:</div>
          <div className="font-bold text-lg">Google Reviews</div>
          <div className="font-bold text-lg">ProvenExpert</div>
          <div className="font-bold text-lg">Trustpilot</div>
        </motion.div>
      </div>
    </section>
  );
};

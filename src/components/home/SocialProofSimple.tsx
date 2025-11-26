import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Shield } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Thomas M.",
    location: "Zürich",
    rating: 5,
    text: "Superschnell, faire Preise und professionelle Firmen. Genau so sollte ein Umzug laufen!"
  },
  {
    name: "Sarah K.",
    location: "Bern",
    rating: 5,
    text: "Die AI-Preisberechnung war genau! Drei Angebote erhalten und die beste Firma gewählt."
  },
  {
    name: "Marco R.",
    location: "Basel",
    rating: 5,
    text: "Transparent, keine versteckten Kosten. Die Vergleichsfunktion hat uns viel Geld gespart."
  },
  {
    name: "Lisa B.",
    location: "Luzern",
    rating: 5,
    text: "Einfacher geht's nicht. In 2 Minuten alle Infos eingegeben und am nächsten Tag Offerten erhalten."
  },
  {
    name: "Peter S.",
    location: "St. Gallen",
    rating: 5,
    text: "Alle Firmen waren geprüft und versichert. Das gibt ein gutes Gefühl beim Umzug."
  }
];

export const SocialProofSimple = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Vertrauen durch echte Schweizer Kunden
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-8 max-w-7xl mx-auto items-center">
          
          {/* Reviews Slider */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max lg:grid lg:grid-cols-3 lg:min-w-0">
              {testimonials.slice(0, 5).map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-[280px] lg:w-auto"
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        "{testimonial.text}"
                      </p>
                      <div className="text-xs font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-soft">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="font-semibold text-foreground">Google Reviews</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-soft">
              <Shield className="h-6 w-6 text-success" />
              <span className="font-semibold text-foreground">Verifizierte Firmen</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-soft">
              <Quote className="h-6 w-6 text-secondary" />
              <span className="font-semibold text-foreground">Schweizer Plattform</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

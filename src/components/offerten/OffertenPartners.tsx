import { Star, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const partners = [
  {
    id: 1,
    name: "Umzug Profi Zürich AG",
    rating: 4.9,
    reviewCount: 342,
    description: "Spezialist für Privat- und Firmenumzüge im Grossraum Zürich. Über 20 Jahre Erfahrung.",
    badges: ["Geprüft", "Top bewertet"],
    slug: "umzug-profi-zuerich",
  },
  {
    id: 2,
    name: "SwissMove GmbH",
    rating: 4.8,
    reviewCount: 289,
    description: "Schweizweite Umzüge mit Fokus auf Qualität und Kundenzufriedenheit.",
    badges: ["Express verfügbar"],
    slug: "swissmove",
  },
  {
    id: 3,
    name: "Bern Umzüge",
    rating: 4.7,
    reviewCount: 198,
    description: "Ihr lokaler Partner für Umzüge in und um Bern. Faire Preise, zuverlässiger Service.",
    badges: ["Versichert"],
    slug: "bern-umzuege",
  },
  {
    id: 4,
    name: "Zügelexpress Basel",
    rating: 4.8,
    reviewCount: 256,
    description: "Schnelle und professionelle Umzüge in der Region Basel. Auch kurzfristig verfügbar.",
    badges: ["Geprüft", "Express"],
    slug: "zuegelexpress-basel",
  },
];

const OffertenPartners = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-muted"}`}
      />
    ));
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top-Partner für Ihren Umzug
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unsere bestbewerteten Umzugsfirmen mit nachgewiesener Qualität.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                <CardContent className="p-5">
                  {/* Logo Placeholder */}
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <Building2 className="w-7 h-7 text-muted-foreground" />
                  </div>

                  {/* Name & Rating */}
                  <h3 className="font-manrope text-lg font-semibold text-foreground mb-2">
                    {partner.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(partner.rating)}</div>
                    <span className="text-sm font-medium text-foreground">{partner.rating}</span>
                    <span className="text-sm text-muted-foreground">({partner.reviewCount})</span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {partner.badges.map((badge, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-5 line-clamp-2">
                    {partner.description}
                  </p>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <Button asChild className="w-full" size="sm">
                      <Link to={`/umzugsfirmen/${partner.slug}`}>
                        Offerte anfordern
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link to={`/umzugsfirmen/${partner.slug}`}>
                        Firma ansehen
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/firmen" className="flex items-center gap-2">
              Alle Firmen anzeigen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OffertenPartners;

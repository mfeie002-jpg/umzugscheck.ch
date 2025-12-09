import { memo } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, Shield, Wrench, Sparkles, ArrowRight, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const exampleOffers = [
  {
    name: "Zürich Umzug Pro",
    priceRange: "CHF 1'200 – 1'600",
    rating: 4.9,
    reviews: 234,
    tags: ["Versichert", "Fixpreis möglich", "Reinigung"],
    highlights: ["Erfahrenes Team mit 15+ Jahren", "Umzugshelfer inkl. Verpackungsmaterial", "Kostenlose Besichtigung"],
    recommended: true,
    responseTime: "< 2 Std.",
  },
  {
    name: "Family Move Bern",
    priceRange: "CHF 1'350 – 1'750",
    rating: 4.8,
    reviews: 189,
    tags: ["Versichert", "Möbelmontage", "Wochenende"],
    highlights: ["Familienunternehmen", "Flexible Terminwahl", "Schweizweiter Service"],
    recommended: false,
    responseTime: "< 4 Std.",
  },
  {
    name: "Express Umzüge Basel",
    priceRange: "CHF 1'100 – 1'450",
    rating: 4.7,
    reviews: 156,
    tags: ["Versichert", "Schnell verfügbar", "Entsorgung"],
    highlights: ["Kurzfristige Termine", "Faire Pauschalpreise", "Umweltfreundliche Entsorgung"],
    recommended: false,
    responseTime: "< 3 Std.",
  },
];

export const CompanyComparisonSection = memo(function CompanyComparisonSection() {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4" />
            Firmen vergleichen
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            So vergleichen Sie mit{" "}
            <span className="text-secondary">Umzugscheck</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Statt nur eine Firma anzufragen, sehen Sie mehrere Angebote auf einen Blick. Sie sparen Zeit, Geld und Nerven.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {exampleOffers.map((offer, index) => (
            <motion.div
              key={offer.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative bg-card rounded-2xl border shadow-soft overflow-hidden transition-all duration-300 hover:shadow-premium",
                offer.recommended 
                  ? "border-secondary ring-2 ring-secondary/20" 
                  : "border-border hover:border-primary/30"
              )}
            >
              {/* Recommended Badge */}
              {offer.recommended && (
                <div className="absolute top-0 left-0 right-0 bg-secondary text-secondary-foreground text-center py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Empfohlen
                </div>
              )}

              <div className={cn("p-6", offer.recommended && "pt-10")}>
                {/* Company Name & Rating */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">{offer.name}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-swiss-gold fill-swiss-gold" />
                      <span className="font-semibold text-sm">{offer.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({offer.reviews} Bewertungen)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <div className="text-xs text-muted-foreground mb-1">Geschätzter Preis</div>
                  <div className="text-xl font-bold text-primary">{offer.priceRange}</div>
                </div>

                {/* Response Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Antwortzeit: {offer.responseTime}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {offer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-muted text-muted-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Highlights */}
                <ul className="space-y-2 mb-6">
                  {offer.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  asChild
                  className={cn(
                    "w-full",
                    offer.recommended 
                      ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta" 
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  <Link to="/umzugsofferten">
                    Offerte anfragen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Text */}
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-6">
            <strong className="text-foreground">Hinweis:</strong> Die angezeigten Firmen und Preise sind Beispiele. 
            Nach Ihrer Anfrage erhalten Sie echte Offerten von geprüften Umzugsfirmen in Ihrer Region.
          </p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 shadow-cta">
            <Link to="/umzugsofferten">
              <CheckCircle className="w-5 h-5 mr-2" />
              Jetzt echte Offerten erhalten
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

import { memo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, CheckCircle, Sparkles, ArrowRight, Clock, Award, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const exampleOffers = [
  {
    name: "Zürich Umzug Pro",
    priceRange: "CHF 1'200 – 1'600",
    priceValue: 1200,
    rating: 4.9,
    reviews: 234,
    tags: ["Versichert", "Fixpreis möglich", "Reinigung"],
    highlights: ["Erfahrenes Team mit 15+ Jahren", "Umzugshelfer inkl. Verpackungsmaterial", "Kostenlose Besichtigung"],
    recommended: true,
    responseTime: "< 2 Std.",
    category: "top",
  },
  {
    name: "Family Move Bern",
    priceRange: "CHF 1'350 – 1'750",
    priceValue: 1350,
    rating: 4.8,
    reviews: 189,
    tags: ["Versichert", "Möbelmontage", "Wochenende"],
    highlights: ["Familienunternehmen", "Flexible Terminwahl", "Schweizweiter Service"],
    recommended: false,
    responseTime: "< 4 Std.",
    category: "beliebt",
  },
  {
    name: "Express Umzüge Basel",
    priceRange: "CHF 1'100 – 1'450",
    priceValue: 1100,
    rating: 4.7,
    reviews: 156,
    tags: ["Versichert", "Schnell verfügbar", "Entsorgung"],
    highlights: ["Kurzfristige Termine", "Faire Pauschalpreise", "Umweltfreundliche Entsorgung"],
    recommended: false,
    responseTime: "< 3 Std.",
    category: "günstig",
  },
];

type SortOption = "empfohlen" | "preis" | "bewertung";
type FilterTab = "alle" | "top" | "günstig" | "beliebt";

export const CompanyComparisonSection = memo(function CompanyComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>("empfohlen");
  const [activeTab, setActiveTab] = useState<FilterTab>("alle");
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.98, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 1]);

  // Filter and sort offers
  const filteredOffers = exampleOffers
    .filter(offer => activeTab === "alle" || offer.category === activeTab)
    .sort((a, b) => {
      if (sortBy === "preis") return a.priceValue - b.priceValue;
      if (sortBy === "bewertung") return b.rating - a.rating;
      return b.recommended ? 1 : -1; // empfohlen
    });

  return (
    <motion.section 
      ref={sectionRef} 
      className="py-16 md:py-24 overflow-hidden"
      style={{ scale, opacity }}
    >
      <div className="container">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4" />
            Firmen vergleichen
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Transparenter{" "}
            <span className="text-secondary">Angebotsvergleich</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sehen Sie mehrere Angebote auf einen Blick – Sie sparen Zeit, Geld und Nerven.
          </p>
        </motion.div>

        {/* Filter & Sort Bar */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-muted/30 rounded-xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="alle" className="text-xs sm:text-sm">Alle</TabsTrigger>
              <TabsTrigger value="top" className="text-xs sm:text-sm">Top Umzüge</TabsTrigger>
              <TabsTrigger value="günstig" className="text-xs sm:text-sm">Günstige</TabsTrigger>
              <TabsTrigger value="beliebt" className="text-xs sm:text-sm">Beliebteste</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sortieren:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="empfohlen">Empfohlen</option>
              <option value="preis">Günstigste</option>
              <option value="bewertung">Beste Bewertung</option>
            </select>
          </div>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.15,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ y: -5 }}
              className={cn(
                "relative bg-card rounded-2xl border shadow-soft overflow-hidden transition-all duration-300 hover:shadow-premium",
                offer.recommended 
                  ? "border-secondary ring-2 ring-secondary/20" 
                  : "border-border hover:border-primary/30"
              )}
            >
              {/* Recommended Badge */}
              {offer.recommended && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 bg-secondary text-secondary-foreground text-center py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Award className="w-3.5 h-3.5" />
                  Empfohlen
                </motion.div>
              )}

              <div className={cn("p-6", offer.recommended && "pt-10")}>
                {/* Company Name & Rating */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{offer.name}</h3>
                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-600/30 bg-green-50">
                      Verifiziert
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-swiss-gold fill-swiss-gold" />
                      <span className="font-semibold text-sm">{offer.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({offer.reviews} Bewertungen)</span>
                  </div>
                </div>

                {/* Price */}
                <motion.div 
                  className="bg-muted/50 rounded-xl p-4 mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs text-muted-foreground mb-1">Geschätzter Preis</div>
                  <div className="text-xl font-bold text-primary">{offer.priceRange}</div>
                </motion.div>

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
                  {offer.highlights.map((highlight, hIndex) => (
                    <motion.li 
                      key={highlight} 
                      className="flex items-start gap-2 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + hIndex * 0.05 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </motion.li>
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-6">
            <strong className="text-foreground">Hinweis:</strong> Die angezeigten Firmen und Preise sind Beispiele. 
            Nach Ihrer Anfrage erhalten Sie echte Offerten von geprüften Umzugsfirmen in Ihrer Region.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 shadow-cta">
              <Link to="/umzugsofferten">
                <CheckCircle className="w-5 h-5 mr-2" />
                Jetzt echte Offerten erhalten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
});

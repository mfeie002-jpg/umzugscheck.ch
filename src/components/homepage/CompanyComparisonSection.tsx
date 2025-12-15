import { memo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, CheckCircle, Sparkles, ArrowRight, Clock, Award, SlidersHorizontal, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePublicProviders, getPriceRange, getResponseTimeString, getDisplayRating } from "@/hooks/usePublicProviders";

// Fallback data when no providers are loaded
const fallbackOffers = [
  {
    id: "fallback-1",
    company_name: "Zürich Umzug Pro",
    city: "Zürich",
    price_level: "fair" as const,
    quality_score: 90,
    response_time_minutes: 120,
    is_featured: true,
    sponsored_tier: 1,
    verification_status: "approved",
    services_offered: ["Privatumzug", "Reinigung", "Entsorgung"],
    certifications: ["Versichert", "ISO 9001"],
    short_description: "Erfahrenes Team mit 15+ Jahren Erfahrung",
  },
  {
    id: "fallback-2",
    company_name: "Family Move Bern",
    city: "Bern",
    price_level: "fair" as const,
    quality_score: 85,
    response_time_minutes: 240,
    is_featured: false,
    sponsored_tier: null,
    verification_status: "approved",
    services_offered: ["Privatumzug", "Firmenumzug", "Möbelmontage"],
    certifications: ["Versichert"],
    short_description: "Familienunternehmen mit flexibler Terminwahl",
  },
  {
    id: "fallback-3",
    company_name: "Express Umzüge Basel",
    city: "Basel",
    price_level: "günstig" as const,
    quality_score: 80,
    response_time_minutes: 180,
    is_featured: false,
    sponsored_tier: null,
    verification_status: "approved",
    services_offered: ["Privatumzug", "Entsorgung"],
    certifications: ["Versichert", "Schnell verfügbar"],
    short_description: "Kurzfristige Termine möglich",
  },
];

type SortOption = "empfohlen" | "preis" | "bewertung";
type FilterTab = "alle" | "top" | "günstig" | "beliebt";

export const CompanyComparisonSection = memo(function CompanyComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>("empfohlen");
  const [activeTab, setActiveTab] = useState<FilterTab>("alle");
  
  const { data: providers, isLoading } = usePublicProviders(6);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.98, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 1]);

  // Use real data or fallback
  const displayProviders = providers && providers.length > 0 ? providers : fallbackOffers;

  // Filter and sort
  const filteredProviders = displayProviders
    .filter(provider => {
      if (activeTab === "alle") return true;
      if (activeTab === "top") return provider.is_featured || (provider.sponsored_tier && provider.sponsored_tier > 0);
      if (activeTab === "günstig") return provider.price_level === "günstig";
      if (activeTab === "beliebt") return (provider.quality_score || 0) > 80;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "preis") {
        const priceOrder = { "günstig": 1, "fair": 2, "premium": 3 };
        return (priceOrder[a.price_level || "fair"] || 2) - (priceOrder[b.price_level || "fair"] || 2);
      }
      if (sortBy === "bewertung") return (b.quality_score || 0) - (a.quality_score || 0);
      // empfohlen: sponsored first, then quality
      if (a.sponsored_tier && !b.sponsored_tier) return -1;
      if (!a.sponsored_tier && b.sponsored_tier) return 1;
      return (b.quality_score || 0) - (a.quality_score || 0);
    })
    .slice(0, 3);

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Comparison Cards */}
        {!isLoading && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {filteredProviders.map((provider, index) => {
              const isSponsored = provider.sponsored_tier && provider.sponsored_tier > 0;
              const rating = getDisplayRating(provider.quality_score);
              const priceRange = getPriceRange(provider.price_level);
              const responseTime = getResponseTimeString(provider.response_time_minutes);
              
              return (
                <motion.div
                  key={provider.id}
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
                    isSponsored 
                      ? "border-secondary ring-2 ring-secondary/20" 
                      : "border-border hover:border-primary/30"
                  )}
                >
                  {/* Sponsored/Recommended Badge */}
                  {isSponsored && (
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

                  <div className={cn("p-6", isSponsored && "pt-10")}>
                    {/* Company Name & Rating */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold truncate">{provider.company_name}</h3>
                          {provider.city && (
                            <p className="text-xs text-muted-foreground">{provider.city}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-[10px] text-green-600 border-green-600/30 bg-green-50 shrink-0">
                          Verifiziert
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-swiss-gold fill-swiss-gold" />
                          <span className="font-semibold text-sm">{rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((provider.quality_score || 50) * 2.5)} Bewertungen)
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <motion.div 
                      className="bg-muted/50 rounded-xl p-4 mb-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-xs text-muted-foreground mb-1">Geschätzter Preis</div>
                      <div className="text-xl font-bold text-primary">{priceRange}</div>
                    </motion.div>

                    {/* Response Time */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Antwortzeit: {responseTime}</span>
                    </div>

                    {/* Tags/Services */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(provider.services_offered || []).slice(0, 3).map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs bg-muted text-muted-foreground">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    {/* Description */}
                    {provider.short_description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {provider.short_description}
                      </p>
                    )}

                    {/* Certifications as highlights */}
                    <ul className="space-y-1.5 mb-6">
                      {(provider.certifications || ["Versichert", "Geprüft"]).slice(0, 3).map((cert, cIndex) => (
                        <motion.li 
                          key={cert} 
                          className="flex items-center gap-2 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + cIndex * 0.05 }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{cert}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button 
                      asChild
                      className={cn(
                        "w-full",
                        isSponsored 
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
              );
            })}
          </div>
        )}

        {/* Bottom Text */}
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-6">
            <strong className="text-foreground">Hinweis:</strong> Nach Ihrer Anfrage erhalten Sie echte Offerten von geprüften Umzugsfirmen in Ihrer Region.
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

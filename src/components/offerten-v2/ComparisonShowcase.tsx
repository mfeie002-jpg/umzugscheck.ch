/**
 * ComparisonShowcase - Mock comparison table showing platform value
 * Demonstrates how users can compare multiple providers
 * 
 * OPTIMIZATIONS:
 * 12. Better table styling with hover effects
 * 13. Improved badge designs
 * 14. Enhanced mobile card view
 */

import { motion } from "framer-motion";
import { Star, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const mockCompanies = [
  {
    name: "Züri-Umzug AG",
    region: "Zürich & Umgebung",
    specialization: ["Privatumzug", "Reinigung"],
    priceLevel: 2,
    rating: 4.8,
    reviews: 234,
    responseTime: "< 4 Stunden",
    verified: true,
    highlight: true,
  },
  {
    name: "Swiss Move Express",
    region: "Ganze Schweiz",
    specialization: ["Privatumzug", "Firmenumzug", "Lagerung"],
    priceLevel: 3,
    rating: 4.6,
    reviews: 412,
    responseTime: "< 6 Stunden",
    verified: true,
    highlight: false,
  },
  {
    name: "Budget Umzüge GmbH",
    region: "Mittelland",
    specialization: ["Privatumzug"],
    priceLevel: 1,
    rating: 4.4,
    reviews: 89,
    responseTime: "< 12 Stunden",
    verified: true,
    highlight: false,
  },
];

const PriceIndicator = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className={`text-xs font-bold transition-colors ${
          i <= level ? "text-primary" : "text-muted-foreground/20"
        }`}
      >
        CHF
      </span>
    ))}
  </div>
);

export default function ComparisonShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Umzugsfirmen im direkten Vergleich
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Statt jede Firma einzeln zu kontaktieren, sehen Sie mehrere passende Anbieter 
            nebeneinander und können objektiv entscheiden.
          </p>
        </motion.div>
        
        {/* Desktop: Table View */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/50 shadow-lg bg-card">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 p-5 bg-muted/50 border-b border-border/50 font-semibold text-sm text-muted-foreground">
            <div className="col-span-2">Umzugsfirma</div>
            <div>Spezialisierung</div>
            <div>Preislevel</div>
            <div>Bewertung</div>
            <div>Antwortzeit</div>
          </div>
          
          {/* Rows */}
          {mockCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`grid grid-cols-6 gap-4 p-5 items-center transition-colors hover:bg-muted/30 ${
                index !== mockCompanies.length - 1 ? "border-b border-border/50" : ""
              } ${company.highlight ? "bg-primary/5" : ""}`}
            >
              <div className="col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-primary">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{company.name}</span>
                      {company.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs px-1.5 py-0">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" />
                          Geprüft
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{company.region}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {company.specialization.slice(0, 2).map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-xs bg-muted/80">
                    {spec}
                  </Badge>
                ))}
                {company.specialization.length > 2 && (
                  <Badge variant="secondary" className="text-xs bg-muted/80">
                    +{company.specialization.length - 2}
                  </Badge>
                )}
              </div>
              
              <div>
                <PriceIndicator level={company.priceLevel} />
              </div>
              
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{company.rating}</span>
                <span className="text-sm text-muted-foreground">({company.reviews})</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {company.responseTime}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile: Card View */}
        <div className="lg:hidden space-y-4">
          {mockCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-border/50 ${company.highlight ? "ring-2 ring-primary/20" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-bold text-primary text-lg">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{company.name}</div>
                        <div className="text-sm text-muted-foreground">{company.region}</div>
                      </div>
                    </div>
                    {company.verified && (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Geprüft
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {company.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{company.rating}</span>
                      </div>
                      <PriceIndicator level={company.priceLevel} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {company.responseTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Disclaimer */}
        <p className="text-sm text-muted-foreground text-center mt-8 max-w-xl mx-auto">
          <strong>Hinweis:</strong> Die Darstellung ist ein Beispiel. 
          Konkrete Angebote erhalten Sie nach dem Ausfüllen des Formulars.
        </p>
        
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-8"
          >
            Jetzt Offerten anfordern
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

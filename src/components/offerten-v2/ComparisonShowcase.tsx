/**
 * ComparisonShowcase - Mock comparison table showing platform value
 * Demonstrates how users can compare multiple providers
 * 
 * OPTIMIZATIONS:
 * 37. "Empfohlen" badge for top company
 * 38. Better row highlighting with gradient
 * 39. Animated rank numbers with medals
 * 40. Enhanced mobile card design
 * 41. Hover effects on rows
 * 42. Savings highlight badges
 * 43. Trust verification badges
 * 44. Response time indicators
 */

import { motion } from "framer-motion";
import { Star, Clock, CheckCircle2, ChevronRight, Award, TrendingUp, Sparkles, Medal, Trophy } from "lucide-react";
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
    recommended: true,
    savings: "Bis 35% günstiger",
    medal: "gold",
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
    recommended: false,
    savings: null,
    medal: "silver",
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
    recommended: false,
    savings: "Günstigster Anbieter",
    medal: "bronze",
  },
];

const medalColors = {
  gold: "from-amber-400 to-amber-500",
  silver: "from-gray-300 to-gray-400",
  bronze: "from-amber-600 to-amber-700",
};

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
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            Transparenter Vergleich
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Umzugsfirmen im direkten Vergleich
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Statt jede Firma einzeln zu kontaktieren, sehen Sie mehrere passende Anbieter 
            nebeneinander und können objektiv entscheiden.
          </p>
        </motion.div>
        
        {/* Desktop: Table View */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/50 shadow-xl bg-card">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 p-5 bg-muted/50 border-b border-border/50 font-semibold text-sm text-muted-foreground">
            <div className="text-center">Rang</div>
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
              whileHover={{ backgroundColor: "rgba(var(--primary), 0.02)" }}
              className={`grid grid-cols-7 gap-4 p-5 items-center transition-all duration-300 ${
                index !== mockCompanies.length - 1 ? "border-b border-border/50" : ""
              } ${company.highlight ? "bg-gradient-to-r from-primary/5 via-primary/3 to-transparent" : ""}`}
            >
              {/* Rank with medal */}
              <div className="flex justify-center">
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${medalColors[company.medal as keyof typeof medalColors]} flex items-center justify-center shadow-lg relative`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {index === 0 ? (
                    <Trophy className="w-6 h-6 text-white" />
                  ) : (
                    <span className="font-bold text-lg text-white">{index + 1}</span>
                  )}
                </motion.div>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center font-bold text-primary text-lg border border-border/50"
                    whileHover={{ scale: 1.05 }}
                  >
                    {company.name.charAt(0)}
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{company.name}</span>
                      {company.recommended && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 text-xs px-2 py-0.5 shadow-sm">
                            <Award className="w-3 h-3 mr-1" />
                            Empfohlen
                          </Badge>
                        </motion.div>
                      )}
                      {company.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs px-1.5 py-0">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" />
                          Geprüft
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{company.region}</div>
                    {company.savings && (
                      <motion.div 
                        className="text-xs text-green-600 font-medium mt-1 inline-flex items-center gap-1"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <Sparkles className="w-3 h-3" />
                        {company.savings}
                      </motion.div>
                    )}
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
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]" />
                </motion.div>
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
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className={`border-border/50 overflow-hidden ${company.highlight ? "ring-2 ring-primary/30 shadow-lg" : "shadow-md"}`}>
                {/* Recommended banner */}
                {company.recommended && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">Empfohlen für Sie</span>
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <motion.div 
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center font-bold text-primary text-xl border border-border/50"
                          whileHover={{ scale: 1.05 }}
                        >
                          {company.name.charAt(0)}
                        </motion.div>
                        <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-lg bg-gradient-to-br ${medalColors[company.medal as keyof typeof medalColors]} flex items-center justify-center shadow-lg`}>
                          {index === 0 ? (
                            <Trophy className="w-4 h-4 text-white" />
                          ) : (
                            <span className="font-bold text-sm text-white">{index + 1}</span>
                          )}
                        </div>
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
                  
                  {company.savings && (
                    <div className="text-sm text-green-600 font-medium mb-3 bg-green-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {company.savings}
                    </div>
                  )}
                  
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
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-8"
            >
              Jetzt Offerten anfordern
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
/**
 * ComparisonShowcase - Mock comparison table showing platform value
 * Demonstrates how users can compare multiple providers
 */

import { motion } from "framer-motion";
import { Star, Clock, CheckCircle2, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  },
];

const PriceIndicator = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className={`text-sm font-bold ${i <= level ? "text-primary" : "text-muted-foreground/30"}`}
      >
        CHF
      </span>
    ))}
  </div>
);

export default function ComparisonShowcase() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Umzugsfirmen im direkten Vergleich
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Statt jede Firma einzeln zu kontaktieren, sehen Sie mehrere passende Anbieter 
            nebeneinander und können objektiv entscheiden.
          </p>
        </motion.div>
        
        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 p-4 bg-card rounded-t-xl border border-border font-semibold text-sm text-muted-foreground">
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
                className={`grid grid-cols-6 gap-4 p-4 border-x border-b border-border bg-card items-center ${
                  index === mockCompanies.length - 1 ? "rounded-b-xl" : ""
                }`}
              >
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-foreground">{company.name}</div>
                    {company.verified && (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Geprüft
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{company.region}</div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {company.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
                
                <div>
                  <PriceIndicator level={company.priceLevel} />
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{company.rating}</span>
                  <span className="text-sm text-muted-foreground">({company.reviews})</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {company.responseTime}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Disclaimer */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          <strong>Hinweis:</strong> Die Darstellung ist ein Beispiel. 
          Konkrete Angebote erhalten Sie nach dem Ausfüllen des Formulars.
        </p>
        
        <div className="text-center mt-8">
          <Button
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90"
          >
            Jetzt Offerten anfordern
          </Button>
        </div>
      </div>
    </section>
  );
}

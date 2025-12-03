import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const regions = [
  { name: "Zürich", slug: "zuerich", count: 45 },
  { name: "Bern", slug: "bern", count: 32 },
  { name: "Basel", slug: "basel", count: 28 },
  { name: "Luzern", slug: "luzern", count: 22 },
  { name: "Zug", slug: "zug", count: 18 },
  { name: "St. Gallen", slug: "st-gallen", count: 24 },
  { name: "Aargau", slug: "aargau", count: 26 },
  { name: "Winterthur", slug: "winterthur", count: 19 },
  { name: "Lausanne", slug: "lausanne", count: 20 },
  { name: "Genf", slug: "genf", count: 25 },
  { name: "Thurgau", slug: "thurgau", count: 15 },
  { name: "Solothurn", slug: "solothurn", count: 14 }
];

export const PremiumRegions = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Schweizweite Abdeckung
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Umzugsfirmen in Ihrer Region
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Über 200 geprüfte Umzugsfirmen in allen 26 Kantonen. Finden Sie lokale Experten, 
            die Ihre Region und deren Besonderheiten kennen.
          </p>
        </motion.div>
        
        {/* Regions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {regions.map((region, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
            >
              <Link
                to={`/${region.slug}/umzugsfirmen`}
                className="group flex flex-col items-center p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-premium transition-all text-center"
              >
                <MapPin className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {region.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {region.count} Firmen
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/regionen">
            <Button variant="outline" size="lg" className="h-12 px-8 font-semibold border-2">
              Alle Regionen anzeigen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

import { MapPin, ArrowRight, Users, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const regions = [
  { name: "Zürich", slug: "zuerich", count: 45, popular: true, rating: 4.8 },
  { name: "Bern", slug: "bern", count: 32, popular: true, rating: 4.7 },
  { name: "Basel", slug: "basel", count: 28, popular: true, rating: 4.6 },
  { name: "Luzern", slug: "luzern", count: 22, popular: false, rating: 4.7 },
  { name: "Zug", slug: "zug", count: 18, popular: false, rating: 4.9 },
  { name: "St. Gallen", slug: "st-gallen", count: 24, popular: false, rating: 4.5 },
  { name: "Aargau", slug: "aargau", count: 26, popular: false, rating: 4.6 },
  { name: "Winterthur", slug: "winterthur", count: 19, popular: false, rating: 4.7 },
  { name: "Lausanne", slug: "lausanne", count: 20, popular: false, rating: 4.5 },
  { name: "Genf", slug: "genf", count: 25, popular: false, rating: 4.6 },
  { name: "Thurgau", slug: "thurgau", count: 15, popular: false, rating: 4.4 },
  { name: "Solothurn", slug: "solothurn", count: 14, popular: false, rating: 4.5 }
];

export const PremiumRegions = () => {
  const popularRegions = regions.filter(r => r.popular);
  const otherRegions = regions.filter(r => !r.popular);
  
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden" aria-labelledby="regions-heading">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            <MapPin className="h-4 w-4" />
            Schweizweite Abdeckung
          </span>
          <h2 id="regions-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Umzugsfirmen in Ihrer Region
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Über 200 geprüfte Umzugsfirmen in allen 26 Kantonen – lokale Experten, die Ihre Region kennen.
          </p>
        </motion.div>
        
        {/* Popular Regions */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Beliebte Regionen
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {popularRegions.map((region, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link
                  to={`/${region.slug}/umzugsfirmen`}
                  className="group flex items-center justify-between p-5 bg-card rounded-xl border border-primary/20 shadow-premium hover:shadow-lift hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {region.name}
                      </span>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {region.count} Firmen
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          {region.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Other Regions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
          {otherRegions.map((region, idx) => (
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
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                  {region.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {region.count} Firmen
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
        >
          {[
            { value: "26", label: "Kantone abgedeckt" },
            { value: "200+", label: "Geprüfte Firmen" },
            { value: "4.7", label: "⭐ Durchschnitt" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/regionen">
            <Button variant="outline" size="lg" className="h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base font-semibold border-2 group">
              <span className="hidden sm:inline">Alle Regionen anzeigen</span>
              <span className="sm:hidden">Alle Regionen</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

import { MapPin, ArrowRight, Users, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { memo } from "react";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

const regions = [
  { name: "Zürich", slug: "zuerich", count: 45, popular: true, rating: 4.8 },
  { name: "Bern", slug: "bern", count: 32, popular: true, rating: 4.7 },
  { name: "Basel", slug: "basel", count: 28, popular: true, rating: 4.6 },
  { name: "Luzern", slug: "luzern", count: 22, rating: 4.7 },
  { name: "Zug", slug: "zug", count: 18, rating: 4.9 },
  { name: "St. Gallen", slug: "st-gallen", count: 24, rating: 4.5 },
  { name: "Aargau", slug: "aargau", count: 26, rating: 4.6 },
  { name: "Winterthur", slug: "winterthur", count: 19, rating: 4.7 },
  { name: "Lausanne", slug: "lausanne", count: 20, rating: 4.5 },
  { name: "Genf", slug: "genf", count: 25, rating: 4.6 },
  { name: "Thurgau", slug: "thurgau", count: 15, rating: 4.4 },
  { name: "Solothurn", slug: "solothurn", count: 14, rating: 4.5 }
];

// Popular region card component
const PopularRegionCard = memo(({ region, index }: { region: typeof regions[0]; index: number }) => {
  const isScreenshot = isScreenshotRenderMode();
  return (
  <motion.div
    initial={isScreenshot ? false : { opacity: 0, y: 10 }}
    whileInView={isScreenshot ? undefined : { opacity: 1, y: 0 }}
    animate={isScreenshot ? { opacity: 1, y: 0 } : undefined}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <Link
      to={`/${region.slug}/umzugsfirmen`}
      className="group flex items-center justify-between p-4 md:p-5 bg-card rounded-xl border border-primary/20 shadow-soft hover:shadow-lift hover:border-primary/40 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <span className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
            {region.name}
          </span>
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <span>{region.count} Firmen</span>
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-swiss-gold fill-swiss-gold" />
              {region.rating}
            </span>
          </div>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  </motion.div>
  );
});

PopularRegionCard.displayName = 'PopularRegionCard';

export const PremiumRegions = memo(() => {
  const popularRegions = regions.filter(r => r.popular);
  const otherRegions = regions.filter(r => !r.popular);
  const isScreenshot = isScreenshotRenderMode();
  
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-muted/30" aria-labelledby="regions-heading">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={isScreenshot ? false : { opacity: 0, y: 10 }}
          whileInView={isScreenshot ? undefined : { opacity: 1, y: 0 }}
          animate={isScreenshot ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-primary font-semibold text-xs uppercase tracking-wider mb-3">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Schweizweit
          </span>
          <h2 id="regions-heading" className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Umzugsfirmen in Ihrer Region
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            200+ geprüfte Partner in allen 26 Kantonen
          </p>
        </motion.div>
        
        {/* Popular Regions */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Top Regionen
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {popularRegions.map((region, idx) => (
              <PopularRegionCard key={region.slug} region={region} index={idx} />
            ))}
          </div>
        </div>
        
        {/* Other Regions */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-8">
          {otherRegions.map((region, idx) => (
            <Link
              key={region.slug}
              to={`/${region.slug}/umzugsfirmen`}
              className="group flex flex-col items-center p-3 bg-card rounded-lg border border-border/40 hover:border-primary/30 hover:shadow-soft transition-all text-center"
            >
              <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                {region.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {region.count} Firmen
              </span>
            </Link>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Link to="/regionen">
            <Button variant="outline" size="default" className="font-semibold group">
              Alle Regionen
              <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});

PremiumRegions.displayName = 'PremiumRegions';

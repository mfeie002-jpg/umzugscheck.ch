import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getRegionBySlug } from "@/data/regions-database";

interface RegionNearbyProps {
  nearbyRegions: string[];
  currentRegion: string;
}

export const RegionNearby = memo(({ nearbyRegions, currentRegion }: RegionNearbyProps) => {
  const nearbyData = nearbyRegions
    .map(slug => getRegionBySlug(slug))
    .filter(Boolean)
    .slice(0, 8);

  if (nearbyData.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Umzugsfirmen in der Nähe von {currentRegion}
          </h2>
          <p className="text-muted-foreground text-sm">
            Entdecken Sie auch Partner in benachbarten Kantonen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl mx-auto"
        >
          {nearbyData.map((region, index) => (
            <motion.div
              key={region!.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/umzugsfirmen/kanton-${region!.slug}`}
                className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <MapPin className="w-4 h-4" />
                {region!.name}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* All Regions Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <Link
            to="/umzugsfirmen-schweiz"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Alle Kantone ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

RegionNearby.displayName = 'RegionNearby';

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const regions = [
  { name: "Zürich", slug: "zuerich", count: "45+" },
  { name: "Bern", slug: "bern", count: "32+" },
  { name: "Basel", slug: "basel", count: "28+" },
  { name: "Luzern", slug: "luzern", count: "22+" },
  { name: "Aargau", slug: "aargau", count: "25+" },
  { name: "St. Gallen", slug: "st-gallen", count: "18+" },
  { name: "Zug", slug: "zug", count: "15+" },
  { name: "Schwyz", slug: "schwyz", count: "12+" },
  { name: "Thurgau", slug: "thurgau", count: "14+" },
  { name: "Solothurn", slug: "solothurn", count: "16+" },
  { name: "Graubünden", slug: "graubuenden", count: "10+" },
  { name: "Wallis", slug: "wallis", count: "12+" },
];

const OffertenRegions = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-foreground mb-4">
            Umzugsofferten nach Region vergleichen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finden Sie lokale Umzugsfirmen in Ihrer Region.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {regions.map((region, index) => (
            <motion.div
              key={region.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={`/${region.slug}`}
                className="group block p-4 bg-card rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {region.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {region.count} Umzugsfirmen
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffertenRegions;

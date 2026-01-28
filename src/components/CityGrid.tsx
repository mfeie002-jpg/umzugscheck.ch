import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface City {
  name: string;
  slug: string;
  count?: number;
}

interface CityGridProps {
  cities: City[];
  title?: string;
  className?: string;
}

const CityGrid = ({ cities, title, className = "" }: CityGridProps) => {
  return (
    <div className={className}>
      {title && (
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl font-display font-semibold mb-6 text-center"
        >
          {title}
        </motion.h3>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {cities.map((city, index) => (
          <motion.div
            key={city.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/area/${city.slug}`}
              className="group flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {city.name}
              </span>
              {city.count && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {city.count}+
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-6"
      >
        <Link
          to="/map"
          className="inline-flex items-center text-primary font-medium hover:underline"
        >
          Alle Regionen anzeigen
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </motion.div>
    </div>
  );
};

export default CityGrid;

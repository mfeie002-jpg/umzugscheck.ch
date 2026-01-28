import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const regions = [
  "Zürich", "Basel", "Bern", "Genf", "Luzern", "Winterthur", "St. Gallen", "Lausanne"
];

const RegionalBadges = () => {
  return (
    <section className="py-8 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            <MapPin className="inline h-4 w-4 mr-1" />
            Aktiv in der ganzen Schweiz
          </p>
        </AnimatedSection>

        <div className="flex flex-wrap justify-center gap-2">
          {regions.map((region, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <Link
                to={`/area/${region.toLowerCase()}`}
                className="px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-alpine hover:text-white transition-colors"
              >
                {region}
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionalBadges;

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const mainRegions = [
  { name: "Zürich", link: "/zuerich/umzugsfirmen" },
  { name: "Bern", link: "/bern/umzugsfirmen" },
  { name: "Basel", link: "/basel/umzugsfirmen" },
  { name: "Luzern", link: "/luzern/umzugsfirmen" },
  { name: "St. Gallen", link: "/st-gallen/umzugsfirmen" },
  { name: "Aargau", link: "/aargau/umzugsfirmen" },
  { name: "Zug", link: "/zug" },
  { name: "Genf", link: "/genf/umzugsfirmen" },
  { name: "Waadt", link: "/waadt/umzugsfirmen" },
  { name: "Tessin", link: "/tessin/umzugsfirmen" }
];

export const RegionsButtons = () => {
  return (
    <section className="py-12 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
            Umzugsfirmen in Ihrer Region
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Finden Sie geprüfte Firmen in allen Schweizer Kantonen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-6xl mx-auto"
        >
          {mainRegions.map((region, index) => (
            <Link key={index} to={region.link}>
              <Button 
                variant="outline" 
                size="default" 
                className="gap-1.5 md:gap-2 h-10 md:h-12 px-3 md:px-6 border-2 border-border hover:border-primary hover:bg-primary/5 hover:text-primary transition-all font-semibold text-sm md:text-base"
              >
                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                {region.name}
              </Button>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/regionen" className="text-primary hover:text-primary/80 font-bold text-lg hover:underline inline-flex items-center gap-2">
            Alle 26 Kantone anzeigen →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

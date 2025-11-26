import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const mainRegions = [
  { name: "Zürich", link: "/zuerich/umzugsfirmen" },
  { name: "Bern", link: "/bern/umzugsfirmen" },
  { name: "Basel", link: "/basel/umzugsfirmen" },
  { name: "Luzern", link: "/luzern/umzugsfirmen" },
  { name: "St. Gallen", link: "/st-gallen/umzugsfirmen" },
  { name: "Aargau", link: "/aargau/umzugsfirmen" },
  { name: "Genf", link: "/genf/umzugsfirmen" },
  { name: "Lausanne", link: "/lausanne/umzugsfirmen" }
];

export const RegionsButtons = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Umzugsfirmen in Ihrer Region
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finden Sie geprüfte Umzugsfirmen in allen Schweizer Kantonen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {mainRegions.map((region, index) => (
            <a key={index} href={region.link}>
              <Button variant="outline" size="lg" className="gap-2">
                <MapPin className="h-4 w-4" />
                {region.name}
              </Button>
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <a href="/regionen" className="text-primary hover:underline font-semibold">
            Alle Regionen anzeigen →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

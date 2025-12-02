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
  { name: "Zug", link: "/zug/umzugsfirmen" },
  { name: "Genf", link: "/genf/umzugsfirmen" },
  { name: "Waadt", link: "/waadt/umzugsfirmen" },
  { name: "Tessin", link: "/tessin/umzugsfirmen" }
];

export const RegionsButtons = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Umzugsfirmen in Ihrer Region
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Finden Sie geprüfte Firmen in allen Schweizer Kantonen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto"
        >
          {mainRegions.map((region, index) => (
            <Link key={index} to={region.link}>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 h-12 px-6 border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold"
              >
                <MapPin className="h-4 w-4" />
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
          <Link to="/regionen" className="text-blue-600 hover:text-blue-700 font-bold text-lg hover:underline inline-flex items-center gap-2">
            Alle 26 Kantone anzeigen →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

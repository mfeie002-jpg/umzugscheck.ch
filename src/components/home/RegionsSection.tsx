import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const regions = [
  { name: "Zürich", count: 48, link: "/zuerich/umzugsfirmen" },
  { name: "Bern", count: 32, link: "/bern/umzugsfirmen" },
  { name: "Basel", count: 28, link: "/basel/umzugsfirmen" },
  { name: "Luzern", count: 24, link: "/luzern/umzugsfirmen" },
  { name: "St. Gallen", count: 22, link: "/st-gallen/umzugsfirmen" },
  { name: "Winterthur", count: 20, link: "/winterthur/umzugsfirmen" },
  { name: "Genf", count: 26, link: "/genf/umzugsfirmen" },
  { name: "Lausanne", count: 23, link: "/lausanne/umzugsfirmen" },
  { name: "Aargau", count: 28, link: "/aargau/umzugsfirmen" },
  { name: "Thurgau", count: 18, link: "/thurgau/umzugsfirmen" },
  { name: "Graubünden", count: 15, link: "/graubuenden/umzugsfirmen" },
  { name: "Tessin", count: 16, link: "/tessin/umzugsfirmen" }
];

export const RegionsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Umzugsfirmen nach Region
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finden Sie lokale Umzugsexperten in allen Schweizer Kantonen
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regions.map((region, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Link to={region.link}>
                  <div className="group bg-card rounded-xl p-5 shadow-soft hover:shadow-medium transition-all border border-border/50 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {region.count}
                      </span>
                    </div>
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {region.name}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

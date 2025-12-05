import { motion } from "framer-motion";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const regions = [
  { name: "Zürich", count: 45, href: "/zuerich" },
  { name: "Bern", count: 32, href: "/bern" },
  { name: "Basel", count: 28, href: "/basel" },
  { name: "Luzern", count: 22, href: "/luzern" },
  { name: "Aargau", count: 26, href: "/aargau" },
  { name: "St. Gallen", count: 20, href: "/st-gallen" },
  { name: "Genf", count: 24, href: "/genf" },
  { name: "Waadt", count: 30, href: "/waadt" },
];

export const RegionsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Schweizweit in allen 26 Kantonen
            </h2>
            <p className="text-muted-foreground text-lg">
              Egal ob Grossstadt oder ländliche Gemeinde – wir haben geprüfte Umzugspartner in Ihrer Nähe.
            </p>
            
            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-secondary">200+</div>
                <div className="text-sm text-muted-foreground">Geprüfte Partner</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">26</div>
                <div className="text-sm text-muted-foreground">Kantone</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">100%</div>
                <div className="text-sm text-muted-foreground">Abdeckung</div>
              </div>
            </div>
            
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link to="/regionen">
                Alle Regionen ansehen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Right - Region Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            {regions.map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  to={region.href}
                  className="group flex items-center justify-between bg-card rounded-xl p-4 border border-border shadow-soft hover:shadow-medium hover:border-secondary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium group-hover:text-secondary transition-colors">
                        {region.name}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {region.count} Firmen
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

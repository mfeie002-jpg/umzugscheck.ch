import { motion } from "framer-motion";
import { MapPin, Building2, Star } from "lucide-react";

const cantonData = [
  { name: "Zürich", code: "ZH", companies: 45, avgRating: 4.8 },
  { name: "Bern", code: "BE", companies: 32, avgRating: 4.7 },
  { name: "Basel", code: "BS", companies: 28, avgRating: 4.6 },
  { name: "Luzern", code: "LU", companies: 22, avgRating: 4.8 },
  { name: "Genf", code: "GE", companies: 35, avgRating: 4.5 },
  { name: "St. Gallen", code: "SG", companies: 18, avgRating: 4.7 },
  { name: "Aargau", code: "AG", companies: 24, avgRating: 4.6 },
  { name: "Waadt", code: "VD", companies: 30, avgRating: 4.5 }
];

export const RegionalAvailabilityMap = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Verfügbarkeit nach Region</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Geprüfte Umzugsfirmen in allen 26 Schweizer Kantonen
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cantonData.map((canton, index) => (
            <motion.div
              key={canton.code}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-4 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-bold text-foreground">{canton.name}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                  {canton.code}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{canton.companies} Firmen</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-foreground">{canton.avgRating} Durchschnitt</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-primary font-medium group-hover:underline">
                  Firmen anzeigen →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Insgesamt <span className="font-bold text-foreground">200+</span> geprüfte Umzugsfirmen schweizweit
          </p>
        </div>
      </div>
    </section>
  );
};

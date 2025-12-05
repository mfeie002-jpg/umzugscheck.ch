import { motion } from "framer-motion";
import { Check, X, Star, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const comparisonData = [
  { feature: "Kostenlose Offerten", us: true, others: true },
  { feature: "Geprüfte Firmen", us: true, others: false },
  { feature: "KI-Preisanalyse", us: true, others: false },
  { feature: "Echte Bewertungen", us: true, others: "teilweise" },
  { feature: "Schadenversicherung", us: true, others: "teilweise" },
  { feature: "24/7 Support", us: true, others: false },
  { feature: "Preisgarantie", us: true, others: false },
  { feature: "Keine versteckten Kosten", us: true, others: false },
];

export const PremiumCompanyComparison = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Vergleich
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Warum Umzugscheck.ch?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sehen Sie den Unterschied zu anderen Vergleichsportalen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-xl border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-muted/50">
              <div className="p-4 md:p-6">
                <span className="font-medium text-muted-foreground">Leistung</span>
              </div>
              <div className="p-4 md:p-6 text-center bg-primary/10 border-x border-primary/20">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-bold text-primary">Umzugscheck.ch</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-6 text-center">
                <span className="font-medium text-muted-foreground">Andere</span>
              </div>
            </div>

            {/* Rows */}
            {comparisonData.map((row, index) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-3 border-t"
              >
                <div className="p-4 md:p-5 flex items-center">
                  <span className="text-sm md:text-base">{row.feature}</span>
                </div>
                <div className="p-4 md:p-5 flex justify-center items-center bg-primary/5 border-x border-primary/10">
                  {row.us && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-5 flex justify-center items-center">
                  {row.others === true ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  ) : row.others === false ? (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">{row.others}</span>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Footer CTA */}
            <div className="p-6 bg-muted/30 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-10 h-10 text-primary" />
                  <div>
                    <p className="font-bold">100% Zufriedenheitsgarantie</p>
                    <p className="text-sm text-muted-foreground">Keine Kosten, kein Risiko</p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/umzugsofferten">Jetzt vergleichen</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

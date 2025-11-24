import { motion } from "framer-motion";
import { TrendingDown, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const PriceComparisonChart = () => {
  const competitors = [
    { name: "Andere Plattformen", price: 1450, color: "bg-gray-400" },
    { name: "Direkt bei Firma", price: 1580, color: "bg-gray-500" },
    { name: "Umzugscheck.ch", price: 980, color: "bg-primary", highlight: true },
  ];

  const maxPrice = Math.max(...competitors.map(c => c.price));

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Vergleichen Sie selbst
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Durchschnittlich 32% günstiger als andere Anbieter
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                {competitors.map((competitor, index) => (
                  <motion.div
                    key={competitor.name}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">
                          {competitor.name}
                        </span>
                        {competitor.highlight && (
                          <Award className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <span className={`text-2xl font-bold ${
                        competitor.highlight ? "text-primary" : "text-muted-foreground"
                      }`}>
                        CHF {competitor.price}
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="relative h-12 bg-secondary/30 rounded-lg overflow-hidden">
                      <motion.div
                        className={`absolute inset-y-0 left-0 ${competitor.color} ${
                          competitor.highlight 
                            ? "bg-gradient-to-r from-primary to-primary/80" 
                            : ""
                        }`}
                        initial={{ width: 0 }}
                        whileInView={{ 
                          width: `${(competitor.price / maxPrice) * 100}%` 
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
                      />
                      
                      {/* Savings Badge */}
                      {competitor.highlight && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 1 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                        >
                          Bis zu CHF 600 sparen! 🎉
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Note */}
              <p className="text-xs text-muted-foreground text-center mt-8">
                * Durchschnittliche Preise für 3.5-Zimmer-Wohnung, 50 km Distanz (Stand: 2025)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

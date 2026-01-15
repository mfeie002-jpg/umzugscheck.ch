/**
 * GOLD STANDARD - Savings Proof Block
 * ChatGPT recommendation: Show anonymized sample offers + "Why possible"
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Shield, Users, CheckCircle, Percent, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RegionSavingsProofProps {
  regionName: string;
  variant?: 'canton' | 'city';
}

export const RegionSavingsProof = memo(({ regionName, variant = 'canton' }: RegionSavingsProofProps) => {
  const locationPrefix = variant === 'canton' ? 'im Kanton' : 'in';
  
  // Sample anonymized offers
  const sampleOffers = [
    { company: 'Firma A', price: 1890, highlight: false },
    { company: 'Firma B', price: 1420, highlight: true },
    { company: 'Firma C', price: 1650, highlight: false },
  ];
  
  const highestPrice = Math.max(...sampleOffers.map(o => o.price));
  const lowestPrice = Math.min(...sampleOffers.map(o => o.price));
  const savings = highestPrice - lowestPrice;
  const savingsPercent = Math.round((savings / highestPrice) * 100);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Percent className="w-4 h-4" />
              So sparen Sie {locationPrefix} {regionName}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Bis zu {savingsPercent}% Ersparnis durch Vergleich
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beispiel: 3.5-Zimmer-Umzug innerhalb {regionName}. Preise variieren je nach Firma erheblich.
            </p>
          </div>

          {/* Sample Offers Chart */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft mb-8">
            <div className="space-y-4">
              {sampleOffers.map((offer, index) => {
                const widthPercent = (offer.price / highestPrice) * 100;
                const isBest = offer.price === lowestPrice;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-20 text-sm font-medium text-muted-foreground">
                      {offer.company}
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-10 bg-muted rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${widthPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className={`h-full rounded-lg flex items-center justify-end pr-3 ${
                            isBest 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500'
                          }`}
                        >
                          <span className={`text-sm font-bold ${isBest ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                            CHF {offer.price.toLocaleString('de-CH')}
                          </span>
                        </motion.div>
                      </div>
                      {isBest && (
                        <span className="absolute -right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          BESTER PREIS
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border/50">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                Ersparnis: CHF {savings.toLocaleString('de-CH')} ({savingsPercent}%)
              </span>
            </div>
          </div>

          {/* Why This Is Possible */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, text: "Wettbewerb", desc: "Firmen konkurrieren um Ihre Anfrage" },
              { icon: CheckCircle, text: "Matching", desc: "Passende Firmen für Ihren Bedarf" },
              { icon: Shield, text: "Geprüft", desc: "Nur qualifizierte Partner" },
              { icon: TrendingDown, text: "Effizienz", desc: "Weniger Leerfahrten, bessere Preise" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-semibold text-sm">{item.text}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" className="h-14 px-8 gradient-cta text-white" asChild>
              <Link to="/umzugsofferten">
                Jetzt eigenen Vergleich starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              100% kostenlos & unverbindlich
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RegionSavingsProof.displayName = 'RegionSavingsProof';

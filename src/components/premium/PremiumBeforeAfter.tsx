import { motion } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";

const comparisons = [
  {
    before: "Stundenlang einzelne Firmen googeln",
    after: "Alle Angebote auf einen Blick",
  },
  {
    before: "Keine Ahnung von fairen Preisen",
    after: "KI-basierte Preistransparenz",
  },
  {
    before: "Risiko bei unbekannten Firmen",
    after: "Nur geprüfte Schweizer Partner",
  },
  {
    before: "Versteckte Kosten nach Buchung",
    after: "Garantierte Festpreise",
  },
];

export const PremiumBeforeAfter = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vorher vs. Nachher
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            So verändert Umzugscheck.ch Ihre Umzugserfahrung
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Ohne Umzugscheck</h3>
              </div>
              {comparisons.map((item, index) => (
                <motion.div
                  key={item.before}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex items-center gap-3"
                >
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-800 dark:text-red-200">{item.before}</span>
                </motion.div>
              ))}
            </div>

            {/* After */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Mit Umzugscheck</h3>
              </div>
              {comparisons.map((item, index) => (
                <motion.div
                  key={item.after}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-xl p-4 flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-800 dark:text-green-200">{item.after}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Arrow for mobile */}
          <div className="flex justify-center my-8 md:hidden">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-primary-foreground rotate-90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

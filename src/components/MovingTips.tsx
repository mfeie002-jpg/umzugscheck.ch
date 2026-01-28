import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const tips = [
  {
    title: "4 Wochen vorher",
    tip: "Umzugsfirma buchen und Kündigungen verschicken",
  },
  {
    title: "2 Wochen vorher",
    tip: "Adressänderungen bei Post, Bank und Versicherungen",
  },
  {
    title: "1 Woche vorher",
    tip: "Kartons packen, Kühlschrank abtauen",
  },
  {
    title: "Am Umzugstag",
    tip: "Zählerstände notieren, Schlüsselübergabe",
  },
];

const MovingTips = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-flex items-center gap-2 text-primary font-medium mb-2">
                  <Lightbulb className="w-4 h-4" />
                  Umzugstipps
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Schnell-Checkliste
                </h2>
              </div>
              <Link
                to="/checklist"
                className="hidden md:inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                Vollständige Checkliste
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {tips.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-muted/50 rounded-xl p-5 h-full border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.tip}
                    </p>
                  </div>
                  {index < tips.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-6 md:hidden">
              <Link
                to="/checklist"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                Vollständige Checkliste
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default MovingTips;

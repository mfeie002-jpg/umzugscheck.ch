/**
 * BottomFinalCTA - Final call-to-action section
 * Strong conversion push at the end of the page
 */

import { motion } from "framer-motion";
import { ArrowUp, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BottomFinalCTA() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Kostenlos & unverbindlich</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Bereit für Ihren Umzug?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Geben Sie Ihre Daten einmal ein und erhalten Sie mehrere Offerten von 
            Umzugsfirmen, die zu Ihnen passen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              onClick={scrollToTop}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto"
            >
              Jetzt Umzug berechnen & Offerten erhalten
              <ArrowUp className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {[
              "In unter 2 Minuten",
              "100% kostenlos",
              "Nur geprüfte Firmen",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

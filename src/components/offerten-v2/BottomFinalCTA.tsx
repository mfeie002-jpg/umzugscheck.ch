/**
 * BottomFinalCTA - Final call-to-action section
 * Strong conversion push at the end of the page
 * 
 * OPTIMIZATIONS:
 * 19. Enhanced gradient background
 * 20. Better badge and button styling
 */

import { motion } from "framer-motion";
import { ArrowUp, Sparkles, CheckCircle2, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BottomFinalCTA() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full mb-8 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Kostenlos & unverbindlich</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Bereit für Ihren Umzug?
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Geben Sie Ihre Daten einmal ein und erhalten Sie mehrere Offerten von 
            Umzugsfirmen, die zu Ihnen passen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button
              size="lg"
              onClick={scrollToTop}
              className="bg-primary hover:bg-primary/90 text-lg px-10 h-14 shadow-xl shadow-primary/20 font-semibold"
            >
              Jetzt Umzug berechnen & Offerten erhalten
              <ArrowUp className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {[
              { icon: Clock, text: "In unter 2 Minuten" },
              { icon: Shield, text: "100% kostenlos" },
              { icon: Award, text: "Nur geprüfte Firmen" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

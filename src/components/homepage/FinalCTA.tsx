import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Shield, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FinalCTA = memo(function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90">
      <div className="container">
        <motion.div 
          className="text-center max-w-3xl mx-auto text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Star className="w-4 h-4" />
            Jetzt Offerten vergleichen
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Bereit für Ihren stressfreien Umzug?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Vergleichen Sie jetzt kostenlos Offerten von geprüften Schweizer Umzugsfirmen und sparen Sie bis zu 40%.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              asChild 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta h-14 px-8 text-base"
            >
              <Link to="/umzugsofferten">
                <CheckCircle className="w-5 h-5 mr-2" />
                Jetzt Offerten erhalten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-14 px-8 text-base"
            >
              <Link to="/umzugsrechner">
                Kosten berechnen
              </Link>
            </Button>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              100% kostenlos
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Geprüfte Firmen
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              15'000+ Umzüge
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

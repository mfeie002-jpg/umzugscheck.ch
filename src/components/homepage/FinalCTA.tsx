import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Shield, Star, Users, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FinalCTA = memo(function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--secondary)) 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, hsl(var(--secondary)) 0%, transparent 50%)`
        }}
      />
      
      <div className="container relative">
        <motion.div 
          className="text-center max-w-3xl mx-auto text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-6 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Star className="w-4 h-4 text-swiss-gold" fill="currentColor" />
            Über 15'000 zufriedene Kunden
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Bereit für Ihren stressfreien Umzug?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Vergleichen Sie jetzt kostenlos Offerten von geprüften Schweizer Umzugsfirmen und sparen Sie bis zu 40%.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              asChild 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta h-14 px-8 text-base font-semibold"
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
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-14 px-8 text-base font-medium"
            >
              <Link to="/umzugsofferten">
                <Calculator className="w-5 h-5 mr-2" />
                Kosten berechnen
              </Link>
            </Button>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              100% kostenlos
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white" />
              Geprüfte Firmen
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white" />
              15'000+ Umzüge
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
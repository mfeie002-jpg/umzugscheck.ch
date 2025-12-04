import { ArrowRight, Shield, Clock, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OffertenCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-manrope text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Bereit für Ihren stressfreien Umzug?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Vergleichen Sie jetzt kostenlos Offerten von geprüften Schweizer Umzugsfirmen 
            und sparen Sie bis zu 40 % Ihrer Umzugskosten.
          </p>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Shield className="w-5 h-5" />
              <span>Geprüfte Firmen</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Clock className="w-5 h-5" />
              <span>Offerten in 24h</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Percent className="w-5 h-5" />
              <span>100% kostenlos</span>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-14 px-10 text-lg font-semibold rounded-xl bg-white text-primary hover:bg-white/90 transition-all hover:scale-105"
          >
            <Link to="/rechner" className="flex items-center gap-2">
              Jetzt Offerten vergleichen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default OffertenCTA;

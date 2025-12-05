import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-secondary/90 rounded-3xl p-8 md:p-12 text-center"
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Bereit für Ihren nächsten Umzug?
            </h2>
            <p className="text-white/90 text-lg">
              In 2 Minuten zu Ihren kostenlosen Offerten von geprüften Schweizer Umzugsfirmen.
            </p>
            
            <Button
              asChild
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 font-bold text-base h-14 px-8 rounded-xl shadow-lift"
            >
              <Link to="/umzugsofferten">
                <CheckCircle className="w-5 h-5 mr-2" />
                Jetzt Offerten erhalten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            {/* Trust Points */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle className="w-4 h-4" />
                100% kostenlos
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle className="w-4 h-4" />
                Unverbindlich
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle className="w-4 h-4" />
                In 2 Minuten fertig
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

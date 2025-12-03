import { Building2, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Users,
    text: "Qualifizierte Kundenanfragen aus der ganzen Schweiz"
  },
  {
    icon: TrendingUp,
    text: "Mehr Sichtbarkeit und Reichweite für Ihr Unternehmen"
  },
  {
    icon: Building2,
    text: "Transparente Konditionen ohne versteckte Kosten"
  }
];

export const PremiumProviderCTA = () => {
  return (
    <section className="py-20 md:py-28 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 border border-background/20 rounded-full text-sm font-medium mb-8">
              <Building2 className="h-4 w-4" />
              <span>Für Umzugsfirmen</span>
            </div>
            
            {/* Header */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sie sind Umzugsfirma?
              <span className="block text-primary mt-2">Werden Sie Partner.</span>
            </h2>
            <p className="text-lg text-background/80 mb-10 max-w-2xl mx-auto">
              Schliessen Sie sich über 200 geprüften Schweizer Umzugsfirmen an und erhalten Sie 
              qualifizierte Kundenanfragen direkt in Ihre Inbox.
            </p>
            
            {/* Benefits */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm text-background/90 text-left">{benefit.text}</span>
                  </motion.div>
                );
              })}
            </div>
            
            {/* CTA */}
            <Link to="/fuer-firmen">
              <Button 
                size="lg" 
                className="h-14 px-10 text-lg font-semibold bg-background text-foreground hover:bg-background/90 shadow-lift"
              >
                Partner werden
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <p className="mt-6 text-sm text-background/60">
              Bereits Partner? <Link to="/provider-login" className="text-primary hover:underline">Hier einloggen</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

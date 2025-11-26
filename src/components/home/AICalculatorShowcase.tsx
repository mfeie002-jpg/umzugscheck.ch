import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Target, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const AICalculatorShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left: Screenshot/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-strong bg-gradient-to-br from-secondary to-secondary/80 aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop"
                alt="AI Calculator Interface"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 rounded-2xl p-8 shadow-strong max-w-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">KI-Rechner</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded-full w-full animate-pulse" />
                    <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded-full w-5/6 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              🚀 Schweizer Innovation
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Der erste <span className="text-primary">KI-Umzugsrechner</span> der Schweiz
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Nutzen Sie modernste Künstliche Intelligenz für präzise Kostenberechnungen und sofortige Angebote
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Sofortige Preisspanne</h3>
                  <p className="text-muted-foreground text-sm">Erhalte deine Kosteneinschätzung in unter 2 Minuten</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Bessere Firmen zuerst</h3>
                  <p className="text-muted-foreground text-sm">AI-Ranking zeigt dir die qualitativ besten Anbieter</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Kein Spam – du wählst</h3>
                  <p className="text-muted-foreground text-sm">Nur ausgewählte Firmen kontaktieren dich, keine Anrufflut</p>
                </div>
              </div>
            </div>

            <Link to="/rechner">
              <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-strong">
                KI-Rechner testen
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

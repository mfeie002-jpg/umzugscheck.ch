import { Building2, TrendingUp, Users, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { memo } from "react";
import { NumberTicker } from "@/components/common/NumberTicker";

const benefits = [
  { icon: Users, text: "Qualifizierte Kundenanfragen schweizweit" },
  { icon: TrendingUp, text: "Mehr Sichtbarkeit für Ihr Unternehmen" },
  { icon: Building2, text: "Transparente Konditionen, keine versteckten Kosten" }
];

const features = ["Kostenlose Registrierung", "Keine Grundgebühr", "Nur bei Erfolg zahlen", "Volle Budget-Kontrolle"];

export const PremiumProviderCTA = memo(() => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-muted/50 via-background to-muted/30 relative overflow-hidden" aria-labelledby="provider-cta-heading">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium mb-4 text-primary">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Für Umzugsfirmen
              </div>
              
              <h2 id="provider-cta-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Werden Sie Partner
                <span className="block text-primary mt-1">Qualifizierte Leads erhalten</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                Über 200 geprüfte Schweizer Firmen erhalten qualifizierte Kundenanfragen.
              </p>
              
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <b.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{b.text}</span>
                  </div>
                ))}
              </div>
              
              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link to="/fuer-firmen">
                  <Button size="lg" className="font-semibold shadow-cta group">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Partner werden
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/provider-login">
                  <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                    Einloggen
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right - Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-primary rounded-2xl p-6 shadow-xl">
                {/* Stats with NumberTicker */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { value: 200, label: "Partner", suffix: "+" },
                    { value: 15000, label: "Vermittelt", suffix: "+" },
                    { value: 98, label: "Zufrieden", suffix: "%" }
                  ].map((s, i) => (
                    <div key={i} className="text-center p-3 bg-white/15 rounded-xl backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">
                        <NumberTicker value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-xs text-white/80 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                
                {/* Features */}
                <div className="space-y-2.5">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" />
                      <span className="text-white font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

PremiumProviderCTA.displayName = 'PremiumProviderCTA';

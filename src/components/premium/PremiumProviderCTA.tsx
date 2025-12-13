import { Building2, TrendingUp, Users, ArrowRight, CheckCircle, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { memo } from "react";
import { NumberTicker } from "@/components/common/NumberTicker";

const benefits = [
  { icon: Zap, text: "Sofortige Lead-Benachrichtigung" },
  { icon: Users, text: "Qualifizierte Kundenanfragen" },
  { icon: TrendingUp, text: "Maximale Sichtbarkeit" }
];

export const PremiumProviderCTA = memo(() => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden" aria-labelledby="provider-cta-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-stretch">
            
            {/* Left content - 3 cols */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  Für Umzugsfirmen
                </div>
                
                <h2 id="provider-cta-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Wachsen Sie mit uns
                </h2>
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                  Werden Sie Teil des grössten Umzugs-Netzwerks der Schweiz und erhalten Sie qualifizierte Aufträge.
                </p>
                
                {/* Stats inline */}
                <div className="flex flex-wrap gap-8 mb-8">
                  {[
                    { value: 200, suffix: "+", label: "Partner" },
                    { value: 15000, suffix: "+", label: "Vermittlungen" },
                    { value: 98, suffix: "%", label: "Zufriedenheit" }
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-3xl md:text-4xl font-bold">
                        <NumberTicker value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-white/60 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <Link to="/fuer-firmen">
                    <Button size="lg" variant="white" className="font-semibold shadow-lg group">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Jetzt Partner werden
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/provider-login">
                    <Button size="lg" variant="ghost" className="text-white border border-white/30 hover:bg-white/10">
                      Einloggen
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Right cards - 2 cols */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              {/* Benefits */}
              {benefits.map((b, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-muted/50 border border-border rounded-2xl p-6 hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <b.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{b.text}</h3>
                </div>
              ))}
              
              {/* Features box */}
              <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
                <h4 className="font-semibold text-foreground mb-3">Ihre Vorteile</h4>
                <div className="space-y-2">
                  {["Kostenlose Registrierung", "Keine Grundgebühr", "Nur bei Erfolg zahlen"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
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

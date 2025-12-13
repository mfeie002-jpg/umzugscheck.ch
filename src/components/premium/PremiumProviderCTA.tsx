import { Building2, TrendingUp, Users, ArrowRight, CheckCircle, Sparkles, Star } from "lucide-react";
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

const stats = [
  { value: 200, label: "Partner", suffix: "+" },
  { value: 15000, label: "Vermittelt", suffix: "+" },
  { value: 98, label: "Zufrieden", suffix: "%" }
];

export const PremiumProviderCTA = memo(() => {
  return (
    <section className="py-16 md:py-24 bg-foreground relative overflow-hidden" aria-labelledby="provider-cta-heading">
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" aria-hidden="true" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-[120px]" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium mb-6 text-white/90">
              <Building2 className="h-4 w-4 text-secondary" aria-hidden="true" />
              Für Umzugsfirmen
            </div>
            
            <h2 id="provider-cta-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Werden Sie Partner bei
              <span className="block text-secondary mt-2">Umzugscheck.ch</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Schliessen Sie sich über 200 geprüften Schweizer Umzugsfirmen an und erhalten Sie qualifizierte Kundenanfragen.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mb-12"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-white mb-1">
                  <NumberTicker value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm md:text-base text-white/60">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Benefits grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {benefits.map((b, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                  <b.icon className="h-6 w-6 text-secondary" />
                </div>
                <p className="text-white font-medium text-lg">{b.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Features + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-10"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3">
                {["Kostenlose Registrierung", "Keine Grundgebühr", "Nur bei Erfolg zahlen", "Volle Budget-Kontrolle"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span className="text-white font-medium">{f}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/fuer-firmen">
                  <Button size="lg" variant="white" className="font-semibold shadow-lg group">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Partner werden
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/provider-login">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Einloggen
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-8 text-white/50 text-sm"
          >
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8/5 durchschnittliche Partnerbewertung</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

PremiumProviderCTA.displayName = 'PremiumProviderCTA';

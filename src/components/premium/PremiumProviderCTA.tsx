import { Building2, TrendingUp, Users, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { memo } from "react";
import { NumberTicker } from "@/components/common/NumberTicker";
import { BlurReveal } from "@/components/common/BlurReveal";
import { HeroGradient } from "@/components/common/HeroGradient";

const benefits = [
  { icon: Users, text: "Qualifizierte Kundenanfragen schweizweit" },
  { icon: TrendingUp, text: "Mehr Sichtbarkeit für Ihr Unternehmen" },
  { icon: Building2, text: "Transparente Konditionen, keine versteckten Kosten" }
];

const features = ["Kostenlose Registrierung", "Keine Grundgebühr", "Nur bei Erfolg zahlen", "Volle Budget-Kontrolle"];

const stats = [
  { value: "200+", label: "Partner" },
  { value: "15K+", label: "Vermittelt" },
  { value: "98%", label: "Zufrieden" }
];

export const PremiumProviderCTA = memo(() => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden" aria-labelledby="provider-cta-heading">
      {/* HeroGradient Background */}
      <HeroGradient variant="mesh" className="opacity-20" />
      
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-medium mb-4 text-white">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Für Umzugsfirmen
              </div>
              
              <h2 id="provider-cta-heading" className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-white">
                Werden Sie Partner
                <span className="block text-secondary/90 mt-1">Qualifizierte Leads erhalten</span>
              </h2>
              <p className="text-sm md:text-base text-white/80 mb-5">
                Über 200 geprüfte Schweizer Firmen erhalten qualifizierte Kundenanfragen.
              </p>
              
              {/* Benefits */}
              <div className="space-y-2 mb-5">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-primary/30 flex items-center justify-center">
                      <b.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-white text-sm">{b.text}</span>
                  </div>
                ))}
              </div>
              
              {/* CTAs */}
              <div className="flex flex-wrap gap-2">
                <Link to="/fuer-firmen">
                  <Button size="default" className="font-semibold shadow-cta group">
                    <Sparkles className="mr-1.5 h-4 w-4" />
                    Partner werden
                    <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/provider-login">
                  <Button size="default" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10">
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
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                {/* Stats with NumberTicker */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { value: 200, label: "Partner", suffix: "+" },
                    { value: 15000, label: "Vermittelt", suffix: "+" },
                    { value: 98, label: "Zufrieden", suffix: "%" }
                  ].map((s, i) => (
                    <div key={i} className="text-center p-2.5 bg-white/10 rounded-lg">
                      <div className="text-xl font-bold text-primary">
                        <NumberTicker value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-[10px] text-white/70">{s.label}</div>
                    </div>
                  ))}
                </div>
                
                {/* Features */}
                <div className="space-y-1.5">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">{f}</span>
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

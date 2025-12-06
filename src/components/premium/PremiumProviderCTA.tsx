import { Building2, TrendingUp, Users, ArrowRight, CheckCircle, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import moversTeamImg from "@/assets/movers-team-working.jpg";

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

const stats = [
  { value: "200+", label: "Partner-Firmen" },
  { value: "15K+", label: "Vermittelte Umzüge" },
  { value: "98%", label: "Zufriedenheit" }
];

export const PremiumProviderCTA = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden" aria-labelledby="provider-cta-heading">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" aria-hidden="true" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-6 text-white">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                <span>Für Umzugsfirmen</span>
              </div>
              
              {/* Header */}
              <h2 id="provider-cta-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
                Sie sind Umzugsfirma?
                <span className="block text-primary mt-1">Werden Sie Partner.</span>
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                Schliessen Sie sich über 200 geprüften Schweizer Umzugsfirmen an und erhalten Sie qualifizierte Kundenanfragen.
              </p>
              
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      </div>
                      <span className="text-white text-sm">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/fuer-firmen" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-cta group w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                    Partner werden
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/provider-login" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base font-semibold bg-transparent border-2 border-white/40 text-white hover:bg-white/10 w-full"
                  >
                    Einloggen
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right Content - Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary fill-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-white">Partner-Vorteile</div>
                    <div className="text-xs text-white/70">Ihr Weg zu mehr Aufträgen</div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                      className="text-center p-3 bg-white/10 rounded-xl"
                    >
                      <div className="text-xl md:text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-white/70">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Features List */}
                <div className="space-y-2.5">
                  {[
                    "Kostenlose Registrierung",
                    "Keine Grundgebühr",
                    "Nur zahlen bei Erfolg",
                    "Volle Budget-Kontrolle"
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: 0.4 + idx * 0.05 }}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" aria-hidden="true" />
                      <span className="text-white/90">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="absolute -top-3 -right-3 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg"
              >
                Jetzt starten →
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

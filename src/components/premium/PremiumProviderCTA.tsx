import { Building2, TrendingUp, Users, ArrowRight, CheckCircle, Sparkles, Star } from "lucide-react";
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

const stats = [
  { value: "200+", label: "Partner-Firmen" },
  { value: "15K+", label: "Vermittelte Umzüge" },
  { value: "98%", label: "Zufriedenheit" }
];

export const PremiumProviderCTA = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-foreground via-foreground to-foreground/95 text-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 border border-background/20 rounded-full text-sm font-medium mb-8"
              >
                <Building2 className="h-4 w-4" />
                <span>Für Umzugsfirmen</span>
              </motion.div>
              
              {/* Header */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Sie sind Umzugsfirma?
                <span className="block text-primary mt-2">Werden Sie Partner.</span>
              </h2>
              <p className="text-lg text-background/80 mb-8">
                Schliessen Sie sich über 200 geprüften Schweizer Umzugsfirmen an und erhalten Sie 
                qualifizierte Kundenanfragen direkt in Ihre Inbox.
              </p>
              
              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-background/90">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/fuer-firmen" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="h-12 sm:h-14 px-5 sm:px-8 text-base sm:text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-copper group w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                    <span className="hidden sm:inline">Partner werden</span>
                    <span className="sm:hidden">Partner</span>
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/provider-login" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-12 sm:h-14 px-5 sm:px-8 text-base sm:text-lg font-semibold bg-transparent border-2 border-background/30 text-background hover:bg-background/10 w-full"
                  >
                    Einloggen
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right Content - Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-background/10 backdrop-blur-sm rounded-3xl p-8 border border-background/20">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Partner-Vorteile</div>
                    <div className="text-sm text-background/60">Ihr Weg zu mehr Aufträgen</div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                      className="text-center p-4 bg-background/5 rounded-xl"
                    >
                      <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-background/60">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Features List */}
                <div className="space-y-3">
                  {[
                    "Kostenlose Registrierung",
                    "Keine Grundgebühr",
                    "Nur zahlen bei Erfolg",
                    "Volle Kontrolle über Ihr Budget"
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: 0.5 + idx * 0.05 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-background/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="absolute -top-4 -right-4 px-4 py-2 bg-success text-success-foreground rounded-full text-sm font-bold shadow-lg"
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

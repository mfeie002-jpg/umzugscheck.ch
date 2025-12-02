import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Target, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const AICalculatorShowcase = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 via-cyan-50 to-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
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
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-bold">
              <Sparkles className="h-4 w-4" />
              Schweizer KI-Innovation
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Der intelligente <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Umzugsrechner</span> für die Schweiz
            </h2>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Erhalten Sie eine präzise Kostenschätzung basierend auf Distanz, Volumen, Etage, Datum und mehr – in nur 2 Minuten
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-slate-900">Sofortige Preisspanne</h3>
                  <p className="text-slate-600">Erhalten Sie Ihre Kosteneinschätzung in unter 60 Sekunden</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-slate-900">Bessere Firmen zuerst</h3>
                  <p className="text-slate-600">KI-Ranking zeigt Ihnen die qualitativ besten Anbieter</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-slate-900">Sie entscheiden</h3>
                  <p className="text-slate-600">Nur ausgewählte Firmen kontaktieren Sie – kein Spam</p>
                </div>
              </div>
            </div>

            <Link to="/umzugsrechner">
              <Button size="lg" className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all">
                <Sparkles className="mr-2 h-5 w-5" />
                Jetzt Preis berechnen
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Video, Sparkles, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * KI Calculator Showcase - Prominent USP Section
 * Highlights Switzerland's first AI-powered moving calculator with video analysis
 */
export const KICalculatorShowcase = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            {/* Content */}
            <div className="space-y-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold text-accent">
                  SCHWEIZER INNOVATION
                </span>
              </motion.div>

              {/* Headline */}
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                  Erster KI-Rechner der Schweiz
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Revolutionäre Video-Analyse für präzise Umzugsofferten in Sekunden
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Video className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Video & Foto-Analyse
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Nehmen Sie ein Video auf oder laden Sie Fotos hoch – unsere KI analysiert automatisch Ihr Umzugsgut
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Sofortige Preis-Berechnung
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Erhalten Sie in unter 60 Sekunden eine präzise Kostenschätzung basierend auf echter KI-Technologie
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Höchste Genauigkeit
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Bis zu 40% genauer als traditionelle Schätzungen – powered by Google Gemini AI
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/rechner/video" className="no-underline">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto gradient-cta text-white font-bold shadow-accent hover:shadow-hover transition-all group"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    KI-Rechner jetzt testen
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/rechner" className="no-underline">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-primary/30 hover:border-primary hover:bg-primary/5"
                  >
                    Weitere Rechner ansehen
                  </Button>
                </Link>
              </div>

              {/* Trust Signal */}
              <div className="flex items-center gap-2 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">500+</span> Nutzer haben bereits mit unserem KI-Rechner Zeit und Geld gespart
                </p>
              </div>
            </div>

            {/* Visual/Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-strong border border-primary/20 bg-gradient-to-br from-background to-primary/5">
                {/* Mock Video Preview */}
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                  {/* Animated Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 animate-pulse" />
                  
                  {/* Center Icon */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
                    <Video className="w-10 h-10 text-white" />
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-4 right-4 w-16 h-16 rounded-lg bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-accent" />
                  </motion.div>

                  <motion.div
                    animate={{ 
                      y: [0, 10, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute bottom-4 left-4 w-12 h-12 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center"
                  >
                    <Zap className="w-6 h-6 text-primary" />
                  </motion.div>
                </div>

                {/* Info Bar */}
                <div className="p-4 bg-background/95 backdrop-blur-sm border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="font-medium text-foreground">KI-Analyse aktiv</span>
                    </div>
                    <span className="text-muted-foreground">Powered by Google Gemini</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 px-4 py-2 bg-accent rounded-full shadow-accent text-white font-bold text-sm"
              >
                NEU
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

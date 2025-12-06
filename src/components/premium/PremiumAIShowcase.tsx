import { Brain, Zap, Target, TrendingUp, ArrowRight, Sparkles, Camera, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { memo } from "react";

const benefits = [
  {
    icon: Target,
    title: "Präzise Kostenschätzung",
    description: "Basierend auf realen Schweizer Umzugsdaten"
  },
  {
    icon: Zap,
    title: "Sofortige Ergebnisse",
    description: "Passende Partner in Sekunden gefunden"
  },
  {
    icon: TrendingUp,
    title: "Lernender Algorithmus",
    description: "Wird mit jedem Umzug besser"
  }
];

export const PremiumAIShowcase = memo(() => {
  return (
    <section className="py-12 md:py-16 bg-muted/30 overflow-hidden" aria-labelledby="ai-showcase-heading">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full text-xs text-secondary font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Erster in der Schweiz
            </div>
            
            {/* Header */}
            <div>
              <h2 id="ai-showcase-heading" className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                KI-gestützter Umzugsrechner
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Laden Sie Fotos oder ein Video hoch – unsere AI berechnet Volumen, Aufwand und Kosten automatisch.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm md:text-base">{benefit.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/umzugsrechner">
                <Button size="lg" className="h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base font-semibold shadow-cta hover:shadow-lift transition-all w-full sm:w-auto">
                  <span className="hidden sm:inline">Zum Preisrechner</span>
                  <span className="sm:hidden">Preisrechner</span>
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/rechner/video">
                <Button size="lg" variant="outline" className="h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base font-semibold w-full sm:w-auto">
                  <Camera className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Foto/Video Upload</span>
                  <span className="sm:hidden">Foto Upload</span>
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/30 rounded-2xl blur-3xl" aria-hidden="true" />
            
            {/* Card */}
            <div className="relative bg-card rounded-2xl shadow-premium border border-border/50 p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Brain className="h-5 w-5 text-secondary-foreground" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm md:text-base">AI Umzugsrechner</h4>
                  <p className="text-xs text-muted-foreground">Echtzeit-Analyse</p>
                </div>
              </div>
              
              {/* Mock Calculator Preview */}
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-muted/50 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">Beispiel: Zürich → Bern</div>
                  <div className="font-semibold text-foreground text-sm">3.5-Zimmer-Wohnung</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-accent/50 rounded-xl border border-secondary/20">
                    <div className="text-xs text-muted-foreground mb-1">Geschätzter Preis</div>
                    <div className="text-xl md:text-2xl font-bold text-foreground">CHF 1'850</div>
                    <div className="text-xs text-muted-foreground">± 15%</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-xl border border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Dauer</div>
                    <div className="text-xl md:text-2xl font-bold text-foreground">6-8 Std.</div>
                    <div className="text-xs text-muted-foreground">inkl. An-/Abfahrt</div>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  <Camera className="h-3 w-3" aria-hidden="true" /> Foto-Analyse
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  <Video className="h-3 w-3" aria-hidden="true" /> Video-Scan
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Inventar-Erkennung
                </span>
              </div>
              
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">AI-Analyse</span>
                  <span className="text-secondary font-medium">Abgeschlossen</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-secondary to-primary rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

PremiumAIShowcase.displayName = 'PremiumAIShowcase';

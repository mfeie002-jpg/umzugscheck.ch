import { Brain, Zap, Target, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Target,
    title: "Präzise Kostenschätzung",
    description: "Basierend auf tausenden realen Schweizer Umzugsdaten"
  },
  {
    icon: Zap,
    title: "Sofortige Firmenempfehlungen",
    description: "Passende Partner in Sekundenschnelle gefunden"
  },
  {
    icon: TrendingUp,
    title: "Ständig lernend",
    description: "Der Algorithmus verbessert sich mit jedem Umzug"
  }
];

export const PremiumAIShowcase = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
            
            {/* Header */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Intelligenter Umzugsrechner mit AI
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Unser AI-System analysiert alle Parameter Ihres Umzugs und liefert präzise 
                Kostenschätzungen – basierend auf echten Daten aus tausenden Schweizer Umzügen.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-6">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* CTA */}
            <Link to="/umzugsrechner">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-copper hover:shadow-lift transition-all">
                Zum Preisrechner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          
          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/30 rounded-3xl blur-3xl" />
            
            {/* Card */}
            <div className="relative bg-card rounded-3xl shadow-deep border border-border/50 p-8 md:p-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Brain className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">AI Umzugsrechner</h4>
                  <p className="text-sm text-muted-foreground">Echtzeit-Analyse</p>
                </div>
              </div>
              
              {/* Mock Calculator Preview */}
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">Beispiel: Zürich → Bern</div>
                  <div className="font-semibold text-foreground">3.5-Zimmer-Wohnung</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-accent/50 rounded-xl border border-secondary/20">
                    <div className="text-xs text-muted-foreground mb-1">Geschätzter Preis</div>
                    <div className="text-2xl font-bold text-foreground">CHF 1'850</div>
                    <div className="text-xs text-muted-foreground">± 15%</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Geschätzte Dauer</div>
                    <div className="text-2xl font-bold text-foreground">6-8 Std.</div>
                    <div className="text-xs text-muted-foreground">inkl. An-/Abfahrt</div>
                  </div>
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AI-Analyse</span>
                  <span className="text-secondary font-medium">Abgeschlossen</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-secondary to-primary rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

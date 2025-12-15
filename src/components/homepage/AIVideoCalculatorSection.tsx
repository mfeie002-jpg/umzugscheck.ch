import { memo } from "react";
import { motion } from "framer-motion";
import { Video, Camera, Sparkles, Zap, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: Video,
    number: "1",
    title: "Video aufnehmen",
    description: "Filmen Sie Ihre Wohnung mit dem Smartphone – alle Räume in einem kurzen Rundgang.",
  },
  {
    icon: Sparkles,
    number: "2",
    title: "KI analysiert",
    description: "Unsere KI erkennt automatisch Möbel, Kartons und schätzt das Volumen ein.",
  },
  {
    icon: Zap,
    number: "3",
    title: "Sofort-Offerten",
    description: "Innerhalb von Minuten erhalten Sie präzise Preisschätzungen von passenden Firmen.",
  },
];

const benefits = [
  "Präzisere Kosteneinschätzung",
  "Keine manuelle Inventarliste nötig",
  "Firmen sehen genau, was zu tun ist",
  "Schnellere Angebotserstellung",
];

export const AIVideoCalculatorSection = memo(function AIVideoCalculatorSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-4 py-2 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Schweizer KI-Innovation</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Der <span className="text-primary">KI Video-Rechner</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl">
              Modernste Künstliche Intelligenz berechnet Ihre Umzugskosten in Sekunden – 
              basierend auf Entfernung, Volumen, Aufwand und historischen Daten.
            </p>

            {/* Steps */}
            <div className="space-y-4 py-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover shadow-glow"
                onClick={() => navigate('/umzugsrechner?tab=ai')}
              >
                <Video className="w-5 h-5 mr-2" />
                Video-Rechner starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30"
                onClick={() => navigate('/umzugsofferten')}
              >
                <Camera className="w-5 h-5 mr-2" />
                Foto-Upload
              </Button>
            </div>

            {/* Trust */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                Datenschutz garantiert
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% kostenlos
              </span>
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-premium border border-border">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop"
                alt="KI Video-Analyse"
                className="w-full h-auto"
                loading="lazy"
              />
              
              {/* Overlay with Analysis UI Mock */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border p-4 shadow-premium">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">KI-Analyse abgeschlossen</p>
                        <p className="text-xs text-muted-foreground">3.5-Zimmer-Wohnung erkannt</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-lg font-bold text-primary">42m³</p>
                        <p className="text-xs text-muted-foreground">Volumen</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-lg font-bold text-primary">~45</p>
                        <p className="text-xs text-muted-foreground">Kartons</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-lg font-bold text-secondary">CHF 1'280</p>
                        <p className="text-xs text-muted-foreground">Ab Preis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full shadow-cta font-semibold text-sm"
            >
              Neu: Video-KI
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

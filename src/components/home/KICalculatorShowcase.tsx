import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Video, Sparkles, Zap, ArrowRight, Upload, CheckCircle2, Play, Camera, TrendingDown, Clock, FileVideo } from "lucide-react";
import { motion } from "framer-motion";

/**
 * KI Video Calculator Showcase - Prominent USP Section
 * Highlights Switzerland's first AI-powered VIDEO moving calculator
 */
export const KICalculatorShowcase = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-secondary/5 via-primary/5 to-background border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full mb-4">
              <Video className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold text-secondary">SCHWEIZER INNOVATION</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              KI <span className="text-secondary">Video</span>-Umzugsrechner
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Filmen Sie einfach Ihre Wohnung – unsere KI berechnet automatisch Volumen, 
              Aufwand und findet die <span className="font-semibold text-foreground">günstigsten Anbieter</span>.
            </p>
          </motion.div>

          {/* Process Steps - How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {/* Step 1 - Upload */}
            <div className="relative bg-card rounded-2xl border border-border p-6 text-center group hover:border-secondary/50 transition-colors">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <FileVideo className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Video aufnehmen</h3>
              <p className="text-sm text-muted-foreground">
                Filmen Sie Ihre Wohnung mit dem Smartphone – 30-60 Sekunden reichen
              </p>
            </div>

            {/* Step 2 - AI Analysis */}
            <div className="relative bg-card rounded-2xl border border-border p-6 text-center group hover:border-primary/50 transition-colors">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">KI analysiert</h3>
              <p className="text-sm text-muted-foreground">
                Google Gemini AI erkennt automatisch Möbel, Kartons und Umzugsvolumen
              </p>
            </div>

            {/* Step 3 - Result */}
            <div className="relative bg-card rounded-2xl border border-border p-6 text-center group hover:border-primary/50 transition-colors">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <TrendingDown className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Beste Offerten</h3>
              <p className="text-sm text-muted-foreground">
                Erhalten Sie sofort Preise von passenden Umzugsfirmen – bis 40% sparen
              </p>
            </div>
          </motion.div>

          {/* Main Content - Visual Demo + Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            {/* Left - Video Demo Mockup */}
            <div className="relative order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border bg-card">
                {/* Phone Frame showing video upload */}
                <div className="aspect-[9/16] max-h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                  {/* Video Frame Overlay */}
                  <div className="absolute inset-4 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    {/* Animated Upload Icon */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-20 h-20 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/40 flex items-center justify-center mb-4"
                    >
                      <Play className="w-10 h-10 text-white ml-1" />
                    </motion.div>
                    <p className="text-white/80 text-sm font-medium mb-1">Video hochladen</p>
                    <p className="text-white/50 text-xs">oder mit Kamera aufnehmen</p>
                  </div>

                  {/* Floating Analysis Elements */}
                  <motion.div
                    animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-6 right-6 px-3 py-2 bg-primary/90 backdrop-blur-sm rounded-lg shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-white text-xs font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      KI aktiv
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-20 left-6 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
                  >
                    <div className="text-xs font-medium text-foreground">
                      <span className="text-primary">✓</span> Sofa erkannt
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-32 right-6 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
                  >
                    <div className="text-xs font-medium text-foreground">
                      <span className="text-primary">✓</span> 12 Kartons
                    </div>
                  </motion.div>
                </div>

                {/* Result Preview Bar */}
                <div className="p-4 bg-card border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-medium text-foreground text-sm">KI-Analyse abgeschlossen</span>
                    </div>
                    <span className="text-xs text-muted-foreground">~45 Sekunden</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-primary/5 rounded-lg">
                      <p className="text-lg font-bold text-primary">28m³</p>
                      <p className="text-[10px] text-muted-foreground">Volumen</p>
                    </div>
                    <div className="p-2 bg-primary/5 rounded-lg">
                      <p className="text-lg font-bold text-primary">~4h</p>
                      <p className="text-[10px] text-muted-foreground">Dauer</p>
                    </div>
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <p className="text-lg font-bold text-secondary">890.-</p>
                      <p className="text-[10px] text-muted-foreground">ab CHF</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 px-4 py-2 bg-secondary rounded-full shadow-lg text-white font-bold text-sm"
              >
                NEU
              </motion.div>
            </div>

            {/* Right - Features & CTA */}
            <div className="space-y-6 order-1 md:order-2">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Warum Video-Analyse?
                </h3>
                <p className="text-muted-foreground">
                  Traditionelle Schätzungen sind ungenau. Unser KI Video-Rechner sieht, 
                  was wirklich da ist – und berechnet präzise Kosten.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">In 60 Sekunden fertig</h4>
                    <p className="text-sm text-muted-foreground">
                      Schneller als jedes Formular – einfach filmen und hochladen
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">90% genauer als Schätzungen</h4>
                    <p className="text-sm text-muted-foreground">
                      KI erkennt jeden Gegenstand – keine vergessenen Möbel mehr
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Bis 40% günstiger</h4>
                    <p className="text-sm text-muted-foreground">
                      Präzise Daten = faire Preise – keine überteuerten Pauschalangebote
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/umzugsofferten?mode=video" className="no-underline flex-1">
                  <Button 
                    size="lg" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold shadow-lg group"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Video-Rechner starten
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/umzugsofferten" className="no-underline">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full border-primary/30 hover:border-primary hover:bg-primary/5"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Foto-Upload
                  </Button>
                </Link>
              </div>

              {/* Trust Signal */}
              <div className="flex items-center gap-3 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  100% kostenlos
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Keine Anmeldung
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  DSGVO-konform
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

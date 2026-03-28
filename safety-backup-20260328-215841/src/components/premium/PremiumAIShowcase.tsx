import { Zap, ArrowRight, Sparkles, Camera, Video, CheckCircle2, Clock, TrendingDown, Play, FileVideo, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { memo } from "react";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

export const PremiumAIShowcase = memo(() => {
  const isScreenshot = isScreenshotRenderMode();
  
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-secondary/5 via-primary/5 to-background overflow-hidden" aria-labelledby="ai-showcase-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={isScreenshot ? false : { opacity: 0, y: 20 }}
          whileInView={isScreenshot ? undefined : { opacity: 1, y: 0 }}
          animate={isScreenshot ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full mb-4">
            <Video className="w-4 h-4 text-secondary" />
            <span className="text-sm font-bold text-secondary">SCHWEIZER INNOVATION</span>
          </div>
          <h2 id="ai-showcase-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            KI <span className="text-secondary">Video</span>-Umzugsrechner
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Filmen Sie einfach Ihre Wohnung – unsere KI berechnet automatisch Volumen, 
            Aufwand und findet die <span className="font-semibold text-foreground">günstigsten Anbieter</span>.
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={isScreenshot ? false : { opacity: 0, y: 20 }}
          whileInView={isScreenshot ? undefined : { opacity: 1, y: 0 }}
          animate={isScreenshot ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10"
        >
          {/* Step 1 */}
          <div className="relative bg-card rounded-xl border border-border p-5 text-center group hover:border-secondary/50 transition-colors">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-sm">
              1
            </div>
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-secondary/10 flex items-center justify-center">
              <FileVideo className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">Video aufnehmen</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              30-60 Sekunden mit dem Smartphone filmen
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-card rounded-xl border border-border p-5 text-center group hover:border-primary/50 transition-colors">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
              2
            </div>
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">KI analysiert</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Google Gemini erkennt Möbel & Volumen automatisch
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-card rounded-xl border border-border p-5 text-center group hover:border-primary/50 transition-colors">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
              3
            </div>
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">Beste Offerten</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Sofort Preise von passenden Firmen – bis 40% sparen
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Phone Mockup */}
          <motion.div
            initial={isScreenshot ? false : { opacity: 0, x: -20 }}
            whileInView={isScreenshot ? undefined : { opacity: 1, x: 0 }}
            animate={isScreenshot ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative max-w-[300px] mx-auto">
              {/* Phone Frame */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900">
                {/* Screen */}
                <div className="aspect-[9/16] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                  {/* Upload UI */}
                  <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-full bg-secondary/30 backdrop-blur-sm border border-secondary/50 flex items-center justify-center mb-3"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </motion.div>
                    <p className="text-white/80 text-sm font-medium">Video hochladen</p>
                    <p className="text-white/50 text-xs">oder mit Kamera aufnehmen</p>
                  </div>

                  {/* Floating Analysis Labels */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 right-4 px-2.5 py-1.5 bg-primary/90 backdrop-blur-sm rounded-lg"
                  >
                    <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      KI aktiv
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-16 left-4 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg"
                  >
                    <div className="text-xs font-medium text-slate-800">
                      <span className="text-primary">✓</span> Sofa erkannt
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-28 right-4 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg"
                  >
                    <div className="text-xs font-medium text-slate-800">
                      <span className="text-primary">✓</span> 12 Kartons
                    </div>
                  </motion.div>
                </div>

                {/* Result Bar */}
                <div className="p-3 bg-white border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-medium text-slate-800 text-xs">KI-Analyse fertig</span>
                    </div>
                    <span className="text-[10px] text-slate-500">~45 Sek.</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 bg-primary/5 rounded-lg">
                      <p className="text-sm font-bold text-primary">28m³</p>
                      <p className="text-[9px] text-slate-500">Volumen</p>
                    </div>
                    <div className="p-1.5 bg-primary/5 rounded-lg">
                      <p className="text-sm font-bold text-primary">~4h</p>
                      <p className="text-[9px] text-slate-500">Dauer</p>
                    </div>
                    <div className="p-1.5 bg-secondary/10 rounded-lg">
                      <p className="text-sm font-bold text-secondary">890.-</p>
                      <p className="text-[9px] text-slate-500">ab CHF</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEU Badge */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 px-3 py-1.5 bg-secondary rounded-full shadow-lg text-white font-bold text-xs"
              >
                NEU
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right Column - Features & CTA */}
          <motion.div
            initial={isScreenshot ? false : { opacity: 0, x: 20 }}
            whileInView={isScreenshot ? undefined : { opacity: 1, x: 0 }}
            animate={isScreenshot ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5 order-1 lg:order-2"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Warum Video-Analyse?
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Traditionelle Schätzungen sind ungenau. Unser KI Video-Rechner sieht, 
                was wirklich da ist – und berechnet präzise Kosten.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">In 60 Sekunden fertig</h4>
                  <p className="text-xs text-muted-foreground">
                    Schneller als jedes Formular – einfach filmen und hochladen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">90% genauer als Schätzungen</h4>
                  <p className="text-xs text-muted-foreground">
                    KI erkennt jeden Gegenstand – keine vergessenen Möbel mehr
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Bis 40% günstiger</h4>
                  <p className="text-xs text-muted-foreground">
                    Präzise Daten = faire Preise – keine überteuerten Pauschalangebote
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Link to="/rechner/video" className="flex-1">
                <Button size="lg" className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold shadow-lg group">
                  <Video className="w-5 h-5 mr-2" />
                  Video-Rechner starten
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button size="lg" variant="outline" className="w-full h-12 border-primary/30 hover:border-primary hover:bg-primary/5">
                  <Camera className="w-5 h-5 mr-2" />
                  Foto-Upload
                </Button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                100% kostenlos
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Keine Anmeldung
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                DSGVO-konform
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

PremiumAIShowcase.displayName = 'PremiumAIShowcase';

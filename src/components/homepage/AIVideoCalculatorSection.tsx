import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Video, Camera, Sparkles, Zap, ArrowRight, CheckCircle, Shield, Lock, Upload, FileVideo, Eye, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    icon: Video,
    number: "1",
    title: "Video aufnehmen",
    description: "Filmen Sie Ihre Wohnung mit dem Smartphone – alle Räume in einem kurzen Rundgang (max. 3 Min).",
    detail: "Tipp: Beginnen Sie im Eingang und gehen Sie systematisch durch jeden Raum.",
  },
  {
    icon: Upload,
    number: "2",
    title: "Video hochladen",
    description: "Laden Sie Ihr Video sicher hoch. Unterstützte Formate: MP4, MOV (max. 200 MB).",
    detail: "Der Upload erfolgt verschlüsselt über sichere Schweizer Server.",
  },
  {
    icon: Sparkles,
    number: "3",
    title: "KI analysiert",
    description: "Unsere KI erkennt automatisch Möbel, Kartons und schätzt das Volumen ein.",
    detail: "Die Analyse dauert nur 30-60 Sekunden.",
  },
  {
    icon: Zap,
    number: "4",
    title: "Sofort-Offerten",
    description: "Innerhalb von Minuten erhalten Sie präzise Preisschätzungen von passenden Firmen.",
    detail: "Firmen sehen Ihr Video und können genau einschätzen, was zu tun ist.",
  },
];

const benefits = [
  "Präzisere Kosteneinschätzung (+30% genauer)",
  "Keine manuelle Inventarliste nötig",
  "Firmen sehen genau, was zu tun ist",
  "Schnellere Offertenerstellung",
];

const privacyFeatures = [
  {
    icon: Lock,
    title: "Ende-zu-Ende-Verschlüsselung",
    description: "Ihr Video wird verschlüsselt übertragen und gespeichert.",
  },
  {
    icon: Trash2,
    title: "Automatische Löschung",
    description: "Videos werden nach 30 Tagen automatisch gelöscht.",
  },
  {
    icon: Eye,
    title: "Eingeschränkter Zugriff",
    description: "Nur von Ihnen ausgewählte Firmen können das Video sehen.",
  },
  {
    icon: Shield,
    title: "Schweizer Datenschutz",
    description: "Hosting auf Schweizer Servern nach DSG-Standard.",
  },
];

const comparisonData = [
  { feature: "Zeitaufwand", video: "3 Minuten", classic: "15-30 Minuten" },
  { feature: "Genauigkeit", video: "+30% genauer", classic: "Schätzung" },
  { feature: "Inventarliste", video: "Automatisch", classic: "Manuell" },
  { feature: "Offerten-Zeit", video: "< 24 Std.", classic: "2-3 Tage" },
];

export const AIVideoCalculatorSection = memo(function AIVideoCalculatorSection() {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
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
              Der <span className="text-primary">Smart Video-Rechner</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl">
              <strong className="text-foreground">Optional:</strong> Laden Sie ein Video Ihrer Wohnung hoch für eine präzisere Schätzung. 
              Unser System erkennt automatisch Möbel und berechnet das Volumen – Sie sparen Zeit bei der Eingabe.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>Das Video ist <strong>optional</strong> – Sie können auch ohne Video Offerten erhalten.</span>
            </div>

            {/* Steps with Accordion */}
            <div className="space-y-3 py-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value={step.number} className="border rounded-lg bg-card/50">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <step.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <span className="text-xs text-primary font-semibold">Schritt {step.number}</span>
                            <h3 className="font-semibold text-sm">{step.title}</h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                        <p className="text-xs text-primary/80 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          {step.detail}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
                className="bg-primary hover:bg-primary/90 shadow-lg"
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
              <button 
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span className="underline underline-offset-2">Datenschutz garantiert</span>
              </button>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% kostenlos
              </span>
            </div>
          </motion.div>

          {/* Right - Visual & Privacy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Main Visual */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop"
                alt="KI Video-Analyse"
                className="w-full h-auto"
                loading="lazy"
              />
              
              {/* Overlay with Analysis UI Mock */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border p-4 shadow-xl">
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

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full shadow-lg font-semibold text-xs"
              >
                Neu: Video-KI
              </motion.div>
            </div>

            {/* Video vs Classic Comparison */}
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-primary" />
                  Video-Rechner vs. Klassisch
                </h4>
                <div className="space-y-2">
                  {comparisonData.map((row, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                      <span className="text-muted-foreground">{row.feature}</span>
                      <span className="text-primary font-medium text-center">{row.video}</span>
                      <span className="text-muted-foreground text-center">{row.classic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Section */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: showPrivacy ? 'auto' : 0, opacity: showPrivacy ? 1 : 0 }}
              className="overflow-hidden"
            >
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-green-800">
                    <Shield className="w-4 h-4" />
                    Datenschutz & Sicherheit
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {privacyFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <feature.icon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-green-800">{feature.title}</p>
                          <p className="text-xs text-green-700/80">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-700">
                      <strong>Dateiformate:</strong> MP4, MOV | <strong>Max. Größe:</strong> 200 MB | <strong>Speicherung:</strong> Schweiz
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Always visible privacy hint */}
            {!showPrivacy && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Videos werden verschlüsselt und nach 30 Tagen gelöscht</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
});

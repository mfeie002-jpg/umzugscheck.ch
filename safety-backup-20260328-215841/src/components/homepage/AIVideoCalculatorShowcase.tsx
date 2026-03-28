import { memo } from "react";
import { motion } from "framer-motion";
import { Video, Camera, Sparkles, Zap, Brain, CheckCircle, ArrowRight, Award, Clock, Shield, Target, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const AIVideoCalculatorShowcase = memo(function AIVideoCalculatorShowcase() {
  const features = [
    {
      icon: Video,
      title: "Video-Analyse",
      description: "Filmen Sie Ihre Räume ab – unser System erkennt automatisch Möbel, Volumen und Besonderheiten",
      badge: "Weltneuheit"
    },
    {
      icon: Camera,
      title: "Foto-Upload",
      description: "Laden Sie Fotos Ihrer Wohnung hoch für eine präzisere Schätzung als jeder manuelle Rechner",
      badge: null
    },
    {
      icon: Brain,
      title: "Smart-Objekterkennung",
      description: "Erkennt Schränke, Sofas, Betten, Kartons – und berechnet das exakte Transportvolumen",
      badge: null
    }
  ];

  const benefits = [
    { icon: Zap, text: "90% genauere Schätzung als manuelle Eingabe" },
    { icon: Clock, text: "In 60 Sekunden statt 10 Minuten Formular" },
    { icon: Target, text: "Automatische Erkennung von Spezialtransporten (Klavier, Tresor, etc.)" },
    { icon: Shield, text: "Ihre Videos werden nach Analyse sofort gelöscht" }
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />
      
      <div className="container relative z-10 px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Innovation Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 text-sm font-bold shadow-lg">
              <Award className="w-4 h-4 mr-2" />
              Schweizer Innovation 2025
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Der <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">erste Smart Video-Rechner</span> der Schweiz
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Revolutionär: Filmen Sie einfach Ihre Wohnung ab – unser intelligentes System analysiert 
            das Video und berechnet Ihren Umzugspreis <strong>automatisch und präzise</strong>.
          </p>

          {/* USP Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Einzigartig in der Schweiz
            </span>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Video className="w-4 h-4" />
              Video & Foto Support
            </span>
            <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Smart Analyse
            </span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left: Video Demo Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-premium border border-border bg-card">
              {/* Video Player Mockup */}
              <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 relative">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Wohnungsaufnahme für Video-Analyse"
                  className="w-full h-full object-cover opacity-60"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl cursor-pointer"
                  >
                    <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                  </motion.div>
                </div>
                
                {/* AI Analysis Overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-white text-sm font-medium">System analysiert Video...</span>
                    <div className="ml-auto flex gap-1">
                      <div className="w-2 h-4 bg-primary rounded animate-pulse" />
                      <div className="w-2 h-6 bg-primary rounded animate-pulse delay-75" />
                      <div className="w-2 h-5 bg-primary rounded animate-pulse delay-150" />
                    </div>
                  </div>
                </div>

                {/* Detected Objects */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-white text-xs mb-2 opacity-70">Erkannte Objekte:</div>
                    <div className="flex flex-wrap gap-2">
                      {["Sofa 3-Sitzer", "Schrank gross", "Bett 160cm", "Kartons ×12", "Klavier"].map((item, i) => (
                        <span key={i} className="bg-primary/80 text-white text-xs px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Preview */}
              <div className="p-4 md:p-6 bg-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Geschätztes Volumen</div>
                    <div className="text-2xl font-bold">32 m³</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Preisschätzung</div>
                    <div className="text-2xl font-bold text-secondary">CHF 1'280 – 1'650</div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Genauigkeit: 85% (steigt mit mehr Aufnahmen)
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-4 -right-4 md:-right-8"
            >
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Nur bei uns
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-xl p-4 md:p-5 hover:shadow-medium transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        {feature.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits List */}
            <div className="bg-muted/30 rounded-xl p-4 md:p-5 border border-border">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Ihre Vorteile
              </h4>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/umzugsrechner?tab=ai" className="flex-1">
                <Button 
                  size="lg" 
                  className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold shadow-cta"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Video-Rechner starten
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/umzugsrechner" className="flex-1 sm:flex-initial">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-14"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Mit Foto starten
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* How it Works - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-xl font-bold text-center mb-6">So funktioniert der Video-Rechner</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Video aufnehmen", desc: "Filmen Sie alle Räume mit Ihrem Smartphone ab (30-60 Sekunden pro Raum)" },
              { step: "2", title: "Hochladen", desc: "Laden Sie das Video direkt in unseren Rechner hoch – sicher und verschlüsselt" },
              { step: "3", title: "Smart-Analyse", desc: "Unser System erkennt alle Möbel und berechnet Volumen, Gewicht und Komplexität" },
              { step: "4", title: "Preisvergleich", desc: "Erhalten Sie sofort passende Offerten von geprüften Umzugsfirmen" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default AIVideoCalculatorShowcase;

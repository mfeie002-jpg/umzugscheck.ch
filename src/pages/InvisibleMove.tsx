import { Helmet } from "react-helmet";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  Camera, Sparkles, Shield, Truck, Home, 
  Scan, Building2, FileCheck, MapPin, CheckCircle2,
  ArrowRight, Zap, Target, Eye, Brain, Clock,
  Award, TrendingUp, Lock, Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Phase data
const phases = [
  {
    id: 1,
    name: "Visualisierung",
    title: "Die Magische Linse",
    subtitle: "Vom Tippen zum Scannen",
    icon: Camera,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    description: "Vergiss Formulare. Richte einfach deine Kamera auf dein Zuhause. Unsere KI erkennt jedes Möbelstück, schätzt Volumen und erstellt deinen Digitalen Zwilling in Echtzeit.",
    features: [
      { icon: Scan, text: "AR Walkthrough Mode" },
      { icon: Brain, text: "KI-Objekterkennung" },
      { icon: Eye, text: "3D Dollhouse Modell" }
    ],
    visual: "walkthrough"
  },
  {
    id: 2,
    name: "Marktplatz",
    title: "Das Matching",
    subtitle: "Firmen bieten auf dich",
    icon: Target,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    description: "Dein verifizierter Digitaler Zwilling wird anonymisiert ausgeschrieben. Umzugsfirmen sehen präzise Daten und bieten transparent – keine Überraschungen, keine Nachforderungen.",
    features: [
      { icon: TrendingUp, text: "Reverse Auction" },
      { icon: Leaf, text: "Green Slots (Leerfahrten)" },
      { icon: Shield, text: "Preisgarantie via Smart Contract" }
    ],
    visual: "auction"
  },
  {
    id: 3,
    name: "Bürokratie",
    title: "Der Auto-Admin",
    subtitle: "Wir erledigen den Papierkram",
    icon: FileCheck,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    description: "Kündigung, Anmeldung, Versicherung – alles automatisch. Wir generieren deine Dokumente, versenden sie per Einschreiben und tracken jeden Schritt.",
    features: [
      { icon: Building2, text: "eUmzugCH Integration" },
      { icon: Lock, text: "Rechtssichere Kündigung" },
      { icon: Zap, text: "Automatische Utility-Switches" }
    ],
    visual: "documents"
  },
  {
    id: 4,
    name: "Ausführung",
    title: "Tactical Ops",
    subtitle: "Dein Kommandozentrum",
    icon: Truck,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-500/10",
    description: "Am Umzugstag siehst du alles live. Wo ist der LKW? Wann kommt das Team? Bei Schäden: Kamera drauf – die KI vergleicht mit dem Vorscan.",
    features: [
      { icon: MapPin, text: "Live-Tracking wie Uber" },
      { icon: Clock, text: "Digitaler Arbeitszeit-Timer" },
      { icon: Camera, text: "Damage Control AR" }
    ],
    visual: "tracking"
  },
  {
    id: 5,
    name: "Landung",
    title: "Das Nesting",
    subtitle: "Garantierte Übergabe",
    icon: Home,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    description: "Die Reinigungsfirma wird erst bezahlt, wenn der Vermieter digital unterschreibt. Bei Diskussionen zeigt die App die Lebensdauertabelle – fair für alle.",
    features: [
      { icon: CheckCircle2, text: "Digitales HEV-Protokoll" },
      { icon: Shield, text: "Abnahmegarantie 2.0" },
      { icon: Home, text: "Nachbarschafts-Concierge" }
    ],
    visual: "handover"
  }
];

// Hero Section
const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/5 to-pink-500/5 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <motion.div style={{ y, opacity }} className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-primary/30 bg-primary/5">
            <Award className="w-4 h-4 mr-2" />
            Vision 2026 · Digital Marketing Award Candidate
          </Badge>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The Invisible
          <br />
          <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Move
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Der Umzug der Zukunft hat kein Formular. Keine Listen. Keine Überraschungen.
          <br className="hidden md:block" />
          <span className="text-foreground font-medium">Nur Magie.</span>
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90" asChild>
            <Link to="/umzugsofferten">
              <Sparkles className="w-5 h-5 mr-2" />
              Jetzt erleben
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
            <a href="#phases">
              Die 5 Phasen entdecken
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { value: "0", label: "Formulare", suffix: "" },
            { value: "100", label: "Preisgarantie", suffix: "%" },
            { value: "5", label: "Minuten Setup", suffix: "min" },
            { value: "24/7", label: "KI-Concierge", suffix: "" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                {stat.value}<span className="text-primary">{stat.suffix}</span>
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

// Philosophy Section
const PhilosophySection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4">Das Manifest</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Der Anti-Rechner
          </h2>
          <p className="text-xl text-muted-foreground">
            Traditionelle Plattformen wälzen die Komplexität auf dich ab. Du schätzt Volumen, 
            du listest Möbel, du hoffst auf Genauigkeit. <span className="text-foreground font-medium">Das ist vorbei.</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Camera,
              title: "Visualisieren statt Tippen",
              description: "Zeig uns deine Wohnung. Die KI erkennt alles – präziser als jede Schätzung."
            },
            {
              icon: Brain,
              title: "Agentisch statt Manuell",
              description: "KI-Agenten verhandeln, buchen und verwalten. Du triffst nur die wichtigen Entscheidungen."
            },
            {
              icon: Shield,
              title: "Garantiert statt Gehofft",
              description: "Smart Contracts sichern jeden Preis. Keine Nachforderungen. Nie."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 h-full hover:border-primary/30 transition-colors">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Phase Card Component
const PhaseCard = ({ phase, index }: { phase: typeof phases[0]; index: number }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
    >
      {/* Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg`}>
            <phase.icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <Badge variant="outline" className="mb-1">Phase {phase.id}</Badge>
            <h3 className="text-sm font-medium text-muted-foreground">{phase.name}</h3>
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">{phase.title}</h2>
          <p className="text-lg text-primary font-medium">{phase.subtitle}</p>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {phase.description}
        </p>

        <div className="grid gap-3">
          {phase.features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-lg ${phase.bgColor} flex items-center justify-center`}>
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visual */}
      <div className="flex-1 w-full">
        <div className={`relative aspect-[4/3] rounded-3xl bg-gradient-to-br ${phase.color} p-1`}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />
          <div className="relative h-full rounded-[22px] bg-card/95 backdrop-blur overflow-hidden flex items-center justify-center">
            <PhaseVisual phase={phase} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Phase Visual Component
const PhaseVisual = ({ phase }: { phase: typeof phases[0] }) => {
  const visualContent = {
    walkthrough: (
      <div className="text-center p-8">
        <motion.div 
          className="relative w-48 h-48 mx-auto mb-6"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-2xl" />
          <div className="absolute inset-4 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-xl flex items-center justify-center">
            <Home className="w-16 h-16 text-primary/60" />
          </div>
          <motion.div 
            className="absolute -right-2 -top-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Scan className="w-4 h-4 text-white" />
          </motion.div>
        </motion.div>
        <p className="text-sm text-muted-foreground">3D Digitaler Zwilling</p>
      </div>
    ),
    auction: (
      <div className="p-8 space-y-4">
        {[
          { name: "Saver", price: "890", badge: "Günstigste", color: "bg-emerald-500" },
          { name: "Balanced", price: "1'240", badge: "Empfohlen", color: "bg-primary" },
          { name: "Royal", price: "1'890", badge: "Premium", color: "bg-violet-500" }
        ].map((option, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`p-4 rounded-xl border ${i === 1 ? 'border-primary bg-primary/5' : 'border-border/50'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${option.color}`} />
                <span className="font-medium">{option.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">CHF {option.price}</div>
                <Badge variant="secondary" className="text-xs">{option.badge}</Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    ),
    documents: (
      <div className="p-8">
        <div className="space-y-3">
          {[
            { text: "Kündigung generiert", done: true },
            { text: "Einschreiben versendet", done: true },
            { text: "eUmzug gemeldet", done: true },
            { text: "EWZ informiert", done: false }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                {item.done && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    tracking: (
      <div className="p-8 relative">
        <div className="aspect-square max-w-[200px] mx-auto relative">
          <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/20 rounded-full" />
          <motion.div 
            className="absolute w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
            animate={{ 
              rotate: 360,
              x: [0, 80, 80, 0, 0],
              y: [0, 0, 80, 80, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Truck className="w-6 h-6 text-white" />
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full" />
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">Live-Tracking aktiv</p>
      </div>
    ),
    handover: (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <h4 className="font-semibold text-lg mb-2">Übergabe erfolgreich</h4>
        <p className="text-sm text-muted-foreground">Digital signiert am 15.03.2026</p>
      </div>
    )
  };

  return visualContent[phase.visual as keyof typeof visualContent] || null;
};

// Phases Section
const PhasesSection = () => {
  return (
    <section id="phases" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <Badge variant="secondary" className="mb-4">Die 5 Phasen</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Von A bis Z, ohne Stress
          </h2>
          <p className="text-xl text-muted-foreground">
            Jede Phase deines Umzugs wird von KI-Agenten orchestriert. 
            Du behältst die Kontrolle, wir erledigen die Arbeit.
          </p>
        </motion.div>

        <div className="space-y-24 lg:space-y-32">
          {phases.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-pink-600" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Bereit für die Zukunft?
          </Badge>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white">
            Dein Umzug verdient Magie
          </h2>
          
          <p className="text-xl text-white/80 mb-10">
            Teste jetzt den Archetyp der Branche. Kostenlos, unverbindlich, 
            und mit 100% Preisgarantie.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link to="/umzugsofferten">
                <Camera className="w-5 h-5 mr-2" />
                Walkthrough starten
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link to="/preisrechner">
                Klassisch berechnen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main Page Component
const InvisibleMove = () => {
  return (
    <>
      <Helmet>
        <title>The Invisible Move | Umzugscheck.ch Vision 2026</title>
        <meta name="description" content="Der Umzug der Zukunft: Keine Formulare, keine Listen, keine Überraschungen. Erlebe den Archetyp der Schweizer Umzugsbranche." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Minimal Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="font-heading font-bold text-xl">
              umzugscheck<span className="text-primary">.ch</span>
            </Link>
            <Button size="sm" asChild>
              <Link to="/umzugsofferten">
                <Sparkles className="w-4 h-4 mr-2" />
                Jetzt starten
              </Link>
            </Button>
          </div>
        </header>

        <main className="pt-16">
          <HeroSection />
          <PhilosophySection />
          <PhasesSection />
          <CTASection />
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2025 Umzugscheck.ch · Vision 2026 · Archetyp der Branche</p>
            <p className="mt-2">
              <Link to="/" className="hover:text-primary transition-colors">
                Zurück zur Hauptseite
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default InvisibleMove;

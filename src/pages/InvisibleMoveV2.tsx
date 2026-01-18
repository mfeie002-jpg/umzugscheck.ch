import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  ShoppingCart, 
  FileText, 
  Truck, 
  Home,
  Shield,
  Leaf,
  Zap,
  Eye,
  Brain,
  Smartphone,
  Database,
  Lock,
  Award,
  AlertTriangle,
  Calculator,
  FormInput,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingDown,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFlowPath } from '@/hooks/useUnifiedAB';

// Hero Section
const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary/20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-40" />

      <div className="container relative z-10 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Digital Marketing Award 2026</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Der</span>{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Unsichtbare
            </span>{' '}
            <span className="text-white">Umzug</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Erlebe deinen nächsten Umzug nicht als nervenaufreibende Aufgabe, sondern als{' '}
            <span className="text-primary font-semibold">magisches Erlebnis</span>. 
            Statt Formulare auszufüllen, zeigst du uns einfach deine Räume – 
            intelligente Agenten erledigen den Rest.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-14 px-8 text-lg font-semibold shadow-2xl shadow-primary/25"
            >
              <Link to="/umzugsofferten">
                <Camera className="w-5 h-5 mr-2" />
                Jetzt Räume zeigen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 h-14 px-8 text-lg"
            >
              <Link to="/invisible-move">
                Version 1 ansehen
              </Link>
            </Button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Eye, label: 'Zeigen statt Tippen', value: 'Visual First' },
              { icon: Shield, label: 'Smart Contracts', value: 'Preisgarantie' },
              { icon: Leaf, label: 'Green Slots', value: 'CO₂ sparen' },
              { icon: Zap, label: 'KI-gesteuert', value: 'Automatisiert' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
});

// Problem Section
const ProblemSection = memo(function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Versteckte Kosten & Betrug',
      description: 'Betrügerische Firmen kassieren Vorauszahlungen und erhöhen dann den Preis oder halten Gegenstände als "Geiseln" zurück.',
      source: 'washingtonpost.com',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Calculator,
      title: 'Fehlerhafte Kostenschätzungen',
      description: 'Traditionelle Rechner basieren auf groben Schätzungen. Selbst kleinere Fehler bei der Volumenschätzung führen zu Tausenderbeträgen Nachzahlung.',
      source: 'movu.ch',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      icon: FormInput,
      title: 'Zu viele Formulare',
      description: 'Nutzer empfinden Formulare als lästig und brechen häufig ab, wenn zu viele Felder ausgefüllt werden müssen.',
      source: 'nngroup.com',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Warum die Branche einen{' '}
            <span className="text-red-400">Wandel</span> braucht
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Die Umzugsbranche ist von fundamentalen Problemen geplagt
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${problem.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <problem.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{problem.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-4">{problem.description}</p>
              <span className="text-xs text-slate-500 font-mono">Quelle: {problem.source}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Solution Phases Section
const SolutionSection = memo(function SolutionSection() {
  const phases = [
    {
      number: '01',
      icon: Camera,
      title: 'Visualisierung & Digital Twin',
      subtitle: 'Zeige statt tippen',
      description: 'Du öffnest die App, aktivierst den Walkthrough-Modus und gehst mit der Kamera durch deine Wohnung. Unsere KI erfasst Möbel, Kartons und sogar den Zustand von Oberflächen.',
      features: [
        'Digitaler Zwilling in Echtzeit',
        'Volumen (m³), Gewicht & Material',
        'Generative-UI Technologie',
        'Gamification: Behalten, Verkaufen, Entsorgen'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      icon: ShoppingCart,
      title: 'Marktplatz & Reverse Auction',
      subtitle: 'Firmen bieten auf dich',
      description: 'Statt Angebote mühsam zu vergleichen, startet eine Reverse-Auction. Verifizierte Umzugsfirmen sehen dein anonymisiertes Volumen und bieten darauf.',
      features: [
        'Reverse Auction System',
        'Green Slots für Leerfahrten',
        'Anonymisierte Ausschreibung',
        'Mikro-Versicherungen per Fingertipp'
      ],
      color: 'from-emerald-500 to-green-500'
    },
    {
      number: '03',
      icon: FileText,
      title: 'Auto-Admin für Behörden',
      subtitle: 'Bürokratie automatisiert',
      description: 'Kündigungsschreiben werden automatisch generiert, per Einschreiben versendet und per Tracking belegt. Integration mit eUmzugCH und automatische Utility-Umschaltung.',
      features: [
        'Automatische Kündigung per Einschreiben',
        'eUmzugCH Integration',
        'Strom, Internet & Versicherung',
        'Kautions-Brücke Finanzierung'
      ],
      color: 'from-violet-500 to-purple-500'
    },
    {
      number: '04',
      icon: Truck,
      title: 'Ausführung in Echtzeit',
      subtitle: 'Dein Command Center',
      description: 'Am Umzugstag siehst du, wo sich der LKW befindet, startest den offiziellen Timer via QR-Code und erhältst Push-Benachrichtigungen – auch offline.',
      features: [
        'Live LKW-Tracking',
        'QR-Code Arbeitszeit-Timer',
        'PWA für Offline-Nutzung',
        'Schaden-Dokumentation mit KI'
      ],
      color: 'from-orange-500 to-amber-500'
    },
    {
      number: '05',
      icon: Home,
      title: 'Landing & Integration',
      subtitle: 'Das Ende ist der Anfang',
      description: 'Die Reinigungsfirma wird erst bezahlt, wenn der Vermieter das digitale Abnahmeprotokoll unterschreibt. Danach wird die App zu deinem Nachbarschafts-Concierge.',
      features: [
        'Digitales Abnahmeprotokoll',
        'Paritätische Lebensdauertabelle',
        'Abfallkalender & Recycling-Tipps',
        'Lokale Services im neuen Quartier'
      ],
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-primary font-semibold mb-4">DIE LÖSUNG</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            So funktioniert der{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Invisible Move
            </span>
          </h2>
        </motion.div>

        <div className="space-y-8 max-w-5xl mx-auto">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-8 md:p-10 hover:border-slate-700 transition-all">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Phase Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-2xl`}>
                      <phase.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-6xl font-black text-slate-800 mt-4 hidden md:block">{phase.number}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">{phase.subtitle}</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">{phase.title}</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">{phase.description}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      {phase.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Technology Section
const TechnologySection = memo(function TechnologySection() {
  const technologies = [
    {
      icon: Brain,
      title: 'Generative UI',
      description: 'Die KI erzeugt das Interface dynamisch basierend auf deinem Kontext – ein Paradigmenwechsel im Design.',
      source: 'uxplanet.org'
    },
    {
      icon: TrendingDown,
      title: 'EAS-Framework',
      description: 'Eliminate → Automate → Simplify. Weniger manuelle Eingabe, automatisierte Datenerfassung, vereinfachte Schritte.',
      source: 'nngroup.com'
    },
    {
      icon: WifiOff,
      title: 'Offline-fähige PWA',
      description: 'Offline-Zugriff, Push-Benachrichtigungen und schnelle Ladezeiten – auch bei schwacher Verbindung.',
      source: 'phoenixbizz.com'
    },
    {
      icon: Smartphone,
      title: 'AR, LiDAR & Vision',
      description: 'ARKit/ARCore und LiDAR-Sensoren für präzise volumetrische Messungen und Objekterkennung.'
    },
    {
      icon: Database,
      title: 'Graph-Datenbank',
      description: 'Beziehungen zwischen Objekten, Räumen, Fahrzeugen und Routen werden intelligent modelliert.'
    },
    {
      icon: Lock,
      title: 'Smart Contracts',
      description: 'Zahlungen und Versicherungen erfolgen transparent über Smart Contracts – unveränderbar und sicher.'
    }
  ];

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-semibold mb-4">TECHNOLOGIE</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Die Technologie, die den{' '}
            <span className="text-secondary">Unterschied</span> macht
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-primary/30 transition-all group"
            >
              <tech.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{tech.description}</p>
              {tech.source && (
                <span className="text-xs text-slate-500 font-mono mt-3 block">Quelle: {tech.source}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Trust Section
const TrustSection = memo(function TrustSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="inline-block text-primary font-semibold mb-4">VERTRAUEN</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Geschäftsmodell & Vertrauen
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Transparente Preise</h3>
              <p className="text-slate-400 text-sm">
                Jede Leistung wird im Smart Contract fixiert, sodass der Endpreis nicht plötzlich steigt.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 text-center">
              <Zap className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">FinTech & InsurTech</h3>
              <p className="text-slate-400 text-sm">
                Mikro-Versicherungen und Kautions-Brücke sind nahtlos integriert – mit einem Tap abschliessbar.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 text-center">
              <Lock className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Datenhoheit</h3>
              <p className="text-slate-400 text-sm">
                Dein digitaler Zwilling wird in der Schweiz gespeichert. Bei Ausschreibungen bleibst du anonym.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

// Story Section (Sarah)
const StorySection = memo(function StorySection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="inline-block text-secondary font-semibold mb-4">BEISPIEL</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stell dir vor …
            </h2>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div className="hidden md:block flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                  <span className="text-white font-semibold">Sarah</span>, eine junge Familie, will in drei Monaten von Zürich nach Lausanne ziehen. 
                  Statt endloser Tabellen scannt Sarah ihre Wohnung mit dem Handy. In wenigen Minuten entsteht ein digitaler Zwilling; 
                  kurz darauf erhält sie drei visualisierte Angebotsoptionen. Sie entscheidet sich für die{' '}
                  <span className="text-primary font-semibold">"Green Slot"-Variante</span>, spart Geld und reduziert ihren CO₂-Abdruck.
                </p>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed mt-4">
                  Das System kündigt ihre alte Wohnung fristgerecht, schaltet Strom und Internet um und bietet sogar eine Kautions-Überbrückung an. 
                  Am Umzugstag trackt sie den LKW live und dokumentiert einen kleinen Kratzer, der sich als bereits vorhanden herausstellt. 
                  Eine Woche später begrüsst sie der <span className="text-secondary font-semibold">Nachbarschafts-Concierge</span> im neuen Quartier.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

// Final CTA Section
const FinalCTASection = memo(function FinalCTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-slate-900 to-secondary/10 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full px-6 py-2 mb-8">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">Digital Marketing Award 2026</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Warum wir 2026{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              gewinnen werden
            </span>
          </h2>

          <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Die Kombination aus visueller Interaktion, KI-basierter Orchestrierung und vollautomatischer Verwaltung 
            schafft ein unsichtbares Erlebnis. Der Nutzer muss kaum mehr Entscheidungen treffen, Inputs eingeben oder Dokumente suchen. 
            Dieses System löst die klassischen Schwachpunkte der Branche radikal auf.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-14 px-10 text-lg font-semibold shadow-2xl shadow-primary/25"
            >
              <Link to="/umzugsofferten">
                <Sparkles className="w-5 h-5 mr-2" />
                Invisible Move erleben
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          <p className="text-slate-500 text-sm mt-8">
            Deshalb wird Umzugscheck.ch als Branchenreferenz gelten.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

// Minimal Header
const MinimalHeader = memo(function MinimalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white">
            Umzugscheck<span className="text-primary">.ch</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              Zurück zur Startseite
            </Link>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link to="/umzugsofferten">Jetzt starten</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});

// Minimal Footer
const MinimalFooter = memo(function MinimalFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-slate-400 text-sm">
            © 2025 Umzugscheck.ch – Die Branchenreferenz für 2026
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link to="/agb" className="hover:text-white transition-colors">AGB</Link>
            <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

// Main Page Component
const InvisibleMoveV2 = memo(function InvisibleMoveV2() {
  return (
    <div className="min-h-screen bg-slate-950">
      <MinimalHeader />
      <main className="pt-16">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <TechnologySection />
        <TrustSection />
        <StorySection />
        <FinalCTASection />
      </main>
      <MinimalFooter />
    </div>
  );
});

export default InvisibleMoveV2;

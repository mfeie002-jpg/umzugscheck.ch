/**
 * Customer USP Visual Cards - Premium Edition
 * Educational infographic-style cards with generated images
 * "Schulbuch-Stil" - clear, visual, easy to understand for parents/customers
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Rocket, ArrowRight, ChevronDown, Sparkles, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Import generated USP images
import uspVideoScan from "@/assets/usp/usp-1-video-scan.jpg";
import uspEscrow from "@/assets/usp/usp-2-escrow.jpg";
import uspBureaucracy from "@/assets/usp/usp-3-bureaucracy.jpg";
import uspCleaning from "@/assets/usp/usp-4-cleaning.jpg";
import uspCircular from "@/assets/usp/usp-5-circular.jpg";
import uspPrice from "@/assets/usp/usp-6-price.jpg";
import uspNeighborhood from "@/assets/usp/usp-7-neighborhood.jpg";
import uspInsurance from "@/assets/usp/usp-8-insurance.jpg";
import uspConcierge from "@/assets/usp/usp-9-concierge.jpg";
import uspHandyman from "@/assets/usp/usp-10-handyman.jpg";

// Customer USPs with images - Enhanced data
const customerUSPsVisual = [
  {
    id: 1,
    image: uspVideoScan,
    title: "Der «Magische Blick»",
    subtitle: "AI Video-Analyse",
    tagline: "Bis zu 40% sparen",
    simpleExplanation: "Filmen Sie Ihre Wohnung mit dem Handy. Die KI zählt alles automatisch und berechnet das exakte Volumen.",
    benefit: "Kein Hausbesuch nötig – exakte Offerten in Minuten statt Tagen.",
    painPoint: "Früher: Fremde Leute im Haus, ungenaue Schätzungen, Überraschungen bei der Rechnung.",
    solution: "Jetzt: 2 Minuten Video = präzise Offerte. Die KI erkennt jeden Schrank.",
    howItWorks: ["📱 Video aufnehmen", "🤖 KI analysiert Volumen", "📋 5 exakte Offerten"],
    emoji: "📹",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/40",
    borderColor: "border-blue-300 dark:border-blue-700",
    accentColor: "text-blue-600 dark:text-blue-400"
  },
  {
    id: 2,
    image: uspEscrow,
    title: "Der «Sicherheits-Tresor»",
    subtitle: "Treuhand-Zahlung",
    tagline: "100% Betrugsschutz",
    simpleExplanation: "Ihr Geld bleibt sicher auf einem Treuhandkonto – die Firma kriegt es erst nach erfolgreichem Umzug.",
    benefit: "100% Schutz vor Betrug. Zahlen Sie erst, wenn alles okay ist.",
    painPoint: "Früher: Vorkasse an unbekannte Firmen, Angst vor Betrug, keine Kontrolle.",
    solution: "Jetzt: Geld bei uns sicher verwahrt. Sie klicken «OK» → Firma wird bezahlt.",
    howItWorks: ["💰 Zahlung an Tresor", "🚛 Umzug erfolgt", "✅ Sie bestätigen → Auszahlung"],
    emoji: "🔐",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/40",
    borderColor: "border-green-300 dark:border-green-700",
    accentColor: "text-green-600 dark:text-green-400"
  },
  {
    id: 3,
    image: uspBureaucracy,
    title: "Der «Bürokratie-Butler»",
    subtitle: "Autopilot für Papierkram",
    tagline: "Ein Klick = Alles erledigt",
    simpleExplanation: "Wir melden Sie bei der Gemeinde um, kündigen Strom/Internet und bestellen alles Neue.",
    benefit: "Sie sparen Stunden. Keine Warteschleifen, kein Ämter-Stress.",
    painPoint: "Früher: Endlose Formulare, Warteschleifen beim Amt, Chaos mit Anbietern.",
    solution: "Jetzt: Ein Klick. Unser Roboter erledigt den ganzen Papierkram.",
    howItWorks: ["📝 Daten eingeben", "🤖 Autopilot startet", "📬 Alles bestätigt"],
    emoji: "🤖",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/40",
    borderColor: "border-violet-300 dark:border-violet-700",
    accentColor: "text-violet-600 dark:text-violet-400"
  },
  {
    id: 4,
    image: uspCleaning,
    title: "Die «Alles-Glänzt»-Garantie",
    subtitle: "Zertifizierte Endreinigung",
    tagline: "Garantierte Abnahme",
    simpleExplanation: "Wir organisieren die Putzfirma – mit Garantie. Meckert der Vermieter, kommt sie kostenlos nochmal.",
    benefit: "Sie geben nur den Schlüssel ab. Der Stress bleibt bei uns.",
    painPoint: "Früher: Stress mit Vermieter, Kaution-Streit, selbst putzen oder hoffen.",
    solution: "Jetzt: Profis mit Garantie. Meckert jemand? Wir regeln das – ohne Sie.",
    howItWorks: ["🧹 Reinigung gebucht", "✨ Wohnung blitzt", "🔑 Schlüssel abgeben, fertig"],
    emoji: "✨",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/40",
    borderColor: "border-pink-300 dark:border-pink-700",
    accentColor: "text-pink-600 dark:text-pink-400"
  },
  {
    id: 5,
    image: uspCircular,
    title: "Der Entrümpelungs-Knopf",
    subtitle: "Circular Economy",
    tagline: "Weniger = Billiger",
    simpleExplanation: "Markieren Sie im Video, was weg kann. Wir holen es vor dem Umzug ab – und Sie sparen Geld.",
    benefit: "Weniger Volumen = billigerer Umzug. Starten Sie ohne Altlasten.",
    painPoint: "Früher: Altes Zeug mitschleppen, höhere Kosten, Chaos nach dem Umzug.",
    solution: "Jetzt: Vorher aussortieren. Wir holen ab, spenden oder verkaufen für Sie.",
    howItWorks: ["🏷️ Im Video markieren", "🚚 Wir holen ab", "♻️ Spenden/Verkaufen"],
    emoji: "♻️",
    color: "from-teal-500 to-emerald-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/40",
    borderColor: "border-teal-300 dark:border-teal-700",
    accentColor: "text-teal-600 dark:text-teal-400"
  },
  {
    id: 6,
    image: uspPrice,
    title: "Der «Fair-Preis-Wächter»",
    subtitle: "Transparenter Marktplatz",
    tagline: "5 Offerten vergleichen",
    simpleExplanation: "Sie bekommen 5 geprüfte Angebote nebeneinander. Wir filtern unrealistische Billig-Angebote raus.",
    benefit: "Sie sehen sofort, wer fair ist. Kein Preis-Dschungel mehr.",
    painPoint: "Früher: Ein Angebot, keine Vergleichsmöglichkeit, Unsicherheit beim Preis.",
    solution: "Jetzt: 5 geprüfte Firmen im direkten Vergleich. KI filtert Abzocker.",
    howItWorks: ["📋 Anfrage stellen", "📊 5 Offerten in 24h", "⚖️ Fair vergleichen"],
    emoji: "⚖️",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/40",
    borderColor: "border-orange-300 dark:border-orange-700",
    accentColor: "text-orange-600 dark:text-orange-400"
  },
  {
    id: 7,
    image: uspNeighborhood,
    title: "Der «Neue-Heimat»-Guide",
    subtitle: "Relocation Intelligence",
    tagline: "Ab Tag 1 zuhause",
    simpleExplanation: "Eine interaktive Karte zeigt alles Wichtige: Bäcker, Arzt, Müllabfuhr, Schule – am neuen Ort.",
    benefit: "Ab Tag 1 zuhause fühlen. Kein Suchen, kein Fragen.",
    painPoint: "Früher: Fremd in der neuen Gegend, endloses Suchen, Wochen bis man ankommt.",
    solution: "Jetzt: Wir liefern das Wissen der Nachbarn digital mit.",
    howItWorks: ["📍 Neue Adresse", "🗺️ Interaktive Karte", "🏪 Alle Infos parat"],
    emoji: "🗺️",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
    borderColor: "border-cyan-300 dark:border-cyan-700",
    accentColor: "text-cyan-600 dark:text-cyan-400"
  },
  {
    id: 8,
    image: uspInsurance,
    title: "Versicherung, die zahlt",
    subtitle: "Smart Insurance",
    tagline: "Video = Beweis",
    simpleExplanation: "Wir haben Video-Beweise vom Zustand Ihrer Möbel – vor dem Umzug. Schäden werden sofort bezahlt.",
    benefit: "Bei Schäden zahlt die Versicherung sofort. Keine Formular-Schlachten.",
    painPoint: "Früher: Keine Beweise, endlose Formulare, Streit mit Versicherung.",
    solution: "Jetzt: Video-Beweis vor dem Umzug. Schaden? KI vergleicht vorher/nachher → Geld.",
    howItWorks: ["📹 Video = Beweis", "📦 Umzug", "💰 Schaden? → Sofort Geld"],
    emoji: "🛡️",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/40",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    accentColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    id: 9,
    image: uspConcierge,
    title: "Immer erreichbar",
    subtitle: "Omni-Channel Concierge",
    tagline: "0 Minuten Wartezeit",
    simpleExplanation: "WhatsApp, Telefon oder Chat – Sie kriegen sofort Antwort. Keine Warteschleife, keine Hotline-Hölle.",
    benefit: "Wenn Sie nervös sind, sind wir da. KI löst 95% der Fragen sofort.",
    painPoint: "Früher: Hotline-Warteschleife, E-Mail ohne Antwort, Stress am Umzugstag.",
    solution: "Jetzt: Sofort-Antwort via WhatsApp/Chat. Mensch da, wenn nötig.",
    howItWorks: ["💬 WhatsApp/Chat", "🤖 KI antwortet sofort", "👤 Mensch wenn nötig"],
    emoji: "🎧",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/40",
    borderColor: "border-rose-300 dark:border-rose-700",
    accentColor: "text-rose-600 dark:text-rose-400"
  },
  {
    id: 10,
    image: uspHandyman,
    title: "Möbel-Taxi & Montage",
    subtitle: "Handyman Service",
    tagline: "Keinen Finger rühren",
    simpleExplanation: "Lampen abmontieren, Bilder aufhängen, IKEA-Schrank aufbauen – alles im Service inklusive.",
    benefit: "Sie müssen am Umzugstag keinen Schraubenzieher anfassen.",
    painPoint: "Früher: Selbst abbauen, selbst aufbauen, Stunden mit Werkzeug.",
    solution: "Jetzt: Wir machen alles. Sie entspannen. Montage ist eingeplant.",
    howItWorks: ["🔧 Demontage alte Wohnung", "🚚 Transport", "🛠️ Aufbau am Ziel"],
    emoji: "🔧",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    borderColor: "border-amber-300 dark:border-amber-700",
    accentColor: "text-amber-600 dark:text-amber-400"
  }
];

// Premium Visual USP Card Component
const VisualUSPCard = memo(({ usp, index }: { usp: typeof customerUSPsVisual[0]; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: "easeOut" }}
      className={`group relative rounded-3xl overflow-hidden border-2 ${usp.borderColor} ${usp.bgColor} hover:shadow-2xl transition-all duration-500`}
    >
      {/* Image Header with gradient overlay */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={usp.image} 
          alt={usp.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${usp.color} opacity-20 mix-blend-overlay`} />
        
        {/* Number badge - top left */}
        <div className={`absolute top-4 left-4 w-12 h-12 rounded-2xl bg-gradient-to-br ${usp.color} flex items-center justify-center shadow-xl`}>
          <span className="font-black text-xl text-white">{usp.id}</span>
        </div>
        
        {/* Tagline badge - top right */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-black/80 text-xs font-bold ${usp.accentColor} shadow-lg`}>
            <Sparkles className="w-3 h-3" />
            {usp.tagline}
          </span>
        </div>
        
        {/* Title section on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{usp.emoji}</span>
            <span className="text-xs text-white/80 font-medium bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {usp.subtitle}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg">
            {usp.title}
          </h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Simple explanation */}
        <p className="text-base font-medium text-foreground mb-5 leading-relaxed">
          {usp.simpleExplanation}
        </p>
        
        {/* Visual workflow - 3 steps */}
        <div className="bg-white/80 dark:bg-black/30 rounded-2xl p-4 mb-5 border border-border/50">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <ArrowRight className="w-3 h-3" />
            So funktioniert's
          </p>
          <div className="grid grid-cols-3 gap-3">
            {usp.howItWorks.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br ${usp.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {idx + 1}
                </div>
                <p className="text-xs font-medium text-foreground leading-tight">{step}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Benefit highlight - main message */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${usp.borderColor} bg-white dark:bg-black/50 mb-4`}>
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${usp.color} flex items-center justify-center flex-shrink-0`}>
            <Check className="w-4 h-4 text-white" />
          </div>
          <p className={`text-sm font-bold ${usp.accentColor} leading-relaxed`}>
            {usp.benefit}
          </p>
        </div>

        {/* Expandable before/after section */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          <span className="font-medium">Vorher vs. Nachher anzeigen</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                {/* Pain point - Before */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <span className="text-lg">😫</span>
                  <div>
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">VORHER</p>
                    <p className="text-xs text-red-700 dark:text-red-300">{usp.painPoint}</p>
                  </div>
                </div>
                
                {/* Solution - After */}
                <div className={`flex items-start gap-3 p-3 rounded-xl ${usp.bgColor} border ${usp.borderColor}`}>
                  <span className="text-lg">🎉</span>
                  <div>
                    <p className={`text-xs font-bold ${usp.accentColor} mb-1`}>NACHHER</p>
                    <p className="text-xs text-foreground">{usp.solution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

VisualUSPCard.displayName = 'VisualUSPCard';

// Main Section Component
export const CustomerUSPVisualCards = memo(() => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <Heart className="w-4 h-4" />
            10 Vorteile für Familien
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-5">
            Warum <span className="text-primary">Umzugscheck.ch?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Einfach erklärt – wie in einem Schulbuch. Jeder Vorteil auf den Punkt gebracht.
            <br />
            <span className="font-semibold text-foreground">Ihr stressfreier Umzug beginnt hier.</span>
          </p>
        </motion.div>
        
        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
            <Shield className="w-4 h-4" />
            100% Gratis & Unverbindlich
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
            <Star className="w-4 h-4" />
            4.9/5 Bewertung
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            150+ geprüfte Firmen
          </div>
        </motion.div>
        
        {/* Visual USP Grid - 2 columns on large screens */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {customerUSPsVisual.map((usp, idx) => (
            <VisualUSPCard key={usp.id} usp={usp} index={idx} />
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/umzugsofferten">
            <Button size="lg" className="h-16 px-12 text-lg font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
              Jetzt alle Vorteile nutzen
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            ✓ Kostenlos · ✓ Unverbindlich · ✓ In 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
});

CustomerUSPVisualCards.displayName = 'CustomerUSPVisualCards';

export default CustomerUSPVisualCards;

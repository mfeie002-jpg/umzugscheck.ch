/**
 * Customer USP Visual Cards - ULTRA Premium Edition
 * Educational infographic-style cards with premium animations
 * "Schulbuch-Stil" - clear, visual, easy to understand for parents/customers
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, Star, Rocket, ArrowRight, ChevronDown, Sparkles, 
  Heart, Shield, Zap, Clock, Users, Award, Gift, ThumbsUp
} from "lucide-react";
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
    howItWorks: ["📱 Video aufnehmen", "🤖 KI analysiert", "📋 5 Offerten erhalten"],
    stats: { value: "2 Min", label: "statt 2 Stunden" },
    emoji: "📹",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/60 dark:to-cyan-950/60",
    borderColor: "border-blue-300 dark:border-blue-600",
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
    howItWorks: ["💰 Zahlung an Tresor", "🚛 Umzug erfolgt", "✅ Bestätigen → Auszahlung"],
    stats: { value: "0 CHF", label: "Betrugs-Risiko" },
    emoji: "🔐",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/60 dark:to-emerald-950/60",
    borderColor: "border-green-300 dark:border-green-600",
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
    stats: { value: "8h", label: "Zeit gespart" },
    emoji: "🤖",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/60 dark:to-purple-950/60",
    borderColor: "border-violet-300 dark:border-violet-600",
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
    howItWorks: ["🧹 Reinigung buchen", "✨ Wohnung blitzt", "🔑 Schlüssel abgeben"],
    stats: { value: "100%", label: "Abnahme-Quote" },
    emoji: "✨",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/60 dark:to-rose-950/60",
    borderColor: "border-pink-300 dark:border-pink-600",
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
    stats: { value: "-30%", label: "Umzugskosten" },
    emoji: "♻️",
    color: "from-teal-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/60 dark:to-emerald-950/60",
    borderColor: "border-teal-300 dark:border-teal-600",
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
    stats: { value: "5", label: "Offerten garantiert" },
    emoji: "⚖️",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/60 dark:to-amber-950/60",
    borderColor: "border-orange-300 dark:border-orange-600",
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
    stats: { value: "50+", label: "POIs angezeigt" },
    emoji: "🗺️",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/60 dark:to-blue-950/60",
    borderColor: "border-cyan-300 dark:border-cyan-600",
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
    howItWorks: ["📹 Video = Beweis", "📦 Umzug", "💰 Schaden → Sofort Geld"],
    stats: { value: "24h", label: "Auszahlung" },
    emoji: "🛡️",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/60 dark:to-blue-950/60",
    borderColor: "border-indigo-300 dark:border-indigo-600",
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
    howItWorks: ["💬 WhatsApp/Chat", "🤖 KI antwortet", "👤 Mensch wenn nötig"],
    stats: { value: "<30s", label: "Antwortzeit" },
    emoji: "🎧",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/60",
    borderColor: "border-rose-300 dark:border-rose-600",
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
    howItWorks: ["🔧 Demontage", "🚚 Transport", "🛠️ Aufbau am Ziel"],
    stats: { value: "0", label: "Eigene Arbeit" },
    emoji: "🔧",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60",
    borderColor: "border-amber-300 dark:border-amber-600",
    accentColor: "text-amber-600 dark:text-amber-400"
  }
];

// Premium Visual USP Card Component - Mobile Optimized
const VisualUSPCard = memo(({ usp, index }: { usp: typeof customerUSPsVisual[0]; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl sm:rounded-[2rem] overflow-hidden border-2 ${usp.borderColor} ${usp.bgColor} hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2`}
    >
      {/* Decorative corner accent - Hidden on mobile for performance */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${usp.color} opacity-20 blur-2xl hidden sm:block`} />
      
      {/* Image Header with premium overlay - Smaller on mobile */}
      <div className="relative h-40 sm:h-56 overflow-hidden">
        <img 
          src={usp.image} 
          alt={usp.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          loading="lazy"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className={`absolute inset-0 bg-gradient-to-br ${usp.color} opacity-30 mix-blend-overlay`} />
        
        {/* Premium number badge - Smaller on mobile */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 + 0.3, type: "spring", stiffness: 200 }}
          className={`absolute top-3 sm:top-4 left-3 sm:left-4 w-10 sm:w-14 h-10 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${usp.color} flex items-center justify-center shadow-xl ring-2 sm:ring-4 ring-white/20`}
        >
          <span className="font-black text-lg sm:text-2xl text-white drop-shadow-md">{usp.id}</span>
        </motion.div>
        
        {/* Tagline badge with glow - Smaller on mobile */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 dark:bg-black/80 text-[10px] sm:text-xs font-bold ${usp.accentColor} shadow-lg backdrop-blur-sm`}>
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span className="hidden xs:inline">{usp.tagline}</span>
            <span className="xs:hidden">{usp.tagline.split(' ')[0]}</span>
          </span>
        </div>
        
        {/* Stats badge - bottom right - Compact on mobile */}
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r ${usp.color} shadow-lg`}>
            <p className="text-base sm:text-xl font-black text-white">{usp.stats.value}</p>
            <p className="text-[8px] sm:text-[10px] text-white/80 font-medium uppercase tracking-wider">{usp.stats.label}</p>
          </div>
        </div>
        
        {/* Title section on image */}
        <div className="absolute bottom-0 left-0 right-16 sm:right-20 p-4 sm:p-6">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="text-xl sm:text-3xl drop-shadow-lg">{usp.emoji}</span>
            <span className="text-[10px] sm:text-xs text-white/90 font-bold bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm border border-white/20 line-clamp-1">
              {usp.subtitle}
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-xl line-clamp-2">
            {usp.title}
          </h3>
        </div>
      </div>
      
      {/* Content - Mobile Optimized */}
      <div className="p-4 sm:p-6 md:p-7">
        {/* Simple explanation with icon */}
        <div className="flex items-start gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${usp.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
            {usp.simpleExplanation}
          </p>
        </div>
        
        {/* Visual workflow - 3 steps - Responsive */}
        <div className="bg-white/80 dark:bg-black/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 mb-4 sm:mb-6 border border-border/50 shadow-inner">
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
            <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            So funktioniert's
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {usp.howItWorks.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 + idx * 0.1 + 0.4 }}
                className="text-center"
              >
                <div className={`w-7 sm:w-10 h-7 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br ${usp.color} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg ring-2 sm:ring-4 ring-white/50 dark:ring-black/50`}>
                  {idx + 1}
                </div>
                <p className="text-[10px] sm:text-xs font-semibold text-foreground leading-tight">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Benefit highlight - main message - Responsive */}
        <div className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 ${usp.borderColor} bg-white dark:bg-black/50 mb-4 sm:mb-5 shadow-sm`}>
          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-br ${usp.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
            <Check className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">Ihr Vorteil</p>
            <p className={`text-xs sm:text-sm font-bold ${usp.accentColor} leading-relaxed`}>
              {usp.benefit}
            </p>
          </div>
        </div>

        {/* Expandable before/after section - Touch optimized */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:bg-muted/50 touch-manipulation min-h-[44px] active:scale-[0.98]"
        >
          <span className="font-medium flex items-center gap-1.5 sm:gap-2">
            <ThumbsUp className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            Vorher vs. Nachher
          </span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Pain point - Before */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800"
                >
                  <span className="text-2xl">😫</span>
                  <div>
                    <p className="text-xs font-black text-red-600 dark:text-red-400 mb-1 uppercase tracking-wider">VORHER – Der Stress</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{usp.painPoint}</p>
                  </div>
                </motion.div>
                
                {/* Solution - After */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl ${usp.bgColor} border-2 ${usp.borderColor}`}
                >
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className={`text-xs font-black ${usp.accentColor} mb-1 uppercase tracking-wider`}>NACHHER – Die Lösung</p>
                    <p className="text-sm text-foreground font-medium">{usp.solution}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

VisualUSPCard.displayName = 'VisualUSPCard';

// Main Section Component - Mobile Optimized
export const CustomerUSPVisualCards = memo(() => {
  return (
    <section className="py-12 sm:py-24 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Premium background decoration - Hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Premium Header - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold mb-4 sm:mb-8 border border-primary/20"
          >
            <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden xs:inline">10 Vorteile für Schweizer Familien</span>
            <span className="xs:hidden">10 Vorteile</span>
            <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.span>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 sm:mb-6 leading-tight px-2">
            Warum <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-violet-500">Umzugscheck.ch?</span>
          </h2>
          
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
            Einfach erklärt – wie in einem Schulbuch. Jeder Vorteil auf den Punkt gebracht.
          </p>

          {/* Trust badges - Horizontal scroll on mobile */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-2">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs sm:text-sm font-bold border border-green-200 dark:border-green-700">
              <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span className="hidden xs:inline">100% Gratis & Unverbindlich</span>
              <span className="xs:hidden">Gratis</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-bold border border-amber-200 dark:border-amber-700">
              <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              4.9/5 Sterne
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs sm:text-sm font-bold border border-blue-200 dark:border-blue-700">
              <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span className="hidden xs:inline">25'000+ Kunden</span>
              <span className="xs:hidden">25k+</span>
            </div>
          </div>
        </motion.div>
        
        {/* USP Cards Grid - Single column on small mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {customerUSPsVisual.map((usp, idx) => (
            <VisualUSPCard key={usp.id} usp={usp} index={idx} />
          ))}
        </div>
        
        {/* Bottom CTA - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-20 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 sm:gap-6 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 via-blue-500/10 to-violet-500/10 border-2 border-primary/20 w-full sm:w-auto max-w-xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <Gift className="w-6 sm:w-8 h-6 sm:h-8 text-primary flex-shrink-0" />
              <span className="text-lg sm:text-2xl md:text-3xl font-black text-foreground text-left sm:text-center">
                Bereit für Ihren stressfreien Umzug?
              </span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl">
              Alle 10 Vorteile – kostenlos und unverbindlich. Jetzt in 2 Minuten Offerten erhalten.
            </p>
            <Link to="/umzugsofferten" className="w-full sm:w-auto touch-manipulation">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98]"
              >
                <Rocket className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                JETZT GRATIS OFFERTEN ERHALTEN
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

CustomerUSPVisualCards.displayName = 'CustomerUSPVisualCards';

export default CustomerUSPVisualCards;

/**
 * Customer USP Visual Cards
 * Educational infographic-style cards with generated images
 * "Schulbuch-Stil" - clear, visual, easy to understand for parents/customers
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Check, Star, Rocket, ArrowRight } from "lucide-react";
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

// Customer USPs with images
const customerUSPsVisual = [
  {
    id: 1,
    image: uspVideoScan,
    title: "Der «Magische Blick»",
    subtitle: "AI Video-Analyse",
    simpleExplanation: "Filmen Sie Ihre Wohnung mit dem Handy. Die KI zählt alles automatisch.",
    benefit: "Kein Hausbesuch nötig – exakte Offerten in Minuten statt Tagen.",
    howItWorks: ["📱 Video aufnehmen", "🤖 KI analysiert", "📋 Genaue Offerte"],
    emoji: "📹",
    color: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    accentColor: "text-blue-600 dark:text-blue-400"
  },
  {
    id: 2,
    image: uspEscrow,
    title: "Der «Sicherheits-Tresor»",
    subtitle: "Treuhand-Zahlung",
    simpleExplanation: "Ihr Geld bleibt sicher bei uns – die Firma kriegt es erst nach dem Umzug.",
    benefit: "100% Schutz vor Betrug. Zahlen Sie erst, wenn alles okay ist.",
    howItWorks: ["💰 Sie zahlen an uns", "🚛 Umzug erfolgt", "✅ Sie bestätigen → Geld geht an Firma"],
    emoji: "🔐",
    color: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    accentColor: "text-green-600 dark:text-green-400"
  },
  {
    id: 3,
    image: uspBureaucracy,
    title: "Der «Bürokratie-Butler»",
    subtitle: "Autopilot für Papierkram",
    simpleExplanation: "Ein Klick – wir melden Sie um, kündigen Strom und bestellen Internet.",
    benefit: "Sie sparen Stunden. Keine Warteschleifen, kein Ämter-Stress.",
    howItWorks: ["📝 Daten eingeben", "🤖 Wir erledigen alles", "📬 Sie erhalten Bestätigung"],
    emoji: "🤖",
    color: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
    accentColor: "text-violet-600 dark:text-violet-400"
  },
  {
    id: 4,
    image: uspCleaning,
    title: "Die «Alles-Glänzt»-Garantie",
    subtitle: "Zertifizierte Endreinigung",
    simpleExplanation: "Wir organisieren die Putzfirma – mit Garantie. Meckert der Vermieter, kommt sie nochmal.",
    benefit: "Sie geben nur den Schlüssel ab. Der Stress bleibt bei uns.",
    howItWorks: ["🧹 Reinigung gebucht", "✨ Wohnung blitzt", "🔑 Schlüssel abgeben"],
    emoji: "✨",
    color: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800",
    accentColor: "text-pink-600 dark:text-pink-400"
  },
  {
    id: 5,
    image: uspCircular,
    title: "Der Entrümpelungs-Knopf",
    subtitle: "Circular Economy",
    simpleExplanation: "Markieren Sie im Video, was weg kann. Wir holen es ab – vor dem Umzug.",
    benefit: "Weniger Volumen = billigerer Umzug. Starten Sie ohne Altlasten.",
    howItWorks: ["🏷️ Markieren was weg soll", "🚚 Wir holen es ab", "♻️ Spende oder Verkauf"],
    emoji: "♻️",
    color: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-200 dark:border-teal-800",
    accentColor: "text-teal-600 dark:text-teal-400"
  },
  {
    id: 6,
    image: uspPrice,
    title: "Der «Fair-Preis-Wächter»",
    subtitle: "Transparenter Marktplatz",
    simpleExplanation: "Sie bekommen 5 geprüfte Angebote nebeneinander. Vergleichen leicht gemacht.",
    benefit: "Sie sehen sofort, wer fair ist. Unrealistische Preise werden gefiltert.",
    howItWorks: ["📋 Anfrage stellen", "📊 5 Offerten erhalten", "⚖️ Fair vergleichen"],
    emoji: "⚖️",
    color: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    accentColor: "text-orange-600 dark:text-orange-400"
  },
  {
    id: 7,
    image: uspNeighborhood,
    title: "Der «Neue-Heimat»-Guide",
    subtitle: "Relocation Intelligence",
    simpleExplanation: "Eine Karte zeigt: Bester Bäcker, Arzt, Müllabfuhr – alles Wichtige am neuen Ort.",
    benefit: "Ab Tag 1 zuhause fühlen. Kein Suchen, kein Fragen.",
    howItWorks: ["📍 Neue Adresse", "🗺️ Interaktive Karte", "🏪 Alle Infos parat"],
    emoji: "🗺️",
    color: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    accentColor: "text-cyan-600 dark:text-cyan-400"
  },
  {
    id: 8,
    image: uspInsurance,
    title: "Versicherung, die zahlt",
    subtitle: "Smart Insurance",
    simpleExplanation: "Wir haben Video-Beweise vom Zustand Ihrer Möbel – vor dem Umzug.",
    benefit: "Bei Schäden zahlt die Versicherung sofort. Keine Formular-Schlachten.",
    howItWorks: ["📹 Video = Beweis", "📦 Umzug", "💰 Schaden? Sofort Geld"],
    emoji: "🛡️",
    color: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    accentColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    id: 9,
    image: uspConcierge,
    title: "Immer erreichbar",
    subtitle: "Omni-Channel Concierge",
    simpleExplanation: "WhatsApp, Telefon oder Chat – Sie kriegen sofort Antwort. Keine Warteschleife.",
    benefit: "Wenn Sie nervös sind, sind wir da. KI löst 95% sofort.",
    howItWorks: ["💬 WhatsApp schreiben", "🤖 KI antwortet", "👤 Mensch bei Bedarf"],
    emoji: "🎧",
    color: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
    accentColor: "text-rose-600 dark:text-rose-400"
  },
  {
    id: 10,
    image: uspHandyman,
    title: "Möbel-Taxi & Montage",
    subtitle: "Handyman Service",
    simpleExplanation: "Lampen abmontieren, Bilder aufhängen, IKEA-Schrank aufbauen – alles inklusive.",
    benefit: "Sie müssen am Umzugstag keinen Schraubenzieher anfassen.",
    howItWorks: ["🔧 Demontage", "🚚 Transport", "🛠️ Aufbau am Ziel"],
    emoji: "🔧",
    color: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    accentColor: "text-amber-600 dark:text-amber-400"
  }
];

// Visual USP Card Component - "Schulbuch-Stil"
const VisualUSPCard = memo(({ usp, index }: { usp: typeof customerUSPsVisual[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.05, duration: 0.5 }}
    className={`group relative rounded-3xl overflow-hidden border-2 ${usp.borderColor} ${usp.color} hover:shadow-2xl transition-all duration-300`}
  >
    {/* Image Header */}
    <div className="relative h-48 overflow-hidden">
      <img 
        src={usp.image} 
        alt={usp.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Number badge */}
      <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 flex items-center justify-center shadow-lg">
        <span className={`font-bold text-lg ${usp.accentColor}`}>{usp.id}</span>
      </div>
      
      {/* Emoji badge */}
      <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-white/90 dark:bg-black/70 flex items-center justify-center shadow-lg text-2xl">
        {usp.emoji}
      </div>
      
      {/* Title on image */}
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-xs text-white/80 font-medium mb-1">{usp.subtitle}</p>
        <h3 className="text-xl font-bold text-white leading-tight">{usp.title}</h3>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-6">
      {/* Simple explanation */}
      <p className="text-base font-medium text-foreground mb-4 leading-relaxed">
        {usp.simpleExplanation}
      </p>
      
      {/* How it works - Visual flow */}
      <div className="bg-white/60 dark:bg-black/20 rounded-2xl p-4 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">So funktioniert's:</p>
        <div className="flex items-center justify-between gap-2">
          {usp.howItWorks.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 flex-1">
              <div className="text-center flex-1">
                <p className="text-sm font-medium text-foreground leading-tight">{step}</p>
              </div>
              {idx < usp.howItWorks.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Benefit highlight */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${usp.borderColor} bg-white/80 dark:bg-black/30`}>
        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${usp.accentColor}`} />
        <p className={`text-sm font-semibold ${usp.accentColor}`}>
          {usp.benefit}
        </p>
      </div>
    </div>
  </motion.div>
));

VisualUSPCard.displayName = 'VisualUSPCard';

// Main Section Component
export const CustomerUSPVisualCards = memo(() => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            📚 10 Vorteile auf einen Blick
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Warum Umzugscheck.ch?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Einfach erklärt – wie in einem Schulbuch. Jeder Vorteil auf den Punkt gebracht.
          </p>
        </motion.div>
        
        {/* Visual USP Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {customerUSPsVisual.map((usp, idx) => (
            <VisualUSPCard key={usp.id} usp={usp} index={idx} />
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/umzugsofferten">
            <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-lg">
              Jetzt alle Vorteile nutzen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

CustomerUSPVisualCards.displayName = 'CustomerUSPVisualCards';

export default CustomerUSPVisualCards;

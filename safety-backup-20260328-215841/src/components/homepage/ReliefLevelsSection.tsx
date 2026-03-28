/**
 * Relief Levels Section - "Lösungen statt Preislisten"
 * 
 * Strategy: No concrete prices, 3 solution cards, focus on benefits
 * - "Der Muskel-Einsatz" (Budget/DIY)
 * - "Der Sorglos-Umzug" (Recommended, 80% of customers)
 * - "Der totale Feierabend" (Premium/Full-service)
 * 
 * Psychology:
 * - No price shock (prices revealed after qualification)
 * - 3 options (brain loves choice of three)
 * - Benefits over features
 * - Festpreis-Garantie eliminates fear
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Shield, 
  Sparkles, 
  Truck, 
  Package, 
  Sofa,
  Clock,
  Star,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReliefLevel {
  id: string;
  title: string;
  subtitle: string;
  idealFor: string;
  weDoList: string[];
  youDoList: string[];
  benefits: string[];
  priceIndicator: string;
  icon: React.ElementType;
  recommended?: boolean;
  premium?: boolean;
}

const reliefLevels: ReliefLevel[] = [
  {
    id: "muscle",
    title: "Der Muskel-Einsatz",
    subtitle: "Für Selbermacher mit Budget",
    idealFor: "Wenig Möbel, Studenten, Einzelzimmer",
    weDoList: [
      "LKW + Profi-Zügelmänner",
      "Sicherer Transport",
      "Transportversicherung",
    ],
    youDoList: [
      "Einpacken & Kartons bereitstellen",
      "Möbel zerlegen & zusammenbauen",
    ],
    benefits: [
      "Günstiger Stundentarif",
      "Flexibel planbar",
    ],
    priceIndicator: "Günstiger Stunden- oder Pauschaltarif",
    icon: Truck,
  },
  {
    id: "classic",
    title: "Der Sorglos-Umzug",
    subtitle: "Unser Bestseller für Familien & Paare",
    idealFor: "2-4 Zimmer Wohnungen, Familien",
    weDoList: [
      "Schutz aller Böden & Türrahmen",
      "Fachgerechte Demontage & Montage",
      "Sicherer Transport & Versicherung (bis CHF 5 Mio.)",
      "Platzierung der Möbel am Wunschort",
    ],
    youDoList: [
      "Nur Kisten packen – den Rest machen wir",
    ],
    benefits: [
      "Kein Schrauben, kein Schleppen",
      "Festpreis nach Besichtigung",
    ],
    priceIndicator: "Fairer Festpreis nach Besichtigung",
    icon: Sofa,
    recommended: true,
  },
  {
    id: "fullservice",
    title: "Der totale Feierabend",
    subtitle: "Für alle, die keine Zeit haben",
    idealFor: "Senioren, Vielbeschäftigte, grosse Häuser",
    weDoList: [
      "Kompletter Ein- & Auspackservice",
      "Lampenmontage & Bildaufhängung",
      "Endreinigung mit Abgabegarantie",
      "Entsorgung & Möbelspende",
    ],
    youDoList: [
      "Nichts – Sie gehen morgens zur Arbeit und schlafen abends im fertigen Zuhause",
    ],
    benefits: [
      "Schlüsselfertig in 1 Tag",
      "Premium-Service für Besserverdiener",
    ],
    priceIndicator: "All-Inclusive Angebot",
    icon: Sparkles,
    premium: true,
  },
];

interface ReliefLevelCardProps {
  level: ReliefLevel;
  index: number;
  onRequestQuote: (levelId: string) => void;
}

const ReliefLevelCard = memo(function ReliefLevelCard({
  level,
  index,
  onRequestQuote,
}: ReliefLevelCardProps) {
  const IconComponent = level.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        "relative flex flex-col bg-card rounded-2xl border overflow-hidden transition-all duration-300",
        "hover:shadow-lg",
        level.recommended 
          ? "border-primary shadow-md scale-[1.02] md:scale-105 z-10" 
          : "border-border/50",
        level.premium && "border-amber-500/50"
      )}
    >
      {/* Recommended Badge */}
      {level.recommended && (
        <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-xs font-semibold py-1.5">
          <Star className="w-3 h-3 inline mr-1" />
          Meistgewählt von Familien
        </div>
      )}
      
      {level.premium && !level.recommended && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center text-xs font-semibold py-1.5">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Premium Service
        </div>
      )}

      <div className={cn(
        "p-5 md:p-6 flex-1 flex flex-col",
        (level.recommended || level.premium) && "pt-10"
      )}>
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            level.recommended 
              ? "bg-primary/10 text-primary" 
              : level.premium 
                ? "bg-amber-500/10 text-amber-600"
                : "bg-muted text-muted-foreground"
          )}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              {level.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {level.subtitle}
            </p>
          </div>
        </div>

        {/* Ideal For */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-muted/50 text-sm">
          <span className="text-muted-foreground">Ideal für: </span>
          <span className="text-foreground font-medium">{level.idealFor}</span>
        </div>

        {/* What We Do */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Das machen wir:
          </p>
          <ul className="space-y-2">
            {level.weDoList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You Do */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Ihr Aufwand:
          </p>
          <ul className="space-y-2">
            {level.youDoList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Indicator */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {level.priceIndicator}
          </p>
          
          <Button
            onClick={() => onRequestQuote(level.id)}
            className={cn(
              "w-full group",
              level.recommended 
                ? "bg-primary hover:bg-primary/90" 
                : level.premium
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                  : "bg-muted hover:bg-muted/80 text-foreground"
            )}
            size="lg"
          >
            Dafür Offerte anfragen
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

interface ReliefLevelsSectionProps {
  onRequestQuote?: (levelId: string) => void;
  className?: string;
}

export const ReliefLevelsSection = memo(function ReliefLevelsSection({
  onRequestQuote,
  className,
}: ReliefLevelsSectionProps) {
  
  const handleRequestQuote = (levelId: string) => {
    if (onRequestQuote) {
      onRequestQuote(levelId);
    } else {
      // Default: Navigate to calculator with pre-selected package
      const params = new URLSearchParams({ package: levelId });
      window.location.href = `/umzugsofferten?${params.toString()}`;
    }
  };

  return (
    <section className={cn("py-12 md:py-20 bg-background", className)}>
      <div className="container max-w-6xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Wie viel möchten Sie selbst machen?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Vom reinen Transport bis zum kompletten "Füsse hoch"-Service. 
            Wir passen uns Ihrem Budget an.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {reliefLevels.map((level, index) => (
            <ReliefLevelCard
              key={level.id}
              level={level}
              index={index}
              onRequestQuote={handleRequestQuote}
            />
          ))}
        </div>

        {/* Festpreis-Garantie Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 
                     border border-primary/20 rounded-2xl p-6 md:p-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-primary" />
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              Unsere Festpreis-Garantie
            </h3>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Egal welche Lösung Sie wählen: Sie erhalten <strong className="text-foreground">vorab einen verbindlichen Festpreis</strong>. 
            Keine versteckten Kosten, keine Nachverrechnung am Umzugstag.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

export default ReliefLevelsSection;

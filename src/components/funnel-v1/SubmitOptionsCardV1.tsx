/**
 * V1 Version - SubmitOptionsCard with ChatGPT UX improvements
 * 
 * Improvements:
 * - Tooltips with detailed explanation for each method
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, Globe, Sparkles, CheckCircle, Users, Clock, 
  TrendingDown, Shield, Zap, Crown, Gavel, Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubmitOption {
  id: "direct" | "publish" | "both";
  label: string;
  description: string;
  tooltip: string;
  icon: React.ReactNode;
  benefits: string[];
  badge?: string;
  recommended?: boolean;
}

// Issue #1, #10, #21, #43, #48: Kürzere Texte, konsistente Empfehlungen, klare Vorteile, keine Fehler-Verwirrung
const submitOptions: SubmitOption[] = [
  {
    id: "direct",
    label: "Direkt anfragen",
    description: "Schnell: Ausgewählte Firmen melden sich direkt.",
    tooltip: "Schnellster Weg: Wir senden Ihre Anfrage direkt an die ausgewählten Firmen. Sie erhalten in 24-48h persönliche Offerten per E-Mail.",
    icon: <Send className="w-5 h-5" />,
    benefits: [
      "⚡ Antwort in Ø 24h",
      "✓ Nur geprüfte Firmen",
      "📞 Persönliche Betreuung",
    ],
  },
  {
    id: "publish",
    label: "Ausschreibung",
    description: "Günstig: Firmen bieten um Ihren Auftrag.",
    tooltip: "Wie eine Auktion: Ihr Umzug wird anonym publiziert. Firmen sehen nur PLZ & Datum und bieten um den Auftrag – oft günstigere Preise durch Wettbewerb.",
    icon: <Gavel className="w-5 h-5" />,
    benefits: [
      "📊 Ø 5-8 Offerten",
      "💰 Bis 35% günstiger",
      "🔒 Anonym bis Sie zustimmen",
    ],
    badge: "💰 Spar-Tipp",
  },
  {
    id: "both",
    label: "Beides",
    // Issue #43: Klartext ohne Verwirrung - "Beides" ist POSITIV empfohlen, nicht fehlerhaft
    description: "Beste Wahl: Schnelle + günstige Offerten.",
    tooltip: "Die beste Wahl: Sie erhalten sowohl schnelle Offerten von Top-Firmen als auch günstige Angebote durch die öffentliche Ausschreibung. Maximale Auswahl, volle Kontrolle.",
    icon: <Crown className="w-5 h-5" />,
    benefits: [
      "🎯 Ø 8-12 Offerten (3× mehr)",
      "⏱ Schnell + günstig kombiniert",
      "✨ 93% wählen diese Option",
    ],
    // Issue #21, #43: Konsistent "Empfohlen" - GRÜN nicht ROT, keine Fehler-Assoziation
    badge: "✨ Beste Wahl",
    recommended: true,
  },
];

interface SubmitOptionsCardV1Props {
  value: "direct" | "publish" | "both";
  onChange: (value: "direct" | "publish" | "both") => void;
  selectedCompaniesCount: number;
  estimatedPrice?: { min: number; max: number };
}

export const SubmitOptionsCardV1 = memo(function SubmitOptionsCardV1({
  value,
  onChange,
  selectedCompaniesCount,
  estimatedPrice,
}: SubmitOptionsCardV1Props) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Issue #2, #7, #29: Klarer interaktiver Button-Stil für "Optionen vergleichen" mit korrekter Funktion */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-base font-semibold flex items-center gap-2">
            Wie möchten Sie Offerten erhalten?
          </label>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={`text-sm flex items-center gap-2 px-5 py-3 rounded-xl transition-all touch-manipulation min-h-[48px] min-w-[48px] font-semibold border-2 ${
              showDetails 
                ? "bg-primary text-primary-foreground border-primary shadow-md" 
                : "bg-card text-primary border-primary/50 hover:border-primary hover:bg-primary/10"
            }`}
            aria-expanded={showDetails}
            aria-label={showDetails ? "Weniger Details anzeigen" : "Optionen vergleichen"}
          >
            <Info className="w-5 h-5" />
            {showDetails ? "Weniger" : "Vergleichen"}
          </button>
        </div>

        {/* Issue #22, #24, #31, #43, #45, #55, #57: Radio-Group mit min 96px Touch-Targets, clear visual hierarchy */}
        <div className="grid gap-3" role="radiogroup" aria-label="Offerten-Methode auswählen">
        {submitOptions.map((option) => {
          const isSelected = value === option.id;
          
          return (
            <motion.button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(option.id)}
              className={`relative w-full p-5 sm:p-6 rounded-xl border-2 text-left transition-all min-h-[110px] touch-manipulation active:scale-[0.99] ${
                isSelected
                  ? "border-secondary bg-secondary/10 ring-2 ring-secondary/30 shadow-xl"
                  : option.recommended
                  ? "border-green-500 dark:border-green-500 bg-green-50/70 dark:bg-green-950/30 hover:border-green-600 shadow-lg ring-1 ring-green-300 dark:ring-green-700"
                  : "border-border hover:border-primary/50 bg-card hover:shadow-md"
              }`}
            >
              {/* Badge - Issue #43: GRÜN für empfohlen, nicht amber (keine Fehler-Assoziation) */}
              {option.badge && (
                <div className="absolute -top-2.5 right-3">
                  <Badge 
                    className={`text-[9px] px-2 py-1 border-0 shadow-sm ${
                      option.recommended 
                        ? "bg-green-500 text-white font-bold" 
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {option.badge}
                  </Badge>
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Enhanced: Larger checkbox for touch targets (24px) */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 transition-all ${
                    isSelected ? "bg-secondary border-secondary scale-110" : "border-border"
                  }`}
                >
                  {isSelected && <CheckCircle className="w-4 h-4 text-secondary-foreground" />}
                </div>

                {/* Enhanced: Larger icon container (48px) - Issue #43: GRÜN für empfohlen */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isSelected 
                      ? "bg-secondary text-secondary-foreground scale-105" 
                      : option.recommended
                      // Issue #43: GRÜN statt AMBER
                      ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {option.icon}
                </div>

                {/* Content - Enhanced typography with larger text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {/* Issue #10: Larger font (base) for better readability */}
                    <p className="text-base sm:text-lg font-bold mb-0.5">{option.label}</p>
                    {/* V1: Info tooltip with larger touch target (44px) */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          type="button" 
                          className="text-muted-foreground hover:text-foreground p-2 -m-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label={`Mehr Info zu ${option.label}`}
                        >
                          <Info className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] text-sm p-4">
                        {option.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {/* Issue #10: Enhanced description text (13px) */}
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>

                  {/* Benefits (shown when selected or showDetails) */}
                  {(isSelected || showDetails) && (
                    /* Issue #25: Enhanced benefits display with larger text */
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-3 space-y-2"
                    >
                      {option.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-foreground/80">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          <span className="font-medium">{benefit}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Special info for publish option */}
              {option.id === "publish" && isSelected && estimatedPrice && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-2 text-[10px] text-green-700 dark:text-green-400">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>
                      Startpreis: <strong>CHF {estimatedPrice.min}</strong> – Firmen können darunter bieten!
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Special info for both option */}
              {option.id === "both" && isSelected && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex items-center gap-2 text-[10px] text-amber-700 dark:text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {selectedCompaniesCount} Firmen direkt + öffentliche Ausschreibung
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
        </div>

        {/* Issue #25, #47: Simplified security info - compact design, better contrast */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-xs">
          <Shield className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
          <span className="text-muted-foreground">
            Firmen sehen nur PLZ – Kontaktdaten erst nach Ihrer Zusage
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
});

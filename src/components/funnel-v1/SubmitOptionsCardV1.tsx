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

// Issue #25: Konkretere Vorteile für jede Option
const submitOptions: SubmitOption[] = [
  {
    id: "direct",
    label: "Direkt anfragen",
    description: "Ihre ausgewählten Firmen werden direkt kontaktiert und melden sich mit Offerten.",
    tooltip: "Schnellster Weg: Wir senden Ihre Anfrage direkt an die ausgewählten Firmen. Sie erhalten in 24-48h persönliche Offerten per E-Mail.",
    icon: <Send className="w-5 h-5" />,
    benefits: [
      "⚡ Antwort in Ø 24 Stunden",
      "✓ Nur geprüfte Top-Firmen",
      "📞 Persönliche Betreuung garantiert",
    ],
  },
  {
    id: "publish",
    label: "Ausschreibung publizieren",
    description: "Ihr Umzug wird im Portal veröffentlicht – Firmen bieten um Ihren Auftrag.",
    tooltip: "Wie eine Auktion: Ihr Umzug wird anonym publiziert. Firmen sehen nur PLZ & Datum und bieten um den Auftrag – oft günstigere Preise durch Wettbewerb.",
    icon: <Gavel className="w-5 h-5" />,
    benefits: [
      "📊 Ø 5-8 Offerten pro Anfrage",
      "💰 Bis zu 35% günstiger durch Wettbewerb",
      "🔒 Ihre Daten bleiben anonym",
    ],
    badge: "💰 Spar-Tipp",
  },
  {
    id: "both",
    label: "Beides kombinieren",
    description: "Direktkontakt + Ausschreibung = maximale Auswahl zum besten Preis.",
    tooltip: "Die beste Wahl: Sie erhalten sowohl schnelle Offerten von Top-Firmen als auch günstige Angebote durch die öffentliche Ausschreibung. Maximale Auswahl, volle Kontrolle.",
    icon: <Crown className="w-5 h-5" />,
    benefits: [
      "🎯 Ø 8-12 Offerten (3x mehr Auswahl)",
      "⏱ Schnelle Antworten + günstige Gebote",
      "✨ 93% unserer Nutzer wählen diese Option",
    ],
    badge: "⭐ Empfohlen",
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
        {/* Issue #15: Klarer Titel mit Vergleichs-Link */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-2">
            Wie möchten Sie Offerten erhalten?
          </label>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-primary hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors"
            aria-expanded={showDetails}
          >
            <Info className="w-3.5 h-3.5" />
            {showDetails ? "Weniger Details" : "Optionen vergleichen"}
          </button>
        </div>

        {/* Issue #24, #49: Radio-Group mit min 88px Touch-Targets, klickbarer Gesamtbereich */}
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
              // Issue #10, #24, #49: Min-h-[96px] für 44px+ Touch-Targets, klickbarer Gesamtbereich
              className={`relative w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all min-h-[96px] touch-manipulation active:scale-[0.99] ${
                isSelected
                  ? "border-secondary bg-secondary/10 ring-2 ring-secondary/20 shadow-md"
                  : option.recommended
                  ? "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 hover:border-amber-400"
                  : "border-border hover:border-primary/30 bg-card"
              }`}
            >
              {/* Badge */}
              {option.badge && (
                <div className="absolute -top-2 right-3">
                  <Badge 
                    className={`text-[8px] px-1.5 py-0.5 border-0 ${
                      option.recommended 
                        ? "bg-amber-500 text-white" 
                        : "bg-green-500 text-white"
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

                {/* Enhanced: Larger icon container (48px) */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isSelected 
                      ? "bg-secondary text-secondary-foreground scale-105" 
                      : option.recommended
                      ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
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
                      className="mt-2.5 space-y-1.5"
                    >
                      {option.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          <span>{benefit}</span>
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

        {/* Issue #16 & #47: Klare Datenschutz-Kommunikation mit spezifischen Details */}
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-sm text-green-700 dark:text-green-400 leading-relaxed space-y-1.5">
              <p className="font-bold text-green-800 dark:text-green-300 flex items-center gap-1.5">
                🔒 Ihre Daten sind sicher
              </p>
              <ul className="text-xs space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span><strong>Direkt anfragen:</strong> Nur gewählte Firmen erhalten Ihre Kontaktdaten</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span><strong>Ausschreibung:</strong> Anonym – nur PLZ & Datum sichtbar, Kontakt erst nach Ihrem OK</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span>Keine Werbeanrufe · 100% unverbindlich · Jederzeit widerrufbar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

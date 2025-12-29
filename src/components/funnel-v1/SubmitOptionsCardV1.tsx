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

const submitOptions: SubmitOption[] = [
  {
    id: "direct",
    label: "Direkt anfragen",
    description: "Ihre ausgewählten Firmen werden direkt kontaktiert und melden sich mit Offerten.",
    tooltip: "Schnellster Weg: Wir senden Ihre Anfrage direkt an die ausgewählten Firmen. Sie erhalten in 24-48h persönliche Offerten per E-Mail.",
    icon: <Send className="w-5 h-5" />,
    benefits: [
      "Schnelle Antwort (24-48h)",
      "Geprüfte Top-Firmen",
      "Persönliche Betreuung",
    ],
  },
  {
    id: "publish",
    label: "Ausschreibung publizieren",
    description: "Ihr Umzug wird im Portal veröffentlicht – registrierte Firmen können darauf bieten.",
    tooltip: "Wie eine Auktion: Ihr Umzug wird anonym publiziert. Firmen sehen nur PLZ & Datum und bieten um den Auftrag – oft günstigere Preise durch Wettbewerb.",
    icon: <Gavel className="w-5 h-5" />,
    benefits: [
      "Mehr Angebote erhalten",
      "Firmen konkurrieren um Sie",
      "Oft günstigere Preise",
    ],
    badge: "💰 Spar-Tipp",
  },
  {
    id: "both",
    label: "Beides",
    description: "Beste Kombination: Direktkontakt + öffentliche Ausschreibung für maximale Auswahl.",
    tooltip: "Die beste Wahl: Sie erhalten sowohl schnelle Offerten von Top-Firmen als auch günstige Angebote durch die öffentliche Ausschreibung. Maximale Auswahl, volle Kontrolle.",
    icon: <Crown className="w-5 h-5" />,
    benefits: [
      "Maximale Reichweite",
      "Schnelle + günstige Optionen",
      "Volle Kontrolle",
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
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Wie möchten Sie Offerten erhalten?</label>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[10px] text-primary hover:underline"
          >
            {showDetails ? "Weniger" : "Mehr Info"}
          </button>
        </div>

        <div className="grid gap-2">
        {submitOptions.map((option) => {
          const isSelected = value === option.id;
          
          return (
            <motion.button
              key={option.id}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(option.id)}
              // Enhanced: min-h-[80px] for better touch targets, improved padding
              className={`relative w-full p-4 rounded-xl border-2 text-left transition-all min-h-[80px] touch-manipulation active:scale-[0.99] ${
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

                {/* Content - Enhanced typography */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {/* Enhanced: Larger font for better readability */}
                    <p className="text-base font-bold mb-0.5">{option.label}</p>
                    {/* V1: Info tooltip with larger touch target */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-foreground p-1 -m-1 touch-manipulation">
                          <Info className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] text-sm p-3">
                        {option.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {/* Enhanced: Larger description text */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
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

        {/* Info Box - Issue #16 & #47: Enhanced trust with lock icon */}
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
              <strong className="text-green-800 dark:text-green-300">Datenschutz garantiert:</strong> Bei der Ausschreibung sehen Firmen nur 
              PLZ und Umzugsdatum. Ihre Kontaktdaten werden erst nach Ihrer Zustimmung geteilt. Keine Werbeanrufe.
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

/**
 * V1 Version - SubmitOptionsCard with enhanced UX
 * 
 * Fixes applied:
 * - Issue #2: Visual comparison table toggle
 * - Issue #10, #38: Consistent badge styling (green for recommended, blue for savings)
 * - Issue #11: Removed confusing slider dots
 * - Issue #18: Enhanced "Beste Wahl" visibility
 * - Issue #23, #25: 48px touch targets for radio buttons
 * - Issue #27: No hidden interactions - all benefits visible
 */

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, CheckCircle, 
  TrendingDown, Shield, Zap, Info
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
  badgeColor?: string;
  recommended?: boolean;
}

// Issue #6, #18: Better icons that are more self-explanatory
const submitOptions: SubmitOption[] = [
  {
    id: "direct",
    label: "Direkt anfragen",
    description: "Schnellster Weg: Firmen melden sich in 24h",
    tooltip: "Schnellster Weg: Wir senden Ihre Anfrage direkt an die ausgewählten Firmen. Sie erhalten in 24-48h persönliche Offerten per E-Mail.",
    icon: <Zap className="w-5 h-5" />,  // Issue #18: Lightning bolt = speed (more intuitive)
    benefits: [
      "⚡ Antwort in Ø 24h",
      "✓ Nur geprüfte Firmen",
      "📞 Persönliche Betreuung",
    ],
  },
  {
    id: "publish",
    label: "Ausschreibung",
    // Issue #71, #73: Klarerer Vorteil direkt im Text
    description: "Günstiger: Firmen bieten um Ihren Auftrag",
    tooltip: "Wie eine Auktion: Ihr Umzug wird anonym publiziert. Firmen sehen nur PLZ & Datum und bieten um den Auftrag – oft günstigere Preise durch Wettbewerb.",
    icon: <TrendingDown className="w-5 h-5" />,  // Issue #18: Trend down = savings (more intuitive than gavel)
    benefits: [
      "📊 Ø 5-8 Offerten",
      "💰 Oft 20-35% günstiger",
      "🔒 Anonym bis Sie zustimmen",
    ],
    // Issue #10, #73: Konsistentes blaues Badge für Spar-Tipp mit direktem Vorteil
    badge: "💰 Bis 35% günstiger",
    badgeColor: "bg-blue-500",
  },
  {
    id: "both",
    label: "Beides",
    // Issue #76: Klarerer Vorteil, keine '93%'-Behauptung ohne Quelle
    description: "Maximum: Schnell + günstig kombiniert",
    tooltip: "Die beste Wahl: Sie erhalten sowohl schnelle Offerten von Top-Firmen als auch günstige Angebote durch die öffentliche Ausschreibung. Maximale Auswahl, volle Kontrolle.",
    icon: <Sparkles className="w-5 h-5" />,  // Issue #18: Sparkles = best of both (more intuitive than crown)
    // Issue #27, #76: Alle Vorteile direkt sichtbar - keine unbelegten Prozente
    benefits: [
      "🎯 Ø 8-12 Offerten",
      "⏱ Schnell + günstig",
      "✨ Maximale Auswahl",
    ],
    // Issue #6, #10, #18, #76: Grünes Badge - externe Platzierung außerhalb des Buttons
    badge: "✨ Empfohlen",
    badgeColor: "bg-green-500",
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

  return (
    <TooltipProvider>
      {/* Issue #15: Prevent horizontal scroll - overflow-x-hidden */}
      <div className="space-y-3 overflow-x-hidden max-w-full">
        {/* Issue #10, #16: Default "Beides" vorausgewählt - keine extra Optionen-Schaltfläche nötig */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-base sm:text-lg font-bold">
            Wie möchten Sie Offerten erhalten?
          </label>
        </div>

        {/* Issue #10: "Beides" ist bereits vorausgewählt - Vergleichstabelle entfernt für weniger Friction */}

        {/* Issue #15, #42: Vertical layout on mobile (NO horizontal scroll), consistent order */}
        <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Offerten-Methode auswählen">
          {/* Issue #42: "Beides" zuerst und prominenter anzeigen als beste Wahl */}
          {submitOptions.slice().sort((a, b) => (a.recommended ? -1 : b.recommended ? 1 : 0)).map((option) => {
            const isSelected = value === option.id;
            
            return (
              <motion.button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => onChange(option.id)}
                // Issue #9, #44, #48, #80: Visuelles Feedback bei Auswahl, min 64px touch target
                className={`relative w-full p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all min-h-[72px] touch-manipulation active:scale-[0.99] ${
                  isSelected
                    ? "border-secondary bg-secondary/10 ring-2 ring-secondary/30 shadow-lg"
                    : option.recommended
                    ? "border-green-400 dark:border-green-600 bg-green-50/50 dark:bg-green-950/30 hover:border-green-500 shadow-sm hover:shadow-md"
                    : "border-border hover:border-primary/50 bg-card hover:shadow-sm"
                }`}
              >
                {/* Issue #10, #63: Consistent badge styling */}
                {option.badge && (
                  <div className="absolute -top-2 right-3">
                    <Badge 
                      className={`text-[10px] px-2 py-0.5 border-0 shadow-sm text-white font-bold ${option.badgeColor || "bg-green-500"}`}
                    >
                      {option.badge}
                    </Badge>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Issue #28, #66: Larger radio indicator (24px) */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 transition-all ${
                      isSelected ? "bg-secondary border-secondary" : "border-muted-foreground/40"
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-secondary-foreground" />}
                  </div>

                  {/* Icon container */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected 
                        ? "bg-secondary text-secondary-foreground" 
                        : option.recommended
                        ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {option.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-base sm:text-lg font-bold">{option.label}</p>
                      {/* Tooltip mit grösserem Touch-Target */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            type="button" 
                            className="text-muted-foreground hover:text-foreground p-2 -m-1 touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
                            aria-label={`Info zu ${option.label}`}
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] text-sm p-3">
                          {option.tooltip}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>

                    {/* Issue #35, #50: Benefits always visible for recommended - simpler layout */}
                    {(isSelected || option.recommended) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-2 flex flex-wrap gap-x-3 gap-y-1"
                      >
                        {option.benefits.map((benefit, idx) => (
                          <span key={idx} className="text-xs text-foreground/70 font-medium">
                            {benefit}
                          </span>
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
                    className="mt-3 ml-[68px] sm:ml-[76px] p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
                      <TrendingDown className="w-4 h-4" />
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
                    className="mt-3 ml-[68px] sm:ml-[76px] p-2.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400">
                      <Sparkles className="w-4 h-4" />
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

        {/* Datenschutz-Info - ohne Widerspruch */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          <span className="text-sm text-green-700 dark:text-green-300 font-medium">
            Sicher: Daten nur an gewählte Firmen · SSL-verschlüsselt
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
});

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

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Globe, Sparkles, CheckCircle, Users, Clock, 
  TrendingDown, Shield, Zap, Crown, Gavel, Info, BarChart3
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

const submitOptions: SubmitOption[] = [
  {
    id: "direct",
    label: "Direkt anfragen",
    description: "Schnell: Ausgewählte Firmen melden sich.",
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
    // Issue #10: Konsistentes blaues Badge für Spar-Tipp
    badge: "💰 Spar-Tipp",
    badgeColor: "bg-blue-500",
  },
  {
    id: "both",
    label: "Beides",
    description: "Beste Wahl: 3× mehr Offerten, schnell + günstig.",
    tooltip: "Die beste Wahl: Sie erhalten sowohl schnelle Offerten von Top-Firmen als auch günstige Angebote durch die öffentliche Ausschreibung. Maximale Auswahl, volle Kontrolle.",
    icon: <Crown className="w-5 h-5" />,
    // Issue #27: Alle Vorteile direkt sichtbar - KEINE versteckten Slider
    benefits: [
      "🎯 Ø 8-12 Offerten",
      "⏱ Schnell + günstig",
      "✨ 93% wählen diese Option",
    ],
    // Issue #10, #18: Grünes Badge für "Beste Wahl" - konsistent
    badge: "✨ Beste Wahl",
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
  const [showComparison, setShowComparison] = useState(false);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Issue #12, #15, #24, #65: Clear label - NO confusing "Vergleichen" button */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-base sm:text-lg font-bold">
            Wie möchten Sie Offerten erhalten?
          </label>
          {/* Issue #12, #64: Comparison toggle - clear function label */}
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className={`text-xs flex items-center gap-2 px-3 py-2 rounded-xl transition-all touch-manipulation min-h-[44px] font-medium border ${
              showComparison 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
            aria-expanded={showComparison}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">{showComparison ? "Tabelle schliessen" : "Optionen vergleichen"}</span>
            <span className="sm:hidden">{showComparison ? "×" : "?"}</span>
          </button>
        </div>

        {/* Issue #2: Comparison table when toggled */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-muted/50 border border-border mb-3">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium">Merkmal</th>
                      <th className="text-center py-2 font-medium">Direkt</th>
                      <th className="text-center py-2 font-medium">Ausschreibung</th>
                      <th className="text-center py-2 font-medium text-green-600">Beides</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Offerten</td>
                      <td className="text-center">3-5</td>
                      <td className="text-center">5-8</td>
                      <td className="text-center font-bold text-green-600">8-12</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Geschwindigkeit</td>
                      <td className="text-center">⚡⚡⚡</td>
                      <td className="text-center">⚡</td>
                      <td className="text-center font-bold text-green-600">⚡⚡⚡</td>
                    </tr>
                    <tr>
                      <td className="py-2">Preisersparnis</td>
                      <td className="text-center">Ø 15%</td>
                      <td className="text-center">Ø 35%</td>
                      <td className="text-center font-bold text-green-600">Ø 40%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Issue #28, #52, #66: Radio-Group with 48px+ touch targets - entire card clickable */}
        <div className="grid gap-3" role="radiogroup" aria-label="Offerten-Methode auswählen">
          {submitOptions.map((option) => {
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
                // Issue #28, #52: Full card clickable, min-h for 48px touch targets
                className={`relative w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all min-h-[80px] touch-manipulation active:scale-[0.99] ${
                  isSelected
                    ? "border-secondary bg-secondary/10 ring-2 ring-secondary/30 shadow-md"
                    : option.recommended
                    ? "border-green-400 dark:border-green-600 bg-green-50/80 dark:bg-green-950/40 hover:border-green-500 shadow-sm ring-1 ring-green-200 dark:ring-green-800"
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

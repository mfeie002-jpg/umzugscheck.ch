/**
 * V1.d Submit Options Card
 * 
 * Improvements (Audit #7):
 * - "Both" option highlighted in GREEN (not red)
 * - Clearer copy explaining what each option means
 * - Auto-scroll hint after selection
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Send, Globe, Zap, Check, Shield, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubmitOption {
  value: "direct" | "publish" | "both";
  label: string;
  description: string;
  tooltip: string;
  icon: React.ReactNode;
  badge?: string;
  highlight?: boolean;
}

const options: SubmitOption[] = [
  {
    value: "direct",
    label: "Direkt anfragen",
    description: "Schnell – nur ausgewählte Firmen",
    tooltip: "Ihre Anfrage geht direkt an die von Ihnen gewählten Firmen. Schnellste Option für gezielte Offerten.",
    icon: <Send className="w-4 h-4" />,
  },
  {
    value: "publish",
    label: "Ausschreiben",
    description: "Mehr Wettbewerb – anonym bis Freigabe",
    tooltip: "Ihre Anfrage wird anonym veröffentlicht. Firmen können Offerten abgeben. Sie entscheiden, wer Ihre Daten sieht.",
    icon: <Globe className="w-4 h-4" />,
  },
  {
    value: "both",
    label: "Beides",
    description: "Maximale Auswahl – du behältst Kontrolle",
    tooltip: "Kombination: Direkte Anfrage + anonyme Ausschreibung. Maximale Reichweite bei voller Kontrolle.",
    icon: <Zap className="w-4 h-4" />,
    badge: "Empfohlen",
    highlight: true,
  },
];

interface SubmitOptionsCardV1dProps {
  value: "direct" | "publish" | "both";
  onChange: (value: "direct" | "publish" | "both") => void;
  selectedCompaniesCount: number;
  estimatedPrice: { min: number; max: number };
}

export const SubmitOptionsCardV1d = memo(function SubmitOptionsCardV1d({
  value,
  onChange,
  selectedCompaniesCount,
  estimatedPrice,
}: SubmitOptionsCardV1dProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold">Wie sollen Firmen Ihnen Offerten senden?</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">Wählen Sie, wie Firmen Ihre Anfrage erhalten. Ihre Daten bleiben immer geschützt.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <TooltipProvider key={option.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onChange(option.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? option.highlight
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : "border-primary bg-primary/5"
                        : option.highlight
                          ? "border-green-200 dark:border-green-800 hover:border-green-400"
                          : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? option.highlight
                          ? "bg-green-500 text-white"
                          : "bg-primary text-primary-foreground"
                        : option.highlight
                          ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                          : "bg-muted"
                    }`}>
                      {option.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${
                          option.highlight && isSelected ? "text-green-700 dark:text-green-300" : ""
                        }`}>
                          {option.label}
                        </p>
                        {option.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            isSelected
                              ? "bg-green-500 text-white"
                              : "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                          }`}>
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{option.description}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? option.highlight
                          ? "bg-green-500 border-green-500"
                          : "bg-primary border-primary"
                        : "border-muted-foreground/30"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-xs">{option.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Summary for "both" option */}
      {value === "both" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="text-xs text-green-700 dark:text-green-300">
              <p className="font-medium mb-1">Sie erhalten:</p>
              <ul className="space-y-0.5 text-green-600 dark:text-green-400">
                <li>• Direkte Offerten von {selectedCompaniesCount} ausgewählten Firmen</li>
                <li>• Zusätzliche Offerten durch anonyme Ausschreibung</li>
                <li>• Volle Kontrolle über Ihre Daten</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Privacy note */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <Shield className="w-3 h-3 text-green-500" />
        <span>Bei Ausschreibung bleiben Ihre Daten anonym bis Sie eine Firma freigeben</span>
      </div>
    </div>
  );
});

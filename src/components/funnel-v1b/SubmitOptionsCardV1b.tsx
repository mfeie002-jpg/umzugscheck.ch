/**
 * SubmitOptionsCardV1b - ChatGPT Rec #6: Tooltips for offer methods
 */
import { memo } from "react";
import { Send, Globe, Crown, CheckCircle, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  value: "direct" | "publish" | "both";
  onChange: (value: "direct" | "publish" | "both") => void;
  selectedCompaniesCount: number;
  estimatedPrice: { min: number; max: number };
}

const options = [
  {
    value: "direct" as const,
    label: "Direkt anfragen",
    description: "Ihre ausgewählten Firmen werden direkt kontaktiert und melden sich mit Offerten.",
    tooltip: "Schnellste Option: Die von Ihnen gewählten Firmen erhalten sofort Ihre Anfrage und können Ihnen direkt ein Angebot machen.",
    icon: Send,
    badge: null,
  },
  {
    value: "publish" as const,
    label: "Ausschreibung publizieren",
    description: "Ihr Umzug wird im Portal veröffentlicht – registrierte Firmen können darauf bieten.",
    tooltip: "Oft günstiger: Ihr Umzug wird anonym ausgeschrieben. Firmen konkurrieren um Ihren Auftrag, was zu besseren Preisen führen kann.",
    icon: Globe,
    badge: "Spar-Tipp",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    value: "both" as const,
    label: "Beides",
    description: "Beste Kombination: Direktkontakt + öffentliche Ausschreibung für maximale Auswahl.",
    tooltip: "Maximale Reichweite: Sie erhalten sowohl direkte Angebote von Ihren Wunschfirmen als auch zusätzliche Gebote aus der Ausschreibung.",
    icon: Crown,
    badge: "Empfohlen",
    badgeColor: "bg-secondary/20 text-secondary",
    highlight: true,
  },
];

export const SubmitOptionsCardV1b = memo(function SubmitOptionsCardV1b({
  value,
  onChange,
  selectedCompaniesCount,
}: Props) {
  return (
    <div className="space-y-2 overflow-x-hidden">
      {/* FIX: Clearer label with better contrast */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-sm font-semibold text-foreground">Wie möchten Sie Offerten erhalten?</label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">Wählen Sie die Methode, die am besten zu Ihnen passt. "Beides" bietet die grösste Auswahl.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* FIX: Radio buttons with clear labels and larger touch targets */}
      <div className="space-y-2">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          
          return (
            <div
              key={option.value}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(option.value);
                }
              }}
              className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer touch-manipulation min-h-[64px] ${
                isSelected
                  ? option.highlight
                    ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20"
                    : "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/30 active:bg-muted/50"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected
                    ? option.highlight
                      ? "border-secondary bg-secondary"
                      : "border-primary bg-primary"
                    : "border-border"
                }`}>
                  {isSelected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                </div>

                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected
                    ? option.highlight
                      ? "bg-secondary/20"
                      : "bg-primary/20"
                    : "bg-muted"
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? (option.highlight ? "text-secondary" : "text-primary") : "text-muted-foreground"}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{option.label}</p>
                    {option.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${option.badgeColor}`}>
                        {option.badge}
                      </span>
                    )}
                    {/* ChatGPT Rec #6: Info tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">{option.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                  
                  {/* Benefits for "both" */}
                  {option.value === "both" && isSelected && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Maximale Reichweite
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Schnelle + günstige Optionen
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Volle Kontrolle
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Summary for "both" */}
              {option.value === "both" && isSelected && (
                <div className="mt-2 ml-14 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-700 dark:text-amber-300">
                  ✨ {selectedCompaniesCount} Firmen direkt + öffentliche Ausschreibung
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          <strong>Sicher & diskret:</strong> Bei der Ausschreibung sehen Firmen nur PLZ und Umzugsdatum – keine persönlichen Daten. Erst nach Ihrem OK werden Kontaktdaten geteilt.
        </span>
      </div>
    </div>
  );
});

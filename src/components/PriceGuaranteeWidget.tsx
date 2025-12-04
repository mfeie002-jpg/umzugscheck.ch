import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, AlertCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PriceGuaranteeWidgetProps {
  companyName: string;
  hasGuarantee?: boolean;
  guaranteeType?: "fixed" | "max" | "estimate";
  maxIncrease?: number;
}

export const PriceGuaranteeWidget = ({
  companyName,
  hasGuarantee = true,
  guaranteeType = "max",
  maxIncrease = 10,
}: PriceGuaranteeWidgetProps) => {
  const guaranteeLabels = {
    fixed: "Festpreisgarantie",
    max: "Maximalpreisgarantie",
    estimate: "Kostenvoranschlag",
  };

  const guaranteeDescriptions = {
    fixed: "Der vereinbarte Preis ist verbindlich und ändert sich nicht.",
    max: `Der Endpreis kann maximal ${maxIncrease}% über dem Angebot liegen.`,
    estimate: "Unverbindliche Schätzung basierend auf Ihren Angaben.",
  };

  return (
    <Card className={`border-2 ${hasGuarantee ? "border-green-200 bg-green-50/50" : "border-amber-200 bg-amber-50/50"}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${hasGuarantee ? "bg-green-100" : "bg-amber-100"}`}>
            <Shield className={`h-5 w-5 ${hasGuarantee ? "text-green-600" : "text-amber-600"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{guaranteeLabels[guaranteeType]}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{guaranteeDescriptions[guaranteeType]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">{guaranteeDescriptions[guaranteeType]}</p>
            
            {hasGuarantee && (
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Keine versteckten Kosten</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Versicherungsschutz inklusive</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Schriftliche Bestätigung</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceGuaranteeWidget;

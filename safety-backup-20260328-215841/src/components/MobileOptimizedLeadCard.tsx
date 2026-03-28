import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Package, Eye, Zap, Flame, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  from_city: string;
  to_city: string;
  move_date: string;
  quality_score?: number;
  recommended_price?: number;
  calculator_output: any;
  interested_providers?: number;
}

interface MobileOptimizedLeadCardProps {
  lead: Lead;
  onView: (leadId: string) => void;
  onQuickBid: (leadId: string) => void;
}

export const MobileOptimizedLeadCard = ({ lead, onView, onQuickBid }: MobileOptimizedLeadCardProps) => {
  const getQualityColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const qualityScore = lead.quality_score || 50;
  
  // Calculate urgency based on move date proximity
  const daysUntilMove = Math.ceil(
    (new Date(lead.move_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilMove <= 7;
  const isHighDemand = (lead.interested_providers || 0) >= 5;

  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-shadow",
      isUrgent && "ring-2 ring-destructive/50"
    )}>
      <div className={cn(
        "h-1",
        getQualityColor(qualityScore)
      )} />
      
      {/* Urgency Banner */}
      {(isUrgent || isHighDemand) && (
        <div className={cn(
          "px-3 py-1.5 text-xs font-medium flex items-center gap-1.5",
          isUrgent 
            ? "bg-destructive/10 text-destructive" 
            : "bg-primary/10 text-primary"
        )}>
          {isUrgent ? (
            <>
              <Flame className="h-3 w-3" />
              Dringend – nur noch {daysUntilMove} Tage!
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              {lead.interested_providers} Anbieter interessiert
            </>
          )}
        </div>
      )}
      
      <CardContent className="p-4 space-y-3">
        {/* Header with Quality Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold",
              getQualityColor(qualityScore)
            )}>
              {qualityScore}
            </div>
            <div>
              <p className="font-semibold text-sm">
                {lead.from_city} → {lead.to_city}
              </p>
              <p className="text-xs text-muted-foreground">
                Lead #{lead.id.slice(0, 8)}
              </p>
            </div>
          </div>
          {lead.recommended_price && (
            <Badge variant="outline" className="font-semibold">
              CHF {lead.recommended_price}
            </Badge>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className="truncate">
              {new Date(lead.move_date).toLocaleDateString('de-CH', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>{lead.calculator_output?.volume || 'N/A'} m³</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{lead.calculator_output?.distance || 'N/A'} km</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(lead.id)}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickBid(lead.id)}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-1" />
            Bieten
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

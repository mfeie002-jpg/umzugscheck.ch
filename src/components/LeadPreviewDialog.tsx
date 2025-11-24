import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Package, Calendar, TrendingUp, Star, Lock, Gavel, ShoppingCart } from "lucide-react";
import { calculateLeadQualityScore } from "@/lib/pricing";

interface Lead {
  id: string;
  from_city: string;
  from_postal: string;
  to_city: string;
  to_postal: string;
  move_date: string | null;
  calculator_type: string;
  calculator_output: any;
  created_at: string;
  bidding_enabled: boolean;
  starting_bid?: number | null;
  current_highest_bid?: number | null;
}

interface LeadPreviewDialogProps {
  lead: Lead;
  children?: React.ReactNode;
  onProceed?: () => void;
}

export function LeadPreviewDialog({ lead, children, onProceed }: LeadPreviewDialogProps) {
  const volume = lead.calculator_output?.volume || 30;
  
  const qualityScore = calculateLeadQualityScore({
    volume,
    fromPostal: lead.from_postal,
    toPostal: lead.to_postal,
    calculatorType: lead.calculator_type,
    calculatorOutput: lead.calculator_output,
    estimatedValue: lead.calculator_output?.priceAvg,
    createdAt: lead.created_at
  });

  // Get canton from postal code (first digit)
  const getCantonFromPostal = (postalCode: string): string => {
    const code = postalCode.substring(0, 1);
    const codeMap: Record<string, string> = {
      '1': 'Westschweiz (VD/FR)',
      '2': 'Nordwestschweiz (NE/JU)',
      '3': 'Bern',
      '4': 'Basel',
      '5': 'Aargau',
      '6': 'Zentralschweiz (LU/TI)',
      '7': 'Graubünden',
      '8': 'Zürich',
      '9': 'Ostschweiz (SG/AR)'
    };
    return codeMap[code] || 'Andere Region';
  };

  const fromRegion = getCantonFromPostal(lead.from_postal);
  const toRegion = getCantonFromPostal(lead.to_postal);

  // Volume range (±10m³ range)
  const volumeMin = Math.max(10, volume - 10);
  const volumeMax = volume + 10;

  // Complexity indicators
  const hasExtraServices = lead.calculator_output?.extraServices?.length > 0;
  const hasSpecialItems = lead.calculator_output?.specialItems?.length > 0;
  const hasDifficultAccess = lead.calculator_output?.accessDifficulty === 'difficult';
  const floors = (lead.calculator_output?.floorsStart || 0) + (lead.calculator_output?.floorsDestination || 0);

  const getQualityBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'elite': return 'default';
      case 'premium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Vorschau
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Lead-Vorschau
          </DialogTitle>
          <DialogDescription>
            Überprüfen Sie die wichtigsten Details, bevor Sie bieten oder kaufen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quality Score & Type */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Umzugsart</div>
              <div className="font-semibold">{lead.calculator_type}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={getQualityBadgeVariant(qualityScore.qualityTier)} className="text-sm">
                <Star className="h-4 w-4 mr-1" />
                {qualityScore.qualityTier.toUpperCase()}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Score: <span className="font-bold text-foreground">{qualityScore.totalScore}/100</span>
              </div>
            </div>
          </div>

          {/* Location Info (Partial) */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Standort (allgemein)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Von</div>
                <div className="font-medium">{fromRegion}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Genaue Adresse nach Kauf
                </div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Nach</div>
                <div className="font-medium">{toRegion}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Genaue Adresse nach Kauf
                </div>
              </div>
            </div>
          </div>

          {/* Volume Range */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Geschätztes Volumen
            </h3>
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-center">
                {volumeMin} - {volumeMax} m³
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                Ungefährer Bereich basierend auf Angaben
              </div>
            </div>
          </div>

          {/* Complexity Indicators */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Komplexitätsfaktoren
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${hasExtraServices ? 'border-primary bg-primary/5' : 'border-border bg-muted/10'}`}>
                <div className="text-sm font-medium">Zusatzleistungen</div>
                <div className={`text-xs mt-1 ${hasExtraServices ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {hasExtraServices ? 'Ja, enthalten' : 'Keine'}
                </div>
              </div>
              <div className={`p-3 rounded-lg border ${hasSpecialItems ? 'border-primary bg-primary/5' : 'border-border bg-muted/10'}`}>
                <div className="text-sm font-medium">Spezielle Gegenstände</div>
                <div className={`text-xs mt-1 ${hasSpecialItems ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {hasSpecialItems ? 'Ja, vorhanden' : 'Keine'}
                </div>
              </div>
              <div className={`p-3 rounded-lg border ${hasDifficultAccess ? 'border-primary bg-primary/5' : 'border-border bg-muted/10'}`}>
                <div className="text-sm font-medium">Zugang</div>
                <div className={`text-xs mt-1 ${hasDifficultAccess ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {hasDifficultAccess ? 'Schwierig' : 'Normal'}
                </div>
              </div>
              <div className={`p-3 rounded-lg border ${floors > 3 ? 'border-primary bg-primary/5' : 'border-border bg-muted/10'}`}>
                <div className="text-sm font-medium">Stockwerke</div>
                <div className={`text-xs mt-1 ${floors > 3 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {floors > 3 ? `${floors} Stockwerke` : 'Niedrig'}
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Value */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              Geschätzter Auftragswert
            </h3>
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="text-3xl font-bold text-center text-primary">
                CHF {qualityScore.estimatedJobValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                Geschätzter Gesamtwert des Auftrags
              </div>
            </div>
          </div>

          {/* Move Date (if available) */}
          {lead.move_date && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Umzugsdatum
              </h3>
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <div className="font-medium">
                  {new Date(lead.move_date).toLocaleDateString("de-CH", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">
              {lead.bidding_enabled ? 'Auktions-Details' : 'Preis-Information'}
            </h3>
            <div className="p-4 bg-muted/20 rounded-lg">
              {lead.bidding_enabled ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Startgebot:</span>
                    <span className="font-bold">CHF {lead.starting_bid || qualityScore.finalPrice}</span>
                  </div>
                  {lead.current_highest_bid && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Aktuelles Höchstgebot:</span>
                      <span className="font-bold text-primary">CHF {lead.current_highest_bid}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 p-2 bg-purple-500/10 rounded">
                    <Gavel className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-700 dark:text-purple-400 font-medium">
                      Auktion läuft - Bieten Sie jetzt!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lead-Preis:</span>
                    <span className="font-bold text-xl">CHF {qualityScore.finalPrice}</span>
                  </div>
                  {qualityScore.ageDiscount > 0 && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-green-500/10 rounded">
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                        {qualityScore.ageDiscountPercentage}% Zeitrabatt angewendet!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              size="lg"
              onClick={onProceed}
            >
              {lead.bidding_enabled ? (
                <>
                  <Gavel className="h-5 w-5 mr-2" />
                  Zur Auktion gehen
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Lead kaufen
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              <Lock className="h-3 w-3 inline mr-1" />
              Vollständige Kontaktdaten und Details nach Kauf verfügbar
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

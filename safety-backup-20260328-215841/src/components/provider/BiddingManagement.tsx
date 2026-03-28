import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, DollarSign, Target, AlertCircle, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const SWISS_CANTONS = [
  "Zürich", "Bern", "Luzern", "Uri", "Schwyz", "Obwalden", "Nidwalden",
  "Glarus", "Zug", "Freiburg", "Solothurn", "Basel-Stadt", "Basel-Landschaft",
  "Schaffhausen", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "St. Gallen",
  "Graubünden", "Aargau", "Thurgau", "Tessin", "Waadt", "Wallis", "Neuenburg",
  "Genf", "Jura"
];

interface BiddingManagementProps {
  provider: any;
  onUpdate?: (updates: any) => void;
}

export const BiddingManagement = ({ provider, onUpdate }: BiddingManagementProps) => {
  const [biddingEnabled, setBiddingEnabled] = useState(provider.biddingEnabled || false);
  const [isPaused, setIsPaused] = useState(provider.isPaused || false);
  const [bidType, setBidType] = useState(provider.bidModel || "CPL");
  const [maxBidCHF, setMaxBidCHF] = useState(provider.maxBidPerLeadCHF || 25);
  const [dailyBudgetCHF, setDailyBudgetCHF] = useState(provider.dailyBudgetCHF || 200);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    provider.sponsoredActiveRegions || provider.cantons_served || []
  );

  const handleSave = () => {
    const updates = {
      biddingEnabled,
      isPaused,
      bidModel: bidType,
      maxBidPerLeadCHF: bidType === "CPL" ? maxBidCHF : 0,
      maxBidPerClickCHF: bidType === "CPC" ? maxBidCHF : 0,
      dailyBudgetCHF,
      remainingDailyBudgetCHF: dailyBudgetCHF,
      sponsoredActiveRegions: selectedRegions,
    };
    
    if (onUpdate) {
      onUpdate(updates);
    }
    
    console.log("Bidding settings updated:", updates);
  };

  const toggleRegion = (canton: string) => {
    setSelectedRegions(prev =>
      prev.includes(canton)
        ? prev.filter(r => r !== canton)
        : [...prev, canton]
    );
  };

  const estimatedImpressions = Math.floor((dailyBudgetCHF / maxBidCHF) * 0.3);
  const estimatedClicks = Math.floor(estimatedImpressions * 0.05);
  const estimatedLeads = Math.floor(estimatedClicks * 0.15);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Werbung & Sichtbarkeit
          </CardTitle>
          <CardDescription>
            Verwalten Sie Ihre Sponsored-Platzierungen auf Ranking-Seiten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Bidding */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sponsored Werbung aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Erscheinen Sie prominent auf Ranking-Seiten
              </p>
            </div>
            <Switch
              checked={biddingEnabled}
              onCheckedChange={setBiddingEnabled}
            />
          </div>

          {biddingEnabled && (
            <>
              {/* Pause/Resume */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Kampagne pausieren</Label>
                  <p className="text-sm text-muted-foreground">
                    Vorübergehend keine gesponserten Platzierungen
                  </p>
                </div>
                <Switch
                  checked={isPaused}
                  onCheckedChange={setIsPaused}
                />
              </div>

              {isPaused && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ihre Kampagne ist pausiert. Sie werden nicht auf Ranking-Seiten angezeigt.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Bidding Settings */}
      {biddingEnabled && !isPaused && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Gebotsstrategie
              </CardTitle>
              <CardDescription>
                Wählen Sie Ihr Abrechnungsmodell und Ihr maximales Gebot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bid Type Selection */}
              <div className="space-y-3">
                <Label>Abrechnungsmodell</Label>
                <Select value={bidType} onValueChange={setBidType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPL">Cost Per Lead (CPL)</SelectItem>
                    <SelectItem value="CPC">Cost Per Click (CPC)</SelectItem>
                    <SelectItem value="CPCall">Cost Per Call</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {bidType === "CPL" && "Sie zahlen nur, wenn ein Lead generiert wird"}
                  {bidType === "CPC" && "Sie zahlen pro Klick auf Ihr Firmenprofil"}
                  {bidType === "CPCall" && "Sie zahlen pro erfolgreichen Anruf"}
                </p>
              </div>

              {/* Max Bid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Maximales Gebot pro {bidType === "CPL" ? "Lead" : bidType === "CPC" ? "Klick" : "Anruf"}</Label>
                  <Badge variant="outline">{maxBidCHF} CHF</Badge>
                </div>
                <Slider
                  value={[maxBidCHF]}
                  onValueChange={(value) => setMaxBidCHF(value[0])}
                  min={bidType === "CPC" ? 1 : bidType === "CPCall" ? 5 : 10}
                  max={bidType === "CPC" ? 10 : bidType === "CPCall" ? 30 : 80}
                  step={bidType === "CPC" ? 0.5 : 1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{bidType === "CPC" ? "1" : bidType === "CPCall" ? "5" : "10"} CHF</span>
                  <span>{bidType === "CPC" ? "10" : bidType === "CPCall" ? "30" : "80"} CHF</span>
                </div>
              </div>

              {/* Daily Budget */}
              <div className="space-y-3">
                <Label>Tagesbudget</Label>
                <Input
                  type="number"
                  value={dailyBudgetCHF}
                  onChange={(e) => setDailyBudgetCHF(Number(e.target.value))}
                  min={50}
                  max={2000}
                  step={10}
                />
                <p className="text-xs text-muted-foreground">
                  Ihr Budget wird automatisch täglich zurückgesetzt
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Regional Targeting */}
          <Card>
            <CardHeader>
              <CardTitle>Regionale Ausrichtung</CardTitle>
              <CardDescription>
                Wählen Sie, in welchen Kantonen Sie gesponserte Platzierungen wünschen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SWISS_CANTONS.map((canton) => (
                  <div key={canton} className="flex items-center space-x-2">
                    <Checkbox
                      id={canton}
                      checked={selectedRegions.includes(canton)}
                      onCheckedChange={() => toggleRegion(canton)}
                    />
                    <label
                      htmlFor={canton}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {canton}
                    </label>
                  </div>
                ))}
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {selectedRegions.length} Kantone ausgewählt
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Performance Estimates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Geschätzte Performance
              </CardTitle>
              <CardDescription>
                Basierend auf Ihrem Budget und Gebot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Impressionen/Tag</p>
                  <p className="text-2xl font-bold">{estimatedImpressions}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Klicks/Tag</p>
                  <p className="text-2xl font-bold">{estimatedClicks}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Leads/Tag</p>
                  <p className="text-2xl font-bold">{estimatedLeads}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Dies sind Schätzungen basierend auf Durchschnittswerten
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" size="lg">
            Einstellungen speichern
          </Button>
        </>
      )}
    </div>
  );
};

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DynamicPricingDisplay } from "@/components/provider/DynamicPricingDisplay";
import { calculateDynamicPricing, formatPricingBreakdown } from "@/lib/dynamic-pricing";
import { TrendingUp, Calculator, Info } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function DynamicPricing() {
  const [basePrice, setBasePrice] = useState(30);
  const [interestedProviders, setInterestedProviders] = useState(2);
  const [availabilityPercentage, setAvailabilityPercentage] = useState(50);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const testDate = new Date();
  testDate.setMonth(selectedMonth);

  const pricing = calculateDynamicPricing(
    basePrice,
    interestedProviders,
    availabilityPercentage,
    testDate
  );

  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Dynamische Preisgestaltung
        </h1>
        <p className="text-muted-foreground">
          Simulieren Sie Lead-Preise basierend auf Nachfrage, Saison und Verfügbarkeit
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Preis-Simulator
              </CardTitle>
              <CardDescription>
                Passen Sie die Parameter an, um verschiedene Preisszenarien zu testen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Base Price */}
              <div className="space-y-2">
                <Label htmlFor="basePrice">Basispreis (CHF)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  min={10}
                  max={100}
                />
              </div>

              {/* Interested Providers */}
              <div className="space-y-3">
                <Label>Anzahl interessierter Anbieter: {interestedProviders}</Label>
                <Slider
                  value={[interestedProviders]}
                  onValueChange={(value) => setInterestedProviders(value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Mehr Nachfrage = höherer Preis (Wettbewerb)
                </p>
              </div>

              {/* Availability Percentage */}
              <div className="space-y-3">
                <Label>Durchschnittliche Verfügbarkeit: {availabilityPercentage}%</Label>
                <Slider
                  value={[availabilityPercentage]}
                  onValueChange={(value) => setAvailabilityPercentage(value[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Niedrigere Verfügbarkeit = höherer Preis (Knappheit)
                </p>
              </div>

              {/* Month Selection */}
              <div className="space-y-2">
                <Label htmlFor="month">Monat (für Saisonalität)</Label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Mai-September = Hochsaison (höhere Preise)
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setBasePrice(30);
                  setInterestedProviders(2);
                  setAvailabilityPercentage(50);
                  setSelectedMonth(new Date().getMonth());
                }}
              >
                Zurücksetzen
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-5 w-5 text-primary" />
                Wie funktioniert die dynamische Preisgestaltung?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>Nachfrage:</strong> Mehr interessierte Anbieter = höherer Preis (bis zu +50%)
              </p>
              <p>
                <strong>Saison:</strong> Hochsaison (Mai-Sep) = höherer Preis (+25%)
              </p>
              <p>
                <strong>Verfügbarkeit:</strong> Niedrige Kapazität = höherer Preis (bis zu +40%)
              </p>
              <p className="pt-2 border-t">
                Der Endpreis wird durch Multiplikation aller Faktoren berechnet und optimiert
                die Lead-Verteilung basierend auf Marktbedingungen.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Display */}
        <div>
          <DynamicPricingDisplay
            basePriceChf={basePrice}
            interestedProviders={interestedProviders}
            averageCapacityPercentage={availabilityPercentage}
            leadDate={testDate}
            showBreakdown={true}
          />

          {/* Breakdown Text */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Preisaufschlüsselung (Text)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                {formatPricingBreakdown(pricing)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}

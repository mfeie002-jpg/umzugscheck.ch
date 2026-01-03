/**
 * Step 1: Start & Ziel
 * 
 * UX-OPTIMIZED VERSION:
 * - Größere Touch-Targets (min 44x44px)
 * - Permanente Labels über Feldern
 * - Bessere Lesbarkeit auf Mobile (16px+ Schriftgröße)
 * - Klarere visuelle Hierarchie
 * - Hilfreiche Tipps prominent dargestellt
 */

import { MapPin, ArrowDown, Home, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UltimateTrustPills } from "../UltimateTrustBadges";
import type { UltimateFlowData } from "../UltimateSwissFlow";

interface StepAddressesProps {
  data: UltimateFlowData;
  updateData: (updates: Partial<UltimateFlowData>) => void;
}

export function StepAddresses({ data, updateData }: StepAddressesProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header - MOBILE OPTIMIZED: Larger text, better spacing */}
      <div className="text-center space-y-2 px-2">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
          Wohin führt Ihr Umzug?
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Kostenlos & unverbindlich – <span className="text-primary font-medium">in 2 Minuten</span>
        </p>
      </div>

      {/* Trust Pills */}
      <UltimateTrustPills />

      {/* Address Form - ENHANCED: Better labels, larger inputs */}
      <div className="space-y-5 bg-card rounded-xl p-4 sm:p-5 border shadow-sm">
        {/* From Address */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <Label htmlFor="fromPostal" className="text-sm sm:text-base font-medium text-foreground">
              Von (Auszugsadresse)
            </Label>
          </div>
          <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-2 sm:gap-3">
            <div className="relative">
              <Label htmlFor="fromPostal" className="sr-only">Postleitzahl</Label>
              <Input
                id="fromPostal"
                type="text"
                inputMode="numeric"
                placeholder="PLZ"
                value={data.fromPostal}
                onChange={(e) => updateData({ fromPostal: e.target.value })}
                className="h-12 sm:h-11 text-base sm:text-sm font-medium text-center"
                autoComplete="postal-code"
                maxLength={4}
                aria-label="Postleitzahl der Auszugsadresse"
              />
            </div>
            <div className="relative">
              <Label htmlFor="fromCity" className="sr-only">Ort und Strasse</Label>
              <Input
                id="fromCity"
                type="text"
                placeholder="Ort, Strasse"
                value={data.fromCity}
                onChange={(e) => updateData({ fromCity: e.target.value })}
                className="h-12 sm:h-11 text-base sm:text-sm"
                autoComplete="street-address"
                aria-label="Ort und Strasse der Auszugsadresse"
              />
            </div>
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="flex justify-center py-1">
          <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-muted flex items-center justify-center">
            <ArrowDown className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground" />
          </div>
        </div>

        {/* To Address */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            <Label htmlFor="toPostal" className="text-sm sm:text-base font-medium text-foreground">
              Nach (Einzugsadresse)
            </Label>
          </div>
          <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-2 sm:gap-3">
            <div className="relative">
              <Label htmlFor="toPostal" className="sr-only">Postleitzahl</Label>
              <Input
                id="toPostal"
                type="text"
                inputMode="numeric"
                placeholder="PLZ"
                value={data.toPostal}
                onChange={(e) => updateData({ toPostal: e.target.value })}
                className="h-12 sm:h-11 text-base sm:text-sm font-medium text-center"
                autoComplete="postal-code"
                maxLength={4}
                aria-label="Postleitzahl der Einzugsadresse"
              />
            </div>
            <div className="relative">
              <Label htmlFor="toCity" className="sr-only">Ort und Strasse</Label>
              <Input
                id="toCity"
                type="text"
                placeholder="Ort, Strasse"
                value={data.toCity}
                onChange={(e) => updateData({ toCity: e.target.value })}
                className="h-12 sm:h-11 text-base sm:text-sm"
                autoComplete="street-address"
                aria-label="Ort und Strasse der Einzugsadresse"
              />
            </div>
          </div>
        </div>

        {/* Tip - ENHANCED: More prominent, better contrast */}
        <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <span className="font-medium">Tipp:</span> Genaue Adressen = präzisere Offerten
          </p>
        </div>
      </div>

      {/* Benefits - MOBILE OPTIMIZED: Better touch targets, readable text */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {[
          { label: "Bis zu 5 Offerten", desc: "kostenlos vergleichen" },
          { label: "Geprüfte Firmen", desc: "aus der Schweiz" },
        ].map((item, i) => (
          <div 
            key={i}
            className="bg-muted/50 rounded-lg p-3 sm:p-4 text-center min-h-[70px] flex flex-col justify-center"
          >
            <div className="font-medium text-sm sm:text-base text-foreground leading-tight">{item.label}</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

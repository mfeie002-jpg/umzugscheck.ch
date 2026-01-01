/**
 * Step 1: Start & Ziel
 * 
 * - PLZ/Ort Eingabe mit Autocomplete
 * - Visuelle Route-Darstellung
 * - Trust-Elemente
 */

import { MapPin, ArrowDown } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Umzugsofferten vergleichen
        </h1>
        <p className="text-muted-foreground">
          Kostenlos Angebote von geprüften Schweizer Umzugsfirmen erhalten
        </p>
      </div>

      {/* Trust Pills */}
      <UltimateTrustPills />

      {/* Address Form */}
      <div className="space-y-4 bg-card rounded-xl p-5 border shadow-sm">
        {/* From */}
        <div className="space-y-2">
          <Label htmlFor="fromPostal" className="text-sm font-medium">
            Von wo ziehen Sie um?
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              id="fromPostal"
              type="text"
              inputMode="numeric"
              placeholder="PLZ oder Ort eingeben"
              value={data.fromPostal}
              onChange={(e) => updateData({ fromPostal: e.target.value })}
              className="h-12 pl-10 text-base"
              autoComplete="postal-code"
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* To */}
        <div className="space-y-2">
          <Label htmlFor="toPostal" className="text-sm font-medium">
            Wohin ziehen Sie?
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
            <Input
              id="toPostal"
              type="text"
              inputMode="numeric"
              placeholder="PLZ oder Ort eingeben"
              value={data.toPostal}
              onChange={(e) => updateData({ toPostal: e.target.value })}
              className="h-12 pl-10 text-base"
              autoComplete="postal-code"
            />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Bis zu 5 Offerten", desc: "kostenlos vergleichen" },
          { label: "Geprüfte Firmen", desc: "aus der Schweiz" },
        ].map((item, i) => (
          <div 
            key={i}
            className="bg-muted/50 rounded-lg p-3 text-center"
          >
            <div className="font-medium text-sm text-foreground">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

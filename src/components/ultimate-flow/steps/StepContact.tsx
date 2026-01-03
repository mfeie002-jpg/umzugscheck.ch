/**
 * Step 4: Termin & Kontakt
 * 
 * - Flexibler Datums-Picker
 * - Minimale Kontaktfelder
 * - Datenschutzhinweis
 */

import { Calendar, User, Mail, Phone, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UltimateTrustPills } from "../UltimateTrustBadges";
import type { UltimateFlowData } from "../UltimateSwissFlow";

interface StepContactProps {
  data: UltimateFlowData;
  updateData: (updates: Partial<UltimateFlowData>) => void;
}

export function StepContact({ data, updateData }: StepContactProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Wann soll es losgehen?
        </h1>
        <p className="text-muted-foreground">
          Kontaktdaten für Ihre persönlichen Offerten
        </p>
      </div>

      {/* Trust Pills */}
      <UltimateTrustPills context="contact" />

      {/* Form */}
      <div className="space-y-5 bg-card rounded-xl p-5 border shadow-sm">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="moveDate" className="text-sm font-medium">
            Gewünschtes Umzugsdatum *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="moveDate"
              type="date"
              value={data.moveDate}
              onChange={(e) => updateData({ moveDate: e.target.value })}
              className="h-12 pl-10 text-base"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Flexibility */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Flexibilität</Label>
          <RadioGroup
            value={data.dateFlexibility}
            onValueChange={(value) => updateData({ dateFlexibility: value as any })}
            className="flex flex-wrap gap-2"
          >
            {[
              { value: 'exact', label: 'Genau dieses Datum' },
              { value: 'flexible', label: '± 1 Woche flexibel' },
              { value: 'very_flexible', label: 'Sehr flexibel' },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.value}
                  className="px-3 py-1.5 rounded-full border cursor-pointer text-sm
                    peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground
                    peer-data-[state=checked]:border-primary hover:bg-muted transition-colors"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <hr className="border-border" />

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Vor- und Nachname"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="h-12 pl-10 text-base"
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            E-Mail *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              inputMode="email"
              placeholder="ihre@email.ch"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              className="h-12 pl-10 text-base"
              autoComplete="email"
              enterKeyHint="next"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
            Telefon <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+41 79 123 45 67"
              value={data.phone}
              onChange={(e) => updateData({ phone: e.target.value })}
              className="h-12 pl-10 text-base"
              autoComplete="tel"
              enterKeyHint="done"
            />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Keine Telefonpflicht – nur für Rückfragen bei Unklarheiten
          </p>
        </div>
      </div>
    </div>
  );
}

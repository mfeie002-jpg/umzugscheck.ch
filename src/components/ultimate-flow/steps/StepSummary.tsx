/**
 * Step 5: Zusammenfassung & Absenden
 * 
 * - Übersichtliche Zusammenfassung
 * - Bearbeiten-Funktion für jeden Abschnitt
 * - Finaler CTA mit Vorteils-Kommunikation
 */

import { MapPin, Home, Package, Calendar, User, Pencil, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UltimateTrustPills } from "../UltimateTrustBadges";
import type { UltimateFlowData } from "../UltimateSwissFlow";

interface StepSummaryProps {
  data: UltimateFlowData;
  updateData: (updates: Partial<UltimateFlowData>) => void;
  onEditSection: (step: number) => void;
}

const ROOM_LABELS: Record<string, string> = {
  "studio": "Studio",
  "1-2": "1-2 Zimmer",
  "2-3": "2-3 Zimmer",
  "3-4": "3-4 Zimmer",
  "4-5": "4-5 Zimmer",
  "5+": "5+ Zimmer",
};

const SERVICE_LABELS: Record<string, string> = {
  "packing": "Ein- & Auspackservice",
  "furniture": "Möbel De-/Montage",
  "cleaning": "Reinigung mit Garantie",
  "storage": "Zwischenlagerung",
};

export function StepSummary({ data, updateData, onEditSection }: StepSummaryProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('de-CH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const sections = [
    {
      step: 1,
      icon: MapPin,
      label: 'Route',
      content: `${data.fromPostal || '-'} → ${data.toPostal || '-'}`,
    },
    {
      step: 2,
      icon: Home,
      label: 'Wohnung',
      content: ROOM_LABELS[data.roomCount] || '-',
    },
    {
      step: 3,
      icon: Package,
      label: 'Services',
      content: data.services?.length 
        ? data.services.map(s => SERVICE_LABELS[s]).join(', ')
        : 'Nur Transport',
    },
    {
      step: 4,
      icon: Calendar,
      label: 'Termin',
      content: formatDate(data.moveDate),
    },
    {
      step: 4,
      icon: User,
      label: 'Kontakt',
      content: `${data.name || '-'}, ${data.email || '-'}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Ihre Anfrage im Überblick
        </h1>
        <p className="text-muted-foreground">
          Bitte prüfen Sie Ihre Angaben vor dem Absenden
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-3">
        {sections.map((section, i) => (
          <div 
            key={i}
            className="bg-card rounded-lg border p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <section.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">{section.label}</div>
              <div className="text-sm font-medium text-foreground truncate">
                {section.content}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditSection(section.step)}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Trust Pills */}
      <UltimateTrustPills context="summary" />

      {/* Privacy Checkbox */}
      <div className="bg-card rounded-xl border p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={data.acceptPrivacy}
            onCheckedChange={(checked) => updateData({ acceptPrivacy: checked as boolean })}
            className="mt-0.5"
          />
          <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
            Ich akzeptiere die{' '}
            <a href="/datenschutz" target="_blank" className="text-primary hover:underline">
              Datenschutzerklärung
            </a>{' '}
            und stimme zu, dass meine Daten an max. 5 passende Umzugsfirmen weitergeleitet werden.
          </Label>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Shield className="h-4 w-4 text-green-600" />
          <span>SSL-verschlüsselt • Schweizer Datenschutz • Jederzeit widerrufbar</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-4">
        <p className="text-sm text-green-800 dark:text-green-200 text-center font-medium mb-2">
          Das erwartet Sie nach dem Absenden:
        </p>
        <ul className="space-y-1.5">
          {[
            "Bis zu 5 Offerten von geprüften Schweizer Firmen",
            "Antwort meist innerhalb von 24 Stunden",
            "Kostenlos vergleichen und bis zu 40% sparen",
          ].map((text, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <Check className="h-4 w-4 flex-shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Step 3: Zusatzleistungen
 * 
 * - Ein/Auspackservice
 * - Möbel Demontage/Montage
 * - Reinigung mit Abnahmegarantie
 * - Lagerung
 */

import { Package, Wrench, Sparkles, Warehouse, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UltimateFlowData } from "../UltimateSwissFlow";

interface StepServicesProps {
  data: UltimateFlowData;
  updateData: (updates: Partial<UltimateFlowData>) => void;
}

const SERVICES = [
  {
    id: "packing",
    icon: Package,
    label: "Ein- & Auspackservice",
    description: "Professionelles Verpacken aller Gegenstände",
    popular: true,
  },
  {
    id: "furniture",
    icon: Wrench,
    label: "Möbel De-/Montage",
    description: "Abbau und Aufbau Ihrer Möbel",
    popular: true,
  },
  {
    id: "cleaning",
    icon: Sparkles,
    label: "Reinigung mit Garantie",
    description: "Endreinigung mit Abnahmegarantie",
    popular: false,
  },
  {
    id: "storage",
    icon: Warehouse,
    label: "Zwischenlagerung",
    description: "Sichere Lagerung Ihrer Möbel",
    popular: false,
  },
];

export function StepServices({ data, updateData }: StepServicesProps) {
  const toggleService = (serviceId: string) => {
    const currentServices = data.services || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(s => s !== serviceId)
      : [...currentServices, serviceId];
    updateData({ services: newServices });
  };

  const selectAllServices = () => {
    updateData({ services: SERVICES.map(s => s.id) });
  };

  const clearServices = () => {
    updateData({ services: [] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Welche Zusatzleistungen?
        </h1>
        <p className="text-muted-foreground">
          Optional – Sie können auch nur den Transport anfragen
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={selectAllServices}
          className="text-xs text-primary hover:underline"
        >
          Rundum-Sorglos-Paket
        </button>
        <span className="text-muted-foreground">|</span>
        <button
          type="button"
          onClick={clearServices}
          className="text-xs text-muted-foreground hover:underline"
        >
          Nur Transport
        </button>
      </div>

      {/* Services Grid */}
      <div className="space-y-3">
        {SERVICES.map((service) => {
          const isSelected = data.services?.includes(service.id);
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => toggleService(service.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                "touch-manipulation",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {/* Checkbox */}
              <div 
                className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0",
                  isSelected
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
              </div>

              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                isSelected ? "bg-primary/10" : "bg-muted"
              )}>
                <service.icon className={cn(
                  "h-5 w-5",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {service.label}
                  </span>
                  {service.popular && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      Beliebt
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {service.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          {data.services?.length === 0 ? (
            "Nur Transport angefragt"
          ) : (
            <>
              <strong>{data.services?.length}</strong> Zusatzleistung(en) ausgewählt
            </>
          )}
        </p>
      </div>
    </div>
  );
}

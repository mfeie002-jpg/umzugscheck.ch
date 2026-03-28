/**
 * IndustryAssociationBar - Verbands-Logos
 * V2 Branchen-Fokus: Branchenverband-Legitimität
 */

import { memo } from "react";
import { Award, Truck, Shield, Building2, CheckCircle2 } from "lucide-react";

const ASSOCIATIONS = [
  {
    id: "sma",
    name: "Swiss Movers Association",
    shortName: "SMA",
    description: "Qualitätsstandard seit 1987",
    icon: Award,
    color: "bg-blue-600",
  },
  {
    id: "astag",
    name: "ASTAG",
    shortName: "ASTAG",
    description: "Nutzfahrzeugverband",
    icon: Truck,
    color: "bg-orange-500",
  },
  {
    id: "spedlog",
    name: "SPEDLOGSWISS",
    shortName: "SPEDLOG",
    description: "Spedition & Logistik",
    icon: Building2,
    color: "bg-teal-600",
  },
  {
    id: "fidi",
    name: "FIDI",
    shortName: "FIDI",
    description: "Int. Möbeltransport",
    icon: Shield,
    color: "bg-indigo-600",
  },
];

export const IndustryAssociationBar = memo(() => {
  return (
    <section className="bg-primary/5 py-10 border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Mitglied führender Branchenverbände
          </h3>
          <p className="text-sm text-muted-foreground">
            Unsere Partner erfüllen die höchsten Branchenstandards
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {ASSOCIATIONS.map((assoc) => (
            <div
              key={assoc.id}
              className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors text-center group"
            >
              <div className={`w-12 h-12 ${assoc.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <assoc.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                {assoc.shortName}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {assoc.description}
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-success">
                <CheckCircle2 className="w-3 h-3" />
                Verifiziert
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

IndustryAssociationBar.displayName = "IndustryAssociationBar";

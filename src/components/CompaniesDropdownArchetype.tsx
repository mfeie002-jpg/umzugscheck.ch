/**
 * ARCHETYPE: Companies Dropdown (Umzugsfirmen)
 * 
 * Structure:
 * - Column 1: Mini Offer Form (Schnell starten)
 * - Column 2: Rankings & Vergleiche
 * - Column 3: Beliebte Regionen (with prefill chips)
 * - Column 4: CTA Card
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, TrendingDown, Building2, Calculator, ArrowRight, Sparkles } from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownSection } from "./navigation/DropdownSection";
import { DropdownLink } from "./navigation/DropdownLink";
import { MiniOfferForm } from "./navigation/MiniOfferForm";
import { DropdownCTACard } from "./navigation/DropdownCTACard";
import { RegionChips, popularRegions, popularCantons } from "./navigation/RegionChips";

interface CompaniesDropdownArchetypeProps {
  isOpen: boolean;
  onClose: () => void;
}

const rankingLinks = [
  {
    title: "Beste Umzugsfirmen 2025",
    description: "Top-bewertete Firmen nach Kundenfeedback",
    icon: Trophy,
    href: "/beste-umzugsfirma",
    featured: true,
  },
  {
    title: "Günstige Umzugsfirmen",
    description: "Bestes Preis-Leistungs-Verhältnis",
    icon: TrendingDown,
    href: "/guenstige-umzugsfirma",
  },
  {
    title: "Alle Umzugsfirmen Schweiz",
    description: "Geprüfte Anbieter im Überblick",
    icon: Building2,
    href: "/umzugsfirmen-schweiz",
  },
  {
    title: "Umzugskosten berechnen",
    description: "Preise & Kosten Rechner",
    icon: Calculator,
    href: "/umzugsrechner",
  },
];

export const CompaniesDropdownArchetype = ({ isOpen, onClose }: CompaniesDropdownArchetypeProps) => {
  const [selectedRegion, setSelectedRegion] = useState<{
    name: string;
    slug: string;
    type: 'canton' | 'city';
    href: string;
  } | null>(null);

  const handleRegionSelect = (region: { name: string; slug: string; type: 'canton' | 'city'; href: string }) => {
    setSelectedRegion(region);
  };

  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[280px_1fr_1fr_260px] gap-6 lg:gap-8">
          
          {/* Column 1: Schnell starten (Mini Form) */}
          <div className="lg:border-r lg:border-border lg:pr-6">
            <DropdownSection title="Schnell starten">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">In 2 Minuten zu Offerten</p>
                    <p className="text-xs text-muted-foreground">100% kostenlos & unverbindlich</p>
                  </div>
                </div>
                
                <MiniOfferForm 
                  onClose={onClose} 
                  selectedRegion={selectedRegion}
                />
              </div>
            </DropdownSection>
          </div>

          {/* Column 2: Rankings & Vergleiche */}
          <div>
            <DropdownSection title="Rankings & Vergleiche">
              <div className="grid gap-1">
                {rankingLinks.map((item) => (
                  <DropdownLink
                    key={item.href}
                    to={item.href}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    onClick={onClose}
                    featured={item.featured}
                  />
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* Column 3: Beliebte Regionen */}
          <div>
            <DropdownSection title="Beliebte Regionen">
              <div className="space-y-4">
                {/* Cities */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Städte</p>
                  <RegionChips
                    regions={popularRegions.slice(0, 6)}
                    selectedRegion={selectedRegion}
                    onRegionSelect={handleRegionSelect}
                    onClose={onClose}
                  />
                </div>
                
                {/* Cantons */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Kantone</p>
                  <RegionChips
                    regions={popularCantons.slice(0, 4)}
                    selectedRegion={selectedRegion}
                    onRegionSelect={handleRegionSelect}
                    onClose={onClose}
                  />
                </div>

                {/* All regions link */}
                <Link
                  to="/regionen"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-2"
                >
                  Alle Regionen anzeigen
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </DropdownSection>
          </div>

          {/* Column 4: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Jetzt Offerten erhalten"
              bullets={[
                "3–5 Offerten in 24–48h",
                "Geprüfte Partner Schweiz",
                "Bis zu 40% sparen"
              ]}
              buttonText="Jetzt starten"
              buttonHref="/umzugsofferten"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

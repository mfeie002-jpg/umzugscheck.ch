/**
 * Kosten & Planung Dropdown
 * "Der Einstieg / Awareness" - Angst nehmen, Nutzer binden
 */

import { Calculator, Box, FileCheck, CalendarDays, ArrowRight, Sparkles, Clock } from "lucide-react";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { DropdownCTACard } from "@/components/navigation/DropdownCTACard";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KostenPlanungDropdown = ({ isOpen, onClose }: DropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Tools / Rechner */}
          <div className="col-span-12 md:col-span-4">
            <DropdownSection title="Kostenrechner" subtitle="Schnell & genau kalkulieren">
              <div className="space-y-1">
                <DropdownLink
                  to="/umzugskostenrechner"
                  icon={Calculator}
                  title="Umzugskostenrechner"
                  description="Was kostet mein Umzug in 2 Minuten?"
                  onClick={onClose}
                  featured
                  badge="Beliebt"
                />
                <DropdownLink
                  to="/volumenrechner"
                  icon={Box}
                  title="Volumen-Rechner (m³)"
                  description="Wie viel Platz brauche ich im LKW?"
                  onClick={onClose}
                />
              </div>
            </DropdownSection>
          </div>

          {/* Middle Column: Organisation */}
          <div className="col-span-12 md:col-span-4">
            <DropdownSection title="Organisation" subtitle="Planung leicht gemacht">
              <div className="space-y-1">
                <DropdownLink
                  to="/umzugscheckliste"
                  icon={FileCheck}
                  title="Umzugs-Checkliste (PDF)"
                  description="Der komplette Leitfaden zum Abhaken."
                  onClick={onClose}
                />
                <DropdownLink
                  to="/ratgeber/umzug-planen"
                  icon={CalendarDays}
                  title="Zeitplan & Ablauf"
                  description="Wann kündigen? Wann packen?"
                  onClick={onClose}
                />
              </div>
            </DropdownSection>
            
            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-primary">2 Min</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Rechner-Durchlauf</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-600">40%</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Ersparnis möglich</p>
              </div>
            </div>
          </div>

          {/* Right Column: CTA Card */}
          <div className="col-span-12 md:col-span-4">
            <DropdownCTACard
              title="Budget geklärt?"
              description="Vergleichen Sie jetzt Preise von lokalen Umzugsfirmen und sparen Sie bis zu 40%."
              bullets={[
                "Gratis & unverbindlich",
                "Antworten in 24 Stunden",
                "Nur geprüfte Firmen"
              ]}
              buttonText="Jetzt Preise vergleichen"
              buttonHref="/umzugsofferten"
              icon={ArrowRight}
              onClose={onClose}
            />
          </div>

        </div>
      </div>
    </DropdownWrapper>
  );
};

/**
 * Dropdown: Kosten berechnen (Ultimate Variant)
 * 
 * ULTIMATE DESIGN - Action-First mit klarer User Journey
 * - Primär: Preisrechner / Kostenübersicht
 * - Sekundär: Checkliste, Zeitplan, Tipps
 * - CTA: Offerten erhalten
 */

import { Link } from "react-router-dom";
import { 
  Calculator, 
  CheckSquare, 
  Clock, 
  Lightbulb,
  FileDown,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownCTACard } from "@/components/navigation/DropdownCTACard";
import { Button } from "@/components/ui/button";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";

interface UmzugPlanenDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainItems = [
  {
    icon: Calculator,
    title: "Umzugskosten berechnen",
    description: "KI-Preisrechner – in 60 Sek. deine Kosten",
    href: "/vergleich",
    featured: true,
    badge: "Beliebt",
  },
  {
    icon: CheckSquare,
    title: "Umzugscheckliste",
    description: "Der komplette Leitfaden für deinen Umzug",
    href: "/ratgeber/umzugscheckliste-download",
    featured: true,
  },
  {
    icon: Clock,
    title: "Zeitplan & Ablauf",
    description: "Was wann zu tun ist – 60, 30, 7 Tage vorher",
    href: "/ratgeber/zeitplan",
  },
  {
    icon: Lightbulb,
    title: "Spartipps & Tricks",
    description: "So sparst du bis zu 40% bei deinem Umzug",
    href: "/ratgeber/kosten",
  },
];

const quickTools = [
  { title: "Checkliste PDF", href: "/ratgeber/umzugscheckliste-download", icon: FileDown },
  { title: "Kündigungsvorlage", href: "/ratgeber/kuendigung", icon: FileDown },
  { title: "Übergabeprotokoll", href: "/ratgeber/wohnungsabgabe", icon: FileDown },
];

export const UmzugPlanenDropdown = ({ isOpen, onClose }: UmzugPlanenDropdownProps) => {
  const navVariant = useNavigationVariant();
  
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_200px_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Hauptnavigation */}
          <div>
            <DropdownSection 
              title={navVariant.dropdownTitles.preisrechner} 
              subtitle={navVariant.microcopy.preisrechner}
            >
              <div className="space-y-1">
                {mainItems.map((item) => (
                  <DropdownLink
                    key={item.href}
                    to={item.href}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    onClick={onClose}
                    featured={item.featured}
                    badge={item.badge}
                  />
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* Column 2: Downloads & Schnellstart */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Downloads">
              <div className="space-y-1">
                {quickTools.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all group"
                  >
                    <tool.icon className="w-4 h-4 text-primary" />
                    {tool.title}
                  </Link>
                ))}
              </div>

              {/* Quick Start Button */}
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Schnellstart</span>
                </div>
                <Button 
                  asChild 
                  size="sm" 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Link to="/umzugsofferten" onClick={onClose}>
                    Jetzt Offerten
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title={navVariant.ctaCard.preisrechner.title}
              description="Starte mit dem Preisrechner und erhalte unverbindliche Angebote von geprüften Firmen."
              icon={Sparkles}
              bullets={[
                "Preisvorschau in 2 Min",
                "3–5 Angebote in 24–48h",
                "100% kostenlos & unverbindlich"
              ]}
              buttonText={navVariant.ctaCard.preisrechner.buttonText}
              buttonHref="/vergleich"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

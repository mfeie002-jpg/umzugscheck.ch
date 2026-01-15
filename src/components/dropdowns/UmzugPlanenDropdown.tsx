/**
 * Dropdown: Umzug planen
 * 
 * Hilft Privatkunden bei der Vorbereitung des Umzugs
 * - Umzugskosten berechnen (interaktiver KI-Preisrechner)
 * - Umzugscheckliste (Download + interaktive Liste)
 * - Zeitplan & Ablauf (Timeline)
 * - Umzugstipps (Einstieg in Ratgeber)
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
  Star
} from "lucide-react";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownCTACard } from "@/components/navigation/DropdownCTACard";
import { Button } from "@/components/ui/button";

interface UmzugPlanenDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainItems = [
  {
    icon: Calculator,
    title: "Umzugskosten berechnen",
    description: "KI-Preisrechner: Was kostet mein Umzug?",
    href: "/umzugsrechner",
    featured: true,
    badge: "Beliebt",
  },
  {
    icon: CheckSquare,
    title: "Umzugscheckliste",
    description: "Kompletter Leitfaden für deinen Umzug",
    href: "/ratgeber/checkliste",
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
    title: "Umzugstipps",
    description: "Packtipps, Entrümpeln, Umzug mit Kindern",
    href: "/ratgeber/tipps",
  },
];

const quickTools = [
  { title: "Checkliste PDF", href: "/ratgeber/checkliste#download", icon: FileDown },
  { title: "Kündigungsvorlage", href: "/ratgeber/kuendigung#vorlage", icon: FileDown },
  { title: "Adressänderung", href: "/ratgeber/adressaenderung", icon: ArrowRight },
];

export const UmzugPlanenDropdown = ({ isOpen, onClose }: UmzugPlanenDropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_220px_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Hauptnavigation */}
          <div>
            <DropdownSection title="Umzug planen">
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

          {/* Column 2: Quick Tools */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Downloads & Tools">
              <div className="space-y-2">
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
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Schnellstart</span>
                </div>
                <Button 
                  asChild 
                  size="sm" 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Link to="/umzugsofferten" onClick={onClose}>
                    Jetzt Offerten anfragen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Kostenlose Offerten"
              description="Starte mit dem Preisrechner und erhalte unverbindliche Angebote."
              icon={Star}
              bullets={[
                "Preisvorschau in 2 Min",
                "3–5 Angebote in 24–48h",
                "100% kostenlos"
              ]}
              buttonText="Preisrechner starten"
              buttonHref="/umzugsrechner"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

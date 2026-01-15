/**
 * ARCHETYPE: Provider Dropdown (Für Firmen)
 * 
 * Structure:
 * - Column 1: Für Umzugsfirmen (Partner)
 * - Column 2: Für Unternehmen (Firmenumzug)
 * - Column 3: CTA Card
 */

import { Link } from "react-router-dom";
import { 
  Briefcase, 
  LogIn, 
  DollarSign, 
  HelpCircle, 
  Building2,
  Users,
  Phone,
  Rocket,
  ArrowRight,
  Award
} from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownSection } from "./navigation/DropdownSection";
import { DropdownLink } from "./navigation/DropdownLink";
import { DropdownCTACard } from "./navigation/DropdownCTACard";

interface ProviderDropdownArchetypeProps {
  isOpen: boolean;
  onClose: () => void;
}

const partnerLinks = [
  { 
    icon: Briefcase, 
    title: "Anbieter werden", 
    description: "Registrieren Sie sich kostenlos", 
    href: "/anbieter", 
    featured: true 
  },
  { 
    icon: DollarSign, 
    title: "Preise & Konditionen", 
    description: "Transparente Preisübersicht", 
    href: "/anbieter/preise" 
  },
  { 
    icon: LogIn, 
    title: "Anbieter Login", 
    description: "Zugang zum Dashboard", 
    href: "/anbieter/login" 
  },
  { 
    icon: HelpCircle, 
    title: "Häufige Fragen", 
    description: "Antworten für Partner", 
    href: "/anbieter/faq" 
  },
];

const businessLinks = [
  { 
    icon: Building2, 
    title: "Firmenumzug anfragen", 
    description: "Büro- & Geschäftsumzüge", 
    href: "/dienstleistungen/firmenumzug", 
    featured: true 
  },
  { 
    icon: Users, 
    title: "Relocation Service", 
    description: "Mitarbeiter-Umzüge", 
    href: "/dienstleistungen/relocation" 
  },
  { 
    icon: Phone, 
    title: "Beratung anfordern", 
    description: "Persönliche Beratung", 
    href: "/kontakt?topic=firmenumzug" 
  },
];

export const ProviderDropdownArchetype = ({ isOpen, onClose }: ProviderDropdownArchetypeProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_1fr_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Für Umzugsfirmen (Partner) */}
          <div>
            <DropdownSection title="Für Umzugsfirmen (Partner)">
              <div className="space-y-1">
                {partnerLinks.map((link) => (
                  <DropdownLink
                    key={link.href}
                    to={link.href}
                    icon={link.icon}
                    title={link.title}
                    description={link.description}
                    onClick={onClose}
                    featured={link.featured}
                  />
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* Column 2: Für Unternehmen (Firmenumzug) */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Für Unternehmen (Firmenumzug)">
              <div className="space-y-1">
                {businessLinks.map((link) => (
                  <DropdownLink
                    key={link.href}
                    to={link.href}
                    icon={link.icon}
                    title={link.title}
                    description={link.description}
                    onClick={onClose}
                    featured={link.featured}
                  />
                ))}
              </div>

              {/* Quick stats */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">500+</p>
                    <p className="text-xs text-muted-foreground">Partner Schweizweit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">4.8★</p>
                    <p className="text-xs text-muted-foreground">Durchschn. Bewertung</p>
                  </div>
                </div>
              </div>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Jetzt Partner werden"
              description="Erreichen Sie täglich hunderte potenzielle Kunden und wachsen Sie mit uns."
              icon={Award}
              bullets={[
                "Keine Grundgebühr",
                "Qualifizierte Leads",
                "Schnelle Auszahlung"
              ]}
              buttonText="Kostenlos registrieren"
              buttonHref="/anbieter"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

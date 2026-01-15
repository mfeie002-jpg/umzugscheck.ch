/**
 * ARCHETYPE: Services Dropdown
 * 
 * Structure:
 * - Column 1: Top Services (Privatumzug, Firmenumzug, Pakete)
 * - Column 2: Zusatzleistungen (Endreinigung, Möbelmontage, etc.)
 * - Column 3: Services nach Ort (Hub links)
 * - Column 4: CTA Card
 */

import { Link } from "react-router-dom";
import { 
  Home, 
  Building2, 
  Sparkles, 
  Package, 
  Wrench, 
  Trash2, 
  Box, 
  Truck,
  MapPin,
  ArrowRight,
  Star
} from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownSection } from "./navigation/DropdownSection";
import { DropdownLink } from "./navigation/DropdownLink";
import { DropdownCTACard } from "./navigation/DropdownCTACard";

interface ServicesDropdownArchetypeProps {
  isOpen: boolean;
  onClose: () => void;
}

const topServices = [
  { 
    icon: Home, 
    title: "Privatumzug", 
    description: "Kompletter Umzugsservice für Privatkunden", 
    href: "/dienstleistungen/privatumzug", 
    featured: true 
  },
  { 
    icon: Building2, 
    title: "Firmenumzug", 
    description: "Professionelle Büro- und Firmenumzüge", 
    href: "/dienstleistungen/firmenumzug", 
    featured: true 
  },
  { 
    icon: Package, 
    title: "Umzug + Endreinigung", 
    description: "Das beliebteste Komplettpaket", 
    href: "/dienstleistungen/umzug-reinigung",
    featured: true
  },
];

const additionalServices = [
  { 
    icon: Sparkles, 
    title: "Endreinigung", 
    description: "Mit Abnahmegarantie", 
    href: "/dienstleistungen/endreinigung" 
  },
  { 
    icon: Wrench, 
    title: "Möbelmontage", 
    description: "Auf- & Abbau Service", 
    href: "/dienstleistungen/moebelmontage" 
  },
  { 
    icon: Truck, 
    title: "Möbellift", 
    description: "Transport über Balkon", 
    href: "/dienstleistungen/moebellift" 
  },
  { 
    icon: Box, 
    title: "Einlagerung", 
    description: "Sichere Möbellagerung", 
    href: "/dienstleistungen/einlagerung" 
  },
  { 
    icon: Trash2, 
    title: "Entsorgung & Räumung", 
    description: "Haushaltsauflösung", 
    href: "/dienstleistungen/entsorgung" 
  },
];

const locationHubs = [
  { label: "Services nach Kanton", href: "/dienstleistungen/kantone", icon: MapPin },
  { label: "Services nach Stadt", href: "/dienstleistungen/staedte", icon: MapPin },
  { label: "Alle Services", href: "/dienstleistungen", icon: ArrowRight },
];

export const ServicesDropdownArchetype = ({ isOpen, onClose }: ServicesDropdownArchetypeProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_1fr_200px_260px] gap-6 lg:gap-8">
          
          {/* Column 1: Top Services */}
          <div>
            <DropdownSection title="Top Services">
              <div className="space-y-1">
                {topServices.map((service) => (
                  <DropdownLink
                    key={service.href}
                    to={service.href}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    onClick={onClose}
                    featured={service.featured}
                  />
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* Column 2: Zusatzleistungen */}
          <div>
            <DropdownSection title="Zusatzleistungen">
              <div className="grid gap-1">
                {additionalServices.map((service) => (
                  <DropdownLink
                    key={service.href}
                    to={service.href}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    onClick={onClose}
                  />
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* Column 3: Services nach Ort */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Nach Ort">
              <div className="space-y-2">
                {locationHubs.map((hub) => (
                  <Link
                    key={hub.href}
                    to={hub.href}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  >
                    <hub.icon className="w-4 h-4 text-primary" />
                    {hub.label}
                  </Link>
                ))}
              </div>

              {/* Popular service+region combos */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Beliebt</p>
                <div className="space-y-1">
                  <Link
                    to="/dienstleistungen/endreinigung/zuerich"
                    onClick={onClose}
                    className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Endreinigung Zürich
                  </Link>
                  <Link
                    to="/dienstleistungen/privatumzug/bern"
                    onClick={onClose}
                    className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privatumzug Bern
                  </Link>
                  <Link
                    to="/dienstleistungen/firmenumzug/kanton-zug"
                    onClick={onClose}
                    className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Firmenumzug Kanton Zug
                  </Link>
                </div>
              </div>
            </DropdownSection>
          </div>

          {/* Column 4: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Service-Offerten in Minuten"
              description="Wähle Service + Ort – wir finden geprüfte Anbieter."
              icon={Star}
              buttonText="Service wählen"
              buttonHref="/umzugsofferten"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

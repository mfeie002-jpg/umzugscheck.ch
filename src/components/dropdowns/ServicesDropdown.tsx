/**
 * Dropdown: Services
 * 
 * Alle Umzugsdienstleistungen die Umzugscheck.ch abdeckt
 * - Umzugsarten: Privatumzug, Geschäftsumzug, Internationaler Umzug
 * - Zusatzservices: Endreinigung, Möbelmontage, Lagerung, Entsorgung, etc.
 */

import { Link } from "react-router-dom";
import { 
  Home, 
  Building2, 
  Globe,
  Sparkles, 
  Wrench, 
  Package, 
  Trash2, 
  Box,
  Truck,
  ParkingCircle,
  ArrowRight,
  Star
} from "lucide-react";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownCTACard } from "@/components/navigation/DropdownCTACard";

interface ServicesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const umzugsarten = [
  { 
    icon: Home, 
    title: "Privatumzug", 
    description: "Kompletter Service für private Wohnungsumzüge", 
    href: "/dienstleistungen/privatumzug", 
    featured: true 
  },
  { 
    icon: Building2, 
    title: "Geschäftsumzug", 
    description: "Büro- und Firmenumzüge professionell", 
    href: "/dienstleistungen/firmenumzug", 
    featured: true 
  },
  { 
    icon: Globe, 
    title: "Internationaler Umzug", 
    description: "Umzüge ins Ausland (Schweiz ⇄ EU)", 
    href: "/dienstleistungen/international" 
  },
];

const zusatzservices = [
  { 
    icon: Sparkles, 
    title: "Endreinigung", 
    description: "Mit Abnahmegarantie", 
    href: "/dienstleistungen/reinigung" 
  },
  { 
    icon: Wrench, 
    title: "Möbelmontage", 
    description: "Auf- und Abbau Service", 
    href: "/moebelmontage" 
  },
  { 
    icon: Package, 
    title: "Lagerung", 
    description: "Einlagern & Lagerboxen", 
    href: "/dienstleistungen/einlagerung" 
  },
  { 
    icon: Trash2, 
    title: "Entsorgung & Räumung", 
    description: "Entrümpelung von Hausrat", 
    href: "/dienstleistungen/entsorgung" 
  },
  { 
    icon: Box, 
    title: "Umzugskartons", 
    description: "Boxen & Verpackung", 
    href: "/services/packservice" 
  },
  { 
    icon: ParkingCircle, 
    title: "Halteverbotszone", 
    description: "Parkplatz reservieren", 
    href: "/ratgeber/halteverbot" 
  },
  { 
    icon: Truck, 
    title: "Möbellift mieten", 
    description: "Aussenaufzug für schwere Güter", 
    href: "/dienstleistungen/moebellift" 
  },
];

export const ServicesDropdown = ({ isOpen, onClose }: ServicesDropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_1fr_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Umzugsarten */}
          <div>
            <DropdownSection title="Umzugsarten">
              <div className="space-y-1">
                {umzugsarten.map((service) => (
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

          {/* Column 2: Zusatzservices */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Zusatzservices">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {zusatzservices.map((service) => (
                  <DropdownLink
                    key={service.href}
                    to={service.href}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    onClick={onClose}
                    compact
                  />
                ))}
              </div>

              <Link
                to="/dienstleistungen"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Alle Services anzeigen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Service-Offerten erhalten"
              description="Wähle Service + Ort – wir finden geprüfte Anbieter."
              icon={Star}
              bullets={[
                "Alle Services aus einer Hand",
                "Geprüfte Partner",
                "Festpreis-Garantie"
              ]}
              buttonText="Jetzt anfragen"
              buttonHref="/umzugsofferten"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

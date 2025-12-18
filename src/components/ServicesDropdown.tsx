import { Truck, Sparkles, Trash2, Box, Wrench, Home, Building2, Package } from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownLink } from "./navigation/DropdownLink";
import { DropdownSection } from "./navigation/DropdownSection";

interface ServicesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainServices = [
  { icon: Home, title: "Privatumzug", description: "Kompletter Umzugsservice für Privatkunden", href: "/privatumzug", featured: true },
  { icon: Building2, title: "Firmenumzug", description: "Professionelle Büro- und Firmenumzüge", href: "/firmenumzug", featured: true },
  { icon: Sparkles, title: "Umzug mit Reinigung", description: "Umzug & Endreinigung aus einer Hand", href: "/umzug-mit-reinigung" },
];

const additionalServices = [
  { icon: Sparkles, title: "Reinigung", description: "Professionelle Endreinigung", href: "/reinigung" },
  { icon: Trash2, title: "Entsorgung & Räumung", description: "Haushaltsauflösung & Entrümpelung", href: "/entsorgung-raeumung" },
  { icon: Wrench, title: "Möbellift", description: "Transport über Balkon & Fenster", href: "/moebellift" },
  { icon: Box, title: "Einlagerung", description: "Sichere Lagerung Ihrer Möbel", href: "/einlagerung" },
];

export const ServicesDropdown = ({ isOpen, onClose }: ServicesDropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Services */}
          <DropdownSection title="Umzugsservices">
            <div className="space-y-2">
              {mainServices.map((service) => (
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

          {/* Additional Services */}
          <DropdownSection title="Zusatzleistungen">
            <div className="grid sm:grid-cols-2 gap-2">
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
      </div>
    </DropdownWrapper>
  );
};

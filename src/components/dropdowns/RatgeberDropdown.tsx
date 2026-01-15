/**
 * Dropdown: Ratgeber
 * 
 * Wissensbereich mit Tipps, Checklisten und hilfreichen Artikeln
 * - Umzug Checkliste (PDF)
 * - Wohnungsübergabe & Reinigung
 * - Kündigung & Ummeldung
 * - Spartipps & Preisvergleich
 * - Weitere Umzugstipps
 */

import { Link } from "react-router-dom";
import { 
  CheckSquare,
  Home,
  FileText,
  DollarSign,
  Lightbulb,
  FileDown,
  Calendar,
  MapPin,
  Baby,
  ArrowRight,
  Rocket
} from "lucide-react";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownCTACard } from "@/components/navigation/DropdownCTACard";

interface RatgeberDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainGuides = [
  {
    icon: CheckSquare,
    title: "Umzug Checkliste (PDF)",
    description: "Kompletter Leitfaden mit Download",
    href: "/ratgeber/checkliste",
    featured: true,
    badge: "Top",
  },
  {
    icon: Home,
    title: "Wohnungsübergabe & Reinigung",
    description: "Übergabeprotokoll & Tipps",
    href: "/ratgeber/wohnungsabgabe",
    featured: true,
  },
  {
    icon: FileText,
    title: "Kündigung & Ummeldung",
    description: "Vorlagen & Adressänderungen",
    href: "/ratgeber/kuendigung",
  },
  {
    icon: DollarSign,
    title: "Spartipps & Preisvergleich",
    description: "Umzugskosten sparen",
    href: "/ratgeber/kosten-sparen",
  },
];

const additionalTopics = [
  { icon: Calendar, title: "Zeitplan erstellen", href: "/ratgeber/zeitplan" },
  { icon: MapPin, title: "Halteverbot beantragen", href: "/ratgeber/halteverbot" },
  { icon: Baby, title: "Umzug mit Kindern", href: "/ratgeber/umzug-mit-kindern" },
  { icon: Lightbulb, title: "Packtipps", href: "/ratgeber/packtipps" },
];

const downloads = [
  { title: "Checkliste PDF", href: "/ratgeber/checkliste#download", icon: FileDown },
  { title: "Kündigungsvorlage", href: "/ratgeber/kuendigung#vorlage", icon: FileDown },
  { title: "Übergabeprotokoll", href: "/ratgeber/wohnungsabgabe#protokoll", icon: FileDown },
];

export const RatgeberDropdown = ({ isOpen, onClose }: RatgeberDropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_1fr_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Hauptratgeber */}
          <div>
            <DropdownSection title="Top Ratgeber">
              <div className="space-y-1">
                {mainGuides.map((guide) => (
                  <DropdownLink
                    key={guide.href}
                    to={guide.href}
                    icon={guide.icon}
                    title={guide.title}
                    description={guide.description}
                    onClick={onClose}
                    featured={guide.featured}
                    badge={guide.badge}
                  />
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* Column 2: Weitere Themen + Downloads */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Weitere Themen">
              <div className="grid grid-cols-2 gap-1">
                {additionalTopics.map((topic) => (
                  <Link
                    key={topic.href}
                    to={topic.href}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <topic.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {topic.title}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Downloads Section */}
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Downloads & Vorlagen</p>
                <div className="space-y-1">
                  {downloads.map((download) => (
                    <Link
                      key={download.href}
                      to={download.href}
                      onClick={onClose}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <download.icon className="w-4 h-4 text-primary" />
                      {download.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/ratgeber"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Alle Ratgeber anzeigen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Umzug jetzt planen"
              description="Starte jetzt – wir zeigen dir Kosten & passende Anbieter."
              icon={Rocket}
              bullets={[
                "Kostenloser Preisrechner",
                "Unverbindliche Offerten",
                "Geprüfte Anbieter"
              ]}
              buttonText="Jetzt Offerten erhalten"
              buttonHref="/umzugsofferten"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

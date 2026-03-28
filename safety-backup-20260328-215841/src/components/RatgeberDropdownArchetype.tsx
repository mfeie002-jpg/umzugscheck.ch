/**
 * ARCHETYPE: Ratgeber Dropdown
 * 
 * Structure:
 * - Column 1: Top Guides (Kosten, Checkliste, Wohnungsabgabe)
 * - Column 2: Beliebte Themen
 * - Column 3: Tools + CTA Card
 */

import { Link } from "react-router-dom";
import { 
  DollarSign, 
  CheckSquare, 
  Lightbulb, 
  BookOpen, 
  Home,
  Calendar,
  FileText,
  MapPin,
  Baby,
  Clock,
  ArrowRight,
  Rocket
} from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownSection } from "./navigation/DropdownSection";
import { DropdownLink } from "./navigation/DropdownLink";
import { DropdownCTACard } from "./navigation/DropdownCTACard";

interface RatgeberDropdownArchetypeProps {
  isOpen: boolean;
  onClose: () => void;
}

const topGuides = [
  {
    icon: DollarSign,
    title: "Kosten & Preise",
    description: "Was kostet ein Umzug in der Schweiz?",
    href: "/ratgeber/kosten-preise",
    featured: true,
  },
  {
    icon: CheckSquare,
    title: "Umzugscheckliste",
    description: "Schritt für Schritt zum perfekten Umzug",
    href: "/ratgeber/checkliste",
    featured: true,
  },
  {
    icon: Home,
    title: "Wohnungsabgabe",
    description: "Übergabeprotokoll & Tipps",
    href: "/ratgeber/wohnungsabgabe",
  },
  {
    icon: Lightbulb,
    title: "Umzugstipps",
    description: "Praktische Tipps von Experten",
    href: "/ratgeber/tipps",
  },
];

const popularTopics = [
  { icon: MapPin, title: "Halteverbot & Parkieren", href: "/ratgeber/halteverbot" },
  { icon: FileText, title: "Adressänderung", href: "/ratgeber/adressaenderung" },
  { icon: Baby, title: "Umzug mit Kindern", href: "/ratgeber/umzug-mit-kindern" },
  { icon: Clock, title: "Kündigungsfristen", href: "/ratgeber/kuendigung" },
  { icon: Calendar, title: "Umzug planen", href: "/ratgeber/planung" },
];

const tools = [
  { title: "Umzugskosten-Rechner", href: "/umzugsrechner", primary: true },
  { title: "Packliste", href: "/ratgeber/packliste" },
  { title: "Zeitplan", href: "/ratgeber/zeitplan" },
];

export const RatgeberDropdownArchetype = ({ isOpen, onClose }: RatgeberDropdownArchetypeProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_1fr_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Top Guides */}
          <div>
            <DropdownSection title="Top Ratgeber">
              <div className="space-y-1">
                {topGuides.map((guide) => (
                  <DropdownLink
                    key={guide.href}
                    to={guide.href}
                    icon={guide.icon}
                    title={guide.title}
                    description={guide.description}
                    onClick={onClose}
                    featured={guide.featured}
                  />
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* Column 2: Beliebte Themen */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Beliebte Themen">
              <div className="space-y-1">
                {popularTopics.map((topic) => (
                  <Link
                    key={topic.href}
                    to={topic.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <topic.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {topic.title}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Tools Section */}
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Tools</p>
                <div className="space-y-1">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      onClick={onClose}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        tool.primary 
                          ? "bg-primary/10 text-primary font-semibold hover:bg-primary/20" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/ratgeber"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Alle Ratgeber
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Umzug planen in 2 Minuten"
              description="Starte jetzt – wir zeigen dir Kosten & passende Anbieter."
              icon={Rocket}
              buttonText="Gratis Offerten starten"
              buttonHref="/umzugsofferten"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

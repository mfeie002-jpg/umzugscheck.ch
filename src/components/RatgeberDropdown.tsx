import { FileText, DollarSign, CheckSquare, Lightbulb, BookOpen } from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownLink } from "./navigation/DropdownLink";
import { DropdownSection } from "./navigation/DropdownSection";

interface RatgeberDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ratgeberItems = [
  {
    icon: DollarSign,
    title: "Kosten & Preise",
    description: "Was kostet ein Umzug in der Schweiz?",
    href: "/ratgeber/kosten",
    featured: true,
  },
  {
    icon: CheckSquare,
    title: "Umzugscheckliste",
    description: "Schritt für Schritt zum perfekten Umzug",
    href: "/ratgeber/checklisten",
  },
  {
    icon: Lightbulb,
    title: "Umzugstipps",
    description: "Praktische Tipps von Experten",
    href: "/ratgeber/umzugstipps",
  },
  {
    icon: BookOpen,
    title: "Alle Ratgeber",
    description: "Komplette Sammlung aller Artikel",
    href: "/ratgeber",
  },
];

export const RatgeberDropdown = ({ isOpen, onClose }: RatgeberDropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-6 py-6">
        <DropdownSection title="Ratgeber & Tipps">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {ratgeberItems.map((item) => (
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
    </DropdownWrapper>
  );
};

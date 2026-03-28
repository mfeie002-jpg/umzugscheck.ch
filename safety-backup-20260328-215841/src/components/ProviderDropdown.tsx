import { Briefcase, LogIn, DollarSign, Award, HelpCircle, Rocket } from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownLink } from "./navigation/DropdownLink";
import { DropdownSection } from "./navigation/DropdownSection";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface ProviderDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const providerLinks = [
  { icon: Briefcase, title: "Anbieter werden", description: "Registrieren Sie sich kostenlos", href: "/anbieter", featured: true },
  { icon: LogIn, title: "Anbieter Login", description: "Zugang zum Dashboard", href: "/anbieter/login" },
  { icon: DollarSign, title: "Preise & Konditionen", description: "Transparente Preisübersicht", href: "/anbieter/preise" },
  { icon: HelpCircle, title: "Häufige Fragen", description: "Antworten auf Ihre Fragen", href: "/anbieter/faq" },
];

export const ProviderDropdown = ({ isOpen, onClose }: ProviderDropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <DropdownSection title="Für Umzugsfirmen">
            <div className="grid sm:grid-cols-2 gap-2">
              {providerLinks.map((link) => (
                <DropdownLink
                  key={link.title}
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

          {/* CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-8">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground">Jetzt starten</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Erreichen Sie täglich hunderte potenzielle Kunden und wachsen Sie mit uns.
              </p>
              <Link to="/anbieter" onClick={onClose}>
                <Button className="w-full" size="sm">
                  Kostenlos registrieren
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};

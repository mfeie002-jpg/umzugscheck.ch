/**
 * Dropdown: Für Anbieter (Ultimate Variant)
 * 
 * ULTIMATE DESIGN - B2B-Portal für Umzugsfirmen
 * - Partner werden (Registration)
 * - Anbieter Login
 * - Preise & Konditionen
 * - Bewertungssystem
 * - FAQ
 */

import { Link } from "react-router-dom";
import { 
  Briefcase, 
  LogIn, 
  Star,
  DollarSign,
  HelpCircle,
  TrendingUp,
  Award,
  ArrowRight,
  Users,
  Zap
} from "lucide-react";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownCTACard } from "@/components/navigation/DropdownCTACard";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";

interface FuerFirmenDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const partnerLinks = [
  { 
    icon: Briefcase, 
    title: "Partner werden", 
    description: "Kostenlos registrieren & Kunden gewinnen", 
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
    description: "Zugang zum Partner-Dashboard", 
    href: "/anbieter/login" 
  },
  { 
    icon: Star, 
    title: "Bewertungssystem", 
    description: "So funktionieren Bewertungen", 
    href: "/anbieter/bewertungen" 
  },
  { 
    icon: HelpCircle, 
    title: "Häufige Fragen", 
    description: "Antworten für Partner", 
    href: "/anbieter/faq" 
  },
];

const benefits = [
  { icon: Users, label: "500+ Partner schweizweit" },
  { icon: TrendingUp, label: "Ø 15 Leads pro Monat" },
  { icon: Award, label: "4.8★ Kundenzufriedenheit" },
];

export const FuerFirmenDropdown = ({ isOpen, onClose }: FuerFirmenDropdownProps) => {
  const navVariant = useNavigationVariant();
  
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Partner Links */}
          <div>
            <DropdownSection 
              title={navVariant.labels.fuerFirmen.toUpperCase()}
              subtitle={navVariant.microcopy.fuerFirmen}
            >
              <div className="grid lg:grid-cols-2 gap-1 mt-2">
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

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Warum Partner werden?</p>
                <div className="flex flex-wrap gap-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-accent rounded-lg">
                      <benefit.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{benefit.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/anbieter"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>

          {/* Column 2: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Jetzt Partner werden"
              description="Erreichen Sie täglich hunderte potenzielle Kunden."
              icon={Zap}
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

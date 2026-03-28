/**
 * Navigation V14 - 2026 Design
 * 
 * 5 main sections + context-aware CTA:
 * 1. Umzug planen - Tools, Tipps & Rechner
 * 2. Umzugsfirmen - 200+ geprüfte Partner
 * 3. Services - Rundum-Service
 * 4. Ratgeber - Tipps & Tricks
 * 5. So funktioniert's - Stressfrei in 3 Schritten
 * + CTA: Offerten erhalten (context-aware)
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  Menu, 
  ClipboardList, 
  Calculator, 
  Box, 
  Bot, 
  Package,
  MapPin,
  Building2,
  Sparkles,
  Trash2,
  Warehouse,
  Truck,
  Briefcase,
  Baby,
  Home,
  Mail,
  Scale,
  PiggyBank,
  HelpCircle,
  Star,
  Shield,
  Users,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileMenuV14 } from "./MobileMenuV14";

interface NavItem {
  label: string;
  tagline: string;
  items: {
    icon: React.ElementType;
    title: string;
    href: string;
  }[];
}

const navStructure: NavItem[] = [
  {
    label: "📋 Umzug planen",
    tagline: "Tools, Tipps & Rechner für deinen Zügeltag",
    items: [
      { icon: ClipboardList, title: "Umzugscheckliste", href: "/checkliste" },
      { icon: Calculator, title: "Umzugskosten-Rechner", href: "/umzugsrechner" },
      { icon: Box, title: "Volumenrechner", href: "/volumenrechner" },
      { icon: Bot, title: "Digitaler Umzugsassistent (Beta)", href: "/assistent" },
      { icon: Package, title: "Packtipps & Tricks", href: "/ratgeber/packtipps" },
    ]
  },
  {
    label: "🔍 Umzugsfirmen",
    tagline: "200+ geprüfte Partner – Umzugsfirma finden & sparen",
    items: [
      { icon: MapPin, title: "Umzugsfirma Zürich", href: "/umzugsfirma-zuerich" },
      { icon: MapPin, title: "Umzugsfirma Bern", href: "/umzugsfirma-bern" },
      { icon: MapPin, title: "Umzugsfirma Basel", href: "/umzugsfirma-basel" },
      { icon: MapPin, title: "Umzugsfirma Luzern", href: "/umzugsfirma-luzern" },
      { icon: Building2, title: "Alle Umzugsfirmen (Regionen)", href: "/umzugsfirmen" },
    ]
  },
  {
    label: "🛠️ Services",
    tagline: "Rundum-Service: Reinigung, Lagerung, Entsorgung & mehr",
    items: [
      { icon: Sparkles, title: "Umzugsreinigung (mit Abgabegarantie)", href: "/reinigung" },
      { icon: Trash2, title: "Entsorgung & Räumung", href: "/entsorgung" },
      { icon: Warehouse, title: "Lagerung & Einlagerung", href: "/lagerung" },
      { icon: Truck, title: "Möbellift mieten", href: "/moebellift" },
      { icon: Briefcase, title: "Firmenumzug (Büro & Geschäft)", href: "/firmenumzug" },
    ]
  },
  {
    label: "📚 Ratgeber",
    tagline: "Tipps & Tricks für einen stressfreien Umzug",
    items: [
      { icon: Baby, title: "Umziehen mit Kindern & Haustieren", href: "/ratgeber/kinder-haustiere" },
      { icon: Home, title: "Wohnungsübergabe leicht gemacht", href: "/ratgeber/wohnungsuebergabe" },
      { icon: Mail, title: "Adressänderung & Ummelden", href: "/ratgeber/adressaenderung" },
      { icon: Scale, title: "DIY vs. Profi-Umzug", href: "/ratgeber/diy-vs-profi" },
      { icon: PiggyBank, title: "Umzugskosten sparen – Tipps vom Profi", href: "/ratgeber/kosten-sparen" },
    ]
  },
  {
    label: "⭐ So funktioniert's",
    tagline: "Stressfrei in 3 Schritten – so funktioniert Umzugscheck",
    items: [
      { icon: HelpCircle, title: "So funktioniert Umzugscheck (Ablauf)", href: "/so-funktionierts" },
      { icon: Star, title: "Kundenbewertungen & Erfahrungen", href: "/bewertungen" },
      { icon: Shield, title: "Geprüfte Umzugspartner (Qualität)", href: "/partner" },
      { icon: Users, title: "Über uns (Team & Kontakt)", href: "/ueber-uns" },
      { icon: MessageCircle, title: "FAQ/Hilfe", href: "/faq" },
    ]
  }
];

// Context-aware CTA logic
const getContextAwareCTA = (pathname: string): { label: string; href: string } => {
  if (pathname.includes('/reinigung')) {
    return { label: "Offerte für Reinigung", href: "/umzugsofferten?service=reinigung" };
  }
  if (pathname.includes('/entsorgung')) {
    return { label: "Offerte für Entsorgung", href: "/umzugsofferten?service=entsorgung" };
  }
  if (pathname.includes('/lagerung')) {
    return { label: "Offerte für Lagerung", href: "/umzugsofferten?service=lagerung" };
  }
  if (pathname.includes('/firmenumzug')) {
    return { label: "Firmenumzug anfragen", href: "/umzugsofferten?type=business" };
  }
  return { label: "Offerten erhalten", href: "/umzugsofferten" };
};

export const NavigationV14 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  
  const ctaConfig = getContextAwareCTA(location.pathname);

  return (
    <>
      <header className="sticky top-0 z-[9998] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Umzugscheck</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navStructure.map((section) => (
              <div
                key={section.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(section.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeDropdown === section.label && "bg-accent text-accent-foreground"
                  )}
                >
                  {section.label}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    activeDropdown === section.label && "rotate-180"
                  )} />
                </button>

                {/* Dropdown */}
                {activeDropdown === section.label && (
                  <div className="absolute top-full left-0 pt-2 z-[9999]">
                    <div className="bg-background border border-border rounded-lg shadow-lg min-w-[320px] p-4">
                      {/* Tagline */}
                      <p className="text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                        {section.tagline}
                      </p>
                      
                      {/* Links */}
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="text-sm font-medium">{item.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button asChild className="font-semibold">
              <Link to={ctaConfig.href}>{ctaConfig.label}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menü öffnen</span>
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenuV14
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navStructure={navStructure}
        ctaConfig={ctaConfig}
      />
    </>
  );
};

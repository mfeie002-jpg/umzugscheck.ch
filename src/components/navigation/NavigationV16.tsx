/**
 * Navigation V16 - SEO-Optimiert 2026
 * 
 * Desktop Navigation with:
 * - 5 Hauptsektionen: Umzug planen, Umzugsfirmen, Services, Ratgeber, So funktioniert's
 * - Context-Aware CTA Button
 * - Premium mega-menu dropdowns
 * - SEO-optimized structure with microcopy
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, ArrowRight, CheckCircle, Menu, Zap,
  ClipboardList, Calculator, Box, Bot, Package, Truck, MapPin,
  Sparkles, Home, FileText, Baby, Key, Mail, HelpCircle, Users, Award,
  Trash2, Archive, CableCar, Briefcase, Wrench, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MobileMenuV16 } from "./MobileMenuV16";
import { VARIANT_P } from "@/lib/navigation-variants";

interface NavItem {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

interface NavSection {
  id: string;
  label: string;
  tagline: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "umzug-planen",
    label: "Umzug planen",
    tagline: "Tools, Tipps & Rechner für deinen Zügeltag",
    items: [
      { icon: ClipboardList, title: "Umzugscheckliste", description: "Schritt für Schritt stressfrei umziehen", href: "/checkliste" },
      { icon: Calculator, title: "Umzugskosten-Rechner", description: "Was kostet dein Umzug? In 60 Sekunden.", href: "/preisrechner" },
      { icon: Box, title: "Volumenrechner", description: "Wie viel Platz braucht dein Haushalt?", href: "/volumenrechner" },
      { icon: Bot, title: "Digitaler Umzugsassistent", description: "KI-gestützter Umzugsplaner", href: "/assistent", badge: "Beta" },
      { icon: Package, title: "Packtipps & Tricks", description: "Effizient & sicher verpacken", href: "/ratgeber/packtipps" },
    ],
  },
  {
    id: "umzugsfirmen",
    label: "Umzugsfirmen",
    tagline: "200+ geprüfte Partner – Umzugsfirma finden & sparen",
    items: [
      { icon: MapPin, title: "Umzugsfirma Zürich", description: "Top-Bewertungen in Zürich", href: "/umzugsfirmen/zuerich" },
      { icon: MapPin, title: "Umzugsfirma Bern", description: "Beste Preise in Bern", href: "/umzugsfirmen/bern" },
      { icon: MapPin, title: "Umzugsfirma Basel", description: "Geprüfte Partner in Basel", href: "/umzugsfirmen/basel" },
      { icon: MapPin, title: "Umzugsfirma Luzern", description: "Zentralschweiz Experten", href: "/umzugsfirmen/luzern" },
      { icon: Truck, title: "Alle Umzugsfirmen", description: "Alle Regionen & Kantone", href: "/umzugsfirmen" },
    ],
  },
  {
    id: "services",
    label: "Services",
    tagline: "Rundum-Service: Reinigung, Lagerung, Entsorgung & mehr",
    items: [
      { icon: Home, title: "Umzugsreinigung", description: "Mit Abgabegarantie – Depot zurück!", href: "/umzugsreinigung", badge: "Garantie" },
      { icon: Trash2, title: "Entsorgung & Räumung", description: "Altes raus, Neues rein", href: "/entsorgung" },
      { icon: Archive, title: "Lagerung & Einlagerung", description: "Flexibel zwischenlagern", href: "/lagerung" },
      { icon: CableCar, title: "Möbellift mieten", description: "Grosses sicher transportieren", href: "/moebellift" },
      { icon: Briefcase, title: "Firmenumzug", description: "Büro & Geschäft professionell", href: "/firmenumzug" },
    ],
  },
  {
    id: "ratgeber",
    label: "Ratgeber",
    tagline: "Tipps & Tricks für einen stressfreien Umzug",
    items: [
      { icon: Baby, title: "Umziehen mit Kindern & Haustieren", description: "Stressfrei für die ganze Familie", href: "/ratgeber/umziehen-mit-kindern" },
      { icon: Key, title: "Wohnungsübergabe leicht gemacht", description: "Depot zurück, garantiert!", href: "/ratgeber/wohnungsuebergabe" },
      { icon: Mail, title: "Adressänderung & Ummelden", description: "Alle Behördengänge im Griff", href: "/ratgeber/adressaenderung" },
      { icon: Wrench, title: "DIY vs. Profi-Umzug", description: "Selber machen oder Profis?", href: "/ratgeber/diy-vs-profi" },
      { icon: Calculator, title: "Umzugskosten sparen", description: "Tipps vom Profi für dein Budget", href: "/ratgeber/kosten-sparen" },
    ],
  },
  {
    id: "so-funktioniert",
    label: "So funktioniert's",
    tagline: "Stressfrei in 3 Schritten – so funktioniert Umzugscheck",
    items: [
      { icon: Sparkles, title: "So funktioniert Umzugscheck", description: "Dein Weg zur besten Offerte", href: "/so-funktioniert" },
      { icon: Star, title: "Kundenbewertungen", description: "Echte Erfahrungen lesen", href: "/bewertungen" },
      { icon: Award, title: "Geprüfte Umzugspartner", description: "Qualität die du spürst", href: "/qualitaet" },
      { icon: Users, title: "Über uns", description: "Das Team hinter Umzugscheck", href: "/ueber-uns" },
      { icon: HelpCircle, title: "FAQ & Hilfe", description: "Antworten auf deine Fragen", href: "/faq" },
    ],
  },
];

export const NavigationV16 = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Context-aware CTA label based on current page
  const getCtaLabel = () => {
    if (location.pathname.includes('reinigung')) return 'Reinigungsofferte';
    if (location.pathname.includes('lagerung')) return 'Lagerungsofferte';
    if (location.pathname.includes('entsorgung')) return 'Entsorgungsofferte';
    if (location.pathname.includes('firmenumzug')) return 'Firmenofferte';
    return VARIANT_P.labels.cta;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-foreground">Umzugs</span>
              <span className="text-primary">check</span>
              <span className="text-muted-foreground text-sm">.ch</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_SECTIONS.map((section) => (
              <div
                key={section.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(section.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    "hover:bg-muted/50 hover:text-primary",
                    activeDropdown === section.id && "bg-muted/50 text-primary"
                  )}
                >
                  {section.label}
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeDropdown === section.id && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === section.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                    >
                      <div className="w-[380px] bg-background rounded-2xl shadow-2xl shadow-black/10 border border-border/50 overflow-hidden">
                        {/* Dropdown Header */}
                        <div className="px-5 py-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50">
                          <p className="text-sm font-semibold text-foreground">{section.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{section.tagline}</p>
                        </div>

                        {/* Dropdown Items */}
                        <div className="p-3 space-y-1">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-muted/50 transition-all group"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 transition-all">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {item.title}
                                    </span>
                                    {item.badge && (
                                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-primary to-emerald-600 text-white rounded-md uppercase">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {item.description}
                                  </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                              </Link>
                            );
                          })}
                        </div>

                        {/* Dropdown CTA */}
                        {section.id === "umzugsfirmen" && (
                          <div className="p-4 pt-0">
                            <Button asChild className="w-full h-11 font-semibold gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/20">
                              <Link to="/umzugsofferten">
                                <Zap className="w-4 h-4" />
                                Gratis Offerten holen
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side: CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA - Context-Aware */}
            <Button asChild className="hidden lg:flex h-10 px-5 font-semibold gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/20">
              <Link to="/umzugsofferten">
                <Zap className="w-4 h-4" />
                {getCtaLabel()}
              </Link>
            </Button>

            {/* Mobile CTA */}
            <Button asChild size="sm" className="lg:hidden h-9 px-3 font-semibold gap-1.5 rounded-lg bg-gradient-to-r from-primary to-emerald-600">
              <Link to="/umzugsofferten">
                <Zap className="w-4 h-4" />
                Offerten
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenuV16 isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

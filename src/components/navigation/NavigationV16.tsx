/**
 * Navigation V16 - SEO-Optimiert 2026 (Enhanced)
 * 
 * Desktop Navigation with:
 * - 5 Hauptsektionen mit lebendigen Mega-Dropdowns
 * - Context-Aware CTA Button
 * - Premium animated dropdowns mit Trust-Signals
 * - SEO-optimized structure with microcopy
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, ArrowRight, CheckCircle, Menu, Zap, Shield, Star, Heart,
  ClipboardList, Calculator, Box, Bot, Package, Truck, MapPin,
  Sparkles, Home, FileText, Baby, Key, Mail, HelpCircle, Users, Award,
  Trash2, Archive, CableCar, Briefcase, Wrench
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
  badgeColor?: string;
}

interface NavSection {
  id: string;
  label: string;
  tagline: string;
  items: NavItem[];
}

// Trust signals for dropdown header
const TRUST_SIGNALS = [
  { icon: Shield, label: "Geprüfte Firmen", color: "text-emerald-600" },
  { icon: Star, label: "4.8★ Bewertung", color: "text-amber-500" },
  { icon: Heart, label: "100% Gratis", color: "text-rose-500" },
];

const NAV_SECTIONS: NavSection[] = [
  {
    id: "umzug-planen",
    label: "Umzug planen",
    tagline: "Tools, Tipps & Rechner für deinen Zügeltag",
    items: [
      { icon: Calculator, title: "Umzugskosten-Rechner", description: "Was kostet dein Umzug? In 60 Sekunden.", href: "/preisrechner", badge: "Beliebt", badgeColor: "from-amber-500 to-orange-500" },
      { icon: ClipboardList, title: "Umzugscheckliste", description: "Schritt für Schritt stressfrei umziehen", href: "/checkliste", badge: "Top", badgeColor: "from-emerald-500 to-teal-500" },
      { icon: Box, title: "Volumenrechner", description: "Wie viel Platz braucht dein Haushalt?", href: "/volumenrechner" },
      { icon: Bot, title: "Digitaler Umzugsassistent", description: "KI-gestützter Umzugsplaner", href: "/assistent", badge: "Neu", badgeColor: "from-violet-500 to-purple-500" },
      { icon: Package, title: "Packtipps & Tricks", description: "Effizient & sicher verpacken", href: "/ratgeber/packtipps" },
    ],
  },
  {
    id: "umzugsfirmen",
    label: "Umzugsfirmen",
    tagline: "200+ geprüfte Partner – Umzugsfirma finden & sparen",
    items: [
      { icon: MapPin, title: "Umzugsfirma Zürich", description: "Top-Bewertungen in Zürich", href: "/umzugsfirmen/zuerich", badge: "★4.9" },
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
      { icon: Home, title: "Umzugsreinigung", description: "Mit Abgabegarantie – Depot zurück!", href: "/umzugsreinigung", badge: "Garantie", badgeColor: "from-emerald-500 to-green-500" },
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
        {/* Warm accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary/60" />
        
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all group-hover:scale-105">
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
                    "hover:bg-primary/10 hover:text-primary",
                    activeDropdown === section.id && "bg-primary/10 text-primary"
                  )}
                >
                  {section.label}
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeDropdown === section.id && "rotate-180"
                  )} />
                </button>

                {/* Enhanced Mega Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === section.id && (
                    <>
                      {/* Backdrop */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 top-[65px]"
                        onClick={() => setActiveDropdown(null)}
                      />
                      
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
                      >
                        <div className="w-[420px] bg-background rounded-2xl shadow-2xl shadow-primary/10 border border-border/50 overflow-hidden">
                          {/* Gradient accent */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-emerald-500/60 to-secondary/60" />
                          
                          {/* Trust micro-bar */}
                          <div className="border-b border-border/50 bg-gradient-to-r from-primary/[0.04] via-transparent to-emerald-500/[0.04]">
                            <div className="flex items-center justify-center gap-4 py-2.5 px-4">
                              {TRUST_SIGNALS.map((signal, i) => (
                                <motion.div
                                  key={signal.label}
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.05 + i * 0.03 }}
                                  className="flex items-center gap-1.5"
                                >
                                  <signal.icon className={cn("w-3.5 h-3.5", signal.color)} />
                                  <span className="text-[10px] font-semibold text-muted-foreground">{signal.label}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Dropdown Header */}
                          <div className="px-5 py-4 bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-transparent border-b border-border/30">
                            <p className="text-sm font-bold text-foreground flex items-center gap-2">
                              <span className="text-lg">🏠</span>
                              {section.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{section.tagline}</p>
                          </div>

                          {/* Dropdown Items */}
                          <div className="p-3 space-y-1">
                            {section.items.map((item, index) => {
                              const Icon = item.icon;
                              return (
                                <motion.div
                                  key={item.href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.05 + index * 0.03 }}
                                >
                                  <Link
                                    to={item.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-start gap-3 px-3 py-3.5 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-emerald-500/5 transition-all group"
                                  >
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-emerald-500/10 transition-all group-hover:scale-110 shadow-sm shadow-primary/10">
                                      <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                          {item.title}
                                        </span>
                                        {item.badge && (
                                          <span className={cn(
                                            "px-2 py-0.5 text-[10px] font-bold text-white rounded-full uppercase shadow-sm",
                                            item.badgeColor 
                                              ? `bg-gradient-to-r ${item.badgeColor}` 
                                              : "bg-gradient-to-r from-primary to-primary/80"
                                          )}>
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-xs text-muted-foreground leading-relaxed">
                                        {item.description}
                                      </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 opacity-0 group-hover:opacity-100" />
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Dropdown CTA */}
                          <div className="p-4 pt-2 bg-gradient-to-t from-muted/30 to-transparent">
                            <Button asChild className="w-full h-12 font-bold gap-2 rounded-xl bg-gradient-to-r from-primary via-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02]">
                              <Link to="/umzugsofferten" onClick={() => setActiveDropdown(null)}>
                                <Zap className="w-5 h-5" />
                                Gratis Offerten holen
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </Button>
                            <p className="text-center text-[10px] text-muted-foreground mt-2">
                              ✓ Kostenlos · ✓ Unverbindlich · ✓ In 60 Sekunden
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side: CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA - Context-Aware */}
            <div className="hidden lg:flex flex-col items-end">
              <Button asChild className="h-11 px-6 font-bold gap-2 rounded-xl bg-gradient-to-r from-primary via-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105">
                <Link to="/umzugsofferten">
                  <Zap className="w-4 h-4" />
                  {getCtaLabel()}
                </Link>
              </Button>
              <span className="text-[10px] text-muted-foreground mt-1">Gratis & unverbindlich</span>
            </div>

            {/* Mobile CTA */}
            <Button asChild size="sm" className="lg:hidden h-9 px-3 font-semibold gap-1.5 rounded-lg bg-gradient-to-r from-primary to-emerald-600 shadow-md shadow-primary/20">
              <Link to="/umzugsofferten">
                <Zap className="w-4 h-4" />
                Offerten
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 hover:bg-primary/10"
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

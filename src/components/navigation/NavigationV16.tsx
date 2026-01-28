/**
 * Navigation V16 - SEO-Optimiert 2026 (Enhanced)
 * 
 * Desktop Navigation with:
 * - 5 Hauptsektionen mit lebendigen Mega-Dropdowns
 * - Context-Aware CTA Button
 * - Premium animated dropdowns mit Trust-Signals
 * - SEO-optimized structure with microcopy
 * - Dynamic Mobile Menu based on active variant
 */

import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, ArrowRight, CheckCircle, Menu, Zap, Shield, Star, Heart,
  ClipboardList, Calculator, Box, Bot, Package, Truck, MapPin,
  Sparkles, Home, FileText, Baby, Key, Mail, HelpCircle, Users, Award,
  Trash2, Archive, CableCar, Briefcase, Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderLogo } from "@/components/brand/HeaderLogo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicMobileMenu } from "@/hooks/useDynamicMobileMenu";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";
import { useFlowPath } from "@/hooks/useUnifiedAB";
import type { NavConfig } from "@/lib/navigation-variants";

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

// Trust signals for dropdown header - Brand colors only
const TRUST_SIGNALS = [
  { icon: Shield, label: "Geprüfte Firmen", color: "text-primary" },
  { icon: Star, label: "4.8★ Bewertung", color: "text-secondary" },
  { icon: Heart, label: "100% Gratis", color: "text-secondary" },
];

// Static dropdown items (links don't change, only main nav labels change)
const DROPDOWN_ITEMS = {
  preisrechner: [
    { icon: Calculator, title: "Umzugskosten-Rechner", description: "Was kostet dein Umzug? In 60 Sekunden.", href: "/preisrechner", badge: "Beliebt", badgeColor: "from-amber-500 to-orange-500" },
    { icon: ClipboardList, title: "Umzugscheckliste", description: "Schritt für Schritt stressfrei umziehen", href: "/checkliste", badge: "Top", badgeColor: "from-emerald-500 to-teal-500" },
    { icon: Box, title: "Volumenrechner", description: "Wie viel Platz braucht dein Haushalt?", href: "/volumenrechner" },
    { icon: Bot, title: "Digitaler Umzugsassistent", description: "KI-gestützter Umzugsplaner", href: "/assistent", badge: "Neu", badgeColor: "from-violet-500 to-purple-500" },
    { icon: Package, title: "Packtipps & Tricks", description: "Effizient & sicher verpacken", href: "/ratgeber/packtipps" },
  ],
  firmen: [
    { icon: MapPin, title: "Umzugsfirma Zürich", description: "Top-Bewertungen in Zürich", href: "/umzugsfirmen/zuerich", badge: "★4.9" },
    { icon: MapPin, title: "Umzugsfirma Bern", description: "Beste Preise in Bern", href: "/umzugsfirmen/bern" },
    { icon: MapPin, title: "Umzugsfirma Basel", description: "Geprüfte Partner in Basel", href: "/umzugsfirmen/basel" },
    { icon: MapPin, title: "Umzugsfirma Luzern", description: "Zentralschweiz Experten", href: "/umzugsfirmen/luzern" },
    { icon: Truck, title: "Alle Umzugsfirmen", description: "Alle Regionen & Kantone", href: "/umzugsfirmen" },
  ],
  services: [
    { icon: Home, title: "Umzugsreinigung", description: "Mit Abgabegarantie – Depot zurück!", href: "/umzugsreinigung", badge: "Garantie", badgeColor: "from-emerald-500 to-green-500" },
    { icon: Trash2, title: "Entsorgung & Räumung", description: "Altes raus, Neues rein", href: "/entsorgung" },
    { icon: Archive, title: "Lagerung & Einlagerung", description: "Flexibel zwischenlagern", href: "/lagerung" },
    { icon: CableCar, title: "Möbellift mieten", description: "Grosses sicher transportieren", href: "/moebellift" },
    { icon: Briefcase, title: "Firmenumzug", description: "Büro & Geschäft professionell", href: "/firmenumzug" },
  ],
  ratgeber: [
    { icon: Baby, title: "Umziehen mit Kindern & Haustieren", description: "Stressfrei für die ganze Familie", href: "/ratgeber/umziehen-mit-kindern" },
    { icon: Key, title: "Wohnungsübergabe leicht gemacht", description: "Depot zurück, garantiert!", href: "/ratgeber/wohnungsuebergabe" },
    { icon: Mail, title: "Adressänderung & Ummelden", description: "Alle Behördengänge im Griff", href: "/ratgeber/adressaenderung" },
    { icon: Wrench, title: "DIY vs. Profi-Umzug", description: "Selber machen oder Profis?", href: "/ratgeber/diy-vs-profi" },
    { icon: Calculator, title: "Umzugskosten sparen", description: "Tipps vom Profi für dein Budget", href: "/ratgeber/kosten-sparen" },
  ],
  fuerFirmen: [
    { icon: Sparkles, title: "So funktioniert Umzugscheck", description: "Dein Weg zur besten Offerte", href: "/so-funktioniert" },
    { icon: Star, title: "Kundenbewertungen", description: "Echte Erfahrungen lesen", href: "/bewertungen" },
    { icon: Award, title: "Geprüfte Umzugspartner", description: "Qualität die du spürst", href: "/qualitaet" },
    { icon: Users, title: "Über uns", description: "Das Team hinter Umzugscheck", href: "/ueber-uns" },
    { icon: HelpCircle, title: "FAQ & Hilfe", description: "Antworten auf deine Fragen", href: "/faq" },
  ],
};

// Build nav sections dynamically based on the active variant's labels and microcopy
const buildNavSections = (variant: NavConfig): NavSection[] => [
  {
    id: "preisrechner",
    label: `📋 ${variant.labels.preisrechner}`,
    tagline: variant.microcopy.preisrechner,
    items: DROPDOWN_ITEMS.preisrechner,
  },
  {
    id: "firmen",
    label: `🔍 ${variant.labels.firmen}`,
    tagline: variant.microcopy.firmen,
    items: DROPDOWN_ITEMS.firmen,
  },
  {
    id: "services",
    label: `🛠️ ${variant.labels.services}`,
    tagline: variant.microcopy.services,
    items: DROPDOWN_ITEMS.services,
  },
  {
    id: "ratgeber",
    label: `📚 ${variant.labels.ratgeber}`,
    tagline: variant.microcopy.ratgeber,
    items: DROPDOWN_ITEMS.ratgeber,
  },
  {
    id: "fuerFirmen",
    label: `⭐ ${variant.labels.fuerFirmen}`,
    tagline: variant.microcopy.fuerFirmen,
    items: DROPDOWN_ITEMS.fuerFirmen,
  },
];

export const NavigationV16 = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navVariant = useNavigationVariant();
  const flowPath = useFlowPath();

  // Build dynamic navigation sections based on current variant
  const navSections = useMemo(() => buildNavSections(navVariant), [navVariant]);

  // Context-aware CTA label based on current page or variant
  const getCtaLabel = () => {
    if (location.pathname.includes('reinigung')) return 'Reinigungsofferte';
    if (location.pathname.includes('lagerung')) return 'Lagerungsofferte';
    if (location.pathname.includes('entsorgung')) return 'Entsorgungsofferte';
    if (location.pathname.includes('firmenumzug')) return 'Firmenofferte';
    return navVariant.labels.cta;
  };

  // Mobile menu is now handled by DynamicMobileMenu component


  return (
    <>
      <header className="sticky top-0 z-[9998] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-x-clip pt-1">
        {/* Brand accent line (NO gradient blending to avoid purple) */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-primary" />
          <div className="w-24 bg-secondary" />
          <div className="flex-1 bg-primary" />
        </div>
        
        <div className="mx-auto flex h-[60px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-5 xl:px-6 pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1.5rem+env(safe-area-inset-right))]">
          {/* Logo */}
          <HeaderLogo size="md" showTagline={true} className="group xl:hidden" />
          <HeaderLogo size="md" showTagline={true} className="group hidden xl:flex" />

          {/* Desktop Navigation - Only show from xl breakpoint */}
          <nav className="hidden xl:flex items-center gap-0.5 flex-1 min-w-0 justify-center">
            {navSections.map((section) => (
              <div
                key={section.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(section.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-2 xl:px-3 py-2 rounded-lg text-[13px] 2xl:text-sm font-medium transition-all whitespace-nowrap",
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
                        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[9998] top-[65px]"
                        onClick={() => setActiveDropdown(null)}
                      />
                      
                      {/* Dropdown */}
                       <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[9999]"
                      >
                        <div className="w-[420px] bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                           {/* Brand accent line (no blending) */}
                           <div className="absolute top-0 left-0 right-0 h-1 flex">
                             <div className="flex-1 bg-primary" />
                             <div className="w-20 bg-secondary" />
                             <div className="flex-1 bg-primary" />
                           </div>
                          
                          {/* Trust micro-bar */}
                          <div className="border-b border-border/50 bg-muted/30">
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
                                    className="flex items-start gap-3 px-3 py-3.5 rounded-xl hover:bg-muted/50 transition-all group"
                                  >
                                    <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0 group-hover:bg-muted transition-all group-hover:scale-110">
                                      <Icon className="h-5 w-5 text-muted-foreground" />
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
                            <Button asChild className="w-full h-12 font-bold gap-2 rounded-xl bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-all hover:scale-[1.02]">
                              <Link to={flowPath} onClick={() => setActiveDropdown(null)}>
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
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 flex-shrink-0">
            {/* Desktop CTA - Context-Aware (xl+) */}
            <div className="hidden xl:flex items-center flex-shrink-0">
              <Button asChild className="h-11 px-6 font-bold gap-2 rounded-xl bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105">
                <Link to={flowPath}>
                  <Zap className="w-4 h-4" />
                  {getCtaLabel()}
                </Link>
              </Button>
            </div>

            {/* Tablet CTA (lg only) - Compact but visible */}
            <Button asChild className="hidden lg:flex xl:hidden h-10 px-4 font-semibold gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20">
              <Link to={flowPath}>
                <Zap className="w-4 h-4" />
                Offerte
              </Link>
            </Button>

            {/* Mobile CTA - PRIMARY (blue) for brand consistency */}
            <Link to={flowPath}>
              <Button size="sm" className="lg:hidden h-9 px-2.5 font-semibold gap-1 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 text-xs sm:text-sm">
                <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Offerten</span>
              </Button>
            </Link>

            {/* Tablet Menu Button (lg) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex xl:hidden h-10 w-10 hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menü öffnen</span>
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

      {/* Mobile Menu - Dynamic based on A/B variant */}
      <DynamicMobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
};

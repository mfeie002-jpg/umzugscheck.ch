/**
 * Mobile Menu V16 - SEO-Optimiert 2026
 * 
 * Premium Mobile-First UX with:
 * - 5 Hauptsektionen: Umzug planen, Umzugsfirmen, Services, Ratgeber, So funktioniert's
 * - Detaillierte SEO-optimierte Submenüs
 * - 52px+ touch targets throughout
 * - Emotional Swiss-quality design with trust signals
 * - Smooth staggered animations
 * - Context-aware microcopy
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  X, ChevronDown, ArrowRight, CheckCircle, Shield, Zap, Star, Search,
  ClipboardList, Calculator, Box, Bot, Package, Truck, MapPin,
  Sparkles, Home, FileText, Baby, Key, Mail, HelpCircle, Users, Award,
  Building2, BadgeCheck, Clock, Heart, Phone, MessageCircle,
  Trash2, Archive, CableCar, Briefcase, Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderLogo } from "@/components/brand/HeaderLogo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface MobileMenuV16Props {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
} as const;

const menuVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 200 }
  },
  exit: { 
    x: "100%",
    transition: { duration: 0.2 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3 }
  })
} as const;

// Trust Signals for header
const TRUST_SIGNALS = [
  { icon: BadgeCheck, label: "200+ Partner", color: "text-emerald-600" },
  { icon: Star, label: "4.8★ Top", color: "text-amber-500" },
  { icon: Zap, label: "Gratis", color: "text-primary" },
];

// ============================================
// SEO-OPTIMIERTE NAVIGATION STRUKTUR V16
// ============================================

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
  emoji: string;
  gradient: { from: string; to: string };
  icon: React.ElementType;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "umzug-planen",
    label: "Umzug planen",
    tagline: "Tools, Tipps & Rechner für deinen Zügeltag",
    emoji: "📋",
    gradient: { from: "from-blue-500", to: "to-indigo-600" },
    icon: ClipboardList,
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
    emoji: "🚚",
    gradient: { from: "from-primary", to: "to-emerald-600" },
    icon: Truck,
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
    emoji: "✨",
    gradient: { from: "from-emerald-500", to: "to-teal-600" },
    icon: Sparkles,
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
    emoji: "💡",
    gradient: { from: "from-amber-500", to: "to-orange-600" },
    icon: FileText,
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
    emoji: "🎯",
    gradient: { from: "from-purple-500", to: "to-pink-600" },
    icon: HelpCircle,
    items: [
      { icon: Sparkles, title: "So funktioniert Umzugscheck", description: "Dein Weg zur besten Offerte", href: "/so-funktioniert" },
      { icon: Star, title: "Kundenbewertungen", description: "Echte Erfahrungen lesen", href: "/bewertungen" },
      { icon: Award, title: "Geprüfte Umzugspartner", description: "Qualität die du spürst", href: "/qualitaet" },
      { icon: Users, title: "Über uns", description: "Das Team hinter Umzugscheck", href: "/ueber-uns" },
      { icon: HelpCircle, title: "FAQ & Hilfe", description: "Antworten auf deine Fragen", href: "/faq" },
    ],
  },
];

export const MobileMenuV16 = ({ isOpen, onClose }: MobileMenuV16Props) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const flowPath = useFlowPath();

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 w-full max-w-[380px] bg-background z-50 lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header with Trust Micro-Bar */}
            <div className="border-b border-border/50">
              {/* Trust Bar - Premium Gradient */}
              <div className="flex items-center justify-center gap-4 py-2.5 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10">
                {TRUST_SIGNALS.map((signal, idx) => {
                  const Icon = signal.icon;
                  return (
                    <motion.div 
                      key={signal.label} 
                      className="flex items-center gap-1.5"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Icon className={cn("w-4 h-4", signal.color)} />
                      <span className="text-xs font-semibold text-foreground">{signal.label}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Logo & Close - Enhanced */}
              <div className="flex items-center justify-between p-4">
                <motion.div 
                  className="flex items-center gap-2.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="flex flex-col">
                    <HeaderLogo size="md" onClick={onClose} />
                    <span className="text-[10px] text-muted-foreground font-medium">🇨🇭 Nr. 1 Schweizer Umzugsvergleich</span>
                  </div>
                </motion.div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="rounded-full h-11 w-11 hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Menü schliessen</span>
                </Button>
              </div>

              {/* Quick Help Banner */}
              <motion.div
                className="mx-4 mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Brauchst du Hilfe?</p>
                    <p className="text-xs text-muted-foreground">Wir beraten dich gerne kostenlos!</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30">
                    <MessageCircle className="w-5 h-5 text-amber-600" />
                  </Button>
                </div>
              </motion.div>

              {/* Search Bar - Enhanced */}
              <div className="px-4 pb-4">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Was suchst du? Zürich, Reinigung..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-13 min-h-[52px] pl-12 pr-4 rounded-2xl border-2 border-border/50 bg-muted/40 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/70"
                  />
                </motion.div>
              </div>
            </div>

            {/* Navigation Accordion - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <nav className="p-4 space-y-3">
                {NAV_SECTIONS.map((section, idx) => (
                  <motion.div 
                    key={section.id} 
                    custom={idx}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      "rounded-2xl overflow-hidden transition-all duration-300",
                      expandedSection === section.id 
                        ? "ring-2 ring-primary/30 shadow-lg shadow-primary/10" 
                        : "border border-border/50 hover:border-primary/30"
                    )}
                  >
                    {/* Section Header - 68px touch target */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 min-h-[68px] text-left transition-all",
                        "active:scale-[0.99] touch-manipulation",
                        expandedSection === section.id 
                          ? "bg-gradient-to-r from-primary/10 to-transparent" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      {/* Gradient Icon Container */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        "bg-gradient-to-br shadow-lg",
                        section.gradient.from,
                        section.gradient.to
                      )}>
                        <section.icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-foreground block text-base">
                          {section.emoji} {section.label}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {section.tagline}
                        </p>
                      </div>

                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                        expandedSection === section.id 
                          ? "bg-primary text-primary-foreground rotate-180" 
                          : "bg-muted/50 text-muted-foreground"
                      )}>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </button>

                    {/* Expanded Content with Staggered Animation */}
                    <AnimatePresence>
                      {expandedSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 space-y-2 bg-gradient-to-b from-primary/5 to-transparent">
                            {section.items.map((item, itemIdx) => {
                              const Icon = item.icon;
                              return (
                                <motion.div
                                  key={item.href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: itemIdx * 0.04 }}
                                >
                                  <Link
                                    to={item.href}
                                    onClick={onClose}
                                    className="flex items-start gap-4 px-4 py-4 min-h-[64px] rounded-xl hover:bg-background/80 active:bg-accent transition-all group touch-manipulation border border-transparent hover:border-border/50 hover:shadow-sm"
                                  >
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                                      <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
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
                                      <span className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                                        {item.description}
                                      </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                                  </Link>
                                </motion.div>
                              );
                            })}

                            {/* Section-specific CTA for Umzugsfirmen */}
                            {section.id === "umzugsfirmen" && (
                              <motion.div 
                                className="pt-3 mt-2 border-t border-border/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                              >
                                <Button asChild className="w-full h-13 min-h-[52px] font-bold gap-2 text-base rounded-xl bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg shadow-secondary/20">
                                  <Link to={flowPath} onClick={onClose}>
                                    <Zap className="w-5 h-5" />
                                    Gratis Offerten holen
                                    <ArrowRight className="w-5 h-5" />
                                  </Link>
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-2">
                                  ✅ Kostenlos & unverbindlich • Bis 40% sparen
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                {/* Für Anbieter Link - Enhanced */}
                <motion.div
                  custom={NAV_SECTIONS.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to="/anbieter"
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 min-h-[68px] border border-dashed border-primary/30 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all group touch-manipulation"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-foreground block text-base">💼 Für Anbieter</span>
                      <p className="text-xs text-muted-foreground">Partner werden, Leads erhalten, Dashboard nutzen</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </nav>
            </div>

            {/* Sticky CTA Footer - Premium Design */}
            <div className="border-t border-border/50 bg-gradient-to-t from-background via-background to-transparent safe-area-inset-bottom">
              {/* Trust Pills Row */}
              <div className="flex items-center justify-center gap-4 py-3 px-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Gratis</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>In 2 Min</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Swiss Made</span>
                </div>
              </div>

              {/* Main CTA Button */}
              <div className="px-4 pb-4">
                <Button asChild className="w-full h-14 min-h-[56px] text-base font-bold gap-3 rounded-2xl bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:opacity-95 shadow-xl shadow-secondary/25 transition-all active:scale-[0.98]">
                  <Link to={flowPath} onClick={onClose}>
                    <CheckCircle className="w-5 h-5" />
                    Offerten erhalten
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3 font-medium">
                  Unverbindlich • 3–5 Offerten in 24h • 200+ Partner
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

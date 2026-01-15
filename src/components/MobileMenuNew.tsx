/**
 * Neue Mobile Navigation mit Accordion-Struktur
 * 
 * Enhanced Mobile-First UX mit:
 * - Smooth animations (framer-motion)
 * - Better touch targets (min 48px)
 * - Emotional elements & trust signals
 * - Gradients & micro-interactions
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  X,
  Calculator,
  CheckSquare,
  Clock,
  Lightbulb,
  FileDown,
  Search,
  MapPin,
  Building2,
  Home,
  Globe,
  Sparkles,
  Wrench,
  Package,
  Trash2,
  Box,
  Truck,
  ParkingCircle,
  FileText,
  DollarSign,
  Calendar,
  Baby,
  Briefcase,
  LogIn,
  Star,
  HelpCircle,
  ArrowRight,
  Award,
  Shield,
  BadgeCheck,
  Users,
  Zap,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";
import { CANTONS_MAP, CITIES_MAP } from "@/data/locations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Trust signals for mobile
const TRUST_SIGNALS = [
  { icon: BadgeCheck, label: "Geprüft", color: "text-emerald-600" },
  { icon: Star, label: "4.8★", color: "text-amber-500" },
  { icon: Shield, label: "Gratis", color: "text-primary" },
];

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const menuVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0, 
    transition: { type: "spring" as const, damping: 25, stiffness: 300 } 
  },
  exit: { 
    x: "100%", 
    transition: { type: "spring" as const, damping: 30, stiffness: 350 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2 }
  })
};

interface MobileMenuNewProps {
  isOpen: boolean;
  onClose: () => void;
}

// Beliebte Städte
const POPULAR_CITIES = ['zuerich', 'bern', 'basel', 'genf', 'lausanne', 'luzern'];
const popularCitiesData = POPULAR_CITIES.map(slug => CITIES_MAP[slug]).filter(Boolean);

// Beliebte Kantone
const POPULAR_CANTONS = ['zuerich', 'bern', 'aargau', 'st-gallen', 'luzern', 'basel-stadt'];

export const MobileMenuNew = ({ isOpen, onClose }: MobileMenuNewProps) => {
  const location = useLocation();
  const navVariant = useNavigationVariant();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

  // Reset when menu opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setOpenAccordion(undefined);
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Search functionality for cities/cantons
  const searchResults = searchTerm.trim() ? {
    cantons: Object.values(CANTONS_MAP).filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 4),
    cities: Object.values(CITIES_MAP).filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 4),
  } : { cantons: [], cities: [] };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with blur */}
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Menu Panel with spring animation */}
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed inset-y-0 right-0 w-full max-w-sm",
              "bg-background z-50 lg:hidden",
              "flex flex-col",
              "shadow-2xl"
            )}
          >
            {/* Enhanced Header with gradient */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border bg-gradient-to-r from-background via-background to-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Menü</h2>
                  <p className="text-[10px] text-muted-foreground">🇨🇭 Schweizer Umzugsvergleich</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-12 w-12 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors touch-manipulation"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Trust Micro-Bar */}
            <div className="flex items-center justify-center gap-4 py-2.5 bg-muted/50 border-b border-border">
              {TRUST_SIGNALS.map((signal, i) => (
                <motion.div
                  key={signal.label}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-1.5"
                >
                  <signal.icon className={cn("w-4 h-4", signal.color)} />
                  <span className="text-xs font-semibold">{signal.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <Accordion 
                  type="single" 
                  collapsible 
                  value={openAccordion}
                  onValueChange={setOpenAccordion}
                  className="space-y-3"
                >
                  {/* 1. Preise berechnen - Enhanced */}
                  <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="umzug-planen" className="border-2 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                      <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent touch-manipulation">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                            <Calculator className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base block truncate">{navVariant.labels.preisrechner}</span>
                              <span className="text-xs bg-secondary/80 text-secondary-foreground px-2 py-0.5 rounded-full font-semibold">💰</span>
                            </div>
                            <span className="text-xs text-muted-foreground block truncate mt-0.5">{navVariant.microcopy.preisrechner}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-1">
                          <MobileMenuItem
                            to="/vergleich"
                            icon={Calculator}
                            title="Umzugskosten berechnen"
                            badge="🔥 Top"
                            emoji="💰"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/ratgeber/umzugscheckliste-download"
                            icon={CheckSquare}
                            title="Umzugscheckliste"
                            emoji="✅"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/ratgeber/zeitplan"
                            icon={Clock}
                            title="Zeitplan & Ablauf"
                            emoji="📅"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/ratgeber/tipps"
                            icon={Lightbulb}
                            title="Umzugstipps"
                            emoji="💡"
                            onClick={onClose}
                          />
                        </div>
                        <div className="mt-4 pt-3 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                            <FileDown className="w-3 h-3" /> Gratis Downloads
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Link 
                              to="/ratgeber/umzugscheckliste-download" 
                              onClick={onClose}
                              className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold hover:from-primary/20 hover:to-primary/10 transition-all touch-manipulation min-h-[40px] flex items-center"
                            >
                              📄 Checkliste PDF
                            </Link>
                            <Link 
                              to="/ratgeber/kuendigung" 
                              onClick={onClose}
                              className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold hover:from-primary/20 hover:to-primary/10 transition-all touch-manipulation min-h-[40px] flex items-center"
                            >
                              📝 Kündigungsvorlage
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 2. Firmen vergleichen - Enhanced */}
                  <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="umzugsfirma-finden" className="border-2 rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/20">
                      <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent touch-manipulation">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base block truncate">{navVariant.labels.firmen}</span>
                              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">📍</span>
                            </div>
                            <span className="text-xs text-muted-foreground block truncate mt-0.5">{navVariant.microcopy.firmen}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        {/* Enhanced Suchfeld */}
                        <div className="relative mb-4">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="🔍 Stadt oder Kanton suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary touch-manipulation"
                          />
                        </div>

                        {/* Suchergebnisse */}
                        {searchTerm.trim() && (searchResults.cantons.length > 0 || searchResults.cities.length > 0) && (
                          <div className="space-y-2 mb-4 p-4 bg-gradient-to-r from-accent to-transparent rounded-xl border">
                            {searchResults.cantons.map(canton => (
                              <Link
                                key={canton.slug}
                                to={`/umzugsfirmen/kanton-${canton.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-3 py-3 px-3 text-sm hover:text-primary transition-colors rounded-lg hover:bg-background touch-manipulation min-h-[48px]"
                              >
                                <MapPin className="w-5 h-5 text-emerald-500" />
                                <span className="font-medium">Kanton {canton.name}</span>
                              </Link>
                            ))}
                            {searchResults.cities.map(city => (
                              <Link
                                key={city.slug}
                                to={`/umzugsfirmen/${city.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-3 py-3 px-3 text-sm hover:text-primary transition-colors rounded-lg hover:bg-background touch-manipulation min-h-[48px]"
                              >
                                <Building2 className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium">{city.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Beliebte Städte */}
                        {!searchTerm.trim() && (
                          <>
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500" /> Beliebte Städte
                            </p>
                            <div className="space-y-1 mb-4">
                              {popularCitiesData.map(city => (
                                <MobileMenuItem
                                  key={city.slug}
                                  to={`/umzugsfirmen/${city.slug}`}
                                  icon={Building2}
                                  title={`Umzugsfirma ${city.name}`}
                                  emoji="🏢"
                                  onClick={onClose}
                                />
                              ))}
                            </div>

                            {/* Beliebte Kantone - Enhanced chips */}
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-500" /> Beliebte Kantone
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {POPULAR_CANTONS.map(slug => {
                                const canton = CANTONS_MAP[slug];
                                if (!canton) return null;
                                return (
                                  <Link
                                    key={slug}
                                    to={`/umzugsfirmen/kanton-${slug}`}
                                    onClick={onClose}
                                    className="text-sm px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent/50 text-foreground font-semibold hover:from-primary/10 hover:to-primary/5 hover:text-primary transition-all touch-manipulation min-h-[44px] flex items-center border border-border/50"
                                  >
                                    {canton.short}
                                  </Link>
                                );
                              })}
                            </div>

                            <Link
                              to="/regionen"
                              onClick={onClose}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline py-2 touch-manipulation"
                            >
                              Alle Kantone & Städte
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 3. Umzugs-Services - Enhanced */}
                  <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="services" className="border-2 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500/5 to-transparent border-purple-500/20">
                      <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent touch-manipulation">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base block truncate">{navVariant.labels.services}</span>
                              <span className="text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-semibold">📦</span>
                            </div>
                            <span className="text-xs text-muted-foreground block truncate mt-0.5">{navVariant.microcopy.services}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                          <Home className="w-3 h-3" /> Umzugsarten
                        </p>
                        <div className="space-y-1 mb-4">
                          <MobileMenuItem to="/dienstleistungen/privatumzug" icon={Home} title="Privatumzug" emoji="🏠" onClick={onClose} />
                          <MobileMenuItem to="/dienstleistungen/firmenumzug" icon={Building2} title="Geschäftsumzug" emoji="🏢" onClick={onClose} />
                          <MobileMenuItem to="/dienstleistungen/international" icon={Globe} title="Internationaler Umzug" emoji="🌍" onClick={onClose} />
                        </div>

                        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Zusatzservices
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <MobileMenuItemCompact to="/dienstleistungen/reinigung" icon={Sparkles} title="Endreinigung" emoji="✨" onClick={onClose} />
                          <MobileMenuItemCompact to="/moebelmontage" icon={Wrench} title="Möbelmontage" emoji="🔧" onClick={onClose} />
                          <MobileMenuItemCompact to="/dienstleistungen/einlagerung" icon={Package} title="Lagerung" emoji="📦" onClick={onClose} />
                          <MobileMenuItemCompact to="/dienstleistungen/entsorgung" icon={Trash2} title="Entsorgung" emoji="🗑️" onClick={onClose} />
                          <MobileMenuItemCompact to="/services/packservice" icon={Box} title="Umzugskartons" emoji="📋" onClick={onClose} />
                          <MobileMenuItemCompact to="/ratgeber/halteverbot" icon={ParkingCircle} title="Halteverbot" emoji="🅿️" onClick={onClose} />
                          <MobileMenuItemCompact to="/dienstleistungen/moebellift" icon={Truck} title="Möbellift" emoji="🏗️" onClick={onClose} />
                        </div>

                        <Link
                          to="/dienstleistungen"
                          onClick={onClose}
                          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline py-2 touch-manipulation"
                        >
                          Alle Services ansehen
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 4. Ratgeber - Enhanced */}
                  <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="ratgeber" className="border-2 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/20">
                      <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent touch-manipulation">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                            <Lightbulb className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base block truncate">{navVariant.labels.ratgeber}</span>
                              <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">📚</span>
                            </div>
                            <span className="text-xs text-muted-foreground block truncate mt-0.5">{navVariant.microcopy.ratgeber}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500" /> Top Ratgeber
                        </p>
                        <div className="space-y-1 mb-4">
                          <MobileMenuItem
                            to="/ratgeber/umzugscheckliste-download"
                            icon={CheckSquare}
                            title="Umzug Checkliste (PDF)"
                            badge="🔥 Top"
                            emoji="✅"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/ratgeber/wohnungsabgabe"
                            icon={Home}
                            title="Wohnungsübergabe"
                            emoji="🏠"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/ratgeber/kuendigung"
                            icon={FileText}
                            title="Kündigung & Ummeldung"
                            emoji="📝"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/ratgeber/kosten"
                            icon={DollarSign}
                            title="Spartipps"
                            emoji="💰"
                            onClick={onClose}
                          />
                        </div>

                        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" /> Weitere Themen
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <MobileMenuItemCompact to="/ratgeber/zeitplan" icon={Calendar} title="Zeitplan" emoji="📅" onClick={onClose} />
                          <MobileMenuItemCompact to="/ratgeber/halteverbot" icon={MapPin} title="Halteverbot" emoji="🅿️" onClick={onClose} />
                          <MobileMenuItemCompact to="/ratgeber/umzug-mit-kindern" icon={Baby} title="Mit Kindern" emoji="👶" onClick={onClose} />
                          <MobileMenuItemCompact to="/ratgeber/packtipps" icon={Box} title="Packtipps" emoji="📦" onClick={onClose} />
                        </div>

                        <Link
                          to="/ratgeber"
                          onClick={onClose}
                          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline py-2 touch-manipulation"
                        >
                          Alle Ratgeber lesen
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 5. Für Firmen - Enhanced */}
                  <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="fuer-firmen" className="border-2 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500/5 to-transparent border-blue-500/20">
                      <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent touch-manipulation">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base block truncate">{navVariant.labels.fuerFirmen}</span>
                              <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">💼</span>
                            </div>
                            <span className="text-xs text-muted-foreground block truncate mt-0.5">{navVariant.microcopy.fuerFirmen}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-1">
                          <MobileMenuItem
                            to="/anbieter"
                            icon={Briefcase}
                            title="Partner werden"
                            badge="🆕 Neu"
                            emoji="🤝"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/anbieter/preise"
                            icon={DollarSign}
                            title="Preise & Konditionen"
                            emoji="💰"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/anbieter/login"
                            icon={LogIn}
                            title="Anbieter Login"
                            emoji="🔐"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/anbieter/bewertungen"
                            icon={Star}
                            title="Bewertungssystem"
                            emoji="⭐"
                            onClick={onClose}
                          />
                          <MobileMenuItem
                            to="/anbieter/faq"
                            icon={HelpCircle}
                            title="Häufige Fragen"
                            emoji="❓"
                            onClick={onClose}
                          />
                        </div>

                        <div className="mt-4 pt-3 border-t border-border">
                          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">500+ Partner</p>
                              <p className="text-xs text-muted-foreground">schweizweit aktiv</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                </Accordion>
              </div>
            </ScrollArea>

            {/* Enhanced Footer CTA */}
            <div className="p-4 border-t-2 border-border bg-gradient-to-r from-background via-background to-secondary/5 safe-area-inset-bottom">
              {/* Mini trust bar */}
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-500" /> Gratis
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> In 2 Min
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" /> Swiss Made
                </span>
              </div>
              
              <Link to="/umzugsofferten" onClick={onClose}>
                <Button 
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80 text-secondary-foreground shadow-xl shadow-secondary/30 rounded-xl touch-manipulation"
                  size="lg"
                >
                  {navVariant.labels.cta}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Enhanced Helper Components with emoji support
interface MobileMenuItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
  emoji?: string;
  onClick: () => void;
}

const MobileMenuItem = ({ to, icon: Icon, title, badge, emoji, onClick }: MobileMenuItemProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-accent transition-all group touch-manipulation min-h-[52px]"
  >
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm font-semibold group-hover:text-primary transition-colors flex-1">{title}</span>
    {emoji && <span className="text-base">{emoji}</span>}
    {badge && (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-sm">
        {badge}
      </span>
    )}
  </Link>
);

interface MobileMenuItemCompactProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  emoji?: string;
  onClick: () => void;
}

const MobileMenuItemCompact = ({ to, icon: Icon, title, emoji, onClick }: MobileMenuItemCompactProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-accent transition-all group touch-manipulation min-h-[48px] border border-transparent hover:border-border"
  >
    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    <span className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{title}</span>
    {emoji && <span className="text-sm ml-auto">{emoji}</span>}
  </Link>
);

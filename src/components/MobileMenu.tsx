/**
 * Enhanced Mobile Menu
 * Warm, trustworthy & lively mobile navigation
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronRight, Home, Building2, Sparkles, Trash2, Wrench, Box,
  Calculator, Video, Package, Settings, Trophy, TrendingDown, MapPin,
  FileText, DollarSign, CheckSquare, Lightbulb, Briefcase, LogIn, Award, HelpCircle, BookOpen, X,
  Shield, Star, Heart, Users, ArrowRight, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Trust micro-signals
const TRUST_SIGNALS = [
  { icon: Shield, label: "Geprüft", color: "text-emerald-500" },
  { icon: Star, label: "4.8★", color: "text-amber-500" },
  { icon: Heart, label: "100% Gratis", color: "text-rose-500" },
];

const menuSections = [
  {
    id: "calculator",
    title: "Preise berechnen",
    subtitle: "In 60 Sek. Klarheit",
    icon: Calculator,
    color: "from-primary to-primary/70",
    items: [
      { icon: Calculator, title: "Umzugsrechner", description: "Kosten in 60 Sek.", href: "/umzugsofferten", featured: true },
      { icon: Sparkles, title: "Reinigungsrechner", description: "Endreinigung kalkulieren", href: "/umzugsofferten?service=reinigung" },
      { icon: Trash2, title: "Entsorgungsrechner", description: "Räumung berechnen", href: "/umzugsofferten?service=entsorgung" },
      { icon: Box, title: "Lagerrechner", description: "Storage-Kosten", href: "/umzugsofferten?service=lagerung" },
      { icon: Video, title: "Video-Umzugsrechner", description: "KI-Analyse per Video", href: "/umzugsofferten?mode=video", badge: "NEU" },
    ],
  },
  {
    id: "companies",
    title: "Firmen vergleichen",
    subtitle: "200+ geprüfte Partner",
    icon: Building2,
    color: "from-emerald-500 to-emerald-400",
    items: [
      { icon: Trophy, title: "Beste Umzugsfirmen 2025", description: "Top bewertete Partner", href: "/beste-umzugsfirma", featured: true },
      { icon: TrendingDown, title: "Günstige Umzugsfirmen", description: "Preis-Leistungs-Sieger", href: "/guenstige-umzugsfirma" },
      { icon: Building2, title: "Alle Umzugsfirmen", description: "Komplette Übersicht", href: "/umzugsfirmen-schweiz" },
    ],
  },
  {
    id: "services",
    title: "Umzugs-Services",
    subtitle: "Alles aus einer Hand",
    icon: Package,
    color: "from-blue-500 to-blue-400",
    items: [
      { icon: Home, title: "Privatumzug", description: "Komplett-Service", href: "/privatumzug", featured: true },
      { icon: Building2, title: "Firmenumzug", description: "Büro & Geschäft", href: "/firmenumzug" },
      { icon: Sparkles, title: "Umzug mit Reinigung", description: "Paket-Angebot", href: "/umzug-mit-reinigung" },
      { icon: Sparkles, title: "Reinigung", description: "Mit Abnahmegarantie", href: "/reinigung" },
      { icon: Trash2, title: "Entsorgung", description: "Räumung & Entrümpelung", href: "/entsorgung-raeumung" },
      { icon: Box, title: "Einlagerung", description: "Lagerboxen & Storage", href: "/einlagerung" },
    ],
  },
  {
    id: "regions",
    title: "Regionen",
    subtitle: "Firmen in deiner Nähe",
    icon: MapPin,
    color: "from-orange-500 to-orange-400",
    items: [
      { icon: MapPin, title: "Zürich", description: "Stadt & Kanton", href: "/zuerich" },
      { icon: MapPin, title: "Bern", description: "Stadt & Kanton", href: "/bern" },
      { icon: MapPin, title: "Basel", description: "Basel-Stadt & Land", href: "/basel" },
      { icon: MapPin, title: "Luzern", description: "Zentralschweiz", href: "/luzern" },
      { icon: MapPin, title: "Aargau", description: "Mittelland", href: "/aargau" },
      { icon: MapPin, title: "Alle Regionen", description: "Schweizweit", href: "/regionen" },
    ],
  },
  {
    id: "ratgeber",
    title: "Ratgeber",
    subtitle: "Tipps & Checklisten",
    icon: BookOpen,
    color: "from-violet-500 to-violet-400",
    items: [
      { icon: DollarSign, title: "Kosten & Preise", description: "Was kostet ein Umzug?", href: "/ratgeber/kosten", featured: true },
      { icon: CheckSquare, title: "Umzugscheckliste", description: "Schritt für Schritt", href: "/ratgeber/checklisten" },
      { icon: Lightbulb, title: "Umzugstipps", description: "Profi-Wissen", href: "/ratgeber/umzugstipps" },
      { icon: BookOpen, title: "Alle Ratgeber", description: "Komplette Bibliothek", href: "/ratgeber" },
    ],
  },
  {
    id: "provider",
    title: "Für Firmen",
    subtitle: "Partner werden",
    icon: Briefcase,
    color: "from-slate-600 to-slate-500",
    items: [
      { icon: Briefcase, title: "Anbieter werden", description: "Jetzt registrieren", href: "/anbieter", featured: true },
      { icon: LogIn, title: "Anbieter Login", description: "Zum Dashboard", href: "/anbieter/login" },
      { icon: DollarSign, title: "Preise", description: "Kosten & Konditionen", href: "/anbieter/preise" },
      { icon: HelpCircle, title: "FAQ", description: "Häufige Fragen", href: "/anbieter/faq" },
    ],
  },
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Reset active section when menu opens
  useEffect(() => {
    if (isOpen) {
      setActiveSection(null);
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const currentSection = menuSections.find(s => s.id === activeSection);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with warm blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed inset-y-0 right-0 w-full max-w-sm",
              "bg-gradient-to-b from-background via-background to-primary/[0.02]",
              "z-50 lg:hidden",
              "flex flex-col",
              "shadow-2xl"
            )}
          >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-emerald-500/60 to-secondary/60" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border/50 bg-background/95 backdrop-blur-md">
              <div className="flex items-center gap-3">
                {activeSection && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setActiveSection(null)}
                    className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </motion.button>
                )}
                <h2 className="font-bold text-lg">
                  {activeSection ? currentSection?.title : "Menü"}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 rounded-xl hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust signals bar */}
            {!activeSection && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-4 py-3 px-4 border-b border-border/30 bg-gradient-to-r from-primary/[0.03] via-transparent to-emerald-500/[0.03]"
              >
                {TRUST_SIGNALS.map((signal, i) => (
                  <div key={signal.label} className="flex items-center gap-1.5">
                    <signal.icon className={cn("w-3.5 h-3.5", signal.color)} />
                    <span className="text-xs font-semibold text-muted-foreground">{signal.label}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {!activeSection ? (
                    // Main Menu
                    <motion.div
                      key="main"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-2"
                    >
                      {menuSections.map((section, index) => (
                        <motion.button
                          key={section.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setActiveSection(section.id)}
                          className={cn(
                            "group flex items-center justify-between w-full p-4 rounded-2xl",
                            "bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/80 hover:to-muted/50",
                            "border border-transparent hover:border-primary/10",
                            "transition-all duration-200 ease-out",
                            "active:scale-[0.98] touch-manipulation",
                            "min-h-[72px]"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform group-hover:scale-105",
                              section.color
                            )}>
                              <section.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                              <span className="font-bold text-foreground block">{section.title}</span>
                              {section.subtitle && (
                                <span className="text-xs text-muted-foreground">{section.subtitle}</span>
                              )}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : (
                    // Sub Menu
                    <motion.div
                      key="sub"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-2"
                    >
                      {/* Section header */}
                      {currentSection?.subtitle && (
                        <div className="mb-4 pb-3 border-b border-border/50">
                          <p className="text-sm text-muted-foreground">{currentSection.subtitle}</p>
                        </div>
                      )}
                      
                      {currentSection?.items.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            onClick={onClose}
                            className={cn(
                              "group flex items-center gap-4 p-4 rounded-2xl",
                              "transition-all duration-200 ease-out",
                              "active:scale-[0.98] touch-manipulation",
                              "min-h-[64px]",
                              isActive(item.href)
                                ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                                : item.featured
                                  ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/30"
                                  : "bg-muted/30 hover:bg-muted/50"
                            )}
                          >
                            <div className={cn(
                              "w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm",
                              isActive(item.href) 
                                ? "bg-white/20" 
                                : item.featured
                                  ? "bg-gradient-to-br from-primary to-primary/80"
                                  : "bg-gradient-to-br from-muted to-muted/60 group-hover:from-primary/20 group-hover:to-primary/10"
                            )}>
                              <item.icon className={cn(
                                "w-5 h-5",
                                isActive(item.href) || item.featured ? "text-white" : "text-muted-foreground group-hover:text-primary"
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-bold text-sm",
                                  isActive(item.href) ? "text-primary-foreground" : item.featured ? "text-primary" : "text-foreground"
                                )}>
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <span className={cn(
                                  "text-xs",
                                  isActive(item.href) ? "text-primary-foreground/80" : "text-muted-foreground"
                                )}>
                                  {item.description}
                                </span>
                              )}
                            </div>
                            {/* Better visual indicator instead of confusing arrow */}
                            <div className={cn(
                              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all",
                              isActive(item.href) 
                                ? "bg-white/20 text-primary-foreground" 
                                : "bg-primary/10 text-primary"
                            )}>
                              <span>Öffnen</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer CTA */}
            <div className="p-4 border-t border-border/50 bg-background/95 backdrop-blur-md">
              {/* Mini trust row */}
              <div className="flex items-center justify-center gap-3 mb-3">
                {[
                  { icon: CheckCircle2, label: "Kostenlos" },
                  { icon: CheckCircle2, label: "Unverbindlich" },
                  { icon: Shield, label: "Datenschutz" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <item.icon className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/umzugsofferten" onClick={onClose}>
                <Button 
                  className="group w-full h-14 text-base font-bold bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:via-secondary hover:to-secondary text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Gratis Offerten erhalten
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

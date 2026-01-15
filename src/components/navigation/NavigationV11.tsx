/**
 * Navigation Variant #11: Simpel & Clean
 * 
 * 6 Hauptpunkte: Umzug, Umzugsreinigung, Weitere Services, Ratgeber, So funktioniert's + CTA
 * Mit verstärkten Trust Signals, Emotionen und menschlichem Touch
 * Animierte Submenus mit framer-motion
 */

import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, ArrowRight, Phone, Star, Shield, Clock, Users, CheckCircle2, Heart, Sparkles, MessageCircle, ThumbsUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { MobileMenuV11 } from "./MobileMenuV11";
import { motion, AnimatePresence } from "framer-motion";

type DropdownType = 'umzug' | 'reinigung' | 'services' | 'ratgeber' | 'wie-es-funktioniert' | null;

// Trust Stats for display - More human and emotional
const TRUST_STATS = {
  reviews: "4.8",
  reviewCount: "2'847",
  companies: "380+",
  savings: "40%",
  happyCustomers: "15'000+",
};

// Animation variants for dropdown
const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.15 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.2,
      staggerChildren: 0.03
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2 }
  }
};

export const NavigationV11 = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAllDropdowns = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(null);
  };

  const handleMouseEnter = (dropdown: DropdownType) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  // Simple nav button (no dropdown)
  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-accent",
        "text-sm xl:text-base whitespace-nowrap"
      )}
    >
      {children}
    </Link>
  );

  // Nav button with dropdown
  const NavButton = ({ dropdown, children }: { dropdown: DropdownType; children: React.ReactNode }) => (
    <button
      onMouseEnter={() => handleMouseEnter(dropdown)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group flex items-center gap-1 px-3 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-accent",
        "text-sm xl:text-base whitespace-nowrap",
        activeDropdown === dropdown && "text-primary bg-accent"
      )}
    >
      {children}
      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", activeDropdown === dropdown && "rotate-180")} />
    </button>
  );

  return (
    <header className="sticky top-0 z-50">
      {/* Emotional Trust Banner - Show on scroll or always */}
      <div className="hidden lg:block bg-gradient-to-r from-primary/5 via-accent to-primary/5 border-b border-border/50 py-1.5">
        <div className="container mx-auto px-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span><strong className="text-foreground">{TRUST_STATS.happyCustomers}</strong> zufriedene Kunden</span>
          </div>
          <div className="hidden xl:flex items-center gap-2 text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span><strong className="text-foreground">{TRUST_STATS.reviews}/5</strong> Sterne</span>
          </div>
          <div className="hidden xl:flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>100% <strong className="text-foreground">geprüfte Partner</strong></span>
          </div>
          <a href="tel:+41445001234" className="flex items-center gap-2 text-primary font-medium hover:underline">
            <Phone className="w-4 h-4" />
            <span>Gratis Beratung</span>
          </a>
        </div>
      </div>

      <nav className={cn(
        "bg-background/95 backdrop-blur-md border-b border-border transition-shadow duration-300",
        scrolled ? "shadow-lg" : "shadow-soft"
      )}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center h-14 sm:h-16 lg:h-20 gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <div className="group flex flex-col items-start hover:scale-105 transition-transform">
                <Logo size="xl" className="hidden xl:flex" />
                <Logo size="lg" className="hidden lg:flex xl:hidden" />
                <Logo size="sm" iconOnly className="flex lg:hidden" />
                <span className="hidden lg:block text-[9px] xl:text-xs text-muted-foreground/80 font-medium mt-0.5">
                  Der Schweizer Umzugsvergleich
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - #11 Structure */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Umzug - Direct link (most important) */}
              <NavLink to="/dienstleistungen/privatumzug">Umzug</NavLink>
              
              {/* Umzugsreinigung - Direct link */}
              <NavLink to="/dienstleistungen/reinigung">Umzugsreinigung</NavLink>
              
              {/* Weitere Services - Dropdown */}
              <NavButton dropdown="services">Weitere Services</NavButton>
              
              {/* Ratgeber - Dropdown */}
              <NavButton dropdown="ratgeber">Ratgeber</NavButton>
              
              {/* So funktioniert's - Direct link */}
              <NavLink to="/so-funktionierts">So funktioniert's</NavLink>
            </nav>

            {/* Spacer */}
            <div className="hidden lg:flex flex-1" />

            {/* Animated Social Proof Badge (Desktop) */}
            <div className="hidden xl:flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-accent to-accent/50 border border-border">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold">{TRUST_STATS.reviews}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">S</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">T</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">L</div>
                </div>
                <span className="text-xs text-muted-foreground">{TRUST_STATS.reviewCount} Bewertungen</span>
              </div>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              <a 
                href="tel:+41445001234" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Beratung</span>
              </a>
              <Button asChild size="default" className="font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25">
                <Link to="/umzugsofferten">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Jetzt Offerten vergleichen
                </Link>
              </Button>
            </div>

            {/* Mobile: Menu + CTA */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              <Button asChild size="sm" className="font-semibold shadow-lg shadow-primary/25">
                <Link to="/umzugsofferten">
                  <Heart className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Offerten
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="h-10 w-10"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Animated Dropdowns */}
        <AnimatePresence mode="wait">
          {activeDropdown === 'services' && (
            <ServicesDropdownV11 
              isOpen={true} 
              onClose={closeAllDropdowns}
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            />
          )}
          {activeDropdown === 'ratgeber' && (
            <RatgeberDropdownV11 
              isOpen={true} 
              onClose={closeAllDropdowns}
              onMouseEnter={() => handleMouseEnter('ratgeber')}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <MobileMenuV11 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

// Enhanced Services Dropdown with animation and emotion
const ServicesDropdownV11 = ({ 
  isOpen, 
  onClose, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  if (!isOpen) return null;
  
  const services = [
    { title: "Entsorgung & Räumung", description: "Umweltgerechte Entsorgung deines Hausrats", href: "/dienstleistungen/entsorgung", emoji: "♻️", color: "from-emerald-500/20 to-emerald-500/5" },
    { title: "Lagerung", description: "Temporäre Einlagerung von Möbeln", href: "/dienstleistungen/einlagerung", emoji: "📦", color: "from-blue-500/20 to-blue-500/5" },
    { title: "Möbelmontage", description: "Ab- und Aufbau-Service für Möbel", href: "/moebelmontage", emoji: "🔧", color: "from-orange-500/20 to-orange-500/5" },
    { title: "Firmenumzug", description: "Professionelle Büro- & Geschäftsumzüge", href: "/dienstleistungen/firmenumzug", emoji: "🏢", color: "from-purple-500/20 to-purple-500/5" },
    { title: "Möbellift", description: "Aussenaufzug für schwere Möbel", href: "/dienstleistungen/moebellift", emoji: "🏗️", color: "from-amber-500/20 to-amber-500/5" },
    { title: "Packservice", description: "Professionelles Ein- und Auspacken", href: "/services/packservice", emoji: "📋", color: "from-rose-500/20 to-rose-500/5" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropdownVariants}
      className="absolute left-0 right-0 bg-background/98 backdrop-blur-sm border-b border-border shadow-2xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Services List with staggered animation */}
          <div>
            <motion.h3 
              variants={itemVariants}
              className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              Weitere Services
              <span className="text-[10px] font-normal normal-case text-primary/80 ml-2">— Alles für deinen Umzug</span>
            </motion.h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.href}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link
                    to={service.href}
                    onClick={onClose}
                    className={cn(
                      "group p-4 rounded-xl transition-all duration-300 border border-transparent",
                      "hover:border-border hover:shadow-lg hover:scale-[1.02]",
                      `bg-gradient-to-br ${service.color} hover:from-accent hover:to-accent/50`
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{service.emoji}</span>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {service.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div variants={itemVariants}>
              <Link
                to="/dienstleistungen"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary hover:underline group"
              >
                Alle Services anzeigen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* CTA Card with Human Touch */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent rounded-2xl p-6 border border-primary/20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent rounded-full blur-xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <span className="font-bold text-lg">Rundum sorglos!</span>
                  <p className="text-xs text-muted-foreground">Komplettpaket möglich</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Umzug + Übergabe + Reinigung aus einer Hand. 
                <span className="text-foreground font-medium"> Wir kümmern uns um alles.</span>
              </p>
              
              {/* Trust Signals with more color */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 font-medium border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Geprüfte Partner
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-blue-500/15 text-blue-700 font-medium border border-blue-500/20">
                  <Clock className="w-3.5 h-3.5" /> 24h Antwort
                </span>
              </div>

              {/* Mini Testimonial */}
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 mb-4 border border-border">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs italic text-muted-foreground">"Super schnell und unkompliziert!"</p>
                    <p className="text-xs font-medium mt-1">— Sarah M., Zürich</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild className="w-full shadow-lg shadow-primary/25">
                  <Link to="/umzugsofferten" onClick={onClose}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gratis Offerten
                  </Link>
                </Button>
                <a 
                  href="tel:+41445001234"
                  className="w-full text-center py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Persönliche Beratung
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Ratgeber Dropdown with animation and emotion
const RatgeberDropdownV11 = ({ 
  isOpen, 
  onClose,
  onMouseEnter,
  onMouseLeave
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  if (!isOpen) return null;
  
  const guides = [
    { title: "Umzugs-Checkliste (PDF)", description: "Alle To-dos zum Download", href: "/ratgeber/umzugscheckliste-download", featured: true, emoji: "📋", color: "from-primary/20 to-primary/5" },
    { title: "Tipps & Tricks", description: "Spartipps, Packhilfen & mehr", href: "/ratgeber/tipps", emoji: "💡", color: "from-yellow-500/20 to-yellow-500/5" },
    { title: "Kosten & Preise", description: "Was kostet ein Umzug wirklich?", href: "/ratgeber/kosten", emoji: "💰", color: "from-emerald-500/20 to-emerald-500/5" },
    { title: "Wohnungsübergabe", description: "Protokoll & Abnahme-Tipps", href: "/ratgeber/wohnungsabgabe", emoji: "🔑", color: "from-purple-500/20 to-purple-500/5" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropdownVariants}
      className="absolute left-0 right-0 bg-background/98 backdrop-blur-sm border-b border-border shadow-2xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Guides List with animation */}
          <div>
            <motion.h3 
              variants={itemVariants}
              className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              Ratgeber & Tipps
              <span className="text-[10px] font-normal normal-case text-rose-500/80 ml-2">— Von Profis für dich</span>
            </motion.h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {guides.map((guide, index) => (
                <motion.div
                  key={guide.href}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link
                    to={guide.href}
                    onClick={onClose}
                    className={cn(
                      "group p-4 rounded-xl transition-all duration-300 border",
                      "hover:shadow-lg hover:scale-[1.02]",
                      guide.featured 
                        ? `bg-gradient-to-br ${guide.color} border-primary/20 hover:border-primary/40` 
                        : `bg-gradient-to-br ${guide.color} border-transparent hover:border-border`
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{guide.emoji}</span>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {guide.title}
                      </p>
                      {guide.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold animate-pulse">
                          TOP
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 ml-9">
                      {guide.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div variants={itemVariants}>
              <Link
                to="/ratgeber"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary hover:underline group"
              >
                Alle Ratgeber
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* CTA Card with Social Proof */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-accent via-accent/80 to-background rounded-2xl p-6 border border-border relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <ThumbsUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg">Schnellstart!</span>
                  <p className="text-xs text-muted-foreground">In 5 Minuten startklar</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Keine Lust auf lange Recherche? 
                <span className="text-foreground font-medium"> Starte direkt mit Offerten.</span>
              </p>
              
              {/* Stats with more visual appeal */}
              <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">40%</p>
                  <p className="text-xs text-muted-foreground">Ersparnis</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">380+</p>
                  <p className="text-xs text-muted-foreground">Firmen</p>
                </div>
              </div>

              {/* Happy customers indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background flex items-center justify-center text-xs text-white font-bold">S</div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-2 border-background flex items-center justify-center text-xs text-white font-bold">T</div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-background flex items-center justify-center text-xs text-white font-bold">L</div>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">15'000+</span> zufriedene Kunden
                </p>
              </div>

              <Button asChild variant="outline" className="w-full border-primary/30 hover:bg-primary/5 group">
                <Link to="/ratgeber/umzugscheckliste-download" onClick={onClose}>
                  📋 Checkliste herunterladen
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavigationV11;

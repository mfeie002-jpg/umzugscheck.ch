import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Building2, Sparkles, MapPin, FileText, Users, Truck, Trash2, Package, Sofa, Home, Briefcase, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Removed redundant "Preisrechner" - CTA button serves this purpose
const navLinks = [
  { 
    label: "Umzugsfirmen", 
    href: "/umzugsfirmen",
    icon: Building2,
    dropdown: [
      { label: "Alle Umzugsfirmen", href: "/umzugsfirmen", icon: Building2 },
      { label: "Beste Umzugsfirmen", href: "/beste-umzugsfirma", icon: Sparkles },
      { label: "Günstige Umzugsfirmen", href: "/guenstige-umzugsfirma", icon: Package },
    ]
  },
  { 
    label: "Services", 
    href: "/dienstleistungen",
    icon: Package,
    dropdown: [
      { label: "Privatumzug", href: "/privatumzug", icon: Home },
      { label: "Firmenumzug", href: "/firmenumzug", icon: Briefcase },
      { label: "Reinigung", href: "/reinigung", icon: Sparkles },
      { label: "Entsorgung & Räumung", href: "/entsorgung", icon: Trash2 },
      { label: "Möbelmontage", href: "/moebelmontage", icon: Sofa },
      { label: "Einlagerung", href: "/lagerung", icon: Package },
      { label: "Internationale Umzüge", href: "/international", icon: Globe },
    ]
  },
  { 
    label: "Regionen", 
    href: "/regionen",
    icon: MapPin,
    dropdown: [
      { label: "Zürich", href: "/zuerich", icon: MapPin },
      { label: "Bern", href: "/bern", icon: MapPin },
      { label: "Basel", href: "/basel", icon: MapPin },
      { label: "Luzern", href: "/luzern", icon: MapPin },
      { label: "Aargau", href: "/aargau", icon: MapPin },
      { label: "Alle Regionen", href: "/regionen", icon: MapPin },
    ]
  },
  { 
    label: "Ratgeber", 
    href: "/ratgeber",
    icon: FileText,
    dropdown: [
      { label: "Umzug Checkliste", href: "/ratgeber/checkliste", icon: FileText },
      { label: "Umzugskosten", href: "/ratgeber/kosten", icon: Truck },
      { label: "Tipps & Tricks", href: "/ratgeber/tipps", icon: Sparkles },
    ]
  },
  { 
    label: "Für Firmen", 
    href: "/fuer-firmen",
    icon: Users,
    dropdown: [
      { label: "Anbieter werden", href: "/fuer-firmen", icon: Users },
      { label: "Partner Login", href: "/login", icon: Building2 },
    ]
  },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Improved dropdown handling with delay (#5)
  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // Increased delay from 0 to 200ms
  };

  return (
    <>
      {/* Trust Bar - above header */}
      <div className="bg-primary text-primary-foreground py-1 px-4 hidden sm:block">
        <div className="container flex items-center justify-center gap-6 text-xs">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="font-medium">SSL Verschlüsselt</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="font-medium">4.8/5 Bewertung</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span className="font-medium">Offerten in 24h</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className="font-medium">200+ Partner</span>
          </span>
        </div>
      </div>
      
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-card/98 backdrop-blur-lg border-b border-border shadow-lg"
          : "bg-card/95 backdrop-blur-sm border-b border-transparent"
      )}>
        <div className="container px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[72px]">
          {/* Animated Logo */}
          <Link to="/" className="flex flex-col group">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.div 
                className="relative w-8 h-8 sm:w-10 sm:h-10 bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center shadow-cta overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated Check */}
                <motion.svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="text-white relative z-10 w-5 h-5 sm:w-6 sm:h-6"
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </motion.svg>
                {/* Moving Box Animation */}
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-sm"
                  animate={{ 
                    y: [0, -2, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <div className="flex items-center">
                <span className="text-lg sm:text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">Umzugs</span>
                <span className="text-lg sm:text-xl font-bold text-secondary group-hover:text-secondary/80 transition-colors">check</span>
                <span className="text-lg sm:text-xl font-bold text-muted-foreground">.ch</span>
              </div>
            </div>
            <span className="hidden sm:block text-[10px] text-muted-foreground/70 font-medium pl-11 -mt-0.5">
              Der Schweizer Umzugsvergleich
            </span>
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div 
                key={link.href}
                className="relative"
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={link.href}
                  className={cn(
                    "group flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                    activeDropdown === link.label
                      ? "text-foreground bg-muted/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      activeDropdown === link.label && "rotate-180"
                    )} />
                  )}
                </Link>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-card rounded-xl border border-border shadow-premium p-2 z-50"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-secondary" />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop CTA - Enhanced visual hierarchy (#2) */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.5)] transition-all"
            >
              <Link to="/umzugsofferten">
                Kostenlos Offerten erhalten
              </Link>
            </Button>
          </div>

          {/* Mobile: Single CTA + Menu (#4 - simplified) */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu öffnen"
              className="h-10 w-10 active:scale-95 transition-transform"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Accordions */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background overflow-hidden absolute top-full left-0 right-0 z-50 shadow-xl"
          >
            <nav className="container px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto bg-background">
              {navLinks.map((link) => (
                <div key={link.href} className="bg-background">
                  <button
                    className="flex items-center justify-between w-full px-3 py-3.5 text-sm font-medium text-foreground hover:text-primary active:bg-muted rounded-lg transition-colors bg-background"
                    onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                  >
                    <span className="flex items-center gap-2">
                      <link.icon className="w-4 h-4 text-secondary" />
                      {link.label}
                    </span>
                    {link.dropdown && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        activeDropdown === link.label && "rotate-180"
                      )} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {link.dropdown && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-0.5 overflow-hidden bg-muted/30 rounded-lg mx-2 mb-2"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground hover:text-foreground active:bg-muted rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4 text-secondary" />
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  );
};

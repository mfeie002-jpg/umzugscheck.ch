import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown, Shield, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { usePaidModeContext } from "@/contexts/PaidModeContext";
import { CONTACT_PHONE_E164, CONTACT_PHONE_DISPLAY } from "@/config/contact";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const paidMode = usePaidModeContext();
  const isPaidTraffic = paidMode?.isPaidTraffic ?? false;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSubmenuOpen(null);
  }, [location]);

  const services = [
    { name: "Privatumzüge", href: "/plan/private", description: "Für Familien und Einzelpersonen" },
    { name: "Büroumzüge", href: "/plan/bueroumzug", description: "Minimale Ausfallzeit" },
    { name: "Seniorenumzüge", href: "/plan/seniorenumzug", description: "Mit extra Fürsorge" },
    { name: "VIP Service", href: "/plan/vip-umzug", description: "Premium Rundum-Service" },
    { name: "Internationale Umzüge", href: "/plan/international", description: "Weltweit zuverlässig" },
  ];

  const extras = [
    { name: "Verpackungsservice", href: "/plan/verpackungsservice", description: "Professionelles Einpacken" },
    { name: "Möbelmontage", href: "/plan/montage", description: "Auf- & Abbau" },
    { name: "Möbellift", href: "/plan/moebellift", description: "Schwere Möbel sicher heben" },
    { name: "Einlagerung", href: "/plan/einlagerung", description: "Sichere Zwischenlagerung" },
    { name: "Reinigung", href: "/plan/reinigung", description: "Übergabereinigung" },
    { name: "Entsorgung", href: "/plan/entsorgung", description: "Entrümpelung & Recycling" },
    { name: "Klaviertransport", href: "/plan/klaviertransport", description: "Spezialservice für Instrumente" },
  ];

  const about = [
    { name: "Über uns", href: "/about", description: "Unsere Geschichte" },
    { name: "Unser Team", href: "/team", description: "Die Menschen dahinter" },
    { name: "Referenzen", href: "/references", description: "Zufriedene Kunden" },
    { name: "Fallstudien", href: "/case-studies", description: "Erfolgsgeschichten" },
    { name: "FAQ", href: "/concierge/faq", description: "Häufige Fragen" },
  ];

  if (isPaidTraffic) {
    return (
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/98 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-background/95 backdrop-blur-sm"
      )}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex-shrink-0 group">
              <Logo variant="badge" size="md" showIcon className="group-hover:opacity-90 transition-opacity" />
            </Link>
            <a href={`tel:${CONTACT_PHONE_E164}`} className="flex items-center gap-2">
              <Button size="sm" className="bg-gradient-brand text-primary-foreground shadow-soft min-h-[48px]">
                <Phone className="h-4 w-4" />
                Jetzt anrufen
              </Button>
            </a>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-background/98 backdrop-blur-md border-b border-border shadow-soft" 
        : "bg-background/95 backdrop-blur-sm"
    )}>
      {/* Top Bar - Unified brand gradient */}
      <div className="hidden lg:block bg-gradient-brand text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 fill-current" />
                <span className="font-medium">Familienunternehmen seit 1980</span>
              </span>
              <span className="hidden xl:flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>Vollversichert & zuverlässig</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>5.0 Google Bewertung</span>
              </span>
              <span className="opacity-50">|</span>
              <a href={`tel:${CONTACT_PHONE_E164}`} className="font-semibold hover:underline flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          {/* Logo - Using unified Logo component with icon */}
          <Link to="/" className="flex-shrink-0 group">
            <Logo variant="badge" size="md" showIcon className="group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                    Leistungen
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[450px] gap-1 p-4">
                      {services.map((service) => (
                        <li key={service.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={service.href}
                              className="block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-muted group"
                            >
                              <div className="text-sm font-semibold leading-none mb-1 group-hover:text-alpine transition-colors">{service.name}</div>
                              <p className="text-xs text-muted-foreground">{service.description}</p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="border-t border-border mt-2 pt-2">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/services"
                            className="block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-alpine hover:text-alpine-foreground font-medium text-sm text-alpine"
                          >
                            Alle Leistungen ansehen →
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                    Zusatzleistungen
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-1 p-4">
                      {extras.map((extra) => (
                        <li key={extra.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={extra.href}
                              className="block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-muted group"
                            >
                              <div className="text-sm font-semibold leading-none mb-1 group-hover:text-alpine transition-colors">{extra.name}</div>
                              <p className="text-xs text-muted-foreground">{extra.description}</p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                    Über uns
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-1 p-4">
                      {about.map((item) => (
                        <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-muted group"
                            >
                              <div className="text-sm font-semibold leading-none mb-1 group-hover:text-alpine transition-colors">{item.name}</div>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact" className="px-4 py-2 text-sm font-medium text-foreground hover:text-alpine transition-colors">
                    Kontakt
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-border">
              <ThemeToggle />
              
              <a href={`tel:${CONTACT_PHONE_E164}`} className="flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">Jetzt anrufen</span>
              </a>

              <Link to="/contact">
                <Button size="sm" className="bg-gradient-brand text-primary-foreground hover:opacity-90 shadow-soft">
                  Offerte anfragen
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <a href={`tel:${CONTACT_PHONE_E164}`} className="p-3 rounded-lg bg-alpine/10 text-alpine min-w-[48px] min-h-[48px] flex items-center justify-center touch-manipulation">
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-3 text-foreground hover:bg-muted transition-colors min-w-[48px] min-h-[48px] touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 animate-fade-in max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border">
            {/* Family badge mobile - unified gradient */}
            <div className="px-3 py-3 mb-2 bg-gradient-brand rounded-lg text-primary-foreground text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-current" />
                <span className="font-medium">Familie Feierabend · Seit 1980</span>
              </div>
            </div>


            <div>
              <button
                className="flex items-center justify-between w-full px-4 py-4 text-base font-medium text-foreground hover:text-alpine hover:bg-muted rounded-lg transition-colors min-h-[52px] touch-manipulation"
                onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === "services" ? null : "services")}
              >
                Leistungen
                <ChevronDown className={cn("h-5 w-5 transition-transform", mobileSubmenuOpen === "services" && "rotate-180")} />
              </button>
              {mobileSubmenuOpen === "services" && (
                <div className="pl-4 mt-1 space-y-1 bg-muted/50 rounded-lg py-2">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:text-alpine transition-colors min-h-[44px] touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    className="flex items-center px-4 py-3 text-sm font-medium text-alpine min-h-[44px] touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Alle Leistungen →
                  </Link>
                </div>
              )}
            </div>

            {/* Extras submenu */}
            <div>
              <button
                className="flex items-center justify-between w-full px-4 py-4 text-base font-medium text-foreground hover:text-alpine hover:bg-muted rounded-lg transition-colors min-h-[52px] touch-manipulation"
                onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === "extras" ? null : "extras")}
              >
                Zusatzleistungen
                <ChevronDown className={cn("h-5 w-5 transition-transform", mobileSubmenuOpen === "extras" && "rotate-180")} />
              </button>
              {mobileSubmenuOpen === "extras" && (
                <div className="pl-4 mt-1 space-y-1 bg-muted/50 rounded-lg py-2">
                  {extras.map((extra) => (
                    <Link
                      key={extra.name}
                      to={extra.href}
                      className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:text-alpine transition-colors min-h-[44px] touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {extra.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About submenu */}
            <div>
              <button
                className="flex items-center justify-between w-full px-4 py-4 text-base font-medium text-foreground hover:text-alpine hover:bg-muted rounded-lg transition-colors min-h-[52px] touch-manipulation"
                onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === "about" ? null : "about")}
              >
                Über uns
                <ChevronDown className={cn("h-5 w-5 transition-transform", mobileSubmenuOpen === "about" && "rotate-180")} />
              </button>
              {mobileSubmenuOpen === "about" && (
                <div className="pl-4 mt-1 space-y-1 bg-muted/50 rounded-lg py-2">
                  {about.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:text-alpine transition-colors min-h-[44px] touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className="flex items-center px-4 py-4 text-base font-medium text-foreground hover:text-alpine hover:bg-muted rounded-lg transition-colors min-h-[52px] touch-manipulation"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kontakt
            </Link>

            <div className="pt-4 space-y-3">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-brand text-primary-foreground min-h-[48px]">
                  Kostenlose Offerte anfragen
                </Button>
              </Link>
              <a href={`tel:${CONTACT_PHONE_E164}`} className="block">
                <Button variant="outline" className="w-full border-2 min-h-[48px]">
                  <Phone className="mr-2 h-4 w-4" />
                  Jetzt anrufen
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

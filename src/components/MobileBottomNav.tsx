import { Link, useLocation } from "react-router-dom";
import { Calculator, Building2, FileText, Home, Menu, Star, Shield, Clock, CheckCircle2, Phone, ArrowRight, Sparkles, Trash2, Box, Wrench, Truck, BookOpen, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Trust Stats
const TRUST_STATS = {
  reviews: "4.8",
  reviewCount: "2'847",
  companies: "380+",
  savings: "40%",
};

// Optimized 5-icon bottom nav based on #11 (Simpel & Clean)
// Center = Offerten (Primary CTA, thumb zone)
const navItems = [
  { href: "/", label: "Start", icon: Home, isCenter: false },
  { href: "/umzugsrechner", label: "Kosten", icon: Calculator, isCenter: false },
  { href: "/umzugsofferten", label: "Offerten", icon: FileText, isCenter: true }, // Center = Primary CTA
  { href: "/umzugsfirmen", label: "Firmen", icon: Building2, isCenter: false },
  { href: "menu", label: "Mehr", icon: Menu, isCenter: false }, // Opens sheet
];

// Structured menu categories with icons
const menuCategories = [
  {
    title: "Services",
    items: [
      { href: "/dienstleistungen/reinigung", label: "Umzugsreinigung", icon: Sparkles },
      { href: "/dienstleistungen/entsorgung", label: "Entsorgung & Räumung", icon: Trash2 },
      { href: "/dienstleistungen/einlagerung", label: "Lagerung", icon: Box },
      { href: "/moebelmontage", label: "Möbelmontage", icon: Wrench },
      { href: "/dienstleistungen/firmenumzug", label: "Firmenumzug", icon: Building2 },
      { href: "/dienstleistungen/moebellift", label: "Möbellift", icon: Truck },
    ]
  },
  {
    title: "Firmen finden",
    items: [
      { href: "/beste-umzugsfirma", label: "Beste Umzugsfirmen", icon: Star },
      { href: "/guenstige-umzugsfirma", label: "Günstigste Firmen", icon: Calculator },
      { href: "/regionen", label: "Nach Region", icon: Building2 },
    ]
  },
  {
    title: "Ratgeber",
    items: [
      { href: "/ratgeber/umzugscheckliste-download", label: "Checkliste (PDF)", icon: FileText },
      { href: "/ratgeber", label: "Alle Tipps", icon: BookOpen },
      { href: "/so-funktionierts", label: "So funktioniert's", icon: HelpCircle },
    ]
  }
];

// Paths where we hide the mobile bottom navigation to avoid overlap with funnels
const HIDDEN_PATHS = [
  '/umzugsofferten',
  '/chatgpt-flow',
  '/umzugsrechner',
  '/god-mode',
  '/flow-tester',
  '/intern-testing',
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { lightTap } = useHapticFeedback();
  const [moreOpen, setMoreOpen] = useState(false);

  // Hide on funnel pages or when not mobile
  const shouldHide = !isMobile || HIDDEN_PATHS.some(path => location.pathname.startsWith(path));
  if (shouldHide) return null;

  return (
    <nav className="site-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg pb-safe" aria-label="Mobile Navigation">
      <div className="flex items-center justify-around h-14 min-h-[56px]">
        {navItems.map((item) => {
          const isMenu = item.href === "menu";
          const isActive = !isMenu && (
            location.pathname === item.href || 
            (item.href !== "/" && location.pathname.startsWith(item.href))
          );
          
          // Center item (Offerten) - prominent styling with highlight animation
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => lightTap()}
                className="relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] py-1 transition-all duration-200 touch-manipulation"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  {/* Pulsing glow effect behind the button */}
                  <motion.div
                    className="absolute -mt-4 w-14 h-14 rounded-full bg-primary/40"
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  {/* Prominent center button */}
                  <motion.div 
                    className="relative -mt-4 flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/40"
                    animate={{
                      boxShadow: [
                        "0 10px 15px -3px hsl(var(--primary) / 0.4), 0 4px 6px -4px hsl(var(--primary) / 0.4)",
                        "0 10px 25px -3px hsl(var(--primary) / 0.6), 0 4px 10px -4px hsl(var(--primary) / 0.5)",
                        "0 10px 15px -3px hsl(var(--primary) / 0.4), 0 4px 6px -4px hsl(var(--primary) / 0.4)",
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                  <span className="text-[10px] font-bold text-primary leading-none whitespace-nowrap -mt-1">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          }
          
          // "Mehr" menu opens sheet
          if (isMenu) {
            return (
              <Sheet key="more-menu" open={moreOpen} onOpenChange={setMoreOpen}>
                <SheetTrigger asChild>
                  <button
                    onClick={() => lightTap()}
                    className={cn(
                      "relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] py-1.5 transition-all duration-200 touch-manipulation",
                      moreOpen 
                        ? "text-primary" 
                        : "text-muted-foreground active:scale-90 active:opacity-70"
                    )}
                  >
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium leading-none whitespace-nowrap">
                        {item.label}
                      </span>
                    </motion.div>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-2xl pb-safe">
                  <SheetHeader className="pb-3 border-b border-border">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-left">Mehr entdecken</SheetTitle>
                      {/* Trust Badge */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/50">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-semibold">{TRUST_STATS.reviews}</span>
                      </div>
                    </div>
                  </SheetHeader>

                  {/* Trust Pills */}
                  <div className="flex flex-wrap gap-1.5 py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-700 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Kostenlos
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-700 font-medium">
                      <Clock className="w-3 h-3" /> 2 Min
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-purple-500/10 text-purple-700 font-medium">
                      <Shield className="w-3 h-3" /> Geprüft
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 font-medium">
                      Bis {TRUST_STATS.savings} sparen
                    </span>
                  </div>

                  {/* Categorized Menu */}
                  <div className="space-y-4 pb-4 max-h-[40vh] overflow-y-auto">
                    {menuCategories.map((category) => (
                      <div key={category.title}>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                          {category.title}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {category.items.map((menuItem) => (
                            <Link
                              key={menuItem.href}
                              to={menuItem.href}
                              onClick={() => {
                                lightTap();
                                setMoreOpen(false);
                              }}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors",
                                location.pathname === menuItem.href
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "bg-muted/50 hover:bg-muted text-foreground"
                              )}
                            >
                              <menuItem.icon className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm truncate">{menuItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick CTAs at bottom */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button asChild className="flex-1">
                      <Link
                        to="/umzugsofferten"
                        onClick={() => {
                          lightTap();
                          setMoreOpen(false);
                        }}
                      >
                        Gratis Offerten
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-shrink-0">
                      <a href="tel:+41445001234" onClick={() => lightTap()}>
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-around text-center mt-3 pt-3 border-t">
                    <div>
                      <p className="text-sm font-bold text-primary">{TRUST_STATS.companies}</p>
                      <p className="text-[10px] text-muted-foreground">Firmen</p>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <div>
                      <p className="text-sm font-bold text-primary">{TRUST_STATS.reviewCount}</p>
                      <p className="text-[10px] text-muted-foreground">Bewertungen</p>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <div>
                      <p className="text-sm font-bold text-primary">24h</p>
                      <p className="text-[10px] text-muted-foreground">Antwort</p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            );
          }
          
          // Regular nav items
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => lightTap()}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] py-1.5 transition-all duration-200 touch-manipulation",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground active:scale-90 active:opacity-70"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-[1px] w-10 h-[3px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex flex-col items-center gap-0.5"
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-105"
                )} />
                <span className={cn(
                  "text-[10px] font-medium transition-colors leading-none whitespace-nowrap",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

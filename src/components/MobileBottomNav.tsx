import { Link, useLocation } from "react-router-dom";
import { Calculator, Building2, FileText, Home, Menu } from "lucide-react";
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

// Optimized 5-icon bottom nav based on #11 (Simpel & Clean)
// Center = Offerten (Primary CTA, thumb zone)
const navItems = [
  { href: "/", label: "Start", icon: Home, isCenter: false },
  { href: "/umzugsrechner", label: "Kosten", icon: Calculator, isCenter: false },
  { href: "/umzugsofferten", label: "Offerten", icon: FileText, isCenter: true }, // Center = Primary CTA
  { href: "/umzugsfirmen", label: "Firmen", icon: Building2, isCenter: false },
  { href: "menu", label: "Mehr", icon: Menu, isCenter: false }, // Opens sheet
];

// "Mehr" menu items - everything else
const moreMenuItems = [
  { href: "/beste-umzugsfirma", label: "Beste Umzugsfirmen" },
  { href: "/guenstige-umzugsfirma", label: "Günstigste Umzugsfirmen" },
  { href: "/firmenumzug", label: "Firmenumzug" },
  { href: "/umzugsreinigung", label: "Umzugsreinigung" },
  { href: "/entsorgung", label: "Entsorgung & Räumung" },
  { href: "/lagerung", label: "Lagerung" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/umzug-checkliste", label: "Checkliste (PDF)" },
  { href: "/so-funktionierts", label: "So funktioniert's" },
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
          
          // Center item (Offerten) - prominent styling
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
                  {/* Prominent center button */}
                  <div className="relative -mt-4 flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-[10px] font-semibold text-primary leading-none whitespace-nowrap -mt-1">
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
                <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl pb-safe">
                  <SheetHeader>
                    <SheetTitle className="text-left">Mehr entdecken</SheetTitle>
                  </SheetHeader>
                  <div className="grid grid-cols-2 gap-2 mt-4 pb-4">
                    {moreMenuItems.map((menuItem) => (
                      <Link
                        key={menuItem.href}
                        to={menuItem.href}
                        onClick={() => {
                          lightTap();
                          setMoreOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2 px-4 py-3 rounded-lg transition-colors",
                          location.pathname === menuItem.href
                            ? "bg-primary/10 text-primary font-medium"
                            : "bg-muted/50 hover:bg-muted text-foreground"
                        )}
                      >
                        <span className="text-sm">{menuItem.label}</span>
                      </Link>
                    ))}
                  </div>
                  {/* Quick CTAs at bottom */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Link
                      to="/umzugsofferten"
                      onClick={() => {
                        lightTap();
                        setMoreOpen(false);
                      }}
                      className="flex-1 bg-primary text-primary-foreground text-center py-3 rounded-lg font-medium text-sm"
                    >
                      Gratis Offerten
                    </Link>
                    <a
                      href="tel:+41445001234"
                      onClick={() => lightTap()}
                      className="flex-1 bg-secondary text-secondary-foreground text-center py-3 rounded-lg font-medium text-sm"
                    >
                      Anrufen
                    </a>
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

import { Link, useLocation } from "react-router-dom";
import { Calculator, Building2, MapPin, FileText, Home } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/umzugsrechner", label: "Rechner", icon: Calculator },
  { href: "/umzugsfirmen", label: "Firmen", icon: Building2 },
  { href: "/regionen", label: "Regionen", icon: MapPin },
  { href: "/umzugsofferten", label: "Offerten", icon: FileText },
];

// Paths where we hide the mobile bottom navigation to avoid overlap with funnels
// All calculator/funnel flows have their own sticky footer CTAs
const HIDDEN_PATHS = [
  '/umzugsofferten',  // All /umzugsofferten variants
  '/chatgpt-flow',    // ChatGPT flows have their own sticky CTA
  '/umzugsrechner',   // Calculator page
  '/god-mode',        // God mode calculator
  '/flow-tester',     // Flow testing
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { lightTap } = useHapticFeedback();

  // Hide on funnel pages or when not mobile
  const shouldHide = !isMobile || HIDDEN_PATHS.some(path => location.pathname.startsWith(path));
  if (shouldHide) return null;

  return (
    <nav className="site-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg pb-safe" aria-label="Mobile Navigation">
      {/* Touch targets min 44px height - Issue #26 fix */}
      <div className="flex items-center justify-around h-14 min-h-[56px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/" && location.pathname.startsWith(item.href));
          
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
                {/* Issue #3 fix - prevent text truncation with smaller font */}
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

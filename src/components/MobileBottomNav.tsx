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

export const MobileBottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { lightTap } = useHapticFeedback();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-xl border-t border-border/80 shadow-lg pb-safe" aria-label="Mobile Navigation">
      <div className="flex items-center justify-around h-[52px] xs:h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/" && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => lightTap()}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 touch-manipulation",
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
                className="flex flex-col items-center"
              >
                <item.icon className={cn(
                  "h-[18px] w-[18px] xs:h-5 xs:w-5 mb-0.5 transition-transform",
                  isActive && "scale-105"
                )} />
                <span className={cn(
                  "text-[9px] xs:text-[10px] font-medium transition-colors leading-none",
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

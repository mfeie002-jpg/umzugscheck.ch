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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border shadow-lg pb-safe">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/" && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => lightTap()}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground active:scale-95"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-0.5 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <item.icon className={cn(
                  "h-5 w-5 mb-0.5 transition-transform",
                  isActive && "scale-110"
                )} />
              </motion.div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

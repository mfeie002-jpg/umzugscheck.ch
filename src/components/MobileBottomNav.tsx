import { Link, useLocation } from "react-router-dom";
import { Calculator, Building2, Wrench, FileText, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rechner", label: "Rechner", icon: Calculator },
  { href: "/firmen", label: "Firmen", icon: Building2 },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/umzugsofferten", label: "Offerten", icon: FileText },
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/" && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive && "text-primary")} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-primary"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

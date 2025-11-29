import { Link } from "react-router-dom";
import { Briefcase, LogIn, DollarSign, Award, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const providerLinks = [
  { 
    icon: Briefcase, 
    label: "Anbieter werden", 
    href: "/anbieter", 
    description: "Jetzt Partner werden" 
  },
  { 
    icon: LogIn, 
    label: "Anbieter Login", 
    href: "/anbieter/login", 
    description: "Zugang für Partner" 
  },
  { 
    icon: DollarSign, 
    label: "Preise & Konditionen", 
    href: "/anbieter/preise", 
    description: "Transparente Konditionen" 
  },
  { 
    icon: HelpCircle, 
    label: "Häufige Fragen", 
    href: "/anbieter/faq", 
    description: "Antworten für Partnerfirmen" 
  },
  { 
    icon: Award, 
    label: "Vorteile", 
    href: "/anbieter#vorteile", 
    description: "Ihre Benefits als Partner" 
  }
];

export const ProviderDropdown = ({ isOpen, onClose }: ProviderDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div className="hidden lg:block absolute left-0 right-0 top-full bg-white border-t border-border shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl">
          {providerLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex flex-col items-start gap-3 p-4 rounded-xl hover:bg-secondary/50 transition-all duration-200 group border border-transparent hover:border-primary/20"
                )}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors mb-1">
                    {item.label}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

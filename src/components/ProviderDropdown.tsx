import { Link } from "react-router-dom";
import { Briefcase, LogIn, DollarSign, Award, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const providerLinks = [
  { icon: Briefcase, title: "Anbieter werden", href: "/anbieter" },
  { icon: LogIn, title: "Anbieter Login", href: "/anbieter/login" },
  { icon: DollarSign, title: "Preise & Konditionen", href: "/anbieter/preise" },
  { icon: HelpCircle, title: "Häufige Fragen", href: "/anbieter/faq" },
  { icon: Award, title: "Vorteile", href: "/anbieter#vorteile" }
];

export const ProviderDropdown = ({ isOpen, onClose }: ProviderDropdownProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/5 z-40 hidden lg:block"
        onClick={onClose}
      />
      
      {/* Dropdown Content */}
      <div className="hidden lg:block absolute left-0 right-0 top-full mt-0 bg-white border-t border-border shadow-strong z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {providerLinks.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              onClick={onClose}
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <link.icon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground group-hover:text-primary">
                {link.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

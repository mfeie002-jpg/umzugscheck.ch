import { Link } from "react-router-dom";
import { Truck, Sparkles, Trash2, Package, Wrench, Home, Building2, Globe, Piano, Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  { icon: Home, title: "Privatumzug", href: "/privatumzug" },
  { icon: Building2, title: "Firmenumzug", href: "/firmenumzug" },
  { icon: Sparkles, title: "Umzug mit Reinigung", href: "/umzug-mit-reinigung" },
  { icon: Sparkles, title: "Reinigung", href: "/reinigung" },
  { icon: Trash2, title: "Entsorgung & Räumung", href: "/entsorgung-raeumung" },
  { icon: Wrench, title: "Möbellift", href: "/moebellift" },
  { icon: Box, title: "Einlagerung", href: "/einlagerung" },
];

export const ServicesDropdown = ({ isOpen, onClose }: ServicesDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div className="hidden lg:block absolute left-0 right-0 top-full bg-white border-t border-border shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.href}
              onClick={onClose}
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <service.icon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground group-hover:text-primary">
                {service.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

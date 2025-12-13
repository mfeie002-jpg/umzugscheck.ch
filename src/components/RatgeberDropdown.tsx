import { Link } from "react-router-dom";
import { FileText, DollarSign, CheckSquare, Package, Trash2, Lightbulb } from "lucide-react";

interface RatgeberDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ratgeberItems = [
  {
    icon: DollarSign,
    title: "Kosten & Preise",
    href: "/ratgeber/kosten"
  },
  {
    icon: CheckSquare,
    title: "Umzugscheckliste",
    href: "/ratgeber/checklisten"
  },
  {
    icon: Lightbulb,
    title: "Umzugstipps",
    href: "/ratgeber/umzugstipps"
  },
  {
    icon: FileText,
    title: "Alle Ratgeber",
    href: "/ratgeber"
  }
];

export const RatgeberDropdown = ({ isOpen, onClose }: RatgeberDropdownProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/5 z-40 hidden lg:block"
        onClick={onClose}
      />
      
      {/* Dropdown Content */}
      <div className="hidden lg:block absolute left-0 right-0 top-0 bg-background border-t border-border shadow-strong z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ratgeberItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground group-hover:text-primary">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StandardCardProps {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  image?: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "info";
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Standardized Card Component
 * Airbnb-style design with Swiss premium aesthetics
 */
export const StandardCard = ({
  icon: Icon,
  iconColor = "text-primary",
  title,
  description,
  image,
  badge,
  badgeVariant = "default",
  footer,
  onClick,
  className = ""
}: StandardCardProps) => {
  const badgeClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info"
  };

  return (
    <Card 
      className={`group overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      {image && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {badge && (
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[badgeVariant]}`}>
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Icon */}
        {Icon && !image && (
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 ${iconColor}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { LucideIcon, CheckCircle } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StandardCardProps {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  details?: string[];
  image?: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "info";
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Standardized Card Component with Rich Content Support
 * Airbnb-style design with Swiss premium aesthetics
 */
export const StandardCard = ({
  icon: Icon,
  iconColor = "text-primary",
  title,
  description,
  details,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={`group overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer ${className}`}
        onClick={onClick}
      >
        {/* Image */}
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            {badge && (
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${badgeClasses[badgeVariant]}`}>
                {badge}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          {Icon && !image && (
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 group-hover:scale-110 transition-transform ${iconColor}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>

          {/* Details List */}
          {details && details.length > 0 && (
            <ul className="space-y-2 mb-4">
              {details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          {footer && (
            <div className="mt-4 pt-4 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

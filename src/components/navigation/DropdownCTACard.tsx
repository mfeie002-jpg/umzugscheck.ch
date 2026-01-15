/**
 * Dropdown CTA Card Component
 * Right-side conversion card for MegaMenus
 */

import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DropdownCTACardProps {
  title: string;
  description?: string;
  bullets?: string[];
  buttonText: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  icon?: LucideIcon;
  className?: string;
  onClose?: () => void;
}

export const DropdownCTACard = ({
  title,
  description,
  bullets,
  buttonText,
  buttonHref,
  onButtonClick,
  icon: Icon,
  className,
  onClose,
}: DropdownCTACardProps) => {
  const handleClick = () => {
    onButtonClick?.();
    onClose?.();
  };

  const ButtonContent = (
    <>
      {buttonText}
      <ArrowRight className="w-4 h-4 ml-2" />
    </>
  );

  return (
    <div className={cn(
      "bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 rounded-xl p-5 border border-primary/20",
      className
    )}>
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      )}
      
      <h4 className="font-bold text-foreground mb-2">{title}</h4>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}

      {bullets && bullets.length > 0 && (
        <ul className="space-y-1.5 mb-4">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {buttonHref ? (
        <Button 
          asChild 
          className="w-full gradient-cta text-white font-semibold shadow-strong"
        >
          <Link to={buttonHref} onClick={handleClick}>
            {ButtonContent}
          </Link>
        </Button>
      ) : (
        <Button 
          onClick={handleClick}
          className="w-full gradient-cta text-white font-semibold shadow-strong"
        >
          {ButtonContent}
        </Button>
      )}
    </div>
  );
};

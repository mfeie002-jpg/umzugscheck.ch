import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CTAButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  showArrow?: boolean;
  className?: string;
  external?: boolean;
}

const sizeStyles = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm sm:text-base",
  lg: "h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg"
};

export const CTAButton = memo(({
  to,
  children,
  variant = "primary",
  size = "md",
  icon: Icon = CheckCircle2,
  showArrow = true,
  className,
  external = false
}: CTAButtonProps) => {
  const buttonContent = (
    <Button
      size="lg"
      variant={variant === "primary" ? "default" : variant === "secondary" ? "secondary" : "outline"}
      className={cn(
        sizeStyles[size],
        "font-semibold shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all group",
        className
      )}
    >
      {Icon && <Icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
      {children}
      {showArrow && (
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      )}
    </Button>
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  return (
    <Link to={to}>
      {buttonContent}
    </Link>
  );
});

CTAButton.displayName = 'CTAButton';

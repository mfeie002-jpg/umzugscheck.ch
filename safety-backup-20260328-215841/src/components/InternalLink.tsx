import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InternalLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  variant?: 'default' | 'subtle' | 'bold';
  external?: boolean;
}

export const InternalLink = ({ 
  to, 
  children, 
  className, 
  showArrow = false,
  variant = 'default',
  external = false
}: InternalLinkProps) => {
  const isExternal = external || to.startsWith('http') || to.startsWith('//');
  
  const variants = {
    default: 'text-primary hover:text-primary/80',
    subtle: 'text-muted-foreground hover:text-primary',
    bold: 'text-primary font-semibold hover:text-primary/80'
  };

  const baseClasses = cn(
    "inline-flex items-center gap-1.5 font-medium transition-colors focus-ring rounded-sm",
    "no-underline hover:underline underline-offset-4",
    variants[variant],
    className
  );

  if (isExternal) {
    return (
      <a
        href={to}
        className={baseClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <ExternalLinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="sr-only">(öffnet in neuem Tab)</span>
      </a>
    );
  }

  return (
    <Link to={to} className={baseClasses}>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
    </Link>
  );
};

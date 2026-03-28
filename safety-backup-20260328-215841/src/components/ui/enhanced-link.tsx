import { Link, LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface EnhancedLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'underline' | 'ghost' | 'muted';
  external?: boolean;
  prefetch?: boolean;
}

/**
 * Enhanced Link component with improved accessibility,
 * prefetching support, and visual variants
 */
export const EnhancedLink = ({
  to,
  children,
  className,
  variant = 'default',
  external = false,
  prefetch = true,
  ...props
}: EnhancedLinkProps) => {
  const isExternal = external || to.startsWith('http') || to.startsWith('//');
  
  const variants = {
    default: 'text-primary hover:text-primary/80 transition-colors',
    underline: 'text-primary hover:text-primary/80 link-underline transition-colors',
    ghost: 'text-muted-foreground hover:text-foreground transition-colors',
    muted: 'text-muted-foreground hover:text-primary transition-colors'
  };

  const baseClasses = cn(
    'inline-flex items-center gap-1 font-medium focus-ring rounded-sm',
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
        {...props}
      >
        {children}
        <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
        <span className="sr-only">(opens in new tab)</span>
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={baseClasses}
      {...props}
    >
      {children}
    </Link>
  );
};

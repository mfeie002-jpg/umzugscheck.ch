import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FooterLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

/**
 * Unified Footer Logo component
 * Use this in all footer components for consistency
 */
export const FooterLogo = ({ className, variant = 'dark' }: FooterLogoProps) => {
  const isLight = variant === 'light';
  
  return (
    <Link 
      to="/" 
      className={cn(
        "inline-flex items-center gap-2.5 group transition-opacity hover:opacity-90",
        className
      )}
      aria-label="Zur Startseite von Umzugscheck.ch"
    >
      {/* Icon Container */}
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
        isLight ? "bg-primary" : "bg-white/20"
      )}>
        <svg 
          viewBox="0 0 40 44" 
          className="w-6 h-6"
          aria-hidden="true"
        >
          <g transform="translate(2, 4)">
            {/* House body */}
            <path 
              d="M18 10L4 20V36H32V20L18 10Z" 
              fill={isLight ? "#ffffff" : "#0050A8"}
            />
            {/* Roof */}
            <path 
              d="M0 21L18 5L36 21" 
              fill="none" 
              stroke="#dc2626" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Checkmark */}
            <path 
              d="M10 22L16 28L28 14" 
              fill="none" 
              stroke={isLight ? "#0050A8" : "white"}
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
      
      {/* Text */}
      <span className="text-xl sm:text-2xl font-bold">
        <span className={isLight ? "text-foreground" : "text-white"}>Umzugs</span>
        <span className="text-secondary">check</span>
        <span className={isLight ? "text-foreground" : "text-white"}>.ch</span>
      </span>
    </Link>
  );
};

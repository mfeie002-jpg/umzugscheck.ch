import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
}

export const Logo = ({ className = "", size = "lg", iconOnly = false }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-7 sm:h-8",
    lg: "h-8 sm:h-10 md:h-11",
    xl: "h-9 sm:h-11 md:h-12 lg:h-14"
  };

  const iconSizeClasses = {
    sm: "h-6 w-6",
    md: "h-7 w-7",
    lg: "h-8 w-8",
    xl: "h-9 w-9"
  };

  // Icon-only version for favicon or small screens
  if (iconOnly) {
    return (
      <Link 
        to="/" 
        className={`flex items-center hover:opacity-90 hover:scale-105 transition-all duration-200 flex-shrink-0 ${className}`}
        aria-label="Zur Startseite von Umzugscheck.ch"
      >
        <svg 
          viewBox="0 0 40 44" 
          className={iconSizeClasses[size]}
          aria-hidden="true"
        >
          <g transform="translate(2, 4)">
            {/* House body - blue */}
            <path 
              d="M18 10L4 20V36H32V20L18 10Z" 
              fill="#0050A8"
            />
            {/* Roof - red accent */}
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
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </Link>
    );
  }

  return (
    <Link 
      to="/" 
      className={`flex flex-col hover:opacity-90 hover:scale-[1.02] transition-all duration-200 flex-shrink-0 ${className}`}
      aria-label="Zur Startseite von Umzugscheck.ch"
    >
      <svg 
        viewBox="0 0 320 44" 
        className={`${sizeClasses[size]} w-auto min-w-[100px] sm:min-w-[140px] md:min-w-[180px]`}
        aria-hidden="true"
      >
        {/* House/Box with Checkmark Icon */}
        <g transform="translate(2, 4)">
          {/* House body - blue */}
          <path 
            d="M18 10L4 20V36H32V20L18 10Z" 
            fill="#0050A8"
          />
          {/* Roof - red accent */}
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
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>
        
        {/* Text "Umzugscheck.ch" combined for proper spacing */}
        <text 
          x="44" 
          y="30" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="26" 
          fontWeight="700"
        >
          <tspan fill="#0050A8">Umzugs</tspan><tspan fill="#dc2626">check.ch</tspan>
        </text>
      </svg>
      {/* Slogan under logo - visible from sm breakpoint */}
      <span className="hidden sm:block text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] text-muted-foreground/70 font-medium leading-tight pl-0.5 -mt-0.5">
        Der Schweizer Umzugsvergleich
      </span>
    </Link>
  );
};

// Standalone icon component for favicon generation
export const LogoIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 40 44" 
    className={className}
    aria-hidden="true"
  >
    <g transform="translate(2, 4)">
      {/* House body - blue */}
      <path 
        d="M18 10L4 20V36H32V20L18 10Z" 
        fill="#0050A8"
      />
      {/* Roof - red accent */}
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
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

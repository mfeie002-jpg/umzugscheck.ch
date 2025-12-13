import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
}

export const Logo = ({ className = "", size = "lg", iconOnly = false }: LogoProps) => {
  const sizeClasses = {
    sm: "h-5",
    md: "h-6",
    lg: "h-6 sm:h-7",
    xl: "h-7 sm:h-8 lg:h-9"
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
      className={`flex items-center hover:opacity-90 hover:scale-[1.02] transition-all duration-200 flex-shrink-0 ${className}`}
      aria-label="Zur Startseite von Umzugscheck.ch"
    >
      <svg 
        viewBox="0 0 290 44" 
        className={`${sizeClasses[size]} w-auto`}
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

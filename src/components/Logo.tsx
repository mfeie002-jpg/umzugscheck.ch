import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Logo = ({ className = "", size = "lg" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-4",
    md: "h-5",
    lg: "h-5 sm:h-6",
    xl: "h-6 sm:h-7"
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center hover:opacity-90 transition-opacity flex-shrink-0 ${className}`}
      aria-label="Zur Startseite von Umzugscheck.ch"
    >
      <svg 
        viewBox="0 0 280 44" 
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
        
        {/* Text "Umzugs" in blue */}
        <text 
          x="44" 
          y="30" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="26" 
          fontWeight="700" 
          fill="#0050A8"
        >
          Umzugs
        </text>
        
        {/* Text "check.ch" in red */}
        <text 
          x="138" 
          y="30" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="26" 
          fontWeight="700" 
          fill="#dc2626"
        >
          check.ch
        </text>
      </svg>
    </Link>
  );
};

import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Logo = ({ className = "", size = "lg" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-9 sm:h-10 md:h-11",
    xl: "h-10 sm:h-11 md:h-12 lg:h-14"
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center hover:opacity-90 transition-opacity flex-shrink-0 ${className}`}
      aria-label="Zur Startseite von Umzugscheck.ch"
    >
      <svg 
        viewBox="0 0 320 60" 
        className={`${sizeClasses[size]} w-auto`}
        aria-hidden="true"
      >
        {/* House/Box with Checkmark Icon */}
        <g transform="translate(0, 8)">
          {/* House shape */}
          <path 
            d="M22 8L4 22V44H40V22L22 8Z" 
            fill="#0050A8" 
            stroke="#0050A8" 
            strokeWidth="2"
          />
          {/* Roof */}
          <path 
            d="M0 24L22 4L44 24" 
            fill="none" 
            stroke="#0050A8" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Checkmark */}
          <path 
            d="M12 24L20 32L34 16" 
            fill="none" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>
        
        {/* Text "Umzugs" in blue */}
        <text 
          x="52" 
          y="42" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="32" 
          fontWeight="700" 
          fill="#0050A8"
        >
          Umzugs
        </text>
        
        {/* Text "check.ch" in red */}
        <text 
          x="164" 
          y="42" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="32" 
          fontWeight="700" 
          fill="#dc2626"
        >
          check.ch
        </text>
      </svg>
    </Link>
  );
};

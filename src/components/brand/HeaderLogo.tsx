import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type HeaderLogoSize = "sm" | "md" | "lg";

interface HeaderLogoProps {
  className?: string;
  size?: HeaderLogoSize;
  onClick?: () => void;
  showTagline?: boolean;
}

const SIZE: Record<HeaderLogoSize, { height: string; iconSize: string; fontSize: number; tagline: string }> = {
  sm: { height: "h-8", iconSize: "h-8 w-8", fontSize: 22, tagline: "text-[7px]" },
  md: { height: "h-9 sm:h-10", iconSize: "h-9 w-9", fontSize: 24, tagline: "text-[8px] sm:text-[9px]" },
  lg: { height: "h-10 sm:h-11", iconSize: "h-10 w-10", fontSize: 26, tagline: "text-[9px] sm:text-[10px]" },
};

export function HeaderLogo({ className, size = "md", onClick, showTagline = true }: HeaderLogoProps) {
  const s = SIZE[size];
  
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn(
        // Keep logo + tagline vertically compact and aligned for mobile headers
        "flex flex-col justify-center items-start hover:opacity-95 transition-opacity flex-shrink-0",
        className
      )}
      aria-label="Zur Startseite von Umzugscheck.ch"
    >
      <svg 
        viewBox="0 0 280 36" 
        // `block` prevents baseline whitespace that pushes the tagline too far down on mobile
        className={cn(
          s.height,
          "block w-auto min-w-[120px] xs:min-w-[140px] sm:min-w-[180px] max-w-[150px] xs:max-w-[170px] sm:max-w-none"
        )}
        aria-hidden="true"
      >
        {/* House Icon - Brand Blue body, Brand Red roof */}
        <g transform="translate(0, 0)">
          {/* House body - Brand Primary Blue #0050A8 */}
          <path 
            d="M16 8L4 16V32H28V16L16 8Z" 
            fill="#0050A8"
          />
          {/* Roof - Brand Secondary Red #E32026 */}
          <path 
            d="M0 17L16 4L32 17" 
            fill="none" 
            stroke="#E32026" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* White checkmark inside house */}
          <path 
            d="M8 19L13 24L24 12" 
            fill="none" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>
        
        {/* Text "Umzugscheck.ch" - Brand Colors */}
        <text 
          x="38" 
          y="25" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize={s.fontSize} 
          fontWeight="700"
        >
          <tspan fill="#0050A8">Umzugs</tspan>
          <tspan fill="#E32026">check</tspan>
          <tspan fill="#0050A8" fontWeight="700">.ch</tspan>
        </text>
      </svg>
      
      {showTagline && (
        <span
          className={cn(
            "block font-semibold leading-none pl-0.5 -mt-2 text-muted-foreground/80",
            s.tagline
          )}
        >
          Der Schweizer Umzugsvergleich
        </span>
      )}
    </Link>
  );
}

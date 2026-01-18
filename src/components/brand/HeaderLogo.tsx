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
        "flex flex-col hover:opacity-95 transition-opacity flex-shrink-0",
        className
      )}
      aria-label="Zur Startseite von Umzugscheck.ch"
    >
      <svg 
        viewBox="0 0 280 36" 
        className={cn(s.height, "w-auto min-w-[140px] sm:min-w-[180px]")}
        aria-hidden="true"
      >
        {/* House Icon - all red (Swiss) */}
        <g transform="translate(0, 0)">
          {/* House body - red */}
          <path 
            d="M16 8L4 16V32H28V16L16 8Z" 
            fill="#dc2626"
          />
          {/* Roof - red */}
          <path 
            d="M0 17L16 4L32 17" 
            fill="none" 
            stroke="#dc2626" 
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
        
        {/* Text "Umzugscheck.ch" */}
        <text 
          x="38" 
          y="25" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize={s.fontSize} 
          fontWeight="700"
        >
          <tspan fill="#1a1a1a">Umzugs</tspan>
          <tspan fill="#dc2626">check</tspan>
          <tspan fill="#64748b" fontWeight="500">.ch</tspan>
        </text>
      </svg>
      
      {/* Tagline */}
      {showTagline && (
        <span className={cn(
          "hidden sm:block text-muted-foreground/80 font-medium leading-tight pl-0.5 -mt-0.5",
          s.tagline
        )}>
          Der Schweizer Umzugsvergleich
        </span>
      )}
    </Link>
  );
}

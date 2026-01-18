import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderLogoSize = "sm" | "md" | "lg";

interface HeaderLogoProps {
  className?: string;
  size?: HeaderLogoSize;
  onClick?: () => void;
}

const SIZE: Record<HeaderLogoSize, { wrap: string; icon: string; text: string; dot: string }> = {
  sm: { wrap: "h-8 w-8 rounded-lg", icon: "h-4 w-4", text: "text-base", dot: "text-xs" },
  md: { wrap: "h-9 w-9 rounded-xl", icon: "h-5 w-5", text: "text-lg", dot: "text-sm" },
  lg: { wrap: "h-10 w-10 rounded-xl", icon: "h-5 w-5", text: "text-xl", dot: "text-sm" },
};

export function HeaderLogo({ className, size = "md", onClick }: HeaderLogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 flex-shrink-0",
        "hover:opacity-95 transition-opacity",
        className
      )}
      aria-label="Zur Startseite von Umzugscheck.ch"
    >
      <div
        className={cn(
          "flex items-center justify-center shadow-md",
          "bg-secondary text-secondary-foreground",
          SIZE[size].wrap
        )}
        aria-hidden="true"
      >
        <CheckCircle2 className={cn(SIZE[size].icon)} />
      </div>

      <span className={cn("font-bold leading-none", SIZE[size].text)}>
        <span className="text-foreground">Umzugs</span>
        <span className="text-secondary">check</span>
        <span className={cn("text-muted-foreground font-medium", SIZE[size].dot)}>.ch</span>
      </span>
    </Link>
  );
}

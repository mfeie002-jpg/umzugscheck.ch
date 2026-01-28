import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "alpine" | "warm" | "primary" | "forest";
}

const variantClasses = {
  default: "text-muted-foreground bg-muted",
  alpine: "text-alpine bg-alpine/10",
  warm: "text-warm bg-warm/10",
  primary: "text-primary bg-primary/10",
  forest: "text-forest bg-forest/10",
};

const SectionBadge = ({ children, className = "", variant = "alpine" }: SectionBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default SectionBadge;

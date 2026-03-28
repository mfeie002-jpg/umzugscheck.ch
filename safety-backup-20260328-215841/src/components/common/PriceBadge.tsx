import { memo } from "react";
import { cn } from "@/lib/utils";

interface PriceBadgeProps {
  price: string | number;
  suffix?: string;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

const sizeClasses = {
  sm: "text-sm px-2 py-0.5",
  md: "text-base px-3 py-1",
  lg: "text-lg px-4 py-1.5"
};

const variantClasses = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  muted: "bg-muted text-muted-foreground border-border"
};

export const PriceBadge = memo(({ 
  price,
  suffix = "",
  prefix = "Ab CHF ",
  size = 'md',
  variant = 'primary',
  className = ""
}: PriceBadgeProps) => {
  const formattedPrice = typeof price === 'number' 
    ? price.toLocaleString('de-CH') 
    : price;

  return (
    <span 
      className={cn(
        "inline-flex items-baseline font-bold rounded-lg border",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className="text-[0.8em] font-medium opacity-80">{prefix}</span>
      {formattedPrice}
      {suffix && <span className="text-[0.7em] font-normal ml-0.5">{suffix}</span>}
    </span>
  );
});

PriceBadge.displayName = 'PriceBadge';

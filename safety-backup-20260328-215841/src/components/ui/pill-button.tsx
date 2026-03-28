import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/**
 * Pill Button Component
 * 
 * A beautiful pill-shaped button with optional icon, inspired by modern UI design.
 * Features smooth gradients, subtle shadows, and elegant animations.
 * 
 * Usage:
 * <PillButton icon={FlaskConical} label="SP V1" variant="blue" />
 * <PillButton icon={Star} label="Premium" variant="red" size="lg" />
 */

const pillButtonVariants = cva(
  "inline-flex items-center gap-2.5 font-semibold rounded-full transition-all duration-300 ease-out cursor-pointer select-none whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary blue - like the reference image
        blue: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]",
        // Red accent
        red: "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 hover:scale-[1.02] active:scale-[0.98]",
        // Success green
        green: "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98]",
        // Neutral/muted
        muted: "bg-gradient-to-r from-muted to-muted/80 text-muted-foreground shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        // Outline style
        outline: "border-2 border-primary bg-background text-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98]",
        // Premium gold
        gold: "bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]",
        // Dark/footer style
        dark: "bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg shadow-slate-800/25 hover:shadow-xl hover:shadow-slate-800/30 hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "blue",
      size: "default",
    },
  }
);

const iconContainerVariants = cva(
  "flex items-center justify-center rounded-full shrink-0",
  {
    variants: {
      size: {
        sm: "w-5 h-5",
        default: "w-6 h-6",
        lg: "w-7 h-7",
        xl: "w-8 h-8",
      },
      iconStyle: {
        default: "bg-white/20",
        contrast: "bg-white text-primary",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      size: "default",
      iconStyle: "contrast",
    },
  }
);

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillButtonVariants> {
  /** The icon to display */
  icon?: LucideIcon;
  /** The label text */
  label: string;
  /** Icon container style */
  iconStyle?: "default" | "contrast" | "transparent";
  /** Whether to show a loading state */
  loading?: boolean;
  /** Badge count (optional) */
  badge?: number;
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      label,
      iconStyle = "contrast",
      loading = false,
      badge,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconSizeMap = {
      sm: 12,
      default: 14,
      lg: 16,
      xl: 18,
    };

    const iconSize = iconSizeMap[size || "default"];

    return (
      <button
        className={cn(pillButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {Icon && (
          <span
            className={cn(
              iconContainerVariants({ size, iconStyle }),
              loading && "animate-pulse"
            )}
          >
            <Icon size={iconSize} strokeWidth={2.5} />
          </span>
        )}
        <span className="tracking-wide">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold rounded-full bg-white/30 text-inherit">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </button>
    );
  }
);

PillButton.displayName = "PillButton";

export { PillButton, pillButtonVariants };

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:brightness-105 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[44px] touch-manipulation",
  {
    variants: {
      variant: {
        // Primary CTA - Red (--uc-red)
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-cta hover:shadow-lift active:shadow-md",
        // Secondary - Blue outline (--uc-blue)
        secondary: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground active:bg-primary/90",
        // Blue filled
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-medium active:shadow-soft",
        // Destructive
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        // Outline - subtle
        outline: "border border-border bg-background hover:bg-accent hover:text-primary hover:border-primary/30 active:bg-accent/80",
        // Ghost - transparent
        ghost: "hover:bg-accent hover:text-primary active:bg-accent/80",
        // Link style
        link: "text-primary underline-offset-4 hover:underline active:opacity-80",
        // CTA emphasis - Red with animation
        cta: "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-[1.02] shadow-cta hover:shadow-lift active:scale-[0.98] active:shadow-md",
        // Accent - same as default
        accent: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-cta active:shadow-md",
        // Premium - blue
        premium: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-medium active:shadow-soft",
        // Success
        success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
        // Warning
        warning: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700",
        // Soft variant - subtle background
        soft: "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/25",
        // White variant for dark backgrounds
        white: "bg-white text-foreground hover:bg-white/90 shadow-soft active:shadow-none",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base font-semibold",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
        // Mobile-optimized sizes
        "mobile-sm": "h-10 xs:h-9 px-4 xs:px-3 text-sm xs:text-xs",
        "mobile-lg": "h-12 xs:h-11 px-6 xs:px-5 text-base xs:text-sm font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

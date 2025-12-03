import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary CTA - Red (--uc-red)
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-cta hover:shadow-lift",
        // Secondary - Blue outline (--uc-blue)
        secondary: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        // Blue filled
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-medium",
        // Destructive
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Outline - subtle
        outline: "border border-border bg-background hover:bg-accent hover:text-primary hover:border-primary/30",
        // Ghost - transparent
        ghost: "hover:bg-accent hover:text-primary",
        // Link style
        link: "text-primary underline-offset-4 hover:underline",
        // CTA emphasis - Red with animation
        cta: "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-[1.02] shadow-cta hover:shadow-lift",
        // Accent - same as default
        accent: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-cta",
        // Premium - blue
        premium: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-medium",
        // Success
        success: "bg-green-600 text-white hover:bg-green-700",
        // Warning
        warning: "bg-amber-500 text-white hover:bg-amber-600",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base font-semibold",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
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

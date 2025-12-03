import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-premium text-base font-semibold transition-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary Red Button (Main CTA)
        default: "bg-secondary text-white shadow-cta hover:bg-secondary/90 hover:shadow-lift hover:scale-105 active:scale-100",
        
        // Secondary Outline Red
        outline: "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10 hover:shadow-premium",
        
        // Primary Blue Button
        primary: "bg-primary text-white shadow-premium hover:bg-primary-hover hover:shadow-lift hover:scale-105 active:scale-100",
        
        // Swiss Noir Premium
        noir: "bg-swiss-noir text-white shadow-premium hover:bg-swiss-noir/90 hover:shadow-lift",
        
        // Ghost Minimal
        ghost: "text-swiss-noir hover:bg-muted hover:text-foreground",
        
        // Link Style
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
      },
      size: {
        default: "h-14 px-8 py-4 text-lg",
        sm: "h-11 px-6 text-base",
        lg: "h-16 px-10 py-5 text-xl",
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ButtonPremium = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonPremium.displayName = "ButtonPremium";

export { ButtonPremium, buttonVariants };

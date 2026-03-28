import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap touch-manipulation",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-medium active:scale-[0.95]",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-medium active:scale-[0.95]",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-medium active:scale-[0.95]",
        outline: "text-foreground border-foreground/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-medium active:scale-[0.95]",
        success: "border-transparent bg-green-600 text-white hover:bg-green-700 hover:shadow-medium active:scale-[0.95]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg text-card-foreground transition-all duration-250 focus-within:ring-2 focus-within:ring-primary/50",
  {
    variants: {
      variant: {
        default: "border bg-card shadow-sm hover:shadow-medium hover:border-primary/30 hover:scale-[1.02]",
        elevated: "bg-card shadow-medium border-0 hover:shadow-lift hover:scale-[1.02]",
        outline: "border-2 bg-card hover:border-primary/50 hover:bg-primary/5",
        ghost: "bg-transparent hover:bg-accent/50 hover:border hover:border-accent/30",
        premium: "bg-gradient-to-br from-card to-card/80 shadow-strong border border-primary/10 hover:shadow-lift hover:-translate-y-1 hover:scale-[1.01]",
        interactive: "border bg-card shadow-sm hover:shadow-medium hover:-translate-y-2 cursor-pointer active:scale-[0.98]",
        glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-soft hover:shadow-medium hover:bg-white/90",
      },
      padding: {
        default: "",
        none: "[&>*:first-child]:p-0 [&>*:last-child]:p-0",
        compact: "[&>*:first-child]:p-4 [&>*:last-child]:p-4",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

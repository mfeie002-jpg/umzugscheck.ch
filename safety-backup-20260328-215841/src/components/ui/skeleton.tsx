import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted",
        className
      )} 
      aria-hidden="true"
      {...props} 
    />
  );
}

export { Skeleton };

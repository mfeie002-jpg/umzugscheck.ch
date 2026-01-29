import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] xs:min-h-[90px] w-full rounded-lg border-2 border-input bg-background px-4 xs:px-3 py-3 xs:py-2 text-base xs:text-sm ring-offset-background placeholder:text-muted-foreground transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:shadow-sm",
        "hover:border-primary/50 hover:shadow-sm",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

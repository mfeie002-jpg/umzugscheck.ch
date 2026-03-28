import { memo, useState, useId } from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelProps {
  label: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
}

export const FloatingLabel = memo(function FloatingLabel({ 
  label, 
  type = "text",
  value = "",
  onChange,
  className,
  required
}: FloatingLabelProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const isActive = focused || value.length > 0;

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={cn(
          "w-full h-14 px-4 pt-5 pb-2 rounded-lg border border-border bg-background",
          "text-foreground transition-all duration-200",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          "peer"
        )}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all duration-200 pointer-events-none",
          isActive 
            ? "top-2 text-xs text-primary font-medium" 
            : "top-1/2 -translate-y-1/2 text-base text-muted-foreground"
        )}
      >
        {label}
        {required && <span className="text-secondary ml-1">*</span>}
      </label>
    </div>
  );
});

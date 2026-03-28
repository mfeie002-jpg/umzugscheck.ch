import { memo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  text: string;
  included: boolean;
}

interface FeatureListProps {
  features: Feature[];
  className?: string;
  compact?: boolean;
}

export const FeatureList = memo(function FeatureList({ 
  features, 
  className,
  compact = false
}: FeatureListProps) {
  return (
    <ul className={cn("space-y-2", className)}>
      {features.map((feature, index) => (
        <li 
          key={index}
          className={cn(
            "flex items-start gap-3",
            compact ? "text-sm" : "text-base"
          )}
        >
          {feature.included ? (
            <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
          )}
          <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  );
});

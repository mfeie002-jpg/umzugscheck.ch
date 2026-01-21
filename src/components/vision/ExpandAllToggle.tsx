/**
 * Expand All Toggle Button
 * Eye icon to toggle all collapsible sections open/closed
 */

import { memo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VisionLanguage } from "@/lib/vision-translations";

interface ExpandAllToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
  language?: VisionLanguage;
  className?: string;
}

export const ExpandAllToggle = memo(({ 
  isExpanded, 
  onToggle, 
  language = 'de',
  className 
}: ExpandAllToggleProps) => {
  const labels: Record<VisionLanguage, { expand: string; collapse: string }> = {
    de: {
      expand: "Alle öffnen",
      collapse: "Alle schliessen"
    },
    bg: {
      expand: "Отвори всички",
      collapse: "Затвори всички"
    },
    it: {
      expand: "Apri tutto",
      collapse: "Chiudi tutto"
    }
  };
  
  const t = labels[language];
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={cn(
        "gap-2 min-h-[40px] touch-manipulation active:scale-[0.98] transition-transform",
        className
      )}
    >
      {isExpanded ? (
        <>
          <EyeOff className="w-4 h-4" />
          <span className="hidden sm:inline">{t.collapse}</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">{t.expand}</span>
        </>
      )}
    </Button>
  );
});

ExpandAllToggle.displayName = 'ExpandAllToggle';

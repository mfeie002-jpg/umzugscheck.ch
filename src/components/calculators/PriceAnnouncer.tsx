import { memo } from "react";
import { cn } from "@/lib/utils";

interface PriceAnnouncerProps {
  announcement: string;
  className?: string;
}

/**
 * Accessible aria-live region for announcing price updates to screen readers
 * Uses role="status" and aria-live="polite" for non-intrusive announcements
 */
export const PriceAnnouncer = memo(function PriceAnnouncer({ 
  announcement, 
  className 
}: PriceAnnouncerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {announcement}
    </div>
  );
});

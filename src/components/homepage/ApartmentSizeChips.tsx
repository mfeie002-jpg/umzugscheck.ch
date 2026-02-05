/**
 * ApartmentSizeChips - Mobile-Optimized Room Size Selector
 * 
 * Replaces dropdown with horizontal scrollable chips for 1-tap selection.
 * Touch-optimized with 44px minimum height for fat-finger friendliness.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

const SIZES = [
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: '3' },
  { value: '3.5', label: '3.5' },
  { value: '4', label: '4' },
  { value: '4.5', label: '4.5' },
  { value: '5', label: '5' },
  { value: '5.5+', label: '5.5+' },
];

interface ApartmentSizeChipsProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ApartmentSizeChips = memo(function ApartmentSizeChips({
  value,
  onChange,
  className,
}: ApartmentSizeChipsProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Horizontal scroll container */}
      <div 
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {SIZES.map((size) => {
          const isSelected = value === size.value;
          return (
            <button
              key={size.value}
              type="button"
              onClick={() => onChange(size.value)}
              className={cn(
                // Base styles
                "flex-shrink-0 min-w-[52px] h-11 px-4 rounded-xl font-semibold text-sm",
                "transition-all duration-200 scroll-snap-align-center",
                "border-2 focus:outline-none focus:ring-2 focus:ring-primary/30",
                // State-based styles
                isSelected ? [
                  "bg-primary text-white border-primary",
                  "shadow-md scale-105"
                ] : [
                  "bg-card text-foreground border-muted/60",
                  "hover:border-primary/40 hover:bg-primary/5",
                  "active:scale-95"
                ]
              )}
              style={{ scrollSnapAlign: 'center' }}
            >
              {size.label}
            </button>
          );
        })}
      </div>
      
      {/* Subtle scroll indicator (fade on right edge) */}
      <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-card to-transparent pointer-events-none opacity-50" />
      
      {/* "Zimmer" label below */}
      <p className="text-xs text-muted-foreground text-center mt-1">Zimmer</p>
    </div>
  );
});

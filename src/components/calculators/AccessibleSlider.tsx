import { forwardRef, useCallback, useId, ComponentPropsWithoutRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type SliderProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

interface AccessibleSliderProps extends Omit<SliderProps, 'aria-valuetext' | 'aria-label'> {
  /** Current value for aria-valuetext */
  value: number[];
  /** Unit suffix for screen reader (e.g., "Quadratmeter", "Zimmer") */
  unit: string;
  /** Accessible label for the slider */
  label: string;
  /** Optional custom value formatter */
  formatValue?: (value: number) => string;
  /** Callback for value changes with tracking */
  onValueChangeWithTracking?: (name: string, value: number) => void;
  /** Name for analytics tracking */
  trackingName?: string;
}

/**
 * Accessible slider component with proper aria-valuetext for screen readers
 * Announces current value in a human-readable format
 */
export const AccessibleSlider = forwardRef<HTMLSpanElement, AccessibleSliderProps>(
  function AccessibleSlider(
    {
      value,
      unit,
      label,
      formatValue,
      onValueChange,
      onValueChangeWithTracking,
      trackingName,
      className,
      ...props
    },
    ref
  ) {
    const id = useId();
    const currentValue = value[0];

    // Format value for screen reader
    const valueText = formatValue 
      ? formatValue(currentValue) 
      : `${currentValue} ${unit}`;

    const handleValueChange = useCallback((vals: number[]) => {
      onValueChange?.(vals);
      if (onValueChangeWithTracking && trackingName) {
        onValueChangeWithTracking(trackingName, vals[0]);
      }
    }, [onValueChange, onValueChangeWithTracking, trackingName]);

    return (
      <Slider
        ref={ref}
        id={id}
        value={value}
        onValueChange={handleValueChange}
        aria-label={label}
        aria-valuetext={valueText}
        aria-valuenow={currentValue}
        className={cn("cursor-pointer", className)}
        {...props}
      />
    );
  }
);

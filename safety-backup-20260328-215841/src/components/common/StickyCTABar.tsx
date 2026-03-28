/**
 * ============================================================================
 * STICKY CTA BAR - ARCHETYP COMPONENT
 * ============================================================================
 * 
 * Mobile-optimierter Sticky CTA für maximale Conversion.
 * Follows Apple Human Interface Guidelines für Touch-Targets.
 * 
 * Features:
 * - Safe Area Support (iPhone X+)
 * - 44px minimum touch targets
 * - Backdrop blur für Premium-Feel
 * - Animated entry/exit
 * - Trust indicator integration
 * 
 * @version 2.0.0 - Archetyp Edition
 */

import { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFlowPath } from "@/hooks/useUnifiedAB";

// ============================================================================
// TYPES
// ============================================================================
interface StickyCTABarProps {
  /** Link destination */
  to?: string;
  /** Button text */
  text?: string;
  /** Subtext / hint below button */
  hint?: string;
  /** Trust indicator type */
  trustIndicator?: "guarantee" | "fast" | "free" | "none";
  /** Show only after scrolling past this offset */
  showAfterScroll?: number;
  /** Callback on click (alternative to link) */
  onClick?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional classnames */
  className?: string;
  /** Variant */
  variant?: "default" | "premium" | "minimal";
}

// ============================================================================
// TRUST INDICATORS
// ============================================================================
const trustIndicators = {
  guarantee: { icon: Shield, text: "Mit Abnahmegarantie" },
  fast: { icon: Clock, text: "Offerten in 24-48h" },
  free: { icon: CheckCircle, text: "100% kostenlos" },
  none: null
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const StickyCTABar = memo(({
  to,
  text = "Jetzt Offerten erhalten",
  hint,
  trustIndicator = "guarantee",
  showAfterScroll = 100,
  onClick,
  isLoading = false,
  disabled = false,
  className,
  variant = "default"
}: StickyCTABarProps) => {
  const flowPath = useFlowPath();
  const destination = to || flowPath;
  const [isVisible, setIsVisible] = useState(showAfterScroll === 0);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  // Scroll visibility logic
  useEffect(() => {
    if (showAfterScroll === 0) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > showAfterScroll;
      
      if (shouldShow !== hasScrolledPast) {
        setHasScrolledPast(shouldShow);
        setIsVisible(shouldShow);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll, hasScrolledPast]);

  const trust = trustIndicator !== "none" ? trustIndicators[trustIndicator] : null;

  const variantStyles = {
    default: "bg-white/95 dark:bg-background/95",
    premium: "bg-gradient-to-r from-white/98 to-white/95 dark:from-background/98 dark:to-background/95",
    minimal: "bg-white/90 dark:bg-background/90"
  };

  const ButtonWrapper = onClick ? 'button' : Link;
  const buttonProps = onClick 
    ? { onClick, type: 'button' as const } 
    : { to: destination };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        // Base styles
        "fixed bottom-0 left-0 right-0 z-50",
        // Padding with safe area
        "px-4 pt-3 pb-safe",
        // Background & effects
        variantStyles[variant],
        "backdrop-blur-xl",
        "border-t border-border/50",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.08)]",
        // Animation
        "animate-slide-in-up",
        // Print hide
        "print:hidden",
        className
      )}
      role="complementary"
      aria-label="Hauptaktion"
    >
      <div className="max-w-lg mx-auto space-y-2">
        {/* Trust Indicator */}
        {trust && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <trust.icon className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            <span>{trust.text}</span>
          </div>
        )}

        {/* CTA Button */}
        <Button
          asChild={!onClick}
          variant="default"
          size="lg"
          disabled={disabled || isLoading}
          className={cn(
            "w-full min-h-[48px] rounded-xl",
            "text-base font-semibold",
            "shadow-cta hover:shadow-lift",
            "transition-all duration-200",
            "touch-manipulation",
            isLoading && "opacity-80 cursor-wait"
          )}
          {...(onClick ? { onClick } : {})}
        >
          {onClick ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              {isLoading ? "Wird geladen..." : text}
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </>
          ) : (
            <Link to={destination} className="flex items-center justify-center w-full">
              <CheckCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              {text}
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </Button>

        {/* Hint Text */}
        {hint && (
          <p className="text-center text-xs text-muted-foreground/70">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
});

StickyCTABar.displayName = 'StickyCTABar';

// ============================================================================
// FLOATING ACTION BUTTON (Alternative for less intrusive CTA)
// ============================================================================
export const FloatingCTAButton = memo(({
  to,
  text = "Offerten",
  onClick,
  className
}: {
  to?: string;
  text?: string;
  onClick?: () => void;
  className?: string;
}) => {
  const flowPath = useFlowPath();
  const destination = to || flowPath;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "animate-fade-in",
        "print:hidden",
        className
      )}
    >
      <Button
        asChild={!onClick}
        variant="default"
        size="lg"
        className={cn(
          "rounded-full shadow-lift",
          "h-14 px-6",
          "hover:scale-105 transition-transform"
        )}
        onClick={onClick}
      >
        {onClick ? (
          <>
            <ArrowRight className="mr-2 h-5 w-5" />
            {text}
          </>
        ) : (
          <Link to={destination} className="flex items-center">
            <ArrowRight className="mr-2 h-5 w-5" />
            {text}
          </Link>
        )}
      </Button>
    </div>
  );
});

FloatingCTAButton.displayName = 'FloatingCTAButton';

export default StickyCTABar;

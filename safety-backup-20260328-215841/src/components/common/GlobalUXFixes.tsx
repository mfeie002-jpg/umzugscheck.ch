/**
 * Global UX Fixes for all Flows
 * 
 * This file contains shared components and utilities to fix common UX issues
 * across all flow variants:
 * 
 * 1. StickyFooterSafeArea - Prevents footer overlap on mobile
 * 2. ProgressIndicatorFix - Ensures correct step counting
 * 3. TouchTargetWrapper - Enforces 44px minimum touch targets
 * 4. NoHorizontalScroll - Prevents horizontal scrolling
 * 5. ValidationHintBox - Shows validation hints without overlapping
 */

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// ============================================================================
// 1. STICKY FOOTER SAFE AREA
// ============================================================================
// Provides consistent bottom padding to prevent sticky footer overlap
// Use this wrapper around main content in flows with sticky footers

export const STICKY_FOOTER_HEIGHTS = {
  mobile: 180, // Height of sticky footer on mobile (including safe area)
  desktop: 140, // Height of sticky footer on desktop
  extraPadding: 24, // Additional breathing room
};

interface StickyFooterSafeAreaProps {
  children: React.ReactNode;
  className?: string;
}

export const StickyFooterSafeArea: React.FC<StickyFooterSafeAreaProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      // Mobile: Extra large padding to account for sticky footer + iOS safe area
      "pb-48 sm:pb-40 md:pb-36",
      className
    )}
  >
    {children}
  </div>
);

// ============================================================================
// 2. PROGRESS INDICATOR FIX
// ============================================================================
// Ensures correct step counting (never shows "Step 5/4")

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

export const ProgressIndicatorFixed: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  className,
}) => {
  // CRITICAL FIX: Clamp currentStep to valid range
  const safeCurrentStep = Math.min(Math.max(1, currentStep), totalSteps);
  const progress = (safeCurrentStep / totalSteps) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Step counter - always shows valid step */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Schritt {safeCurrentStep} / {totalSteps}
        </span>
        {stepLabels && stepLabels[safeCurrentStep - 1] && (
          <span className="text-muted-foreground">
            {stepLabels[safeCurrentStep - 1]}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// 3. TOUCH TARGET WRAPPER
// ============================================================================
// Ensures minimum 44px touch targets for interactive elements

interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
}

export const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  className,
  onClick,
  role = "button",
  ariaLabel,
}) => (
  <div
    role={onClick ? role : undefined}
    aria-label={ariaLabel}
    onClick={onClick}
    className={cn(
      // Minimum 44x44px touch target
      "min-h-[44px] min-w-[44px]",
      "flex items-center justify-center",
      // Touch-friendly padding
      "p-2",
      // Cursor and interaction styles
      onClick && "cursor-pointer active:scale-95 transition-transform",
      className
    )}
  >
    {children}
  </div>
);

// ============================================================================
// 4. NO HORIZONTAL SCROLL CONTAINER
// ============================================================================
// Prevents horizontal scrolling issues on mobile

interface NoHorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

export const NoHorizontalScroll: React.FC<NoHorizontalScrollProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      // Prevent horizontal overflow
      "overflow-x-hidden",
      "w-full max-w-full",
      className
    )}
  >
    {children}
  </div>
);

// ============================================================================
// 5. VALIDATION HINT BOX
// ============================================================================
// Shows validation hints without overlapping navigation buttons

interface ValidationHintProps {
  message: string | null;
  variant?: "warning" | "error" | "success" | "info";
  className?: string;
}

export const ValidationHint: React.FC<ValidationHintProps> = ({
  message,
  variant = "warning",
  className,
}) => {
  if (!message) return null;

  const variants = {
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-900 dark:text-yellow-200",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200",
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-200",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-200",
  };

  const icons = {
    warning: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
    error: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
    success: <CheckCircle2 className="h-4 w-4 flex-shrink-0" />,
    info: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
  };

  return (
    <div
      className={cn(
        // Position ABOVE navigation, not overlapping
        "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm",
        // Ensure it doesn't overlap other elements
        "mb-3",
        variants[variant],
        className
      )}
    >
      {icons[variant]}
      <span>{message}</span>
    </div>
  );
};

// ============================================================================
// 6. STICKY FOOTER COMPONENT
// ============================================================================
// A properly structured sticky footer that doesn't overlap content

interface StickyFooterProps {
  children: React.ReactNode;
  className?: string;
  showTrustBadges?: boolean;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
  children,
  className,
  showTrustBadges = true,
}) => (
  <div
    className={cn(
      // Fixed at bottom
      "fixed bottom-0 left-0 right-0 z-50",
      // Background with blur
      "bg-background/95 backdrop-blur-lg",
      // Border and shadow
      "border-t shadow-lg",
      // Safe area support for iOS
      "pb-[env(safe-area-inset-bottom)]",
      className
    )}
  >
    {/* Gradient fade above footer */}
    <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
    
    {/* Footer content container */}
    <div className="max-w-2xl mx-auto px-4 py-4">
      {showTrustBadges && (
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            100% kostenlos
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            Unverbindlich
          </span>
        </div>
      )}
      {children}
    </div>
  </div>
);

// ============================================================================
// 7. RESPONSIVE GRID HELPER
// ============================================================================
// Prevents overflow on mobile with proper responsive grid

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "gap-3",
  className,
}) => (
  <div
    className={cn(
      "grid w-full",
      gap,
      // Dynamic columns based on breakpoints
      columns.mobile === 1 && "grid-cols-1",
      columns.mobile === 2 && "grid-cols-2",
      columns.mobile === 3 && "grid-cols-3",
      columns.tablet === 2 && "sm:grid-cols-2",
      columns.tablet === 3 && "sm:grid-cols-3",
      columns.tablet === 4 && "sm:grid-cols-4",
      columns.desktop === 3 && "md:grid-cols-3",
      columns.desktop === 4 && "md:grid-cols-4",
      className
    )}
  >
    {children}
  </div>
);

// ============================================================================
// 8. CONSISTENT NAVIGATION BUTTONS
// ============================================================================
// Ensures consistent navigation button styling and sizing

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  className?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  backLabel = "Zurück",
  nextLabel = "Weiter",
  nextDisabled = false,
  isSubmitting = false,
  isLastStep = false,
  className,
}) => (
  <div className={cn("flex items-center gap-3", className)}>
    {onBack && (
      <button
        type="button"
        onClick={onBack}
        className={cn(
          // Minimum touch target
          "min-h-[48px] min-w-[100px]",
          // Styling
          "px-4 py-3 rounded-lg border",
          "text-sm font-medium",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-muted/50 transition-colors",
          // Flex layout
          "flex items-center justify-center gap-2"
        )}
      >
        <span>←</span>
        <span>{backLabel}</span>
      </button>
    )}

    {onNext && (
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || isSubmitting}
        className={cn(
          // Minimum touch target and full width
          "min-h-[48px] flex-1",
          // Primary button styling
          "px-4 py-3 rounded-lg",
          "text-sm font-semibold",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 transition-colors",
          "shadow-md",
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Last step gets special styling
          isLastStep && "bg-green-600 hover:bg-green-700",
          // Flex layout
          "flex items-center justify-center gap-2"
        )}
      >
        {isSubmitting ? (
          <span>Wird gesendet...</span>
        ) : (
          <>
            <span>{nextLabel}</span>
            <span>→</span>
          </>
        )}
      </button>
    )}
  </div>
);

// ============================================================================
// CSS CLASSES FOR GLOBAL USE
// ============================================================================

export const GLOBAL_UX_CLASSES = {
  // Minimum touch target
  touchTarget: "min-h-[44px] min-w-[44px]",
  
  // Safe area padding for sticky footers
  safeAreaBottom: "pb-48 sm:pb-40 md:pb-36",
  
  // Prevent horizontal scroll
  noHorizontalScroll: "overflow-x-hidden max-w-full",
  
  // Consistent button heights
  buttonHeight: "h-12 sm:h-11",
  
  // Consistent input heights
  inputHeight: "h-12 sm:h-10",
  
  // Consistent spacing
  containerPadding: "px-4 sm:px-6",
  sectionGap: "space-y-4 sm:space-y-6",
};

export default {
  StickyFooterSafeArea,
  ProgressIndicatorFixed,
  TouchTarget,
  NoHorizontalScroll,
  ValidationHint,
  StickyFooter,
  ResponsiveGrid,
  NavigationButtons,
  GLOBAL_UX_CLASSES,
};

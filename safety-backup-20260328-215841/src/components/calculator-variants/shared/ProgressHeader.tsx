/**
 * ProgressHeader - Consistent sticky header for all calculator flows
 * 
 * CRITICAL UX Guidelines:
 * - Step counter must ALWAYS show "Schritt X von Y" where X <= Y
 * - Visual progress bar must match the step counter
 * - Use 1-indexed steps for display (Step 1, not Step 0)
 * - Mobile: Simplified view with just step counter
 * - Desktop: Can show step labels
 * 
 * @param step - Current step (1-indexed, so step 1 = first step)
 * @param total - Total number of steps
 * @param title - Optional title to display
 * @param stepLabels - Optional array of step labels for desktop view
 */

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressHeaderProps {
  /** Current step number (1-indexed) */
  step: number;
  /** Total number of steps */
  total: number;
  /** Optional title for the header */
  title?: string;
  /** Optional step labels for desktop view */
  stepLabels?: { id: number; label: string; icon?: React.ComponentType<{ className?: string }> }[];
}

export function ProgressHeader({ step, total, title, stepLabels }: ProgressHeaderProps) {
  // CRITICAL: Clamp step to valid range to prevent "Schritt 8 von 4" bug
  const safeStep = Math.max(1, Math.min(step, total));
  const pct = Math.round((safeStep / total) * 100);
  
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Desktop: Show step labels if provided */}
        {stepLabels && stepLabels.length > 0 && (
          <div className="hidden sm:flex items-center justify-between mb-3">
            {stepLabels.map((stepItem, idx) => {
              const isActive = stepItem.id === safeStep;
              const isCompleted = stepItem.id < safeStep;
              const Icon = stepItem.icon;
              
              return (
                <React.Fragment key={stepItem.id}>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                      isActive && 'bg-primary text-primary-foreground',
                      isCompleted && 'bg-primary/20 text-primary',
                      !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : Icon ? (
                        <Icon className="h-3.5 w-3.5" />
                      ) : (
                        stepItem.id
                      )}
                    </div>
                    <span className={cn(
                      'text-xs font-medium hidden md:inline',
                      isActive && 'text-primary',
                      isCompleted && 'text-muted-foreground',
                      !isActive && !isCompleted && 'text-muted-foreground/50'
                    )}>
                      {stepItem.label}
                    </span>
                  </div>
                  {idx < stepLabels.length - 1 && (
                    <div className={cn(
                      'flex-1 h-0.5 mx-2 max-w-8 lg:max-w-12',
                      isCompleted ? 'bg-primary' : 'bg-border'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
        
        {/* Mobile & Fallback: Simple step counter */}
        <div className={cn(
          "flex items-center justify-between mb-2",
          stepLabels && stepLabels.length > 0 && "sm:hidden"
        )}>
          {title ? (
            <h2 className="text-lg font-semibold">{title}</h2>
          ) : (
            <span className="text-sm font-medium">
              {stepLabels?.[safeStep - 1]?.label || `Schritt ${safeStep}`}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            Schritt {safeStep}/{total}
          </span>
        </div>
        
        <Progress value={pct} className="h-1.5" />
      </div>
    </div>
  );
}

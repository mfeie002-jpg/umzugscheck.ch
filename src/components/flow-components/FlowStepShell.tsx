/**
 * FlowStepShell Component - UX Compliance Checklist:
 * ✅ Mobile-first layout with proper padding
 * ✅ Progress indicator in header
 * ✅ Back navigation
 * ✅ Content area with proper scroll handling
 * ✅ Space for sticky CTA at bottom
 */

import React, { memo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrustBar } from './TrustBar';

export interface FlowStepShellProps {
  /** Step title */
  title: string;
  /** Step subtitle/description */
  subtitle?: string;
  /** Current step number (1-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Step content */
  children: ReactNode;
  /** Show back button */
  showBack?: boolean;
  /** Back button handler */
  onBack?: () => void;
  /** Show trust bar */
  showTrustBar?: boolean;
  /** Trust bar variant */
  trustBarVariant?: 'compact' | 'full';
  /** Custom className for content area */
  contentClassName?: string;
  /** Animation direction */
  direction?: 'forward' | 'backward';
  /** Bottom padding for sticky CTA */
  hasStickyCta?: boolean;
}

export const FlowStepShell = memo(function FlowStepShell({
  title,
  subtitle,
  currentStep,
  totalSteps,
  children,
  showBack = true,
  onBack,
  showTrustBar = true,
  trustBarVariant = 'compact',
  contentClassName,
  direction = 'forward',
  hasStickyCta = true,
}: FlowStepShellProps) {
  const progress = (currentStep / totalSteps) * 100;
  const slideDirection = direction === 'forward' ? 1 : -1;

  return (
    <div 
      key={`uc-step-${currentStep}`}
      data-uc-step={currentStep}
      className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col"
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {showBack && currentStep > 1 && onBack ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack} 
                className="gap-1.5 -ml-2 h-9 px-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Zurück</span>
              </Button>
            ) : (
              <div className="w-16" />
            )}
            
            <span className="text-sm text-muted-foreground font-medium">
              {currentStep < totalSteps 
                ? `Noch ${totalSteps - currentStep} ${totalSteps - currentStep === 1 ? 'Schritt' : 'Schritte'}`
                : 'Letzter Schritt'
              }
            </span>
            
            <div className="w-16" />
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </header>

      {/* Trust Bar */}
      {showTrustBar && <TrustBar variant={trustBarVariant} />}

      {/* Content Area */}
      <main className={cn(
        "flex-1 container max-w-2xl mx-auto px-4 py-6",
        hasStickyCta && "pb-36", // Space for sticky CTA
        contentClassName
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 * slideDirection }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 * slideDirection }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Step Header */}
            <div className="text-center mb-6">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground text-base sm:text-lg"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>

            {/* Step Content */}
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
});

export default FlowStepShell;

/**
 * FunnelStepShell - Einheitlicher Funnel-Wrapper
 * 
 * FEATURES:
 * - Konsistente Header/Progress/Trust/CTA Struktur
 * - Sticky CTA mit Safe-Area Support
 * - Mobile Keyboard Handling
 * - Inline Validation Support
 * - Scroll to Error
 */

import { ReactNode, useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Send, Shield, Award, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FunnelStepShellProps {
  children: ReactNode;
  
  // Step info
  step: number;
  totalSteps: number;
  stepTitle?: string;
  stepSubtitle?: string;
  
  // Navigation
  onNext: () => void;
  onBack?: () => void;
  canProceed?: boolean;
  hint?: string | null;
  
  // CTA
  ctaLabel?: string;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  
  // Trust
  showTrustPills?: boolean;
  showTimeEstimate?: boolean;
  estimatedTime?: string;
  
  // Prefill
  prefillInfo?: {
    label: string;
    onEdit: () => void;
  } | null;
  
  // Keyboard handling
  formRef?: React.RefObject<HTMLFormElement>;
}

// Trust Pills Component
function TrustPills() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-full">
        <CheckCircle className="w-3.5 h-3.5" />
        Geprüfte Partner
      </span>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">
        <Shield className="w-3.5 h-3.5" />
        Keine Kosten
      </span>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full">
        <Clock className="w-3.5 h-3.5" />
        Antwort in 24h
      </span>
    </div>
  );
}

// Prefill Banner Component
function PrefillBanner({ label, onEdit }: { label: string; onEdit: () => void }) {
  return (
    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2 flex items-center justify-between">
      <span className="text-sm text-blue-800 dark:text-blue-200">
        <CheckCircle className="w-4 h-4 inline mr-2 text-blue-600" />
        Übernommen aus: <strong>{label}</strong>
      </span>
      <button
        type="button"
        onClick={onEdit}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
      >
        Ändern
      </button>
    </div>
  );
}

// Sticky Footer CTA
function StickyFooterCTA({
  step,
  totalSteps,
  canProceed,
  hint,
  onBack,
  onNext,
  ctaLabel,
  isSubmitting,
  isLastStep,
}: {
  step: number;
  totalSteps: number;
  canProceed: boolean;
  hint?: string | null;
  onBack?: () => void;
  onNext: () => void;
  ctaLabel: string;
  isSubmitting: boolean;
  isLastStep: boolean;
}) {
  const getIcon = () => {
    if (isSubmitting) return <Loader2 className="h-5 w-5 animate-spin" />;
    if (isLastStep) return <Send className="h-5 w-5" />;
    return <ArrowRight className="h-5 w-5" />;
  };

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Gradient fade */}
      <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-2xl px-4 pt-3 pb-4">
        {/* Mini Trust Row */}
        <div className="flex items-center justify-center gap-3 mb-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-red-500" />
            ASTAG
          </span>
          <span>•</span>
          <span>100% kostenlos</span>
          <span>•</span>
          <span>~60 Sek.</span>
        </div>
        
        {/* Hint */}
        <AnimatePresence>
          {!canProceed && hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {hint}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Buttons */}
        <div className="flex gap-3">
          {step > 1 && onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="h-14 flex-1 gap-2 rounded-xl font-semibold text-base border-2 min-w-[100px]"
            >
              <ArrowLeft className="h-5 w-5" />
              Zurück
            </Button>
          )}
          
          <Button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={cn(
              "h-14 gap-3 font-bold transition-all rounded-xl shadow-lg text-base",
              step > 1 && onBack ? "flex-[1.5]" : "w-full",
              isLastStep
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary hover:bg-primary/90",
              !canProceed && "opacity-60 cursor-not-allowed"
            )}
          >
            <span className="text-lg">{ctaLabel}</span>
            {getIcon()}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function FunnelStepShell({
  children,
  step,
  totalSteps,
  stepTitle,
  stepSubtitle,
  onNext,
  onBack,
  canProceed = true,
  hint,
  ctaLabel,
  isSubmitting = false,
  isLastStep = false,
  showTrustPills = true,
  showTimeEstimate = true,
  estimatedTime = '~60 Sek.',
  prefillInfo,
  formRef,
}: FunnelStepShellProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
  // Detect keyboard open (mobile)
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      setIsKeyboardOpen(viewportHeight < windowHeight * 0.8);
    };
    
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);
  
  // Scroll to first error
  const scrollToError = useCallback(() => {
    if (!formRef?.current) return;
    
    const firstError = formRef.current.querySelector('[data-error="true"]');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstError as HTMLElement).focus?.();
    }
  }, [formRef]);
  
  // Progress percentage
  const progress = Math.round((step / totalSteps) * 100);
  
  // Default CTA label
  const finalCtaLabel = ctaLabel || (isLastStep ? 'Offerten erhalten' : 'Weiter');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 max-w-2xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Schritt {step} von {totalSteps}
            </span>
            {showTimeEstimate && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {estimatedTime} • jederzeit kostenlos
              </span>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          
          {/* Trust Pills */}
          {showTrustPills && (
            <div className="mt-3">
              <TrustPills />
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main 
        ref={contentRef}
        className="flex-1 container mx-auto px-4 py-6 max-w-2xl pb-48 sm:pb-40"
      >
        {/* Prefill Banner */}
        {prefillInfo && (
          <div className="mb-4">
            <PrefillBanner label={prefillInfo.label} onEdit={prefillInfo.onEdit} />
          </div>
        )}
        
        {/* Step Title */}
        {stepTitle && (
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {stepTitle}
            </h1>
            {stepSubtitle && (
              <p className="mt-2 text-muted-foreground">
                {stepSubtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Sticky Footer */}
      <StickyFooterCTA
        step={step}
        totalSteps={totalSteps}
        canProceed={canProceed}
        hint={hint}
        onBack={onBack}
        onNext={() => {
          if (!canProceed) {
            scrollToError();
          } else {
            onNext();
          }
        }}
        ctaLabel={finalCtaLabel}
        isSubmitting={isSubmitting}
        isLastStep={isLastStep}
      />
    </div>
  );
}

export default FunnelStepShell;

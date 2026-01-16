/**
 * Progressive Disclosure Components
 * Step-by-step reveal of form complexity
 * Reduces cognitive load and improves completion
 */

import { memo, useState, useCallback, ReactNode, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, Info, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Context for managing disclosure state
interface DisclosureContextValue {
  expandedSections: Set<string>;
  toggleSection: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  isExpanded: (id: string) => boolean;
}

const DisclosureContext = createContext<DisclosureContextValue | null>(null);

export function useDisclosure() {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error('useDisclosure must be used within a DisclosureProvider');
  }
  return context;
}

// Provider component
interface DisclosureProviderProps {
  children: ReactNode;
  defaultExpanded?: string[];
}

export const DisclosureProvider = memo(function DisclosureProvider({
  children,
  defaultExpanded = []
}: DisclosureProviderProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    // This would need to know all section IDs - implement as needed
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  const isExpanded = useCallback((id: string) => {
    return expandedSections.has(id);
  }, [expandedSections]);

  return (
    <DisclosureContext.Provider value={{
      expandedSections,
      toggleSection,
      expandAll,
      collapseAll,
      isExpanded
    }}>
      {children}
    </DisclosureContext.Provider>
  );
});

// Collapsible section component
interface CollapsibleSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  optional?: boolean;
  badge?: string;
  className?: string;
}

export const CollapsibleSection = memo(function CollapsibleSection({
  id,
  title,
  description,
  children,
  defaultOpen = false,
  optional = false,
  badge,
  className
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left transition-colors',
          isOpen ? 'bg-muted/50' : 'hover:bg-muted/30'
        )}
        aria-expanded={isOpen}
        aria-controls={`section-${id}`}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}>
            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{title}</span>
              {optional && (
                <span className="text-xs text-muted-foreground">(optional)</span>
              )}
              {badge && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        
        <ChevronDown className={cn(
          'w-5 h-5 text-muted-foreground transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`section-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-t">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// "Show more" inline disclosure
interface ShowMoreProps {
  previewLines?: number;
  children: ReactNode;
  className?: string;
}

export const ShowMore = memo(function ShowMore({
  previewLines = 2,
  children,
  className
}: ShowMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={className}>
      <div className={cn(
        'relative overflow-hidden transition-all',
        !isExpanded && `line-clamp-${previewLines}`
      )}>
        {children}
        
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-sm text-primary hover:underline flex items-center gap-1"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Weniger anzeigen
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Mehr anzeigen
          </>
        )}
      </button>
    </div>
  );
});

// Tooltip/Popover for additional info
interface InfoTooltipProps {
  content: ReactNode;
  title?: string;
  children?: ReactNode;
  className?: string;
}

export const InfoTooltip = memo(function InfoTooltip({
  content,
  title,
  children,
  className
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Mehr Informationen"
      >
        {children || <HelpCircle className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-popover text-popover-foreground rounded-lg shadow-lg border"
          >
            {title && (
              <p className="font-medium mb-1">{title}</p>
            )}
            <div className="text-sm text-muted-foreground">
              {content}
            </div>
            
            {/* Arrow */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover border-l border-t rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Progressive form steps
interface ProgressiveStepsProps {
  steps: {
    id: string;
    title: string;
    description?: string;
    content: ReactNode;
    isOptional?: boolean;
    isCompleted?: boolean;
  }[];
  currentStep: number;
  onStepChange: (step: number) => void;
  className?: string;
}

export const ProgressiveSteps = memo(function ProgressiveSteps({
  steps,
  currentStep,
  onStepChange,
  className
}: ProgressiveStepsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isPast = index < currentStep;
        const isFuture = index > currentStep;

        return (
          <motion.div
            key={step.id}
            initial={false}
            animate={{
              opacity: isFuture ? 0.5 : 1,
              scale: isActive ? 1 : 0.98
            }}
            className={cn(
              'border rounded-lg overflow-hidden transition-colors',
              isActive && 'border-primary shadow-md',
              isPast && step.isCompleted && 'border-green-500/50 bg-green-500/5'
            )}
          >
            {/* Step header */}
            <button
              type="button"
              onClick={() => !isFuture && onStepChange(index)}
              disabled={isFuture}
              className={cn(
                'w-full flex items-center gap-4 p-4 text-left',
                isFuture && 'cursor-not-allowed'
              )}
            >
              {/* Step number */}
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
                isActive && 'bg-primary text-primary-foreground',
                isPast && step.isCompleted && 'bg-green-500 text-white',
                (isFuture || (isPast && !step.isCompleted)) && 'bg-muted text-muted-foreground'
              )}>
                {isPast && step.isCompleted ? '✓' : index + 1}
              </div>

              {/* Step info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'font-medium',
                    isFuture && 'text-muted-foreground'
                  )}>
                    {step.title}
                  </span>
                  {step.isOptional && (
                    <span className="text-xs text-muted-foreground">(optional)</span>
                  )}
                </div>
                {step.description && (
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                )}
              </div>

              {/* Expand indicator */}
              {!isFuture && (
                <ChevronDown className={cn(
                  'w-5 h-5 text-muted-foreground transition-transform',
                  isActive && 'rotate-180'
                )} />
              )}
            </button>

            {/* Step content */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 pt-0 border-t">
                    {step.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
});

// "Advanced options" toggle
interface AdvancedOptionsProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export const AdvancedOptions = memo(function AdvancedOptions({
  children,
  label = 'Erweiterte Optionen',
  className
}: AdvancedOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Info className="w-4 h-4" />
        <span>{label}</span>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-dashed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default {
  DisclosureProvider,
  CollapsibleSection,
  ShowMore,
  InfoTooltip,
  ProgressiveSteps,
  AdvancedOptions
};

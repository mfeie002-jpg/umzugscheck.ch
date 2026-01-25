/**
 * Move Journey Progress Indicator
 * 
 * Visual representation of the 6-phase "Invisible Move" journey.
 * Used across the platform to show users where they are in the process.
 */

import { motion } from 'framer-motion';
import { 
  MapPin, 
  ScanLine, 
  Calculator, 
  CreditCard, 
  Truck, 
  Home,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MoveProjectStatus, getPhaseForStatus } from '@/lib/move-project';

interface JourneyPhase {
  id: number;
  label: string;
  labelDe: string;
  icon: typeof MapPin;
  status: MoveProjectStatus[];
}

const JOURNEY_PHASES: JourneyPhase[] = [
  {
    id: 1,
    label: 'Route',
    labelDe: 'Route',
    icon: MapPin,
    status: ['draft']
  },
  {
    id: 2,
    label: 'Inventory',
    labelDe: 'Inventar',
    icon: ScanLine,
    status: ['inventory_scan']
  },
  {
    id: 3,
    label: 'Quote',
    labelDe: 'Offerte',
    icon: Calculator,
    status: ['quote_ready']
  },
  {
    id: 4,
    label: 'Booking',
    labelDe: 'Buchung',
    icon: CreditCard,
    status: ['booking_pending', 'booked']
  },
  {
    id: 5,
    label: 'Moving',
    labelDe: 'Umzug',
    icon: Truck,
    status: ['scheduled', 'in_transit']
  },
  {
    id: 6,
    label: 'Complete',
    labelDe: 'Zuhause',
    icon: Home,
    status: ['completed', 'closed']
  }
];

interface MoveJourneyProgressProps {
  currentStatus: MoveProjectStatus;
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showLabels?: boolean;
}

export function MoveJourneyProgress({
  currentStatus,
  className,
  variant = 'horizontal',
  showLabels = true
}: MoveJourneyProgressProps) {
  const currentPhase = getPhaseForStatus(currentStatus);
  
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {JOURNEY_PHASES.map((phase, index) => {
          const isCompleted = phase.id < currentPhase;
          const isCurrent = phase.id === currentPhase;
          
          return (
            <motion.div
              key={phase.id}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                isCompleted ? 'bg-primary' : isCurrent ? 'bg-primary/60' : 'bg-muted'
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          );
        })}
      </div>
    );
  }
  
  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {JOURNEY_PHASES.map((phase) => {
          const isCompleted = phase.id < currentPhase;
          const isCurrent = phase.id === currentPhase;
          const Icon = phase.icon;
          
          return (
            <div key={phase.id} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : isCurrent 
                      ? 'bg-primary/20 text-primary border-2 border-primary' 
                      : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              {showLabels && (
                <span className={cn(
                  'text-sm',
                  isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'
                )}>
                  {phase.labelDe}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  
  // Horizontal (default)
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {JOURNEY_PHASES.map((phase, index) => {
        const isCompleted = phase.id < currentPhase;
        const isCurrent = phase.id === currentPhase;
        const Icon = phase.icon;
        
        return (
          <div key={phase.id} className="flex flex-col items-center flex-1">
            {/* Connector line */}
            {index > 0 && (
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                <div
                  className={cn(
                    'h-0.5 w-full transition-colors',
                    phase.id <= currentPhase ? 'bg-primary' : 'bg-muted'
                  )}
                />
              </div>
            )}
            
            {/* Icon */}
            <motion.div
              className={cn(
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all',
                isCompleted 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : isCurrent 
                    ? 'bg-primary/20 text-primary border-2 border-primary ring-4 ring-primary/20' 
                    : 'bg-muted text-muted-foreground'
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </motion.div>
            
            {/* Label */}
            {showLabels && (
              <span className={cn(
                'mt-2 text-xs text-center',
                isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'
              )}>
                {phase.labelDe}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Simplified progress bar for mobile
export function MoveJourneyBar({ 
  currentStatus, 
  className 
}: { 
  currentStatus: MoveProjectStatus; 
  className?: string;
}) {
  const progress = (getPhaseForStatus(currentStatus) / 6) * 100;
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Fortschritt</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

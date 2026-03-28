/**
 * GoldenFlowStep3 - Services (Expandable Cards)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Sparkles, Brush, Trash2, Warehouse, Video,
  Plus, Minus, CheckCircle, Info, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GoldenFlowData, GoldenFlowPriceEstimate } from '../types';
import { GOLDEN_FLOW_SERVICES } from '../constants';
import { GoldenFlowPricePreview } from '../components/GoldenFlowPricePreview';

interface GoldenFlowStep3Props {
  formData: GoldenFlowData;
  priceEstimate: GoldenFlowPriceEstimate | null;
  onUpdate: (data: Partial<GoldenFlowData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Package,
  Sparkles,
  Brush,
  Trash2,
  Warehouse,
  Video,
};

export function GoldenFlowStep3({ formData, priceEstimate, onUpdate, onNext, onBack }: GoldenFlowStep3Props) {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
  const toggleService = (serviceId: string) => {
    if (serviceId === 'umzug') return; // Base service always included
    
    const current = formData.selectedServices || ['umzug'];
    const updated = current.includes(serviceId)
      ? current.filter(id => id !== serviceId)
      : [...current, serviceId];
    
    onUpdate({ selectedServices: updated });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Zusatzleistungen wählen
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Optional: Sparen Sie Zeit mit unseren Services
        </p>
      </div>
      
      {/* Services list */}
      <div className="space-y-3">
        {GOLDEN_FLOW_SERVICES.map((service) => {
          const isSelected = formData.selectedServices?.includes(service.id) || service.included;
          const isExpanded = expandedService === service.id;
          const IconComponent = ICONS[service.icon] || Package;
          
          return (
            <div
              key={service.id}
              className={cn(
                "rounded-xl border-2 transition-all overflow-hidden",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30"
              )}
            >
              {/* Main row */}
              <div
                role="button"
                tabIndex={service.included ? -1 : 0}
                onClick={() => !service.included && toggleService(service.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 text-left min-h-[64px] touch-manipulation",
                  !service.included && "cursor-pointer active:bg-muted/30"
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center border-2 shrink-0 transition-all",
                    isSelected ? "bg-primary border-primary" : "border-muted-foreground/40"
                  )}
                >
                  {isSelected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                </div>
                
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    isSelected ? "bg-primary/20" : "bg-muted"
                  )}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{service.label}</p>
                    {service.highlight && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        💡 Tipp
                      </span>
                    )}
                    {service.popular && !service.highlight && (
                      <span className="text-[10px] bg-secondary/20 text-secondary-foreground px-1.5 py-0.5 rounded-full">
                        Beliebt
                      </span>
                    )}
                    {service.included && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        Inklusive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {service.description}
                  </p>
                </div>
                
                {/* Price & expand */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "text-xs font-medium",
                    service.highlight ? "text-secondary" : "text-primary"
                  )}>
                    {service.priceRange}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedService(isExpanded ? null : service.id);
                    }}
                    className={cn(
                      "p-1.5 rounded-full transition-colors",
                      isExpanded ? "bg-primary/20" : "hover:bg-muted"
                    )}
                  >
                    {isExpanded ? (
                      <Minus className="w-4 h-4 text-primary" />
                    ) : (
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-border/50">
                      <div className="flex items-start gap-2 mb-3">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {service.details}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        {service.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      {service.bookingPercent && (
                        <p className="text-xs text-muted-foreground mt-3 italic">
                          📊 {service.bookingPercent}% unserer Kunden buchen diesen Service
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      {/* Price preview */}
      {priceEstimate && (
        <GoldenFlowPricePreview estimate={priceEstimate} variant="compact" />
      )}
      
      {/* Navigation */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1 h-12">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          className="flex-[2] h-12 bg-gradient-to-r from-secondary to-secondary/90"
        >
          Weiter zu Kontakt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

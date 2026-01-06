/**
 * FlowRenderer Component
 * 
 * Automatically renders a flow from a FlowDefinition.
 * Handles field rendering, validation, and step navigation.
 */

import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowDefinition, FlowField } from './types';
import { useFlowEngine, FlowEngineActions } from './useFlowEngine';
import { FlowRuntimeState } from './types';
import FlowStepShell from '../FlowStepShell';
import ReviewReceipt from '../ReviewReceipt';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon, CheckCircle2, AlertCircle, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface FlowRendererProps {
  definition: FlowDefinition;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onComplete?: () => void;
  className?: string;
}

// Field Renderer Component
const FieldRenderer = memo(({ 
  field, 
  state, 
  actions,
}: { 
  field: FlowField; 
  state: FlowRuntimeState;
  actions: FlowEngineActions;
}) => {
  const value = actions.getFieldValue(field.name);
  const error = actions.getFieldError(field.name);
  const touched = actions.isFieldTouched(field.name);
  
  const handleChange = useCallback((newValue: unknown) => {
    actions.setFieldValue(field.name, newValue);
    
    // Auto-advance for card-select with autoAdvance
    if (field.autoAdvance && (field.type === 'card-select' || field.type === 'select')) {
      setTimeout(() => actions.nextStep(), 300);
    }
  }, [actions, field.name, field.autoAdvance, field.type]);
  
  const handleBlur = useCallback(() => {
    actions.setFieldTouched(field.name);
    actions.validateField(field.name);
  }, [actions, field.name]);
  
  const baseInputClass = cn(
    "h-14 text-lg transition-all duration-200",
    error && touched && "border-destructive ring-1 ring-destructive",
    !error && touched && value && "border-green-500 ring-1 ring-green-500"
  );
  
  // Text, Email, Tel, PLZ, Number
  if (['text', 'email', 'tel', 'plz', 'number'].includes(field.type)) {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-base font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <div className="relative">
          {field.icon && (
            <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          )}
          <Input
            id={field.name}
            type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
            inputMode={field.inputMode || (field.type === 'plz' ? 'numeric' : field.type === 'number' ? 'decimal' : undefined)}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            value={String(value || '')}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className={cn(baseInputClass, field.icon && "pl-10")}
            pattern={field.type === 'plz' ? '[0-9]*' : undefined}
            maxLength={field.type === 'plz' ? 4 : undefined}
          />
          {touched && !error && value && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
          {touched && error && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
          )}
        </div>
        <AnimatePresence>
          {error && touched && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {field.trustPill && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" />
            {field.trustPill}
          </p>
        )}
        {field.helperText && !error && (
          <p className="text-sm text-muted-foreground">{field.helperText}</p>
        )}
      </div>
    );
  }
  
  // Date Picker
  if (field.type === 'date') {
    const dateValue = value ? new Date(value as string) : undefined;
    
    return (
      <div className="space-y-2">
        <Label className="text-base font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-14 justify-start text-left font-normal text-lg",
                !dateValue && "text-muted-foreground",
                error && touched && "border-destructive"
              )}
              onBlur={handleBlur}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {dateValue ? format(dateValue, 'dd.MM.yyyy', { locale: de }) : field.placeholder || 'Datum wählen'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(date) => handleChange(date?.toISOString())}
              disabled={(date) => date < new Date()}
              initialFocus
              locale={de}
            />
          </PopoverContent>
        </Popover>
        {error && touched && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
  
  // Card Select (Single)
  if (field.type === 'card-select' && field.options) {
    const columns = field.columns || 2;
    
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <div className={cn("grid gap-3", `grid-cols-${columns}`)}>
          {field.options.map((option) => {
            const isSelected = value === option.value;
            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleChange(option.value)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "hover:border-primary/50 hover:bg-primary/5",
                  isSelected 
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                    : "border-border bg-card"
                )}
              >
                {option.recommended && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    Empfohlen
                  </span>
                )}
                <div className="flex items-center gap-3">
                  {option.icon && <option.icon className="h-6 w-6 text-primary" />}
                  <div>
                    <p className="font-medium">{option.label}</p>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    )}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
        {error && touched && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
  
  // Multi-Select
  if (field.type === 'multi-select' && field.options) {
    const selectedValues = (value as string[]) || [];
    
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {field.options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  const newValue = isSelected
                    ? selectedValues.filter(v => v !== option.value)
                    : [...selectedValues, option.value];
                  handleChange(newValue);
                }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "hover:border-primary/50 hover:bg-primary/5",
                  isSelected 
                    ? "border-primary bg-primary/10" 
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <option.icon className="h-5 w-5 text-primary" />}
                  <span className="font-medium">{option.label}</span>
                  {isSelected && (
                    <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Rooms Selector
  if (field.type === 'rooms') {
    const roomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5+'];
    
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {roomOptions.map((room) => {
            const isSelected = value === room;
            return (
              <motion.button
                key={room}
                type="button"
                onClick={() => handleChange(room)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "py-3 px-2 rounded-lg border-2 font-medium transition-all",
                  isSelected 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-border hover:border-primary/50"
                )}
              >
                {room}
              </motion.button>
            );
          })}
        </div>
        {error && touched && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
  
  // Toggle/Switch
  if (field.type === 'toggle') {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <div>
          <Label htmlFor={field.name} className="text-base font-medium">
            {field.label}
          </Label>
          {field.helperText && (
            <p className="text-sm text-muted-foreground">{field.helperText}</p>
          )}
        </div>
        <Switch
          id={field.name}
          checked={Boolean(value)}
          onCheckedChange={handleChange}
        />
      </div>
    );
  }
  
  // Slider
  if (field.type === 'slider') {
    const sliderValue = Number(value) || field.min || 0;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <span className="text-lg font-semibold text-primary">{sliderValue} m²</span>
        </div>
        <Slider
          value={[sliderValue]}
          onValueChange={([val]) => handleChange(val)}
          min={field.min || 10}
          max={field.max || 300}
          step={field.step || 5}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{field.min || 10} m²</span>
          <span>{field.max || 300} m²</span>
        </div>
      </div>
    );
  }
  
  return null;
});

FieldRenderer.displayName = 'FieldRenderer';

// Main FlowRenderer Component
export const FlowRenderer = memo(({ 
  definition, 
  onSubmit, 
  onComplete,
  className 
}: FlowRendererProps) => {
  const [state, actions] = useFlowEngine(definition);
  
  const currentStepDef = definition.steps[state.currentStep - 1];
  const isLastStep = state.currentStep === definition.steps.length;
  const reviewItems = currentStepDef?.showReview ? actions.generateReviewItems() : [];
  
  const handleSubmit = useCallback(async () => {
    if (!actions.validateCurrentStep()) return;
    
    if (!isLastStep) {
      actions.nextStep();
      return;
    }
    
    // Submit
    actions.setSubmitting(true);
    actions.setSubmitError(null);
    
    try {
      await onSubmit(actions.getFormData());
      actions.setComplete();
      onComplete?.();
    } catch (error) {
      actions.setSubmitError(
        error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten'
      );
    } finally {
      actions.setSubmitting(false);
    }
  }, [actions, isLastStep, onSubmit, onComplete]);
  
  const handleEditFromReview = useCallback((step: number) => {
    actions.goToStep(step);
  }, [actions]);
  
  // Success state
  if (state.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {definition.successMessage || 'Vielen Dank!'}
          </h2>
          <p className="text-muted-foreground">
            Wir haben Ihre Anfrage erhalten und melden uns in Kürze.
          </p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <FlowStepShell
      title={currentStepDef?.title || ''}
      currentStep={state.currentStep}
      totalSteps={definition.steps.length}
      onBack={state.currentStep > 1 ? actions.prevStep : undefined}
      showTrustBar={currentStepDef?.showTrustBar}
    >
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="space-y-6"
      >
        {currentStepDef?.subtitle && (
          <p className="text-muted-foreground text-center">
            {currentStepDef.subtitle}
          </p>
        )}
        
        {/* Render Fields */}
        <div className="space-y-5">
          {currentStepDef?.fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              state={state}
              actions={actions}
            />
          ))}
        </div>
        
        {/* Review Receipt */}
        {currentStepDef?.showReview && reviewItems.length > 0 && (
          <ReviewReceipt
            title="Ihre Angaben"
            items={reviewItems.map(item => ({
              label: item.label,
              value: item.value,
              editStep: currentStepDef.reviewEditable ? item.editStep : undefined,
            }))}
            onEdit={currentStepDef.reviewEditable ? handleEditFromReview : undefined}
          />
        )}
        
        {/* Submit Error */}
        <AnimatePresence>
          {state.submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm"
            >
              {state.submitError}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={state.isSubmitting}
          className="w-full h-14 text-lg font-semibold gap-2"
        >
          {state.isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Wird gesendet...
            </>
          ) : isLastStep ? (
            <>
              <Lock className="h-5 w-5" />
              {definition.submitButtonText || 'Kostenlose Offerten erhalten'}
            </>
          ) : (
            <>
              Weiter
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    </FlowStepShell>
  );
});

FlowRenderer.displayName = 'FlowRenderer';

export default FlowRenderer;

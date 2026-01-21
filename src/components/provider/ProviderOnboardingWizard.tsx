import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, User, Briefcase, ShieldCheck, CreditCard,
  ChevronRight, ChevronLeft, Check, Upload, Info,
  Users, Star, Shield, TrendingUp, Headphones, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  PROVIDER_ONBOARDING_STEPS, 
  ONBOARDING_BENEFITS,
  validateStep,
  type OnboardingField 
} from '@/lib/provider-onboarding';
import { toast } from 'sonner';

const STEP_ICONS = {
  company: Building2,
  contact: User,
  services: Briefcase,
  verification: ShieldCheck,
  pricing: CreditCard,
};

const BENEFIT_ICONS = {
  Users, Star, Shield, TrendingUp, Headphones, Zap
};

export const ProviderOnboardingWizard = memo(function ProviderOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step = PROVIDER_ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep) / PROVIDER_ONBOARDING_STEPS.length) * 100;
  const StepIcon = STEP_ICONS[step.id as keyof typeof STEP_ICONS] || Building2;

  const handleFieldChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  const handleNext = () => {
    const stepErrors = validateStep(step.id, formData);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    if (currentStep < PROVIDER_ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setErrors([]);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Registrierung erfolgreich! Wir prüfen Ihre Daten und melden uns innerhalb von 24 Stunden.');
    setIsSubmitting(false);
  };

  const renderField = (field: OnboardingField) => {
    const value = formData[field.name];
    
    switch (field.type) {
      case 'select':
        return (
          <Select
            value={value as string || ''}
            onValueChange={(v) => handleFieldChange(field.name, v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Auswählen...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'multiselect':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="grid grid-cols-2 gap-2">
            {field.options?.map(opt => (
              <label 
                key={opt.value}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                  selectedValues.includes(opt.value)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={selectedValues.includes(opt.value)}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...selectedValues, opt.value]
                      : selectedValues.filter(v => v !== opt.value);
                    handleFieldChange(field.name, newValues);
                  }}
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value as string || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        );
      
      case 'file':
        return (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Datei hier ablegen oder klicken zum Hochladen
            </p>
            <input type="file" className="hidden" />
          </div>
        );
      
      case 'checkbox':
        return (
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={value as boolean || false}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
              className="mt-0.5"
            />
            <span className="text-sm">{field.label}</span>
          </label>
        );
      
      default:
        return (
          <Input
            type={field.type}
            value={value as string || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Partner werden bei Umzugscheck.ch
          </h1>
          <p className="text-primary-foreground/80">
            Registrieren Sie Ihr Unternehmen und erhalten Sie qualifizierte Umzugsanfragen
          </p>
        </div>
      </div>

      <div className="container max-w-4xl py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Steps */}
          <div className="md:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Progress */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Fortschritt</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Step List */}
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                {PROVIDER_ONBOARDING_STEPS.map((s, idx) => {
                  const Icon = STEP_ICONS[s.id as keyof typeof STEP_ICONS] || Building2;
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  
                  return (
                    <div
                      key={s.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-all",
                        isActive && "bg-primary/10 border border-primary/20",
                        isCompleted && "text-success",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isActive && "bg-primary text-primary-foreground",
                        isCompleted && "bg-success text-white",
                        !isActive && !isCompleted && "bg-muted"
                      )}>
                        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-medium">{s.title}</span>
                    </div>
                  );
                })}
              </div>

              {/* Benefits */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold mb-3">Ihre Vorteile</h3>
                <div className="space-y-3">
                  {ONBOARDING_BENEFITS.slice(0, 4).map((benefit, idx) => {
                    const Icon = BENEFIT_ICONS[benefit.icon as keyof typeof BENEFIT_ICONS] || Users;
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{benefit.title}</p>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                {/* Step Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <StepIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{step.title}</h2>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                    <ul className="text-sm text-destructive space-y-1">
                      {errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fields */}
                <div className="space-y-5">
                  {step.fields.map(field => (
                    <div key={field.name} className="space-y-2">
                      {field.type !== 'checkbox' && (
                        <Label className="flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-destructive">*</span>}
                        </Label>
                      )}
                      {renderField(field)}
                      {field.helpText && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          {field.helpText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Zurück
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="min-w-[150px]"
                  >
                    {isSubmitting ? (
                      'Wird gesendet...'
                    ) : currentStep === PROVIDER_ONBOARDING_STEPS.length - 1 ? (
                      <>
                        Registrieren
                        <Check className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Weiter
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
});

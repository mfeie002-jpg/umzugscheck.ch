/**
 * OptimizedLeadForm - Minimal friction contact form
 * Step 5.6 - Form optimization with fewer fields
 */
import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Check, Loader2, Shield, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Minimal schema - only essential fields
const quickLeadSchema = z.object({
  name: z.string().min(2, 'Name erforderlich'),
  phone: z.string().min(10, 'Telefonnummer erforderlich'),
});

const fullLeadSchema = quickLeadSchema.extend({
  email: z.string().email('Gültige E-Mail erforderlich'),
  fromCity: z.string().min(2, 'Von-Ort erforderlich'),
  toCity: z.string().min(2, 'Nach-Ort erforderlich'),
});

type QuickFormData = z.infer<typeof quickLeadSchema>;
type FullFormData = z.infer<typeof fullLeadSchema>;

interface OptimizedLeadFormProps {
  variant?: 'quick' | 'full';
  onSubmit?: (data: QuickFormData | FullFormData) => void;
  className?: string;
  source?: string;
}

export const OptimizedLeadForm = memo(function OptimizedLeadForm({
  variant = 'quick',
  onSubmit,
  className,
  source = 'unknown',
}: OptimizedLeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFullForm, setShowFullForm] = useState(variant === 'full');

  const quickForm = useForm<QuickFormData>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: { name: '', phone: '' },
  });

  const fullForm = useForm<FullFormData>({
    resolver: zodResolver(fullLeadSchema),
    defaultValues: { name: '', phone: '', email: '', fromCity: '', toCity: '' },
  });

  const handleQuickSubmit = async (data: QuickFormData) => {
    setIsSubmitting(true);
    
    // Track form submission
    console.log('Quick form submitted:', { ...data, source });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit?.(data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleFullSubmit = async (data: FullFormData) => {
    setIsSubmitting(true);
    
    console.log('Full form submitted:', { ...data, source });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit?.(data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'bg-green-50 dark:bg-green-950/20 rounded-xl p-6 text-center',
          className
        )}
      >
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
          Anfrage erhalten!
        </h3>
        <p className="text-sm text-green-600 dark:text-green-500">
          Wir melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <AnimatePresence mode="wait">
        {!showFullForm ? (
          <motion.form
            key="quick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={quickForm.handleSubmit(handleQuickSubmit)}
            className="space-y-4"
          >
            {/* Quick Form - Only 2 fields */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Ihr Name"
                  {...quickForm.register('name')}
                  className="mt-1"
                />
                {quickForm.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {quickForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Telefon
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="079 123 45 67"
                    {...quickForm.register('phone')}
                    className="pl-10"
                  />
                </div>
                {quickForm.formState.errors.phone && (
                  <p className="text-xs text-destructive mt-1">
                    {quickForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              Rückruf anfordern
            </Button>

            <button
              type="button"
              onClick={() => setShowFullForm(true)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Mehr Details angeben →
            </button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="w-3 h-3 text-green-500" />
                <span>Datenschutz</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>30 Sek.</span>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={fullForm.handleSubmit(handleFullSubmit)}
            className="space-y-4"
          >
            {/* Full Form - 5 fields in optimal layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Ihr vollständiger Name"
                  {...fullForm.register('name')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fullPhone">Telefon *</Label>
                <Input
                  id="fullPhone"
                  type="tel"
                  placeholder="079 123 45 67"
                  {...fullForm.register('phone')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fullEmail">E-Mail *</Label>
                <Input
                  id="fullEmail"
                  type="email"
                  placeholder="ihre@email.ch"
                  {...fullForm.register('email')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fromCity">Von (Ort) *</Label>
                <Input
                  id="fromCity"
                  placeholder="z.B. Zürich"
                  {...fullForm.register('fromCity')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="toCity">Nach (Ort) *</Label>
                <Input
                  id="toCity"
                  placeholder="z.B. Bern"
                  {...fullForm.register('toCity')}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              Offerten anfordern
            </Button>

            <button
              type="button"
              onClick={() => setShowFullForm(false)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Weniger Felder
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
});

/**
 * Step 4: Contact Form
 * Collects contact details after method selection
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowLeft, Send, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { SmartRouterData, SmartRouterPriceEstimate } from '../types';

interface ContactStepProps {
  formData: SmartRouterData;
  priceEstimate: SmartRouterPriceEstimate | null;
  isSubmitting: boolean;
  onUpdate: (updates: Partial<SmartRouterData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function ContactStep({ 
  formData, 
  priceEstimate,
  isSubmitting,
  onUpdate, 
  onSubmit, 
  onBack 
}: ContactStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bitte geben Sie Ihren Namen ein';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Bitte geben Sie Ihre E-Mail ein';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail ein';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Bitte geben Sie Ihre Telefonnummer ein';
    }
    
    if (!formData.agbAccepted) {
      newErrors.agb = 'Bitte akzeptieren Sie die AGB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  }, [validate, onSubmit]);

  const methodLabel = formData.selectedMethod === 'video' ? 'Video-Analyse' : 'Express-Formular';

  return (
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto space-y-6"
    >
      {/* Summary header */}
      <div className="text-center p-4 bg-muted/50 rounded-xl">
        <p className="text-sm text-muted-foreground">Ihre Anfrage</p>
        <p className="font-medium">
          {formData.fromPLZ} → {formData.toPLZ} • {formData.rooms} Zi. • {methodLabel}
        </p>
        {priceEstimate && (
          <p className="text-lg font-semibold text-primary mt-1">
            CHF {priceEstimate.min.toLocaleString()} - {priceEstimate.max.toLocaleString()}
          </p>
        )}
      </div>

      {/* Contact Fields */}
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Name
          </label>
          <Input
            type="text"
            placeholder="Max Muster"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={`h-12 ${errors.name ? 'border-destructive' : ''}`}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            E-Mail
          </label>
          <Input
            type="email"
            placeholder="max@beispiel.ch"
            value={formData.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Telefon
          </label>
          <Input
            type="tel"
            placeholder="079 123 45 67"
            value={formData.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className={`h-12 ${errors.phone ? 'border-destructive' : ''}`}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        {/* Comments (optional) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Bemerkungen (optional)
          </label>
          <Textarea
            placeholder="Besondere Wünsche, Klaviertransport, etc."
            value={formData.comments}
            onChange={(e) => onUpdate({ comments: e.target.value })}
            rows={2}
          />
        </div>

        {/* AGB Checkbox */}
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
          <Checkbox
            id="agb"
            checked={formData.agbAccepted}
            onCheckedChange={(checked) => onUpdate({ agbAccepted: checked === true })}
            className="mt-0.5"
          />
          <label htmlFor="agb" className="text-sm text-muted-foreground cursor-pointer">
            Ich akzeptiere die{' '}
            <a href="/agb" target="_blank" className="text-primary underline">AGB</a>
            {' '}und{' '}
            <a href="/datenschutz" target="_blank" className="text-primary underline">Datenschutzerklärung</a>.
          </label>
        </div>
        {errors.agb && <p className="text-xs text-destructive">{errors.agb}</p>}
      </div>

      {/* Trust reminder */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5" />
        <span>Ihre Daten werden sicher übertragen und nicht an Dritte verkauft.</span>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 h-12"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-[2] h-12"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Wird gesendet...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Offerten anfordern
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}

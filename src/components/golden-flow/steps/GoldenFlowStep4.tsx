/**
 * GoldenFlowStep4 - Contact & Submit
 * Phase 2.1: Result Teasing (Glimp Method) integrated
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MessageSquare, Shield, 
  ArrowLeft, CheckCircle, Loader2, Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { GoldenFlowData, GoldenFlowPriceEstimate } from '../types';
import { GoldenFlowPricePreview } from '../components/GoldenFlowPricePreview';
import { GoldenFlowTrustBar } from '../components/GoldenFlowTrustBar';
import { GoldenFlowResultTeaser } from '../components/GoldenFlowResultTeaser';

interface GoldenFlowStep4Props {
  formData: GoldenFlowData;
  priceEstimate: GoldenFlowPriceEstimate | null;
  isSubmitting: boolean;
  onUpdate: (data: Partial<GoldenFlowData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function GoldenFlowStep4({ 
  formData, 
  priceEstimate, 
  isSubmitting,
  onUpdate, 
  onSubmit, 
  onBack 
}: GoldenFlowStep4Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Bitte geben Sie Ihren Namen ein';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail ein';
    }
    
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 9) {
      newErrors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein';
    }
    
    if (!formData.agbAccepted) {
      newErrors.agb = 'Bitte akzeptieren Sie die AGB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
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
          Fast geschafft! Kontaktdaten
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Die Firmen melden sich innerhalb von 24 Stunden
        </p>
      </div>
      
      {/* Result Teaser (Phase 2.1 - Glimp Method) */}
      <GoldenFlowResultTeaser 
        matchedCompanies={3}
        fromCity={formData.fromCity}
        toCity={formData.toCity}
      />
      
      {/* Summary */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-2">
        <h3 className="font-medium text-sm">Ihre Anfrage:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>📍 Von: {formData.fromPLZ} {formData.fromCity}</div>
          <div>📍 Nach: {formData.toPLZ} {formData.toCity}</div>
          <div>🏠 {formData.rooms} Zimmer, {formData.floor}. Stock</div>
          <div>📅 {formData.moveDate || 'Flexibel'}</div>
        </div>
        <div className="text-xs">
          <span className="font-medium">Services: </span>
          {formData.selectedServices?.join(', ') || 'Basis-Umzug'}
        </div>
      </div>
      
      {/* Contact form */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            Vor- und Nachname
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Max Muster"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={cn("h-12", errors.name && "border-destructive")}
            autoComplete="name"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck="false"
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-primary" />
            E-Mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="max@beispiel.ch"
            value={formData.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className={cn("h-12", errors.email && "border-destructive")}
            autoComplete="email"
            inputMode="email"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email}</p>
          )}
        </div>
        
        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-primary" />
            Telefon
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="079 123 45 67"
            value={formData.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className={cn("h-12", errors.phone && "border-destructive")}
            autoComplete="tel"
            inputMode="tel"
            autoCapitalize="off"
            autoCorrect="off"
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Shield className="h-3 w-3 text-green-600" />
            Nur für Offerten-Rückfragen – keine Werbeanrufe
          </p>
        </div>
        
        {/* Comments (optional) */}
        <div>
          <Label htmlFor="comments" className="text-sm font-medium flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Bemerkungen (optional)
          </Label>
          <Textarea
            id="comments"
            placeholder="z.B. Klavier vorhanden, enge Treppe..."
            value={formData.comments}
            onChange={(e) => onUpdate({ comments: e.target.value })}
            className="min-h-[80px]"
          />
        </div>
        
        {/* AGB */}
        <div className={cn(
          "flex items-start gap-3 p-4 rounded-xl border",
          errors.agb ? "border-destructive bg-destructive/5" : "border-border"
        )}>
          <Checkbox
            id="agb"
            checked={formData.agbAccepted}
            onCheckedChange={(checked) => onUpdate({ agbAccepted: checked === true })}
            className="mt-0.5"
          />
          <Label htmlFor="agb" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
            Ich akzeptiere die{' '}
            <a href="/agb" target="_blank" className="text-primary underline">AGB</a>
            {' '}und{' '}
            <a href="/datenschutz" target="_blank" className="text-primary underline">Datenschutzerklärung</a>.
            Meine Daten werden nur zur Offerten-Erstellung verwendet.
          </Label>
        </div>
      </div>
      
      {/* Price preview */}
      {priceEstimate && (
        <GoldenFlowPricePreview estimate={priceEstimate} />
      )}
      
      {/* Navigation */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1 h-14" disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="flex-[2] h-14 text-lg font-bold bg-gradient-to-r from-secondary to-secondary/90 shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Kostenlos Offerten erhalten
            </>
          )}
        </Button>
      </div>
      
      {/* Trust bar */}
      <GoldenFlowTrustBar />
    </motion.div>
  );
}

/**
 * V1b Feedback-Based - ChatGPT Agent Optimized
 * 
 * Basierend auf detailliertem ChatGPT-Feedback:
 * - 4-Step Flow: Typ+Details → Services → Firmen → Kontakt
 * - Sticky Navigation mit Weiter/Zurück
 * - Vereinfachte Service-Auswahl (Akkordeon-Stil)
 * - Transparenter Preis-Estimator mit Info-Tooltip
 * - Verbesserte Firmenvergleich (vertikaler Scroll auf Mobile)
 * - Trust-Signale & Datenschutz-Kommunikation
 * - Mobile-first responsive Design
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { 
  Shield, CheckCircle2, Lock, MapPin, Calendar, User, Mail, Phone, 
  ArrowLeft, ArrowRight, Send, Home, Building2, Briefcase, Info,
  Star, Package, Sparkles, Trash2, Clock, Filter, ChevronDown, ChevronUp,
  TrendingUp, Users, Award
} from 'lucide-react';

// Step Configuration
const STEPS = [
  { id: 1, title: 'Typ & Details', shortTitle: 'Details' },
  { id: 2, title: 'Services', shortTitle: 'Services' },
  { id: 3, title: 'Firmen', shortTitle: 'Firmen' },
  { id: 4, title: 'Kontakt', shortTitle: 'Kontakt' },
];

// Apartment sizes
const APARTMENT_SIZES = [
  { id: 'studio', label: 'Studio', rooms: '1', basePrice: 800 },
  { id: '2-2.5', label: '2-2.5 Zimmer', rooms: '2-2.5', basePrice: 1200 },
  { id: '3-3.5', label: '3-3.5 Zimmer', rooms: '3-3.5', basePrice: 1600 },
  { id: '4-4.5', label: '4-4.5 Zimmer', rooms: '4-4.5', basePrice: 2100 },
  { id: '5+', label: '5+ Zimmer', rooms: '5+', basePrice: 2800 },
];

// Move types
const MOVE_TYPES = [
  { id: 'apartment', label: 'Wohnung', icon: Home, description: 'Privatumzug aus einer Wohnung' },
  { id: 'house', label: 'Haus', icon: Building2, description: 'Umzug aus einem Einfamilienhaus' },
  { id: 'office', label: 'Büro', icon: Briefcase, description: 'Geschäfts- oder Firmenumzug' },
];

// Services
const SERVICES = [
  { 
    id: 'basic', 
    label: 'Umzug (Basis)', 
    description: 'Transport, Be- und Entladen',
    price: 0,
    included: true,
    badge: null
  },
  { 
    id: 'packing', 
    label: 'Einpack-Service', 
    description: 'Professionelles Einpacken aller Gegenstände',
    price: 400,
    included: false,
    badge: 'Beliebt'
  },
  { 
    id: 'unpacking', 
    label: 'Auspack-Service', 
    description: 'Auspacken und Aufstellen am Zielort',
    price: 350,
    included: false,
    badge: 'Tipp'
  },
  { 
    id: 'cleaning', 
    label: 'Endreinigung', 
    description: 'Professionelle Reinigung der alten Wohnung',
    price: 450,
    included: false,
    badge: null
  },
  { 
    id: 'disposal', 
    label: 'Entsorgung', 
    description: 'Entsorgung von Möbeln und Sperrgut',
    price: 250,
    included: false,
    badge: null
  },
];

// Mock companies
const COMPANIES = [
  { 
    id: '1', 
    name: 'Müller Umzüge AG', 
    location: 'Zürich', 
    rating: 4.9, 
    reviews: 342,
    match: 98,
    priceMin: 1650,
    priceMax: 2100,
    isPremium: true,
    services: ['Privatumzug', 'Einpacken', 'Reinigung']
  },
  { 
    id: '2', 
    name: 'SwissMove GmbH', 
    location: 'Winterthur', 
    rating: 4.7, 
    reviews: 218,
    match: 94,
    priceMin: 1480,
    priceMax: 1950,
    isPremium: false,
    services: ['Privatumzug', 'Büroumzug']
  },
  { 
    id: '3', 
    name: 'Blitz Transport', 
    location: 'Bern', 
    rating: 4.6, 
    reviews: 156,
    match: 91,
    priceMin: 1350,
    priceMax: 1800,
    isPremium: true,
    services: ['Privatumzug', 'Auslandsumzug']
  },
  { 
    id: '4', 
    name: 'Eco Umzug', 
    location: 'Basel', 
    rating: 4.5, 
    reviews: 89,
    match: 87,
    priceMin: 1200,
    priceMax: 1650,
    isPremium: false,
    services: ['Privatumzug', 'Entsorgung']
  },
  { 
    id: '5', 
    name: 'Profi Zügel Team', 
    location: 'Luzern', 
    rating: 4.8, 
    reviews: 267,
    match: 95,
    priceMin: 1550,
    priceMax: 2050,
    isPremium: false,
    services: ['Privatumzug', 'Einpacken', 'Auspacken']
  },
];

// === Reusable Components ===

function ProgressHeader({ step, total, steps }: { step: number; total: number; steps: typeof STEPS }) {
  const pct = Math.round((step / total) * 100);
  
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Step tabs */}
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, idx) => (
            <div 
              key={s.id} 
              className={`flex items-center ${idx < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div className={`flex flex-col items-center ${idx < step ? 'text-primary' : idx === step - 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 
                  ${idx < step ? 'bg-primary text-primary-foreground' : idx === step - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {idx < step - 1 ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                <span className="text-xs hidden sm:block">{s.shortTitle}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${idx < step - 1 ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <Progress value={pct} className="h-1.5" />
        
        {/* Time hint */}
        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Noch {total - step + 1} {total - step + 1 === 1 ? 'Schritt' : 'Schritte'} • ca. 1 Min.</span>
        </div>
      </div>
    </div>
  );
}

function TrustBar({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground py-2">
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" /> SSL-gesichert
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-3 w-3" /> CH-DSG konform
        </span>
      </div>
    );
  }
  
  return (
    <div className="bg-muted/50 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">100% Unverbindlich</p>
            <p className="text-xs text-muted-foreground">Keine Verpflichtung</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Geprüfte Firmen</p>
            <p className="text-xs text-muted-foreground">Schweizer Partner</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Datenschutz</p>
            <p className="text-xs text-muted-foreground">DSG/DSGVO konform</p>
          </div>
        </div>
      </div>
      
      {/* Social proof */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t text-sm">
        <Users className="h-4 w-4 text-primary" />
        <span className="font-medium">15'000+ Umzüge</span>
        <span className="text-muted-foreground">dieses Jahr vermittelt</span>
      </div>
    </div>
  );
}

function StickyFooterCTA({
  primaryLabel,
  onPrimary,
  disabled,
  hint,
  secondaryLabel,
  onSecondary,
  showBack = false,
}: {
  primaryLabel: string;
  onPrimary: () => void;
  disabled?: boolean;
  hint?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
  showBack?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t safe-area-inset-bottom">
      <div className="max-w-2xl mx-auto p-4">
        {hint && <p className="text-center text-xs text-muted-foreground mb-2">{hint}</p>}
        <div className="flex gap-3">
          {showBack && onSecondary && (
            <Button
              variant="outline"
              onClick={onSecondary}
              className="h-12 px-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
          )}
          <Button
            onClick={onPrimary}
            disabled={disabled}
            className="flex-1 h-12 text-base font-semibold"
          >
            {primaryLabel}
            {!disabled && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PriceEstimator({ 
  basePrice, 
  selectedServices 
}: { 
  basePrice: number; 
  selectedServices: string[] 
}) {
  const servicesCost = SERVICES
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
  
  const minPrice = basePrice + servicesCost;
  const maxPrice = Math.round(minPrice * 1.35);
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Geschätzte Kosten</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            CHF {minPrice.toLocaleString('de-CH')} – {maxPrice.toLocaleString('de-CH')}
          </p>
        </div>
        <button 
          className="text-muted-foreground hover:text-foreground p-1"
          title="Berechnet aus Ihren Angaben; endgültiger Preis variiert je nach Service und Anbieter"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        💡 Mit Vergleich sparen Sie bis zu 40%
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  inputMode,
  icon: Icon,
  optional = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  icon?: React.ElementType;
  optional?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium flex items-center gap-2">
        {label}
        {optional && <span className="text-xs text-muted-foreground">(optional)</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`h-12 text-base ${Icon ? 'pl-10' : ''} ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// === Step Components ===

function Step1TypeDetails({
  formData,
  updateField,
  errors,
}: {
  formData: any;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Umzug planen</h1>
        <p className="text-muted-foreground">
          In weniger als 2 Minuten zu bis zu 5 Angeboten
        </p>
      </div>

      {/* Move Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Was ziehen Sie um?</Label>
        <div className="grid grid-cols-3 gap-3">
          {MOVE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => updateField('moveType', type.id)}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all
                ${formData.moveType === type.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-muted-foreground/30'}`}
            >
              <type.icon className={`h-8 w-8 mb-2 ${formData.moveType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`font-medium text-sm ${formData.moveType === type.id ? 'text-primary' : ''}`}>
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Apartment Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Wohnungsgrösse</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {APARTMENT_SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => updateField('apartmentSize', size.id)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all
                ${formData.apartmentSize === size.id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-muted hover:border-muted-foreground/30'}`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Von (PLZ & Ort)"
          name="fromZip"
          value={formData.fromZip}
          onChange={(v) => updateField('fromZip', v)}
          placeholder="z.B. 8048 Zürich"
          autoComplete="postal-code"
          error={errors.fromZip}
          icon={MapPin}
        />
        <Field
          label="Nach (PLZ & Ort)"
          name="toZip"
          value={formData.toZip}
          onChange={(v) => updateField('toZip', v)}
          placeholder="z.B. 3011 Bern"
          autoComplete="postal-code"
          error={errors.toZip}
          icon={MapPin}
        />
      </div>

      {/* Date */}
      <Field
        label="Umzugsdatum"
        name="moveDate"
        type="date"
        value={formData.moveDate}
        onChange={(v) => updateField('moveDate', v)}
        icon={Calendar}
        optional
      />

      {/* Price Estimator - shown when enough data */}
      {formData.apartmentSize && (
        <PriceEstimator 
          basePrice={APARTMENT_SIZES.find(s => s.id === formData.apartmentSize)?.basePrice || 1500}
          selectedServices={formData.selectedServices || ['basic']}
        />
      )}
    </div>
  );
}

function Step2Services({
  formData,
  updateField,
}: {
  formData: any;
  updateField: (field: string, value: any) => void;
}) {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const selectedServices = formData.selectedServices || ['basic'];
  
  const toggleService = (serviceId: string) => {
    if (serviceId === 'basic') return; // Basic is always included
    
    const current = [...selectedServices];
    const idx = current.indexOf(serviceId);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(serviceId);
    }
    updateField('selectedServices', current);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Welche Leistungen?</h1>
        <p className="text-muted-foreground">
          Wählen Sie optionale Zusatzleistungen
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {SERVICES.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          const isExpanded = expandedService === service.id;
          
          return (
            <div
              key={service.id}
              className={`rounded-xl border-2 transition-all overflow-hidden
                ${isSelected ? 'border-primary bg-primary/5' : 'border-muted'}`}
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => service.id !== 'basic' && toggleService(service.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox 
                    checked={isSelected} 
                    disabled={service.included}
                    className="h-5 w-5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{service.label}</span>
                      {service.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {service.badge}
                        </Badge>
                      )}
                      {service.included && (
                        <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/10">
                          Inklusive
                        </Badge>
                      )}
                    </div>
                    {service.price > 0 && (
                      <p className="text-sm text-muted-foreground">
                        + CHF {service.price}–{Math.round(service.price * 1.5)}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedService(isExpanded ? null : service.id);
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground border-t">
                  <p className="pt-3">{service.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Updated Price Estimator */}
      {formData.apartmentSize && (
        <PriceEstimator 
          basePrice={APARTMENT_SIZES.find(s => s.id === formData.apartmentSize)?.basePrice || 1500}
          selectedServices={selectedServices}
        />
      )}

      {/* Recommendation */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl text-sm">
        <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Tipp: Komplettpaket</p>
          <p className="text-muted-foreground">
            Mit Einpack- und Reinigungsservice sparen Sie Zeit und oft 15% gegenüber Einzelbuchungen.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step3Companies({
  formData,
  updateField,
}: {
  formData: any;
  updateField: (field: string, value: any) => void;
}) {
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price'>('recommended');
  const selectedCompanies = formData.selectedCompanies || ['1', '2', '3'];
  
  const toggleCompany = (companyId: string) => {
    const current = [...selectedCompanies];
    const idx = current.indexOf(companyId);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      if (current.length < 5) {
        current.push(companyId);
      }
    }
    updateField('selectedCompanies', current);
  };

  const sortedCompanies = useMemo(() => {
    const companies = [...COMPANIES];
    switch (sortBy) {
      case 'rating':
        return companies.sort((a, b) => b.rating - a.rating);
      case 'price':
        return companies.sort((a, b) => a.priceMin - b.priceMin);
      default:
        return companies.sort((a, b) => b.match - a.match);
    }
  }, [sortBy]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Firmen auswählen</h1>
        <p className="text-muted-foreground">
          Wir empfehlen mindestens 3 Firmen für einen fairen Vergleich
        </p>
      </div>

      {/* Selection info */}
      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="font-medium">{selectedCompanies.length} Firmen ausgewählt</span>
        </div>
        <span className="text-sm text-muted-foreground">max. 5</span>
      </div>

      {/* Sort/Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-sm text-muted-foreground flex-shrink-0">Sortieren:</span>
        {[
          { id: 'recommended', label: 'Empfohlen' },
          { id: 'rating', label: 'Beste Bewertung' },
          { id: 'price', label: 'Günstigste' },
        ].map((option) => (
          <Button
            key={option.id}
            variant={sortBy === option.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy(option.id as any)}
            className="flex-shrink-0"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Companies List - Vertical scroll on mobile */}
      <div className="space-y-3">
        {sortedCompanies.map((company, idx) => {
          const isSelected = selectedCompanies.includes(company.id);
          
          return (
            <div
              key={company.id}
              onClick={() => toggleCompany(company.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                ${isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/30'}
                ${company.isPremium ? 'ring-2 ring-amber-400/50' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox checked={isSelected} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{company.name}</span>
                      {company.isPremium && (
                        <Badge variant="outline" className="text-xs border-amber-400 text-amber-600 bg-amber-50">
                          Premium Partner
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{company.location}</p>
                    
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{company.rating}</span>
                        <span className="text-muted-foreground">({company.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>{company.match}% Match</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {company.services.slice(0, 3).map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-lg">
                    CHF {company.priceMin.toLocaleString('de-CH')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    – {company.priceMax.toLocaleString('de-CH')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparency note */}
      <p className="text-xs text-muted-foreground text-center">
        Auswahl basiert auf Bewertungen, Verfügbarkeit & Nähe zu Ihrem Standort.
        Premium Partner sind gekennzeichnet.
      </p>
    </div>
  );
}

function Step4Contact({
  formData,
  updateField,
  errors,
}: {
  formData: any;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Fast geschafft! 🎉</h1>
        <p className="text-muted-foreground">
          Wohin sollen wir die Offerten senden?
        </p>
      </div>

      {/* Contact Fields */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Field
            label="Vor- und Nachname"
            name="name"
            value={formData.name}
            onChange={(v) => updateField('name', v)}
            placeholder="Max Muster"
            autoComplete="name"
            error={errors.name}
            icon={User}
          />

          <Field
            label="E-Mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={(v) => updateField('email', v)}
            placeholder="max.muster@email.ch"
            autoComplete="email"
            inputMode="email"
            error={errors.email}
            icon={Mail}
          />

          <Field
            label="Telefonnummer"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(v) => updateField('phone', v)}
            placeholder="079 123 45 67"
            autoComplete="tel"
            inputMode="tel"
            error={errors.phone}
            icon={Phone}
            optional
          />
        </CardContent>
      </Card>

      {/* Privacy Checkbox */}
      <div className="flex items-start gap-3">
        <Checkbox 
          id="privacy"
          checked={formData.privacyAccepted}
          onCheckedChange={(checked) => updateField('privacyAccepted', checked)}
          className="mt-0.5"
        />
        <Label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
          Ich akzeptiere die{" "}
          <Link
            to="/datenschutz"
            className="underline text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung
          </Link>{" "}
          und erlaube die Weitergabe meiner Anfrage an ausgewählte Umzugsfirmen zur Offertstellung.
        </Label>
      </div>
      {errors.privacy && <p className="text-sm text-destructive">{errors.privacy}</p>}

      {/* Security/Trust Info */}
      <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-700 dark:text-green-400 mb-1">Ihre Daten sind sicher</p>
            <ul className="space-y-1 text-green-600 dark:text-green-500">
              <li>✓ Keine Werbeanrufe</li>
              <li>✓ Nur an ausgewählte Firmen</li>
              <li>✓ 100% unverbindlich</li>
              <li>✓ Server in der Schweiz</li>
            </ul>
          </div>
        </div>
      </div>

      <TrustBar compact />
    </div>
  );
}

// === Main Component ===

export const V1bFeedbackBased: React.FC = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  
  // Initialize step from capture mode or default to 1
  const [currentStep, setCurrentStep] = useState(() => {
    if (isCaptureMode && captureStep !== null && captureStep >= 1 && captureStep <= 4) {
      return captureStep;
    }
    return 1;
  });
  
  // Initialize form data - use demo data in capture mode
  const [formData, setFormData] = useState(() => ({
    moveType: 'apartment',
    apartmentSize: isCaptureMode ? demoData.apartmentSize : '',
    fromZip: isCaptureMode ? demoData.fromPostal : '',
    toZip: isCaptureMode ? demoData.toPostal : '',
    moveDate: isCaptureMode ? demoData.moveDate : '',
    selectedServices: isCaptureMode ? ['basic', 'packing', 'cleaning'] : ['basic'],
    selectedCompanies: ['1', '2', '3'],
    name: isCaptureMode ? demoData.name : '',
    email: isCaptureMode ? demoData.email : '',
    phone: isCaptureMode ? demoData.phone : '',
    privacyAccepted: isCaptureMode ? true : false,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Update step when capture params change (for URL navigation)
  useEffect(() => {
    if (isCaptureMode && captureStep !== null && captureStep >= 1 && captureStep <= 4) {
      setCurrentStep(captureStep);
    }
  }, [isCaptureMode, captureStep]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.apartmentSize) newErrors.apartmentSize = 'Bitte wählen Sie eine Grösse';
        if (formData.fromZip.length < 4) newErrors.fromZip = 'Gültige PLZ eingeben';
        if (formData.toZip.length < 4) newErrors.toZip = 'Gültige PLZ eingeben';
        break;
      case 2:
        // Services step - no validation needed, basic is always included
        break;
      case 3:
        if (formData.selectedCompanies.length < 1) {
          newErrors.companies = 'Bitte mindestens eine Firma auswählen';
        }
        break;
      case 4:
        if (formData.name.trim().length < 2) newErrors.name = 'Bitte Name eingeben';
        if (!formData.email.includes('@')) newErrors.email = 'Gültige E-Mail eingeben';
        if (!formData.privacyAccepted) newErrors.privacy = 'Bitte Datenschutzerklärung akzeptieren';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        setIsSubmitted(true);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.apartmentSize.length > 0 && formData.fromZip.length >= 4 && formData.toZip.length >= 4;
      case 2:
        return true;
      case 3:
        return formData.selectedCompanies.length >= 1;
      case 4:
        return formData.name.length >= 2 && formData.email.includes('@') && formData.privacyAccepted;
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Anfrage gesendet!</h2>
            <p className="text-muted-foreground">
              Sie erhalten in Kürze {formData.selectedCompanies.length} unverbindliche Offerten 
              von geprüften Umzugsfirmen an <strong>{formData.email}</strong>.
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Durchschnittliche Antwortzeit: 2-4 Stunden
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <ProgressHeader 
        step={currentStep} 
        total={STEPS.length} 
        steps={STEPS}
      />

      <div className="max-w-2xl mx-auto p-4 pt-6">
        {currentStep === 1 && <TrustBar />}

        <Card>
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <Step1TypeDetails 
                formData={formData} 
                updateField={updateField} 
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <Step2Services 
                formData={formData} 
                updateField={updateField}
              />
            )}
            {currentStep === 3 && (
              <Step3Companies 
                formData={formData} 
                updateField={updateField}
              />
            )}
            {currentStep === 4 && (
              <Step4Contact 
                formData={formData} 
                updateField={updateField}
                errors={errors}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <StickyFooterCTA
        primaryLabel={currentStep === 4 ? 'Kostenlos Offerten anfordern' : 'Weiter'}
        onPrimary={handleNext}
        disabled={!canProceed()}
        hint={currentStep === 4 ? 'Unverbindlich • Kostenlos • Geprüfte Partner' : undefined}
        showBack={currentStep > 1}
        onSecondary={handleBack}
      />
    </div>
  );
};

export default V1bFeedbackBased;

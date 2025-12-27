/**
 * V1c Archetyp - Strategische UX-Transformation
 * 
 * Basierend auf dem strategischen Audit-Dokument:
 * - Smart Address Input (PLZ-Autocomplete mit Stadtanzeige)
 * - Flexibles Datum-Modul (Fix, Zeitraum, "Noch unsicher")
 * - "Reinigung mit 100% Abnahmegarantie" als Visual Card
 * - ASTAG/Zertifikats-Badges inline
 * - Trust-Mikro-Copy & Schweizer Wording ("Zügeln", "Offerte")
 * - Smart Defaults für Inventar
 * - Sticky CTA mit Wert-orientiertem Text
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { 
  Shield, CheckCircle2, Lock, MapPin, Calendar, User, Mail, Phone, 
  ArrowLeft, ArrowRight, Home, Building2, Briefcase, Info, Sparkles,
  Star, Package, Trash2, Clock, ChevronDown, ChevronUp, Brush, Warehouse,
  TrendingUp, Users, Award, CalendarRange, HelpCircle
} from 'lucide-react';

// === CONSTANTS ===

const STEPS = [
  { id: 1, title: 'Wohin & Wann?', shortTitle: 'Route' },
  { id: 2, title: 'Services', shortTitle: 'Services' },
  { id: 3, title: 'Firmen', shortTitle: 'Firmen' },
  { id: 4, title: 'Kontakt', shortTitle: 'Kontakt' },
];

// Swiss Postal Code Database (Extended)
const SWISS_POSTAL_DB: Record<string, string> = {
  '8001': 'Zürich', '8002': 'Zürich', '8003': 'Zürich', '8004': 'Zürich', 
  '8005': 'Zürich', '8006': 'Zürich', '8008': 'Zürich', '8032': 'Zürich',
  '8037': 'Zürich', '8045': 'Zürich', '8048': 'Zürich', '8055': 'Zürich',
  '8057': 'Zürich', '8400': 'Winterthur', '8401': 'Winterthur',
  '3000': 'Bern', '3011': 'Bern', '3012': 'Bern', '3013': 'Bern',
  '3014': 'Bern', '3018': 'Bern', '3600': 'Thun',
  '4000': 'Basel', '4001': 'Basel', '4051': 'Basel', '4052': 'Basel',
  '4053': 'Basel', '4055': 'Basel', '4600': 'Olten',
  '6000': 'Luzern', '6003': 'Luzern', '6004': 'Luzern', '6005': 'Luzern',
  '1200': 'Genève', '1201': 'Genève', '1202': 'Genève', '1203': 'Genève',
  '1000': 'Lausanne', '1003': 'Lausanne', '1004': 'Lausanne',
  '9000': 'St. Gallen', '9001': 'St. Gallen',
  '5000': 'Aarau', '5400': 'Baden',
  '6900': 'Lugano', '7000': 'Chur', '2000': 'Neuchâtel', '1700': 'Fribourg',
  '8200': 'Schaffhausen', '2500': 'Biel/Bienne', '8500': 'Frauenfeld',
  '8600': 'Dübendorf', '8700': 'Küsnacht', '8800': 'Thalwil',
  '8810': 'Horgen', '8820': 'Wädenswil', '8610': 'Uster',
};

const getCityFromZip = (zip: string): string | null => {
  return SWISS_POSTAL_DB[zip] || null;
};

// Apartment Sizes with Smart Defaults
const APARTMENT_SIZES = [
  { id: 'studio', label: 'Studio', basePrice: 800, defaultItems: { boxes: 10, furniture: 5 } },
  { id: '2-2.5', label: '2-2.5 Zimmer', basePrice: 1200, defaultItems: { boxes: 20, furniture: 12 } },
  { id: '3-3.5', label: '3-3.5 Zimmer', basePrice: 1600, defaultItems: { boxes: 30, furniture: 18 } },
  { id: '4-4.5', label: '4-4.5 Zimmer', basePrice: 2100, defaultItems: { boxes: 40, furniture: 25 } },
  { id: '5+', label: '5+ Zimmer', basePrice: 2800, defaultItems: { boxes: 55, furniture: 35 } },
];

const MOVE_TYPES = [
  { id: 'apartment', label: 'Wohnung', icon: Home, description: 'Privatumzug' },
  { id: 'house', label: 'Haus', icon: Building2, description: 'Einfamilienhaus' },
  { id: 'office', label: 'Büro/Firma', icon: Briefcase, description: 'Geschäftsumzug' },
];

// Services with Archetyp Optimizations
const SERVICES = [
  { 
    id: 'basic', 
    label: 'Umzug (Basis)', 
    description: 'Transport, sorgfältiges Be- und Entladen durch erfahrene Möbelpacker',
    price: 0,
    included: true,
    badge: null,
    icon: Package,
  },
  { 
    id: 'packing', 
    label: 'Einpack-Service', 
    description: 'Professionelles Einpacken aller Gegenstände – Sie müssen keinen Finger rühren',
    price: 400,
    included: false,
    badge: 'Beliebt',
    icon: Package,
    bookingRate: 73,
  },
  { 
    id: 'unpacking', 
    label: 'Auspack-Service', 
    description: 'Sofort einzugsbereit – wir packen alles aus und entsorgen Kartons',
    price: 350,
    included: false,
    badge: '💡 Tipp',
    icon: Sparkles,
    bookingRate: 52,
  },
  { 
    id: 'cleaning', 
    label: 'Reinigung mit Abnahmegarantie', 
    description: 'Professionelle Endreinigung nach CH-Standard – 100% Abnahmegarantie inklusive',
    price: 450,
    included: false,
    badge: '✅ Garantie',
    icon: Brush,
    highlight: true,
    guaranteeText: 'Falls der Vermieter nicht akzeptiert, reinigen wir kostenlos nach!',
  },
  { 
    id: 'disposal', 
    label: 'Entsorgung', 
    description: 'Fachgerechte Entsorgung von Möbeln, Sperrgut und Elektrogeräten',
    price: 250,
    included: false,
    badge: null,
    icon: Trash2,
  },
  { 
    id: 'storage', 
    label: 'Zwischenlagerung', 
    description: 'Sichere, klimatisierte Lagerung – flexibel von 1 Woche bis 12 Monate',
    price: 150,
    priceNote: '/Monat',
    included: false,
    badge: null,
    icon: Warehouse,
  },
];

// Mock Companies with ASTAG/Zertifikate
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
    isASTAG: true,
    badges: ['ASTAG', 'Versichert'],
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
    isASTAG: true,
    badges: ['ASTAG'],
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
    isASTAG: false,
    badges: ['Versichert'],
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
    isASTAG: true,
    badges: ['ASTAG', 'Öko-zertifiziert'],
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
    isASTAG: true,
    badges: ['ASTAG', 'Premium Partner'],
  },
];

// === REUSABLE COMPONENTS ===

function ProgressHeader({ step, total, steps }: { step: number; total: number; steps: typeof STEPS }) {
  const pct = Math.round((step / total) * 100);
  
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, idx) => (
            <div key={s.id} className={`flex items-center ${idx < steps.length - 1 ? 'flex-1' : ''}`}>
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
        <Progress value={pct} className="h-1.5" />
      </div>
    </div>
  );
}

function TrustBadgesInline() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-full">
        <Shield className="h-3.5 w-3.5 text-primary" />
        <span>Unverbindlich</span>
      </div>
      <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-full">
        <Award className="h-3.5 w-3.5 text-amber-500" />
        <span>ASTAG-Partner</span>
      </div>
      <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-full">
        <Lock className="h-3.5 w-3.5 text-green-600" />
        <span>CH-Datenschutz</span>
      </div>
    </div>
  );
}

function StickyFooterCTA({
  primaryLabel,
  onPrimary,
  disabled,
  hint,
  showBack = false,
  onBack,
}: {
  primaryLabel: string;
  onPrimary: () => void;
  disabled?: boolean;
  hint?: string;
  showBack?: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t">
      <div className="max-w-2xl mx-auto p-4">
        {hint && <p className="text-center text-xs text-muted-foreground mb-2">{hint}</p>}
        <div className="flex gap-3">
          {showBack && onBack && (
            <Button variant="outline" onClick={onBack} className="h-12 px-4">
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

// Smart Address Input with City Display
function SmartAddressInput({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}) {
  const city = value.length >= 4 ? getCityFromZip(value.slice(0, 4)) : null;
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode="numeric"
          className={`h-12 pl-10 pr-24 text-base ${error ? 'border-destructive' : ''}`}
          maxLength={4}
        />
        {city && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">{city}</span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Flexible Date Module
function FlexibleDateModule({
  dateType,
  onDateTypeChange,
  fixedDate,
  onFixedDateChange,
  flexibleMonth,
  onFlexibleMonthChange,
}: {
  dateType: 'fixed' | 'flexible' | 'asap';
  onDateTypeChange: (type: 'fixed' | 'flexible' | 'asap') => void;
  fixedDate: string;
  onFixedDateChange: (date: string) => void;
  flexibleMonth: string;
  onFlexibleMonthChange: (month: string) => void;
}) {
  const monthOptions = useMemo(() => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push({
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('de-CH', { month: 'long', year: 'numeric' }),
      });
    }
    return months;
  }, []);

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Wann soll der Umzug stattfinden?
      </Label>
      
      <RadioGroup value={dateType} onValueChange={(v) => onDateTypeChange(v as any)} className="space-y-3">
        <div className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${dateType === 'fixed' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
          <RadioGroupItem value="fixed" id="date-fixed" />
          <Label htmlFor="date-fixed" className="flex-1 cursor-pointer">
            <span className="font-medium">Fixer Termin</span>
            <p className="text-xs text-muted-foreground">Ich kenne das genaue Datum</p>
          </Label>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${dateType === 'flexible' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
          <RadioGroupItem value="flexible" id="date-flexible" />
          <Label htmlFor="date-flexible" className="flex-1 cursor-pointer">
            <span className="font-medium">Flexibler Zeitraum</span>
            <p className="text-xs text-muted-foreground">Ungefähr in einem bestimmten Monat</p>
          </Label>
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${dateType === 'asap' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
          <RadioGroupItem value="asap" id="date-asap" />
          <Label htmlFor="date-asap" className="flex-1 cursor-pointer">
            <span className="font-medium">Sobald wie möglich</span>
            <p className="text-xs text-muted-foreground">Schnellstmöglicher Termin</p>
          </Label>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      </RadioGroup>

      {dateType === 'fixed' && (
        <Input
          type="date"
          value={fixedDate}
          onChange={(e) => onFixedDateChange(e.target.value)}
          className="h-12"
          min={new Date().toISOString().split('T')[0]}
        />
      )}

      {dateType === 'flexible' && (
        <select
          value={flexibleMonth}
          onChange={(e) => onFlexibleMonthChange(e.target.value)}
          className="w-full h-12 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Monat wählen...</option>
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}

// Service Card with Guarantee Highlight
function ServiceCardArchetyp({
  service,
  isSelected,
  onToggle,
  isExpanded,
  onExpand,
}: {
  service: typeof SERVICES[0];
  isSelected: boolean;
  onToggle: () => void;
  isExpanded: boolean;
  onExpand: () => void;
}) {
  const isHighlight = (service as any).highlight;
  const Icon = service.icon;
  
  return (
    <div
      className={`rounded-xl border-2 transition-all overflow-hidden ${
        isSelected ? 'border-primary bg-primary/5' : 
        isHighlight ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20' : 
        'border-muted hover:border-primary/30'
      }`}
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => service.id !== 'basic' && onToggle()}
      >
        <div className="flex items-center gap-3 flex-1">
          <Checkbox 
            checked={isSelected} 
            disabled={service.included}
            className="h-5 w-5"
          />
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary/20' : isHighlight ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-muted'}`}>
            <Icon className={`h-4 w-4 ${isHighlight ? 'text-amber-600' : ''}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{service.label}</span>
              {service.badge && (
                <Badge variant={isHighlight ? 'default' : 'secondary'} className={`text-xs ${isHighlight ? 'bg-amber-500 hover:bg-amber-600' : ''}`}>
                  {service.badge}
                </Badge>
              )}
              {service.included && (
                <Badge variant="outline" className="text-xs border-primary/50 text-primary">Inklusive</Badge>
              )}
            </div>
            {service.price > 0 && (
              <p className="text-sm text-muted-foreground">
                + CHF {service.price}–{Math.round(service.price * 1.5)}{(service as any).priceNote || ''}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={(e) => { e.stopPropagation(); onExpand(); }}
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground border-t">
          <p className="pt-3">{service.description}</p>
          {(service as any).guaranteeText && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-green-700 dark:text-green-400">
              <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium">{(service as any).guaranteeText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Company Card with ASTAG Badge
function CompanyCardArchetyp({
  company,
  isSelected,
  onToggle,
}: {
  company: typeof COMPANIES[0];
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'
      } ${company.isASTAG ? 'ring-1 ring-amber-400/50' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox checked={isSelected} className="mt-1" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{company.name}</span>
              {company.isASTAG && (
                <Badge variant="outline" className="text-xs border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-900/30">
                  <Award className="h-3 w-3 mr-1" />
                  ASTAG
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
              {company.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">{badge}</Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-lg">CHF {company.priceMin.toLocaleString('de-CH')}</p>
          <p className="text-xs text-muted-foreground">– {company.priceMax.toLocaleString('de-CH')}</p>
        </div>
      </div>
    </div>
  );
}

// === STEP COMPONENTS ===

function Step1RouteDate({
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
          In weniger als 2 Minuten zu unverbindlichen Offerten
        </p>
      </div>

      <TrustBadgesInline />

      {/* Move Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Was zügeln Sie?</Label>
        <div className="grid grid-cols-3 gap-3">
          {MOVE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => updateField('moveType', type.id)}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all
                ${formData.moveType === type.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'}`}
            >
              <type.icon className={`h-7 w-7 mb-2 ${formData.moveType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`font-medium text-sm ${formData.moveType === type.id ? 'text-primary' : ''}`}>{type.label}</span>
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
                ${formData.apartmentSize === size.id ? 'border-primary bg-primary/5 text-primary' : 'border-muted hover:border-primary/30'}`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Address Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SmartAddressInput
          label="Von (PLZ)"
          value={formData.fromZip}
          onChange={(v) => updateField('fromZip', v)}
          placeholder="z.B. 8048"
          error={errors.fromZip}
        />
        <SmartAddressInput
          label="Nach (PLZ)"
          value={formData.toZip}
          onChange={(v) => updateField('toZip', v)}
          placeholder="z.B. 3011"
          error={errors.toZip}
        />
      </div>

      {/* Flexible Date Module */}
      <FlexibleDateModule
        dateType={formData.dateType}
        onDateTypeChange={(type) => updateField('dateType', type)}
        fixedDate={formData.moveDate}
        onFixedDateChange={(date) => updateField('moveDate', date)}
        flexibleMonth={formData.flexibleMonth}
        onFlexibleMonthChange={(month) => updateField('flexibleMonth', month)}
      />
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
    if (serviceId === 'basic') return;
    const current = [...selectedServices];
    const idx = current.indexOf(serviceId);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(serviceId);
    }
    updateField('selectedServices', current);
  };

  // Calculate estimated price
  const basePrice = APARTMENT_SIZES.find(s => s.id === formData.apartmentSize)?.basePrice || 1500;
  const servicesCost = SERVICES.filter(s => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  const minPrice = basePrice + servicesCost;
  const maxPrice = Math.round(minPrice * 1.35);

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
        {SERVICES.map((service) => (
          <ServiceCardArchetyp
            key={service.id}
            service={service}
            isSelected={selectedServices.includes(service.id)}
            onToggle={() => toggleService(service.id)}
            isExpanded={expandedService === service.id}
            onExpand={() => setExpandedService(expandedService === service.id ? null : service.id)}
          />
        ))}
      </div>

      {/* Price Estimator */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Geschätzte Kosten</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              CHF {minPrice.toLocaleString('de-CH')} – {maxPrice.toLocaleString('de-CH')}
            </p>
          </div>
          <button className="text-muted-foreground hover:text-foreground p-1" title="Unverbindliche Schätzung">
            <Info className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Mit Vergleich sparen Sie bis zu 40%
        </p>
      </div>

      {/* Recommendation */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl text-sm">
        <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Tipp: Reinigung mit Garantie</p>
          <p className="text-muted-foreground">
            Sparen Sie Zeit und Nerven – mit unserer Abnahmegarantie sind Sie auf der sicheren Seite.
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
      if (current.length < 5) current.push(companyId);
    }
    updateField('selectedCompanies', current);
  };

  const sortedCompanies = useMemo(() => {
    const companies = [...COMPANIES];
    switch (sortBy) {
      case 'rating': return companies.sort((a, b) => b.rating - a.rating);
      case 'price': return companies.sort((a, b) => a.priceMin - b.priceMin);
      default: return companies.sort((a, b) => b.match - a.match);
    }
  }, [sortBy]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Firmen auswählen</h1>
        <p className="text-muted-foreground">
          Wir empfehlen mindestens 3 für einen fairen Vergleich
        </p>
      </div>

      {/* ASTAG Trust Note */}
      <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
        <Award className="h-5 w-5 text-amber-600" />
        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
          Alle ASTAG-Partner sind geprüft & versichert
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

      {/* Sort */}
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

      {/* Companies List */}
      <div className="space-y-3">
        {sortedCompanies.map((company) => (
          <CompanyCardArchetyp
            key={company.id}
            company={company}
            isSelected={selectedCompanies.includes(company.id)}
            onToggle={() => toggleCompany(company.id)}
          />
        ))}
      </div>
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

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Vor- und Nachname</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Max Muster"
                autoComplete="name"
                className={`h-12 pl-10 ${errors.name ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="max.muster@email.ch"
                autoComplete="email"
                inputMode="email"
                className={`h-12 pl-10 ${errors.email ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Telefon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="079 123 45 67"
                autoComplete="tel"
                inputMode="tel"
                className={`h-12 pl-10 ${errors.phone ? 'border-destructive' : ''}`}
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Nur für Rückfragen zur Offerte – keine Werbung
            </p>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Diskretion Promise */}
      <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl text-sm border border-green-200 dark:border-green-800">
        <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-green-700 dark:text-green-400">Ihre Daten sind sicher</p>
          <p className="text-muted-foreground">
            Weitergabe nur an max. 5 ausgewählte Partnerfirmen. Keine Werbung durch Dritte. 
            CH-Datenschutz (DSG) konform.
          </p>
        </div>
      </div>

      {/* Privacy Checkbox */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="privacy"
          checked={formData.privacyAccepted}
          onCheckedChange={(checked) => updateField('privacyAccepted', !!checked)}
          className="mt-1"
        />
        <Label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
          Ich akzeptiere die <a href="/datenschutz" className="underline hover:text-primary">Datenschutzerklärung</a> und 
          erlaube die Weitergabe meiner Anfrage an ausgewählte Umzugsfirmen.
        </Label>
      </div>
    </div>
  );
}

// === MAIN COMPONENT ===

export const V1cFeedbackBased: React.FC = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (isCaptureMode && captureStep) return captureStep;
    return 1;
  });
  
  const [formData, setFormData] = useState(() => {
    if (isCaptureMode) {
      return {
        moveType: 'apartment',
        apartmentSize: demoData.apartmentSize,
        fromZip: demoData.fromPostal,
        toZip: demoData.toPostal,
        dateType: 'fixed' as const,
        moveDate: demoData.moveDate,
        flexibleMonth: '',
        selectedServices: ['basic', 'cleaning'],
        selectedCompanies: ['1', '2', '3'],
        name: demoData.name,
        email: demoData.email,
        phone: demoData.phone,
        privacyAccepted: true,
      };
    }
    return {
      moveType: '',
      apartmentSize: '',
      fromZip: '',
      toZip: '',
      dateType: 'fixed' as const,
      moveDate: '',
      flexibleMonth: '',
      selectedServices: ['basic'],
      selectedCompanies: ['1', '2', '3'],
      name: '',
      email: '',
      phone: '',
      privacyAccepted: false,
    };
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.moveType) newErrors.moveType = 'Bitte wählen';
      if (!formData.apartmentSize) newErrors.apartmentSize = 'Bitte wählen';
      if (formData.fromZip.length < 4) newErrors.fromZip = 'Gültige PLZ eingeben';
      if (formData.toZip.length < 4) newErrors.toZip = 'Gültige PLZ eingeben';
    }
    
    if (step === 4) {
      if (formData.name.trim().length < 2) newErrors.name = 'Name eingeben';
      if (!formData.email.includes('@')) newErrors.email = 'Gültige E-Mail eingeben';
      if (formData.phone.length < 8) newErrors.phone = 'Gültige Telefonnummer eingeben';
      if (!formData.privacyAccepted) newErrors.privacy = 'Bitte akzeptieren';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid = formData.moveType && formData.apartmentSize && 
                       formData.fromZip.length >= 4 && formData.toZip.length >= 4;
  const isStep4Valid = formData.name.trim().length >= 2 && 
                       formData.email.includes('@') && 
                       formData.phone.length >= 8 && 
                       formData.privacyAccepted;

  const getButtonDisabled = () => {
    if (currentStep === 1) return !isStep1Valid;
    if (currentStep === 4) return !isStep4Valid;
    return false;
  };

  const getButtonLabel = () => {
    if (currentStep === 4) return 'Kostenlos Offerten erhalten';
    return 'Weiter';
  };

  const getHint = () => {
    if (currentStep === 4) return '100% kostenlos & unverbindlich • Keine Verpflichtung';
    return undefined;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Anfrage gesendet!</h2>
            <p className="text-muted-foreground">
              Sie erhalten in Kürze unverbindliche Offerten von geprüften Schweizer Umzugsfirmen.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{formData.selectedCompanies.length} Firmen angefragt</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <ProgressHeader step={currentStep} total={STEPS.length} steps={STEPS} />

      <div className="max-w-2xl mx-auto p-4 pt-6">
        {currentStep === 1 && (
          <Step1RouteDate formData={formData} updateField={updateField} errors={errors} />
        )}
        {currentStep === 2 && (
          <Step2Services formData={formData} updateField={updateField} />
        )}
        {currentStep === 3 && (
          <Step3Companies formData={formData} updateField={updateField} />
        )}
        {currentStep === 4 && (
          <Step4Contact formData={formData} updateField={updateField} errors={errors} />
        )}
      </div>

      <StickyFooterCTA
        primaryLabel={getButtonLabel()}
        onPrimary={handleNext}
        disabled={getButtonDisabled()}
        hint={getHint()}
        showBack={currentStep > 1}
        onBack={handleBack}
      />
    </div>
  );
};

export default V1cFeedbackBased;

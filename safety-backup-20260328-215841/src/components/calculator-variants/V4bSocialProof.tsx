/**
 * V4b - Social Proof Heavy
 * Focus: Reviews, testimonials, trust indicators at every step
 * 
 * Capture Mode Support: Distinct content per step
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Users, CheckCircle2, Quote, Award, ThumbsUp, MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { cn } from '@/lib/utils';

const TESTIMONIALS = [
  { name: 'Sandra M.', location: 'Zürich', text: 'Beste Entscheidung! 3 Offerten in 2 Stunden.', rating: 5 },
  { name: 'Thomas K.', location: 'Bern', text: 'Super einfach und transparent.', rating: 5 },
  { name: 'Lisa W.', location: 'Basel', text: 'CHF 600 gespart gegenüber Direktanfrage.', rating: 5 },
];

const MOVE_TYPES = [
  { id: 'private', label: 'Privatumzug', stats: '8,432 zufriedene Kunden', rating: 4.9 },
  { id: 'business', label: 'Firmenumzug', stats: '1,205 Firmenkunden', rating: 4.8 },
  { id: 'senior', label: 'Seniorenumzug', stats: '98% Weiterempfehlung', rating: 5.0 },
];

const SERVICES = [
  { id: 'packing', label: 'Ein- und Auspacken', stats: '92% wählen dies' },
  { id: 'furniture', label: 'Möbelmontage', stats: '67% wählen dies' },
  { id: 'cleaning', label: 'Endreinigung', stats: '78% wählen dies' },
];

export const V4bSocialProof: React.FC = () => {
  const initialStep = useInitialStep(1);
  const { isCaptureMode, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedType, setSelectedType] = useState<string>(isCaptureMode ? 'private' : '');
  const [fromLocation, setFromLocation] = useState(isCaptureMode ? demoData.fromLocation : '');
  const [toLocation, setToLocation] = useState(isCaptureMode ? demoData.toLocation : '');
  const [moveDate, setMoveDate] = useState(isCaptureMode ? demoData.moveDate : '');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    isCaptureMode ? new Set(['packing', 'cleaning']) : new Set()
  );
  const [name, setName] = useState(isCaptureMode ? demoData.name : '');
  const [email, setEmail] = useState(isCaptureMode ? demoData.email : '');
  const [phone, setPhone] = useState(isCaptureMode ? demoData.phone : '');
  
  const progress = (currentStep / 4) * 100;

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            {MOVE_TYPES.map((type) => (
              <SocialOption
                key={type.id}
                label={type.label}
                stats={type.stats}
                rating={type.rating}
                selected={selectedType === type.id}
                onSelect={() => setSelectedType(type.id)}
              />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Von (Abholadresse)
              </Label>
              <Input
                placeholder="z.B. 8048 Zürich"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                Nach (Lieferadresse)
              </Label>
              <Input
                placeholder="z.B. 3011 Bern"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Umzugsdatum
              </Label>
              <Input
                type="date"
                value={moveDate}
                onChange={(e) => setMoveDate(e.target.value)}
              />
            </div>
            <Card className="p-3 bg-green-500/10 border-green-500/20">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✓ 156 Anfragen heute in Ihrer Region
              </p>
            </Card>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              Was andere Kunden dazu buchen:
            </p>
            {SERVICES.map((service) => (
              <label
                key={service.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer",
                  selectedServices.has(service.id)
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedServices.has(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <span className="font-medium">{service.label}</span>
                </div>
                <span className="text-xs text-green-600">{service.stats}</span>
              </label>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                placeholder="Ihr vollständiger Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-Mail
              </Label>
              <Input
                type="email"
                placeholder="ihre@email.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon
              </Label>
              <Input
                type="tel"
                placeholder="+41 79 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Card className="p-3 bg-primary/5 border-primary/20">
              <p className="text-sm">
                🔒 Ihre Daten sind sicher - nur geprüfte Umzugsfirmen erhalten Ihre Anfrage
              </p>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Umzugsart wählen';
      case 2: return 'Ihre Adressen';
      case 3: return 'Zusatzservices';
      case 4: return 'Kontaktdaten';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Trust header */}
      <div className="bg-primary/5 border-b border-primary/10 px-4 py-3">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">4.9</span>
            <span className="text-muted-foreground">(2,847)</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>15,000+ Umzüge</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary">
            <ThumbsUp className="h-3 w-3" />
            <span>V4b Social</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Trust badges */}
        <div className="flex justify-center gap-4 mb-4">
          <TrustBadge icon={<CheckCircle2 className="h-5 w-5" />} label="Verifiziert" />
          <TrustBadge icon={<Award className="h-5 w-5" />} label="Nr. 1 Schweiz" />
          <TrustBadge icon={<Star className="h-5 w-5" />} label="Top Rated" />
        </div>

        <Progress value={progress} className="h-2 mb-6" />

        {/* Main card with testimonial sidebar */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Schritt {currentStep}: {getStepTitle()}
            </h2>

            {renderStepContent()}

            <Button
              size="lg"
              className="w-full mt-6"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
            >
              {currentStep === 4 ? 'Offerten anfordern' : 'Weiter'}
            </Button>
            
            {currentStep > 1 && (
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Zurück
              </Button>
            )}
          </Card>

          {/* Testimonial sidebar */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Quote className="h-4 w-4" />
              Was andere sagen
            </h3>
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="p-3 bg-muted/50">
                <div className="flex gap-1 mb-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-2">"{t.text}"</p>
                <p className="text-xs text-muted-foreground">
                  {t.name}, {t.location}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <StatBox value="2,847" label="Bewertungen" />
          <StatBox value="4.9★" label="Durchschnitt" />
          <StatBox value="98%" label="Empfehlen uns" />
        </div>
      </div>
    </div>
  );
};

const TrustBadge: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-1 text-primary">
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </div>
);

const SocialOption: React.FC<{
  label: string;
  stats: string;
  rating: number;
  selected?: boolean;
  onSelect: () => void;
}> = ({ label, stats, rating, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={cn(
      "w-full p-4 rounded-xl border-2 text-left transition-all",
      selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
    )}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{stats}</div>
      </div>
      <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded">
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
    </div>
  </button>
);

const StatBox: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="bg-muted/50 rounded-lg p-3">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default V4bSocialProof;

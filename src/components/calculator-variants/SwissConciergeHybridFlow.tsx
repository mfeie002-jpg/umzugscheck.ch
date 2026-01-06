/**
 * Swiss Concierge Hybrid Flow - 4 Steps with Optional Video
 * Route: /umzugsofferten/swiss-concierge-hybrid
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  FlowStepShell, StickyCtaBar, ReviewReceipt, useFlowState 
} from '@/components/flow-components';
import { 
  MapPin, Calendar, Home, User, Mail, Phone, Video, Zap, 
  CheckCircle2, Send, Package, Wrench, Sparkles, Warehouse, 
  Upload, X, PlayCircle, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwissConciergeFormData {
  [key: string]: unknown;
  fromZip: string; toZip: string; moveDate: string; rooms: string;
  videoOption: 'quick' | 'video';
  videoFile: string | null;
  videoUploaded: boolean;
  services: { packing: boolean; assembly: boolean; cleaning: boolean; storage: boolean };
  unsure: boolean;
  name: string; email: string; phone: string; privacy: boolean;
}

const INITIAL_DATA: SwissConciergeFormData = {
  fromZip: '', toZip: '', moveDate: '', rooms: '',
  videoOption: 'quick',
  videoFile: null,
  videoUploaded: false,
  services: { packing: false, assembly: false, cleaning: false, storage: false },
  unsure: false,
  name: '', email: '', phone: '', privacy: false,
};

const ROOMS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6+'];

const SERVICES = [
  { id: 'packing', label: 'Verpackung', icon: Package, desc: 'Professionelles Ein- & Auspacken' },
  { id: 'assembly', label: 'Montage', icon: Wrench, desc: 'Möbel ab- & aufbauen' },
  { id: 'cleaning', label: 'Reinigung', icon: Sparkles, desc: 'Endreinigung alte Wohnung' },
  { id: 'storage', label: 'Einlagerung', icon: Warehouse, desc: 'Zwischenlagerung möglich' },
];

export const SwissConciergeHybridFlow: React.FC = () => {
  const [state, actions] = useFlowState<SwissConciergeFormData>({
    storageKey: 'swiss-concierge-hybrid-flow',
    initialData: INITIAL_DATA,
    totalSteps: 4,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { formData, currentStep, isSubmitting } = state;
  const activeServicesCount = Object.values(formData.services).filter(Boolean).length;
  const basePrice = (parseFloat(formData.rooms) || 2) * 400;
  const serviceMultiplier = 1 + (activeServicesCount * 0.15);
  const videoBonus = formData.videoUploaded ? 0.95 : 1;
  const price = { 
    min: Math.round(basePrice * serviceMultiplier * videoBonus * 0.8), 
    max: Math.round(basePrice * serviceMultiplier * videoBonus * 1.3) 
  };
  
  const isStep1Valid = formData.fromZip.length >= 4 && formData.toZip.length >= 4 && formData.rooms;
  const isStep2Valid = true; // Video is always optional
  const isStep3Valid = true; // Services are optional
  const isStep4Valid = formData.name && formData.email.includes('@') && formData.phone.length >= 9 && formData.privacy;

  const handleVideoUpload = async (file: File) => {
    setUploadError(null);
    setUploadProgress(0);
    
    // Simulate upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 150));
      setUploadProgress(i);
    }
    
    // Simulate occasional failure for demo
    if (Math.random() < 0.1) {
      setUploadError('Upload fehlgeschlagen. Versuchen Sie es erneut.');
      setUploadProgress(0);
      return;
    }
    
    actions.updateFields({ 
      videoFile: file.name, 
      videoUploaded: true 
    });
    console.log('[Analytics] video_upload_success');
  };

  const handleSubmit = async () => {
    actions.setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    actions.setComplete();
    console.log('Swiss Concierge Hybrid submitted:', formData);
  };

  if (state.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6 space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </motion.div>
            <h2 className="text-2xl font-bold">Vielen Dank!</h2>
            <p className="text-muted-foreground">
              {formData.videoUploaded 
                ? 'Ihr Video wurde erfolgreich übermittelt. Sie erhalten präzisere Offerten!'
                : 'Sie erhalten in Kürze bis zu 5 unverbindliche Offerten.'}
            </p>
            <Button onClick={() => window.location.href = '/'} className="mt-4">Zur Startseite</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <FlowStepShell
        title={
          currentStep === 1 ? "Ihr Umzug" : 
          currentStep === 2 ? "Genauigkeit erhöhen?" : 
          currentStep === 3 ? "Zusätzliche Services" : 
          "Kontakt & Übersicht"
        }
        subtitle={
          currentStep === 1 ? "Die Basics in 30 Sekunden" : 
          currentStep === 2 ? "Optional: Video für präzisere Offerten" : 
          currentStep === 3 ? "Was brauchen Sie noch?" : 
          "Ihre Daten für die Offerten"
        }
        currentStep={currentStep}
        totalSteps={4}
        onBack={() => actions.prevStep()}
        hasStickyCta
      >
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />Von (PLZ)</Label>
                <Input inputMode="numeric" maxLength={4} placeholder="8000" value={formData.fromZip} onChange={e => actions.updateField('fromZip', e.target.value)} className="h-12 text-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />Nach (PLZ)</Label>
                <Input inputMode="numeric" maxLength={4} placeholder="3000" value={formData.toZip} onChange={e => actions.updateField('toZip', e.target.value)} className="h-12 text-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />Umzugsdatum</Label>
              <Input type="date" value={formData.moveDate} onChange={e => actions.updateField('moveDate', e.target.value)} className="h-12 text-lg" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Home className="h-4 w-4 text-primary" />Zimmer</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {ROOMS.map(r => (
                  <Button key={r} type="button" variant={formData.rooms === r ? 'default' : 'outline'} className={cn("h-11", formData.rooms === r && "ring-2 ring-primary")} onClick={() => actions.updateField('rooms', r)}>{r}</Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Quick option - Primary */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  formData.videoOption === 'quick' ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:border-primary/50"
                )}
                onClick={() => {
                  actions.updateField('videoOption', 'quick');
                  console.log('[Analytics] video_option_selected: quick');
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                      formData.videoOption === 'quick' ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Zap className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">Schnell ohne Video</h3>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Empfohlen</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Basierend auf Ihren Angaben • In 30 Sekunden fertig</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                      formData.videoOption === 'quick' ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )}>
                      {formData.videoOption === 'quick' && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Video option - Secondary */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  formData.videoOption === 'video' ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:border-primary/50"
                )}
                onClick={() => {
                  actions.updateField('videoOption', 'video');
                  console.log('[Analytics] video_option_selected: video');
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                      formData.videoOption === 'video' ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Video className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Mit Video genauer</h3>
                      <p className="text-sm text-muted-foreground">Präzisere Schätzung • 5% genauere Offerten</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                      formData.videoOption === 'video' ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )}>
                      {formData.videoOption === 'video' && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Video upload UI */}
            <AnimatePresence>
              {formData.videoOption === 'video' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="border-dashed border-2 bg-muted/30">
                    <CardContent className="p-5">
                      {!formData.videoUploaded ? (
                        <>
                          <div className="text-center mb-4">
                            <PlayCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                            <h4 className="font-medium">So filmst du richtig:</h4>
                            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                              <li>• Langsam durch alle Räume gehen</li>
                              <li>• Möbel & grosse Gegenstände zeigen</li>
                              <li>• Max. 2 Minuten, Querformat</li>
                            </ul>
                          </div>
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleVideoUpload(file);
                            }}
                          />
                          {uploadProgress > 0 && uploadProgress < 100 ? (
                            <div className="space-y-2">
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                              </div>
                              <p className="text-sm text-center text-muted-foreground">{uploadProgress}% hochgeladen...</p>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full h-12"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-5 w-5 mr-2" />
                              Video hochladen
                            </Button>
                          )}
                          {uploadError && (
                            <div className="flex items-center gap-2 mt-3 text-destructive text-sm">
                              <AlertCircle className="h-4 w-4" />
                              <span>{uploadError}</span>
                            </div>
                          )}
                          <Button 
                            variant="ghost" 
                            className="w-full mt-2 text-muted-foreground"
                            onClick={() => {
                              actions.updateField('videoOption', 'quick');
                              console.log('[Analytics] video_upload_skip');
                            }}
                          >
                            Überspringen
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            </div>
                            <div>
                              <p className="font-medium">{formData.videoFile}</p>
                              <p className="text-sm text-muted-foreground">Erfolgreich hochgeladen</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              actions.updateFields({ videoFile: null, videoUploaded: false });
                              setUploadProgress(0);
                            }}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isActive = formData.services[service.id as keyof typeof formData.services];
              return (
                <Card 
                  key={service.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    isActive ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:border-primary/50"
                  )}
                  onClick={() => actions.updateField('services', {
                    ...formData.services,
                    [service.id]: !isActive
                  })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{service.label}</h3>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                      <Switch checked={isActive} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <div className="flex items-center gap-3 pt-2">
              <Checkbox 
                id="unsure" 
                checked={formData.unsure} 
                onCheckedChange={c => actions.updateField('unsure', c as boolean)} 
              />
              <Label htmlFor="unsure" className="text-sm text-muted-foreground">
                Ich bin unsicher – bitte beraten Sie mich
              </Label>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-5">
            <ReviewReceipt
              items={[
                { label: 'Von', value: formData.fromZip, icon: <MapPin className="h-4 w-4" />, editStep: 1 },
                { label: 'Nach', value: formData.toZip, icon: <MapPin className="h-4 w-4" />, editStep: 1 },
                { label: 'Datum', value: formData.moveDate || 'Flexibel', icon: <Calendar className="h-4 w-4" />, editStep: 1 },
                { label: 'Zimmer', value: formData.rooms, icon: <Home className="h-4 w-4" />, editStep: 1 },
                { label: 'Video', value: formData.videoUploaded ? '✓ Hochgeladen' : 'Ohne Video', icon: <Video className="h-4 w-4" />, editStep: 2 },
                { label: 'Services', value: activeServicesCount > 0 ? `${activeServicesCount} gewählt` : 'Keine', icon: <Package className="h-4 w-4" />, editStep: 3 },
              ]}
              onEdit={(step) => actions.goToStep(step || 1)}
              priceRange={price}
              variant="highlighted"
            />
            <div className="space-y-3">
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Vor- und Nachname" value={formData.name} onChange={e => actions.updateField('name', e.target.value)} className="h-14 pl-11 text-lg" />{formData.name && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />}</div>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input type="email" inputMode="email" placeholder="E-Mail" value={formData.email} onChange={e => actions.updateField('email', e.target.value)} className="h-14 pl-11 text-lg" />{formData.email.includes('@') && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />}</div>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input type="tel" inputMode="tel" placeholder="Telefon" value={formData.phone} onChange={e => actions.updateField('phone', e.target.value)} className="h-14 pl-11 text-lg" />{formData.phone.length >= 9 && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />}</div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="privacy" checked={formData.privacy} onCheckedChange={c => actions.updateField('privacy', c as boolean)} className="mt-1" />
              <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">Ich akzeptiere die <a href="/datenschutz" className="text-primary underline">Datenschutzerklärung</a>.</Label>
            </div>
          </div>
        )}
      </FlowStepShell>

      <StickyCtaBar
        ctaText={currentStep === 4 ? "Offerten anfordern" : "Weiter"}
        onCtaClick={currentStep === 4 ? handleSubmit : () => actions.nextStep()}
        disabled={currentStep === 1 ? !isStep1Valid : currentStep === 4 ? !isStep4Valid : false}
        isLoading={isSubmitting}
        showBack={currentStep > 1}
        onBack={() => actions.prevStep()}
        currentStep={currentStep}
        totalSteps={4}
        ctaIcon={currentStep === 4 ? <Send className="h-5 w-5" /> : undefined}
      />
    </>
  );
};

export default SwissConciergeHybridFlow;

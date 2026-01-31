/**
 * PostMoveSurvey - 5-step post-move survey wizard
 * Collects user feedback on their moving experience
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowRight, ArrowLeft, Check, Star, Calendar, MapPin, 
  Truck, FileText, ThumbsUp, Smile, Frown, Meh
} from 'lucide-react';

const SWISS_CANTONS = [
  { code: 'ZH', name: 'Zürich' },
  { code: 'BE', name: 'Bern' },
  { code: 'LU', name: 'Luzern' },
  { code: 'UR', name: 'Uri' },
  { code: 'SZ', name: 'Schwyz' },
  { code: 'OW', name: 'Obwalden' },
  { code: 'NW', name: 'Nidwalden' },
  { code: 'GL', name: 'Glarus' },
  { code: 'ZG', name: 'Zug' },
  { code: 'FR', name: 'Fribourg' },
  { code: 'SO', name: 'Solothurn' },
  { code: 'BS', name: 'Basel-Stadt' },
  { code: 'BL', name: 'Basel-Landschaft' },
  { code: 'SH', name: 'Schaffhausen' },
  { code: 'AR', name: 'Appenzell AR' },
  { code: 'AI', name: 'Appenzell IR' },
  { code: 'SG', name: 'St. Gallen' },
  { code: 'GR', name: 'Graubünden' },
  { code: 'AG', name: 'Aargau' },
  { code: 'TG', name: 'Thurgau' },
  { code: 'TI', name: 'Tessin' },
  { code: 'VD', name: 'Waadt' },
  { code: 'VS', name: 'Wallis' },
  { code: 'NE', name: 'Neuenburg' },
  { code: 'GE', name: 'Genf' },
  { code: 'JU', name: 'Jura' },
];

interface RatingButtonsProps {
  value: number | undefined;
  onChange: (value: number) => void;
  labels?: string[];
}

function RatingButtons({ value, onChange, labels = ['Sehr schlecht', '', '', '', 'Sehr gut'] }: RatingButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-semibold transition-all ${
              value === rating
                ? 'bg-primary text-primary-foreground border-primary scale-110'
                : 'bg-background border-border hover:border-primary/50 hover:scale-105'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-2">
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>
    </div>
  );
}

interface SurveyData {
  fromCanton: string;
  toCanton: string;
  moveDate: string;
  moveType: 'private' | 'company';
  planningEaseScore?: number;
  findingCompanyEase?: number;
  quoteComparisonEase?: number;
  movingDayScore?: number;
  punctualityScore?: number;
  careWithItemsScore?: number;
  professionalismScore?: number;
  adminHurdlesScore?: number;
  registrationEase?: number;
  utilityTransferEase?: number;
  addressChangeEase?: number;
  overallScore?: number;
  wouldRecommend: boolean;
  stressLevel?: number;
  positiveFeedback: string;
  improvementSuggestions: string;
}

export function PostMoveSurvey({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const [data, setData] = useState<SurveyData>({
    fromCanton: '',
    toCanton: '',
    moveDate: new Date().toISOString().split('T')[0],
    moveType: 'private',
    wouldRecommend: true,
    positiveFeedback: '',
    improvementSuggestions: '',
  });

  const updateData = (updates: Partial<SurveyData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 0:
        return data.fromCanton && data.toCanton && data.moveDate;
      case 1:
        return data.planningEaseScore && data.findingCompanyEase && data.quoteComparisonEase;
      case 2:
        return data.movingDayScore && data.punctualityScore && data.careWithItemsScore && data.professionalismScore;
      case 3:
        return data.adminHurdlesScore && data.registrationEase && data.utilityTransferEase && data.addressChangeEase;
      case 4:
        return data.overallScore && data.stressLevel;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('submit-post-move-survey', {
        body: data,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Vielen Dank!',
        description: 'Ihre Bewertung hilft anderen bei ihrem Umzug.',
      });
      onComplete?.();
    } catch (error) {
      console.error('Survey submission error:', error);
      toast({
        title: 'Fehler',
        description: 'Umfrage konnte nicht gesendet werden.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-10 w-10 text-green-600" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">Vielen Dank!</h3>
          <p className="text-muted-foreground mb-6">
            Ihre Bewertung trägt zum Move Health Index bei und hilft anderen, 
            bessere Entscheidungen zu treffen.
          </p>
          <Button onClick={() => window.location.href = '/move-health-index'}>
            Zum Move Health Index →
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Schritt {step + 1} von {totalSteps}</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 0: Move Context */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Ihr Umzug</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Von Kanton</Label>
                    <Select value={data.fromCanton} onValueChange={(v) => updateData({ fromCanton: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SWISS_CANTONS.map(c => (
                          <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Nach Kanton</Label>
                    <Select value={data.toCanton} onValueChange={(v) => updateData({ toCanton: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SWISS_CANTONS.map(c => (
                          <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Umzugsdatum</Label>
                    <input
                      type="date"
                      value={data.moveDate}
                      onChange={(e) => updateData({ moveDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Umzugsart</Label>
                    <Select value={data.moveType} onValueChange={(v: 'private' | 'company') => updateData({ moveType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Privatumzug</SelectItem>
                        <SelectItem value="company">Firmenumzug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Planning */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Planung & Vorbereitung</h3>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Wie einfach war die Umzugsplanung?</Label>
                  <RatingButtons value={data.planningEaseScore} onChange={(v) => updateData({ planningEaseScore: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Wie einfach war es, eine Umzugsfirma zu finden?</Label>
                  <RatingButtons value={data.findingCompanyEase} onChange={(v) => updateData({ findingCompanyEase: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Wie einfach war der Offerten-Vergleich?</Label>
                  <RatingButtons value={data.quoteComparisonEase} onChange={(v) => updateData({ quoteComparisonEase: v })} />
                </div>
              </div>
            )}

            {/* Step 2: Moving Day */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Umzugstag</h3>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Gesamteindruck am Umzugstag</Label>
                  <RatingButtons value={data.movingDayScore} onChange={(v) => updateData({ movingDayScore: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Pünktlichkeit des Teams</Label>
                  <RatingButtons value={data.punctualityScore} onChange={(v) => updateData({ punctualityScore: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Sorgfalt mit Ihren Sachen</Label>
                  <RatingButtons value={data.careWithItemsScore} onChange={(v) => updateData({ careWithItemsScore: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Professionalität</Label>
                  <RatingButtons value={data.professionalismScore} onChange={(v) => updateData({ professionalismScore: v })} />
                </div>
              </div>
            )}

            {/* Step 3: Admin */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Administrative Hürden</h3>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Wie einfach war die Bürokratie insgesamt?</Label>
                  <RatingButtons value={data.adminHurdlesScore} onChange={(v) => updateData({ adminHurdlesScore: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">An-/Abmeldung bei der Gemeinde</Label>
                  <RatingButtons value={data.registrationEase} onChange={(v) => updateData({ registrationEase: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Strom/Wasser/Internet-Übertragung</Label>
                  <RatingButtons value={data.utilityTransferEase} onChange={(v) => updateData({ utilityTransferEase: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Adressänderungen (Post, Bank etc.)</Label>
                  <RatingButtons value={data.addressChangeEase} onChange={(v) => updateData({ addressChangeEase: v })} />
                </div>
              </div>
            )}

            {/* Step 4: Overall + Feedback */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Gesamtbewertung</h3>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Gesamtzufriedenheit mit dem Umzug</Label>
                  <RatingButtons value={data.overallScore} onChange={(v) => updateData({ overallScore: v })} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Wie stressig war der Umzug?</Label>
                  <RatingButtons 
                    value={data.stressLevel} 
                    onChange={(v) => updateData({ stressLevel: v })} 
                    labels={['Sehr stressig', '', '', '', 'Sehr entspannt']}
                  />
                </div>

                <div className="flex items-center gap-4 py-4 border rounded-lg px-4">
                  <Switch
                    checked={data.wouldRecommend}
                    onCheckedChange={(v) => updateData({ wouldRecommend: v })}
                  />
                  <Label className="text-base cursor-pointer">
                    Würden Sie Umzugscheck.ch weiterempfehlen?
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Was hat besonders gut geklappt? (optional)</Label>
                  <Textarea
                    value={data.positiveFeedback}
                    onChange={(e) => updateData({ positiveFeedback: e.target.value })}
                    placeholder="z.B. Schnelle Offerten, freundliches Team..."
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Verbesserungsvorschläge (optional)</Label>
                  <Textarea
                    value={data.improvementSuggestions}
                    onChange={(e) => updateData({ improvementSuggestions: e.target.value })}
                    placeholder="Was können wir besser machen?"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          
          {step < totalSteps - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Weiter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

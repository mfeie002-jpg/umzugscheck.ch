/**
 * Step 3: Routing Decision
 * Smart Router recommends Video for large apartments, Form for small
 * Based on Gemini UX Audit: "Push Video for high-value users"
 */

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Video, FileText, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartRouterData, SMART_ROUTER_CONFIG } from '../types';
import { VIDEO_BENEFITS, FORM_BENEFITS } from '../constants';

interface RoutingStepProps {
  formData: SmartRouterData;
  onUpdate: (updates: Partial<SmartRouterData>) => void;
  onSelectVideo: () => void;
  onSelectForm: () => void;
  onBack: () => void;
}

export function RoutingStep({ 
  formData, 
  onUpdate,
  onSelectVideo, 
  onSelectForm, 
  onBack 
}: RoutingStepProps) {
  const isHighValue = formData.rooms > SMART_ROUTER_CONFIG.VIDEO_THRESHOLD_ROOMS;

  const handleVideoSelect = useCallback(() => {
    onUpdate({ selectedMethod: 'video' });
    onSelectVideo();
  }, [onUpdate, onSelectVideo]);

  const handleFormSelect = useCallback(() => {
    onUpdate({ selectedMethod: 'form' });
    onSelectForm();
  }, [onUpdate, onSelectForm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Route summary */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Ihre Route</p>
        <p className="text-lg font-semibold">
          {formData.fromPLZ} {formData.fromCity && `(${formData.fromCity})`} → {formData.toPLZ} {formData.toCity && `(${formData.toCity})`}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {formData.rooms} Zimmer-Wohnung
        </p>
      </div>

      {/* Recommendation banner for high-value */}
      {isHighValue && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">Empfohlen für Ihre Wohnungsgrösse</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Für {formData.rooms}+ Zimmer empfehlen wir die Video-Analyse für eine 
            <strong className="text-foreground"> 100% Festpreisgarantie</strong>.
          </p>
        </motion.div>
      )}

      {/* Method Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Video Card - Recommended for large */}
        <motion.button
          type="button"
          onClick={handleVideoSelect}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative text-left p-5 rounded-2xl border-2 transition-all
            ${isHighValue 
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
              : 'border-border hover:border-primary/50'
            }
          `}
        >
          {/* Recommended badge */}
          {isHighValue && (
            <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              ✨ Empfohlen
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className={`
              p-3 rounded-xl shrink-0
              ${isHighValue ? 'bg-primary text-primary-foreground' : 'bg-muted'}
            `}>
              <Video className="h-6 w-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Video-Analyse</h3>
              <p className="text-sm text-muted-foreground mb-3">
                2 Min. Video → KI berechnet Volumen
              </p>
              
              <ul className="space-y-2">
                {VIDEO_BENEFITS.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Incentive for high-value users */}
              {isHighValue && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary">
                    🎁 CHF {SMART_ROUTER_CONFIG.VIDEO_INCENTIVE_CHF} Rabatt auf Endreinigung
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.button>

        {/* Form Card - Alternative */}
        <motion.button
          type="button"
          onClick={handleFormSelect}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative text-left p-5 rounded-2xl border-2 border-border hover:border-muted-foreground/30 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-muted shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Express-Formular</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Schnelle Angaben → Richtpreis-Offerten
              </p>
              
              <ul className="space-y-2">
                {FORM_BENEFITS.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Note for high-value users */}
              {isHighValue && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Hinweis: Bei grösseren Wohnungen kann der Endpreis von der Schätzung abweichen.
                </p>
              )}
            </div>
          </div>
        </motion.button>
      </div>

      {/* Back button */}
      <div className="flex justify-center pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
      </div>
    </motion.div>
  );
}

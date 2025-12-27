/**
 * V4e - Minimal Friction
 * Focus: Fewest possible fields, smart defaults, instant gratification
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check, Loader2, Zap, Sparkles } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

export const V4eMinimalFriction: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [fromZip, setFromZip] = useState('');
  const [toZip, setToZip] = useState('');

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(step + 1);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-1 text-xs text-primary mb-8">
          <Zap className="h-3 w-3" />
          <span>V4e Minimal</span>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold text-center mb-2">
              Umzug in 30 Sekunden
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Nur 2 Angaben – wir kümmern uns um den Rest
            </p>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Von wo?</label>
                  <Input
                    placeholder="PLZ eingeben (z.B. 8001)"
                    value={fromZip}
                    onChange={(e) => setFromZip(e.target.value)}
                    className="h-14 text-lg"
                    type="number"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Nach wo?</label>
                  <Input
                    placeholder="PLZ eingeben (z.B. 3011)"
                    value={toZip}
                    onChange={(e) => setToZip(e.target.value)}
                    className="h-14 text-lg"
                    type="number"
                    maxLength={4}
                  />
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg mt-6"
                onClick={handleSubmit}
                disabled={!fromZip || !toZip || loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Offerten erhalten
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-4">
              ✓ Kostenlos ✓ Unverbindlich ✓ In 24h
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Fast geschafft!</h2>
              <p className="text-muted-foreground">
                Wohin sollen wir die Offerten senden?
              </p>
            </div>

            <Card className="p-6">
              <div>
                <label className="text-sm font-medium mb-2 block">E-Mail</label>
                <Input
                  placeholder="ihre@email.ch"
                  className="h-14 text-lg"
                  type="email"
                />
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg mt-6"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Offerten anfordern
                    <Sparkles className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Kein Spam. Ihre Daten sind sicher.
              </p>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Erledigt!</h2>
            <p className="text-muted-foreground mb-6">
              Sie erhalten in Kürze 3-5 Offerten per E-Mail.
            </p>
            
            <Card className="p-6 bg-muted/50">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">3-5</div>
                  <div className="text-xs text-muted-foreground">Offerten</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-xs text-muted-foreground">Wartezeit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">0 CHF</div>
                  <div className="text-xs text-muted-foreground">Kosten</div>
                </div>
              </div>
            </Card>

            <Button variant="outline" className="mt-6">
              Weitere Details hinzufügen (optional)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default V4eMinimalFriction;

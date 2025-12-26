/**
 * V4c - Value-First Approach
 * Focus: Show savings/benefits before asking for information
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Percent, Clock, Shield, Calculator, ChevronRight } from 'lucide-react';

export const V4cValueFirst: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start with value proposition
  const [estimatedSaving, setEstimatedSaving] = useState(450);
  const progress = (currentStep / 4) * 100;

  // Value proposition step (step 0)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="p-4">
          <div className="flex items-center justify-center gap-1 text-xs text-primary mb-4">
            <Calculator className="h-3 w-3" />
            <span>V4c Value-First</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Sparen Sie durchschnittlich
            </h1>
            <div className="text-5xl font-bold text-primary mb-2">
              CHF {estimatedSaving}
            </div>
            <p className="text-muted-foreground">
              bei Ihrem Umzug mit unserem Vergleich
            </p>
          </div>

          {/* Value cards */}
          <div className="grid gap-3 mb-8">
            <ValueCard
              icon={<Percent className="h-6 w-6 text-green-500" />}
              title="Bis zu 40% günstiger"
              description="Im Vergleich zu Einzelanfragen"
            />
            <ValueCard
              icon={<Clock className="h-6 w-6 text-blue-500" />}
              title="3+ Offerten in 24h"
              description="Schnell und unkompliziert"
            />
            <ValueCard
              icon={<Shield className="h-6 w-6 text-purple-500" />}
              title="100% kostenlos"
              description="Keine versteckten Gebühren"
            />
            <ValueCard
              icon={<Gift className="h-6 w-6 text-amber-500" />}
              title="Exklusive Rabatte"
              description="Nur über unsere Plattform"
            />
          </div>

          {/* Calculator preview */}
          <Card className="p-4 bg-primary/5 border-primary/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Schnellrechner</p>
                <p className="text-sm text-muted-foreground">
                  In 2 Minuten zu Ihrer persönlichen Ersparnis
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>

          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={() => setCurrentStep(1)}
          >
            Jetzt Ersparnis berechnen
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Über 15,000 zufriedene Kunden
          </p>
        </div>
      </div>
    );
  }

  // Regular steps
  return (
    <div className="min-h-screen bg-background">
      {/* Savings reminder header */}
      <div className="sticky top-0 z-50 bg-green-500/10 border-b border-green-500/20 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Ihre potenzielle Ersparnis: <strong>CHF {estimatedSaving}</strong>
            </span>
          </div>
          <div className="text-xs text-primary">V4c Value</div>
        </div>
      </div>

      <div className="p-4">
        <Progress value={progress} className="h-2 mb-6" />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Schritt {currentStep}: Ihre Angaben
          </h2>

          <div className="space-y-3 mb-6">
            <button className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 text-left">
              <div className="flex justify-between items-center">
                <span className="font-medium">Privatumzug</span>
                <span className="text-sm text-green-600">
                  Ø CHF 480 gespart
                </span>
              </div>
            </button>
            <button className="w-full p-4 rounded-xl border-2 border-border text-left hover:border-primary/50">
              <div className="flex justify-between items-center">
                <span className="font-medium">Firmenumzug</span>
                <span className="text-sm text-green-600">
                  Ø CHF 1,200 gespart
                </span>
              </div>
            </button>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
          >
            Weiter zur Ersparnis
          </Button>
        </Card>
      </div>
    </div>
  );
};

const ValueCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <Card className="p-4 flex items-center gap-4">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  </Card>
);

export default V4cValueFirst;

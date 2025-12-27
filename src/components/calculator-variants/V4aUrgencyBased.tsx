/**
 * V4a - Urgency-Based Conversion
 * Focus: Scarcity, time pressure, immediate action triggers
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, AlertTriangle, Zap, TrendingUp } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

export const V4aUrgencyBased: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [timeLeft, setTimeLeft] = useState(892); // 14:52 minutes
  const [activeUsers, setActiveUsers] = useState(23);
  const progress = (currentStep / 4) * 100;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fluctuating active users
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Urgency header */}
      <div className="sticky top-0 z-50 bg-destructive/10 border-b border-destructive/20 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-destructive">
            <Clock className="h-4 w-4 animate-pulse" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            <span className="text-destructive/80">Rabatt läuft ab</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{activeUsers} aktiv</span>
          </div>
        </div>
      </div>

      {/* Badge */}
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
          <Zap className="h-3 w-3" />
          <span>V4a Urgency</span>
        </div>
      </div>

      <div className="p-4">
        {/* Flash offer banner */}
        <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                🔥 Exklusiv: 15% Rabatt für die nächsten {Math.ceil(timeLeft / 60)} Minuten
              </p>
              <p className="text-sm text-amber-600/80 dark:text-amber-500/80">
                Nur noch 3 Plätze für diese Woche verfügbar
              </p>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Progress value={progress} className="h-2 mb-6" />

        {/* Main content */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Schritt {currentStep}: Umzugsart
          </h2>

          <div className="space-y-3">
            <UrgencyOption
              label="Privatumzug"
              badge="Beliebteste Wahl"
              badgeColor="green"
              selected
            />
            <UrgencyOption
              label="Firmenumzug"
              badge="2 heute gebucht"
              badgeColor="blue"
            />
            <UrgencyOption
              label="Express-Umzug"
              badge="Nur noch 1 Platz!"
              badgeColor="red"
              urgent
            />
          </div>
        </Card>

        {/* Social proof ticker */}
        <div className="mt-4 overflow-hidden">
          <div className="animate-scroll-left whitespace-nowrap text-sm text-muted-foreground">
            <span className="mx-4">✓ Max aus Zürich hat gerade gebucht</span>
            <span className="mx-4">✓ 156 Offerten heute verschickt</span>
            <span className="mx-4">✓ Anna aus Bern spart CHF 420</span>
            <span className="mx-4">✓ Durchschnittlich 3.2 Offerten pro Anfrage</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Button
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80"
            onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
          >
            Jetzt 15% Rabatt sichern →
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            ⚡ Über 2'400 erfolgreiche Umzüge
          </p>
        </div>
      </div>
    </div>
  );
};

const UrgencyOption: React.FC<{
  label: string;
  badge: string;
  badgeColor: 'green' | 'blue' | 'red';
  selected?: boolean;
  urgent?: boolean;
}> = ({ label, badge, badgeColor, selected, urgent }) => {
  const colors = {
    green: 'bg-green-500/10 text-green-600',
    blue: 'bg-blue-500/10 text-blue-600',
    red: 'bg-red-500/10 text-red-600 animate-pulse',
  };

  return (
    <button
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-primary bg-primary/5'
          : urgent
          ? 'border-red-500/50 bg-red-500/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${colors[badgeColor]}`}>
          {badge}
        </span>
      </div>
    </button>
  );
};

export default V4aUrgencyBased;

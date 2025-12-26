/**
 * V4d - Gamified Experience
 * Focus: Progress rewards, achievements, engagement mechanics
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Zap, Gift, Lock, Unlock, Sparkles, Medal } from 'lucide-react';

const REWARDS = [
  { step: 1, label: 'Starter', icon: Star, unlocked: true },
  { step: 2, label: 'Explorer', icon: Zap, unlocked: false },
  { step: 3, label: 'Pro', icon: Trophy, unlocked: false },
  { step: 4, label: 'Champion', icon: Medal, unlocked: false, bonus: '10% Rabatt' },
];

export const V4dGamified: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [points, setPoints] = useState(50);
  const [showReward, setShowReward] = useState(false);

  const handleNext = () => {
    setPoints(points + 100);
    setShowReward(true);
    setTimeout(() => {
      setShowReward(false);
      setCurrentStep(Math.min(currentStep + 1, 4));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500/10 to-background">
      {/* Gamified header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
              <span className="font-bold">{points}</span>
            </div>
            <span className="text-sm opacity-80">Punkte</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Sparkles className="h-3 w-3" />
            <span>V4d Gamified</span>
          </div>
        </div>
      </div>

      {/* Reward popup */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 animate-in fade-in">
          <div className="text-center animate-in zoom-in">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">+100 Punkte!</h2>
            <p className="text-muted-foreground">Level {currentStep} geschafft</p>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Progress track */}
        <div className="flex justify-between items-center mb-6 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
          {REWARDS.map((reward, i) => {
            const Icon = reward.icon;
            const isActive = currentStep >= reward.step;
            const isCurrent = currentStep === reward.step;
            return (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-purple-500/30 scale-110' : ''}`}
                >
                  {isActive ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                </div>
                <span className="text-xs mt-2 font-medium">{reward.label}</span>
                {reward.bonus && (
                  <span className="text-[10px] text-purple-500 mt-0.5">
                    {isActive ? '✓ ' : ''}{reward.bonus}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <Card className="p-6 border-2 border-purple-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded text-sm font-medium">
              Level {currentStep}
            </div>
            <h2 className="text-xl font-semibold">Umzugsart wählen</h2>
          </div>

          <div className="space-y-3 mb-6">
            <GameOption
              label="Privatumzug"
              points={100}
              selected
            />
            <GameOption
              label="Firmenumzug"
              points={150}
            />
            <GameOption
              label="Seniorenumzug"
              points={120}
              badge="Beliebt"
            />
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            onClick={handleNext}
          >
            <Zap className="h-5 w-5 mr-2" />
            Weiter & 100 Punkte sammeln
          </Button>
        </Card>

        {/* Achievement hint */}
        <Card className="mt-4 p-4 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-3">
            <Gift className="h-8 w-8 text-amber-500" />
            <div>
              <p className="font-medium text-amber-700 dark:text-amber-400">
                Noch {4 - currentStep} Schritte bis zum Champion-Status!
              </p>
              <p className="text-sm text-amber-600/80">
                Schalte 10% Rabatt auf deine erste Offerte frei
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const GameOption: React.FC<{
  label: string;
  points: number;
  selected?: boolean;
  badge?: string;
}> = ({ label, points, selected, badge }) => (
  <button
    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
      selected
        ? 'border-purple-500 bg-purple-500/10'
        : 'border-border hover:border-purple-500/50'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium">{label}</span>
        {badge && (
          <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-600 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span className="text-sm text-purple-500 font-medium">+{points} ⭐</span>
    </div>
  </button>
);

export default V4dGamified;

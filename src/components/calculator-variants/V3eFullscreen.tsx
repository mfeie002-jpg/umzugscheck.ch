/**
 * V3e - Fullscreen Steps
 * Focus: One question per screen, immersive mobile experience
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Home, Building2, Heart, MapPin, Package, User, Sparkles } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

const QUESTIONS = [
  {
    id: 1,
    question: 'Was möchten Sie umziehen?',
    options: [
      { id: 'privat', label: 'Privatumzug', icon: Home, color: 'from-blue-500 to-cyan-500' },
      { id: 'firma', label: 'Firmenumzug', icon: Building2, color: 'from-purple-500 to-pink-500' },
      { id: 'senior', label: 'Seniorenumzug', icon: Heart, color: 'from-amber-500 to-orange-500' },
    ],
  },
  {
    id: 2,
    question: 'Wie gross ist Ihre Wohnung?',
    options: [
      { id: '1-2', label: '1-2 Zimmer', icon: Package, color: 'from-green-500 to-emerald-500' },
      { id: '3-4', label: '3-4 Zimmer', icon: Package, color: 'from-blue-500 to-indigo-500' },
      { id: '5+', label: '5+ Zimmer', icon: Package, color: 'from-purple-500 to-violet-500' },
    ],
  },
  {
    id: 3,
    question: 'Wohin geht die Reise?',
    options: [
      { id: 'lokal', label: 'Im Ort', icon: MapPin, color: 'from-teal-500 to-cyan-500' },
      { id: 'regional', label: 'In der Region', icon: MapPin, color: 'from-blue-500 to-sky-500' },
      { id: 'national', label: 'Schweizweit', icon: MapPin, color: 'from-indigo-500 to-purple-500' },
    ],
  },
  {
    id: 4,
    question: 'Fast geschafft!',
    options: [],
    isContact: true,
  },
];

export const V3eFullscreen: React.FC = () => {
  // Note: V3e uses 0-based index for questions, so uc_step=1 maps to index 0
  const initialStep = useInitialStep(1);
  const [currentQuestion, setCurrentQuestion] = useState(Math.max(0, initialStep - 1));
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleSelect = (optionId: string) => {
    setAnswers({ ...answers, [question.id]: optionId });
    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          className={`p-2 rounded-full hover:bg-muted transition-opacity ${
            currentQuestion === 0 ? 'opacity-0 pointer-events-none' : ''
          }`}
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-1 text-xs text-primary">
          <Sparkles className="h-3 w-3" />
          <span>V3e Fullscreen</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentQuestion + 1}/{QUESTIONS.length}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <h1 className="text-3xl font-bold text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {question.question}
        </h1>

        {/* Options */}
        {!question.isContact ? (
          <div className="space-y-4">
            {question.options.map((option, index) => {
              const Icon = option.icon;
              const isSelected = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full p-6 rounded-2xl text-left transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
                    isSelected
                      ? `bg-gradient-to-r ${option.color} text-white scale-[1.02]`
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-background'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-medium">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground mb-8">
              Geben Sie Ihre Kontaktdaten ein, um kostenlose Offerten zu erhalten.
            </p>
            <Button size="lg" className="h-14 px-8 text-lg">
              Kontaktdaten eingeben
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Step indicators */}
      <div className="p-6 flex justify-center gap-2">
        {QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentQuestion
                ? 'w-8 bg-primary'
                : index < currentQuestion
                ? 'w-2 bg-primary/50'
                : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default V3eFullscreen;

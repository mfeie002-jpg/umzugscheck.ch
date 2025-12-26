/**
 * V4b - Social Proof Heavy
 * Focus: Reviews, testimonials, trust indicators at every step
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Users, CheckCircle2, Quote, Award, ThumbsUp } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Sandra M.', location: 'Zürich', text: 'Beste Entscheidung! 3 Offerten in 2 Stunden.', rating: 5 },
  { name: 'Thomas K.', location: 'Bern', text: 'Super einfach und transparent.', rating: 5 },
  { name: 'Lisa W.', location: 'Basel', text: 'CHF 600 gespart gegenüber Direktanfrage.', rating: 5 },
];

export const V4bSocialProof: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
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
              Schritt {currentStep}: Umzugsart wählen
            </h2>

            <div className="space-y-3">
              <SocialOption
                label="Privatumzug"
                stats="8,432 zufriedene Kunden"
                rating={4.9}
                selected
              />
              <SocialOption
                label="Firmenumzug"
                stats="1,205 Firmenkunden"
                rating={4.8}
              />
              <SocialOption
                label="Seniorenumzug"
                stats="98% Weiterempfehlung"
                rating={5.0}
              />
            </div>

            <Button
              size="lg"
              className="w-full mt-6"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
            >
              Weiter
            </Button>
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
}> = ({ label, stats, rating, selected }) => (
  <button
    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
      selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
    }`}
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

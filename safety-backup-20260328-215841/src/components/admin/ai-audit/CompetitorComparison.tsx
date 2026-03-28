/**
 * Competitor Comparison Module
 * Feature matrix and benchmark comparison with MOVU, Sirelo etc.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check, X, Minus, ExternalLink, RefreshCw,
  TrendingUp, TrendingDown, Equal, Shield,
  Zap, Search, Users, Star
} from 'lucide-react';
import { CompetitorData } from './types';

// Competitor data
const COMPETITORS: CompetitorData[] = [
  {
    name: 'Umzugscheck.ch',
    url: 'https://umzugscheck.ch',
    features: {
      priceCalculator: true,
      instantQuote: true,
      videoInventory: true,
      escrowPayment: true,
      liveTracking: false,
      mobileApp: false,
      aiPricing: true,
      whatsappSupport: true,
      chatBot: true,
      multiLanguage: true,
      googleReviews: true,
      astag: true
    },
    scores: {
      seo: 78,
      ux: 82,
      trust: 85,
      conversion: 75
    }
  },
  {
    name: 'MOVU',
    url: 'https://movu.ch',
    features: {
      priceCalculator: true,
      instantQuote: true,
      videoInventory: false,
      escrowPayment: false,
      liveTracking: false,
      mobileApp: true,
      aiPricing: false,
      whatsappSupport: false,
      chatBot: true,
      multiLanguage: true,
      googleReviews: true,
      astag: false
    },
    scores: {
      seo: 92,
      ux: 88,
      trust: 80,
      conversion: 85
    }
  },
  {
    name: 'Sirelo',
    url: 'https://sirelo.ch',
    features: {
      priceCalculator: true,
      instantQuote: false,
      videoInventory: false,
      escrowPayment: false,
      liveTracking: false,
      mobileApp: false,
      aiPricing: false,
      whatsappSupport: false,
      chatBot: false,
      multiLanguage: true,
      googleReviews: true,
      astag: false
    },
    scores: {
      seo: 75,
      ux: 70,
      trust: 65,
      conversion: 60
    }
  },
  {
    name: 'Umzug.ch',
    url: 'https://umzug.ch',
    features: {
      priceCalculator: true,
      instantQuote: false,
      videoInventory: false,
      escrowPayment: false,
      liveTracking: false,
      mobileApp: false,
      aiPricing: false,
      whatsappSupport: false,
      chatBot: false,
      multiLanguage: false,
      googleReviews: true,
      astag: true
    },
    scores: {
      seo: 68,
      ux: 55,
      trust: 70,
      conversion: 50
    }
  }
];

const FEATURE_LABELS: Record<string, { label: string; category: string }> = {
  priceCalculator: { label: 'Preisrechner', category: 'Core' },
  instantQuote: { label: 'Sofort-Offerte', category: 'Core' },
  videoInventory: { label: 'Video-Inventar', category: 'Innovation' },
  escrowPayment: { label: 'Escrow-Zahlung', category: 'Innovation' },
  liveTracking: { label: 'Live-Tracking', category: 'Innovation' },
  mobileApp: { label: 'Mobile App', category: 'Platform' },
  aiPricing: { label: 'AI-Pricing', category: 'Innovation' },
  whatsappSupport: { label: 'WhatsApp Support', category: 'Support' },
  chatBot: { label: 'Chat Bot', category: 'Support' },
  multiLanguage: { label: 'Mehrsprachig', category: 'Platform' },
  googleReviews: { label: 'Google Reviews', category: 'Trust' },
  astag: { label: 'ASTAG Zertifiziert', category: 'Trust' }
};

const FeatureIcon: React.FC<{ value: boolean }> = ({ value }) => (
  value ? (
    <Check className="w-5 h-5 text-green-500" />
  ) : (
    <X className="w-5 h-5 text-red-400" />
  )
);

const ScoreBar: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const getColor = (s: number) => {
    if (s >= 80) return 'bg-green-500';
    if (s >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(score)} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

const ComparisonIndicator: React.FC<{ ourScore: number; theirScore: number }> = ({ ourScore, theirScore }) => {
  const diff = ourScore - theirScore;
  if (diff > 5) return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (diff < -5) return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Equal className="w-4 h-4 text-muted-foreground" />;
};

export const CompetitorComparison: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('MOVU');
  
  const us = COMPETITORS[0]; // Umzugscheck
  const them = COMPETITORS.find(c => c.name === selectedCompetitor) || COMPETITORS[1];

  // Calculate overall scores
  const calculateOverall = (c: CompetitorData) => 
    Math.round((c.scores.seo + c.scores.ux + c.scores.trust + c.scores.conversion) / 4);

  // Count features
  const countFeatures = (c: CompetitorData) => 
    Object.values(c.features).filter(Boolean).length;

  // Get unique features
  const getUniqueFeatures = (c: CompetitorData, others: CompetitorData[]) => 
    Object.entries(c.features)
      .filter(([key, value]) => value && !others.some(o => o.features[key as keyof typeof o.features]))
      .map(([key]) => FEATURE_LABELS[key]?.label || key);

  const ourUnique = getUniqueFeatures(us, COMPETITORS.slice(1));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COMPETITORS.map((c) => (
          <Card 
            key={c.name}
            className={`cursor-pointer transition-all ${
              c.name === 'Umzugscheck.ch' 
                ? 'ring-2 ring-primary' 
                : selectedCompetitor === c.name 
                  ? 'ring-2 ring-secondary' 
                  : 'hover:shadow-md'
            }`}
            onClick={() => c.name !== 'Umzugscheck.ch' && setSelectedCompetitor(c.name)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{c.name}</h3>
                {c.name === 'Umzugscheck.ch' && (
                  <Badge variant="default">Wir</Badge>
                )}
              </div>
              <div className="text-3xl font-bold mb-2">{calculateOverall(c)}%</div>
              <div className="text-sm text-muted-foreground">
                {countFeatures(c)} / {Object.keys(c.features).length} Features
              </div>
              <a 
                href={c.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary flex items-center gap-1 mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
                Website
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Unique Features */}
      {ourUnique.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-primary" />
              <span className="font-semibold">Unsere Unique Features</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ourUnique.map((feature) => (
                <Badge key={feature} variant="default">{feature}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="features">
        <TabsList>
          <TabsTrigger value="features">Feature Matrix</TabsTrigger>
          <TabsTrigger value="scores">Score Vergleich</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature-Vergleich: Umzugscheck vs {selectedCompetitor}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Feature</th>
                      <th className="text-center py-3 px-2">Umzugscheck</th>
                      <th className="text-center py-3 px-2">{selectedCompetitor}</th>
                      <th className="text-center py-3 px-2">Kategorie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(FEATURE_LABELS).map(([key, { label, category }]) => (
                      <tr key={key} className="border-b last:border-0">
                        <td className="py-3 px-2 font-medium">{label}</td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex justify-center">
                            <FeatureIcon value={us.features[key as keyof typeof us.features]} />
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex justify-center">
                            <FeatureIcon value={them.features[key as keyof typeof them.features]} />
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="outline" className="text-xs">{category}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scores" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Our Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Umzugscheck.ch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreBar score={us.scores.seo} label="SEO" />
                <ScoreBar score={us.scores.ux} label="UX" />
                <ScoreBar score={us.scores.trust} label="Trust" />
                <ScoreBar score={us.scores.conversion} label="Conversion" />
                <div className="pt-4 border-t">
                  <div className="text-2xl font-bold">
                    Gesamt: {calculateOverall(us)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Their Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {selectedCompetitor}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ScoreBar score={them.scores.seo} label="SEO" />
                  </div>
                  <ComparisonIndicator ourScore={us.scores.seo} theirScore={them.scores.seo} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ScoreBar score={them.scores.ux} label="UX" />
                  </div>
                  <ComparisonIndicator ourScore={us.scores.ux} theirScore={them.scores.ux} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ScoreBar score={them.scores.trust} label="Trust" />
                  </div>
                  <ComparisonIndicator ourScore={us.scores.trust} theirScore={them.scores.trust} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ScoreBar score={them.scores.conversion} label="Conversion" />
                  </div>
                  <ComparisonIndicator ourScore={us.scores.conversion} theirScore={them.scores.conversion} />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      Gesamt: {calculateOverall(them)}%
                    </div>
                    <ComparisonIndicator 
                      ourScore={calculateOverall(us)} 
                      theirScore={calculateOverall(them)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gap Analyse & Handlungsempfehlungen</CardTitle>
              <CardDescription>
                Bereiche wo {selectedCompetitor} besser abschneidet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(us.scores).map(([key, ourScore]) => {
                  const theirScore = them.scores[key as keyof typeof them.scores];
                  const gap = theirScore - ourScore;
                  
                  if (gap <= 0) return null;
                  
                  return (
                    <div key={key} className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold capitalize">{key}</span>
                        <Badge variant="destructive">-{gap}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {key === 'seo' && `${selectedCompetitor} hat stärkere Domain Authority und mehr Backlinks. Fokus auf Content Marketing und Link Building.`}
                        {key === 'ux' && `${selectedCompetitor} hat optimierte User Flows. A/B Tests für CTA-Platzierung und Form-UX empfohlen.`}
                        {key === 'trust' && `Mehr Trust-Signale und Social Proof einbauen. Team-Fotos und Video-Testimonials priorisieren.`}
                        {key === 'conversion' && `Conversion-Funnel optimieren. Sticky CTAs, Exit-Intent und Retargeting implementieren.`}
                      </p>
                      <Button size="sm" variant="outline">
                        <Zap className="w-3 h-3 mr-1" />
                        Massnahmenplan
                      </Button>
                    </div>
                  );
                })}

                {Object.entries(us.scores).every(([key, ourScore]) => 
                  ourScore >= them.scores[key as keyof typeof them.scores]
                ) && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                    <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold">Keine signifikanten Gaps!</p>
                    <p className="text-sm text-muted-foreground">
                      Du bist in allen Bereichen auf Augenhöhe oder besser als {selectedCompetitor}.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetitorComparison;

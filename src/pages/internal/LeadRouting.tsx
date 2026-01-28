/**
 * Lead Scoring & Routing Brain
 * "Cherries & Chaff" Hybrid Model Implementation
 */

import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Calculator, Target, Phone, MessageSquare, Users, XCircle, 
  CheckCircle, AlertTriangle, Clock, Zap, TrendingUp, Shield,
  Package, Sparkles, Truck, Calendar, DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatSwissCHF } from '@/lib/swiss-number-format';

// Types
interface LeadInput {
  rooms: number;
  squareMeters: number | null;
  distanceKm: number;
  services: {
    packing: boolean;
    montage: boolean;
    cleaning: boolean;
  };
  moveDate: string;
  timingType: 'mid-month' | 'end-month' | 'tomorrow';
  budgetAttitude: 'quality' | 'cheapest';
  estimatedValue: number | null;
  capacityAvailable: boolean;
}

interface ScoringBreakdown {
  category: string;
  points: number;
  reason: string;
}

interface RoutingResult {
  tier: 1 | 2 | 3;
  tierName: 'Cherry' | 'Standard' | 'Chaff';
  route: string;
  conciergeMode: 'Human' | 'Automated' | 'None';
  callTimeBudget: string;
  sla: string;
  marginProtection: boolean;
  marginProtectionReason?: string;
}

const DEFAULT_INPUT: LeadInput = {
  rooms: 3.5,
  squareMeters: null,
  distanceKm: 25,
  services: {
    packing: false,
    montage: false,
    cleaning: false,
  },
  moveDate: '',
  timingType: 'mid-month',
  budgetAttitude: 'quality',
  estimatedValue: null,
  capacityAvailable: true,
};

// Scoring logic
function calculateScore(input: LeadInput): { total: number; breakdown: ScoringBreakdown[] } {
  const breakdown: ScoringBreakdown[] = [];
  
  // Volume scoring
  if (input.rooms > 3.5) {
    breakdown.push({ category: 'Volume', points: 30, reason: `${input.rooms} Zimmer (>3.5) → Grossumzug` });
  } else if (input.rooms >= 2 && input.rooms <= 3.5) {
    breakdown.push({ category: 'Volume', points: 20, reason: `${input.rooms} Zimmer (2-3.5) → Standard` });
  } else {
    breakdown.push({ category: 'Volume', points: -10, reason: `${input.rooms} Zimmer (<2) → Kleinumzug` });
  }
  
  // Distance scoring
  if (input.distanceKm > 50) {
    breakdown.push({ category: 'Distanz', points: 20, reason: `${input.distanceKm}km (>50km) → Langstrecke` });
  } else {
    breakdown.push({ category: 'Distanz', points: 10, reason: `${input.distanceKm}km (lokal) → Nahbereich` });
  }
  
  // Services scoring
  if (input.services.packing) {
    breakdown.push({ category: 'Services', points: 20, reason: 'Verpackung gewünscht → High-Value' });
  }
  if (input.services.cleaning) {
    breakdown.push({ category: 'Services', points: 10, reason: 'Reinigung gewünscht → Upsell' });
  }
  if (input.services.montage) {
    breakdown.push({ category: 'Services', points: 5, reason: 'Montage gewünscht → Upsell' });
  }
  
  // Date scoring
  if (input.timingType === 'mid-month') {
    breakdown.push({ category: 'Timing', points: 20, reason: 'Mitte Monat → Kapazität optimal' });
  } else if (input.timingType === 'end-month') {
    breakdown.push({ category: 'Timing', points: 0, reason: 'Monatsende → Peak-Nachfrage' });
  } else {
    breakdown.push({ category: 'Timing', points: -50, reason: 'Morgen/Dringend → Chaos-Risiko' });
  }
  
  // Budget attitude
  if (input.budgetAttitude === 'quality') {
    breakdown.push({ category: 'Budget', points: 10, reason: 'Qualitätsfokus → Preis-insensitiv' });
  } else {
    breakdown.push({ category: 'Budget', points: -20, reason: 'Billigst-Fokus → Marge-Killer' });
  }
  
  const total = breakdown.reduce((sum, item) => sum + item.points, 0);
  
  return { total: Math.max(0, Math.min(100, total)), breakdown };
}

// Routing logic
function determineRoute(score: number, input: LeadInput): RoutingResult {
  const minOrderValue = 800;
  const marginProtection = input.estimatedValue !== null && input.estimatedValue < minOrderValue;
  
  // Tier 1: Cherry (Score >= 60)
  if (score >= 60) {
    // Margin protection override
    if (marginProtection) {
      return {
        tier: 2,
        tierName: 'Standard',
        route: 'MARKETPLACE (Margin Protection Override)',
        conciergeMode: 'Automated',
        callTimeBudget: '2-3 Min.',
        sla: 'Automated sequence',
        marginProtection: true,
        marginProtectionReason: `Geschätzter Wert (${formatSwissCHF(input.estimatedValue!)}) < CHF 800 Minimum`,
      };
    }
    
    if (input.capacityAvailable) {
      return {
        tier: 1,
        tierName: 'Cherry',
        route: 'FEIERABENDUMZUG (Exklusiv)',
        conciergeMode: 'Human',
        callTimeBudget: '8-10 Min. (Whale)',
        sla: 'Offerte innerhalb 2 Stunden',
        marginProtection: false,
      };
    } else {
      return {
        tier: 1,
        tierName: 'Cherry',
        route: 'MARKETPLACE PREMIUM AUCTION',
        conciergeMode: 'Human',
        callTimeBudget: '5-8 Min.',
        sla: 'Höchstbietender Partner',
        marginProtection: false,
      };
    }
  }
  
  // Tier 2: Standard (Score 30-59)
  if (score >= 30) {
    return {
      tier: 2,
      tierName: 'Standard',
      route: 'MARKETPLACE ROUND ROBIN',
      conciergeMode: 'Automated',
      callTimeBudget: '2-3 Min.',
      sla: 'Max 3 Partner',
      marginProtection: false,
    };
  }
  
  // Tier 3: Chaff (Score < 30)
  return {
    tier: 3,
    tierName: 'Chaff',
    route: 'AUTO-REJECT oder BUDGET PARTNER (CHF 15)',
    conciergeMode: 'None',
    callTimeBudget: '0 Min.',
    sla: 'Keine',
    marginProtection: false,
  };
}

export default function LeadRouting() {
  const [input, setInput] = useState<LeadInput>(DEFAULT_INPUT);
  
  const { total: score, breakdown } = useMemo(() => calculateScore(input), [input]);
  const routing = useMemo(() => determineRoute(score, input), [score, input]);
  
  const updateInput = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };
  
  const updateService = (service: keyof LeadInput['services'], checked: boolean) => {
    setInput(prev => ({
      ...prev,
      services: { ...prev.services, [service]: checked },
    }));
  };
  
  return (
    <>
      <Helmet>
        <title>Lead Routing Brain | Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Lead Scoring & Routing Brain
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Cherries & Chaff • Hybrid Model
                </p>
              </div>
              <Badge variant={
                routing.tier === 1 ? 'default' :
                routing.tier === 2 ? 'secondary' :
                'destructive'
              } className="text-lg px-4 py-2">
                {routing.tier === 1 && '🍒 CHERRY'}
                {routing.tier === 2 && '📦 STANDARD'}
                {routing.tier === 3 && '🗑️ CHAFF'}
              </Badge>
            </div>
          </div>
        </header>
        
        {/* Margin Protection Alert */}
        {routing.marginProtection && (
          <div className="container mx-auto px-6 pt-4">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertTitle>⚠️ Direct Mover Margin Protection</AlertTitle>
              <AlertDescription>
                {routing.marginProtectionReason} — Lead wird zum Marketplace geroutet.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <main className="container mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* SECTION 1: Input Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Lead-Eingabe
                </CardTitle>
                <CardDescription>Daten vom Telefongespräch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                
                {/* Volume */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="rooms">Zimmer</Label>
                    <Input
                      id="rooms"
                      type="number"
                      step="0.5"
                      min="1"
                      value={input.rooms}
                      onChange={(e) => updateInput('rooms', parseFloat(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sqm">m² (optional)</Label>
                    <Input
                      id="sqm"
                      type="number"
                      placeholder="—"
                      value={input.squareMeters ?? ''}
                      onChange={(e) => updateInput('squareMeters', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                </div>
                
                {/* Distance */}
                <div>
                  <Label htmlFor="distance">Distanz (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="1"
                    value={input.distanceKm}
                    onChange={(e) => updateInput('distanceKm', parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <Separator />
                
                {/* Services */}
                <div>
                  <Label className="mb-3 block">Zusatz-Services</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="packing"
                        checked={input.services.packing}
                        onCheckedChange={(checked) => updateService('packing', !!checked)}
                      />
                      <Label htmlFor="packing" className="font-normal flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        Verpackung (+20)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="montage"
                        checked={input.services.montage}
                        onCheckedChange={(checked) => updateService('montage', !!checked)}
                      />
                      <Label htmlFor="montage" className="font-normal flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        Montage (+5)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="cleaning"
                        checked={input.services.cleaning}
                        onCheckedChange={(checked) => updateService('cleaning', !!checked)}
                      />
                      <Label htmlFor="cleaning" className="font-normal flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        Reinigung (+10)
                      </Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Date & Timing */}
                <div>
                  <Label htmlFor="moveDate">Umzugsdatum</Label>
                  <Input
                    id="moveDate"
                    type="date"
                    value={input.moveDate}
                    onChange={(e) => updateInput('moveDate', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label className="mb-3 block">Timing</Label>
                  <RadioGroup
                    value={input.timingType}
                    onValueChange={(value) => updateInput('timingType', value as LeadInput['timingType'])}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mid-month" id="mid" />
                      <Label htmlFor="mid" className="font-normal">Mitte Monat (+20)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="end-month" id="end" />
                      <Label htmlFor="end" className="font-normal">Monatsende (+0)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tomorrow" id="tomorrow" />
                      <Label htmlFor="tomorrow" className="font-normal text-red-600">Morgen/Dringend (-50)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                {/* Budget Attitude */}
                <div>
                  <Label className="mb-3 block">Budget-Einstellung</Label>
                  <RadioGroup
                    value={input.budgetAttitude}
                    onValueChange={(value) => updateInput('budgetAttitude', value as LeadInput['budgetAttitude'])}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quality" id="quality" />
                      <Label htmlFor="quality" className="font-normal">Qualitätsfokus (+10)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cheapest" id="cheapest" />
                      <Label htmlFor="cheapest" className="font-normal text-yellow-600">Billigster Preis (-20)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                {/* Estimated Value */}
                <div>
                  <Label htmlFor="value">Geschätzter Wert (CHF)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="z.B. 2200"
                    value={input.estimatedValue ?? ''}
                    onChange={(e) => updateInput('estimatedValue', e.target.value ? parseInt(e.target.value) : null)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Min. CHF 800 für Feierabendumzug
                  </p>
                </div>
                
                {/* Capacity Toggle */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="capacity" className="font-medium">Feierabend-Kapazität</Label>
                    <p className="text-xs text-muted-foreground">Am gewählten Datum</p>
                  </div>
                  <Switch
                    id="capacity"
                    checked={input.capacityAvailable}
                    onCheckedChange={(checked) => updateInput('capacityAvailable', checked)}
                  />
                </div>
                
              </CardContent>
            </Card>
            
            {/* SECTION 2 & 3: Scoring & Routing */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Score Display */}
              <Card className={
                routing.tier === 1 ? 'border-green-500 border-2' :
                routing.tier === 2 ? 'border-yellow-500 border-2' :
                'border-red-500 border-2'
              }>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Lead Score
                    </CardTitle>
                    <div className="text-4xl font-bold font-mono">
                      {score}/100
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={score} 
                    className={`h-4 mb-4 ${
                      score >= 60 ? '[&>div]:bg-green-500' :
                      score >= 30 ? '[&>div]:bg-yellow-500' :
                      '[&>div]:bg-red-500'
                    }`}
                  />
                  
                  {/* Breakdown */}
                  <div className="grid md:grid-cols-2 gap-2">
                    {breakdown.map((item, i) => (
                      <div 
                        key={i}
                        className={`p-2 rounded text-sm flex justify-between items-center ${
                          item.points > 0 ? 'bg-green-500/10' :
                          item.points < 0 ? 'bg-red-500/10' :
                          'bg-muted'
                        }`}
                      >
                        <span className="text-muted-foreground">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs truncate max-w-32">{item.reason}</span>
                          <Badge variant={item.points > 0 ? 'default' : item.points < 0 ? 'destructive' : 'outline'}>
                            {item.points > 0 ? '+' : ''}{item.points}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Routing Result */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Routing-Entscheidung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Route */}
                  <div className={`p-4 rounded-lg ${
                    routing.tier === 1 ? 'bg-green-500/10 border border-green-500' :
                    routing.tier === 2 ? 'bg-yellow-500/10 border border-yellow-500' :
                    'bg-red-500/10 border border-red-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Empfohlene Route</p>
                        <p className="text-xl font-bold">{routing.route}</p>
                      </div>
                      <Badge variant={
                        routing.tier === 1 ? 'default' :
                        routing.tier === 2 ? 'secondary' :
                        'destructive'
                      } className="text-lg px-3 py-1">
                        Tier {routing.tier}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Concierge Mode</p>
                      </div>
                      <p className={`font-bold ${
                        routing.conciergeMode === 'Human' ? 'text-green-600' :
                        routing.conciergeMode === 'Automated' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {routing.conciergeMode}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Call Time Budget</p>
                      </div>
                      <p className="font-bold">{routing.callTimeBudget}</p>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">SLA</p>
                      </div>
                      <p className="font-bold">{routing.sla}</p>
                    </div>
                  </div>
                  
                  {/* Rules Explanation */}
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">
                    <p className="font-medium mb-2">Routing-Regeln:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className={score >= 60 ? 'text-foreground font-medium' : ''}>
                        • Score ≥60: <strong>Tier 1 Cherry</strong> → Feierabend exklusiv (wenn Kapazität)
                      </li>
                      <li className={score >= 30 && score < 60 ? 'text-foreground font-medium' : ''}>
                        • Score 30-59: <strong>Tier 2 Standard</strong> → Marketplace (max 3 Partner)
                      </li>
                      <li className={score < 30 ? 'text-foreground font-medium' : ''}>
                        • Score &lt;30: <strong>Tier 3 Chaff</strong> → Reject oder Budget-Partner (CHF 15)
                      </li>
                    </ul>
                  </div>
                  
                </CardContent>
              </Card>
              
              {/* SECTION 5: Output Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Nächste Aktionen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Button
                      variant={routing.tier === 1 ? 'default' : 'outline'}
                      className="h-auto py-4 flex-col gap-2"
                      disabled={routing.tier === 3}
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>WhatsApp Video Survey</span>
                      <span className="text-xs opacity-70">AI Inventar-Scan</span>
                    </Button>
                    
                    <Button
                      variant={routing.tier === 2 ? 'default' : 'outline'}
                      className="h-auto py-4 flex-col gap-2"
                    >
                      <Users className="h-5 w-5" />
                      <span>Partner Round Robin</span>
                      <span className="text-xs opacity-70">Max 3 Partner</span>
                    </Button>
                    
                    <Button
                      variant={routing.tier === 3 ? 'destructive' : 'outline'}
                      className="h-auto py-4 flex-col gap-2"
                    >
                      <XCircle className="h-5 w-5" />
                      <span>Reject / Budget</span>
                      <span className="text-xs opacity-70">CHF 15 flat</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

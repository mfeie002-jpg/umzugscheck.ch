import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Play, Star, Clock, CheckCircle2, ArrowRight, 
  ExternalLink, MessageSquare, ThumbsUp, ThumbsDown,
  BarChart3, Trophy, Send, ChevronRight, Eye,
  Sparkles, Target, Timer, Zap, Users, Award
} from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';

interface FlowConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  path: string;
  color: string;
  features: string[];
}

interface FlowFeedback {
  flowId: string;
  stepRatings: Record<string, { rating: number; comment: string; timeSpent: number }>;
  overallRating: number;
  wouldRecommend: boolean;
  completedAt: Date | null;
  abandoned: boolean;
  abandonedAtStep?: string;
  totalTime: number;
}

interface TesterInfo {
  name: string;
  email: string;
  role: string;
}

const FLOWS: FlowConfig[] = [
  {
    id: 'v1',
    name: 'Classic Flow',
    version: 'V1',
    description: 'Der ursprüngliche 5-Schritt Funnel',
    path: '/umzugsofferten',
    color: 'bg-blue-500',
    features: ['5 klare Schritte', 'Firmenauswahl', 'Standard-Formular']
  },
  {
    id: 'v2',
    name: 'Optimized Flow',
    version: 'V2',
    description: 'Optimierter Funnel mit besserem UX',
    path: '/umzugsofferten-v2',
    color: 'bg-green-500',
    features: ['Verbesserte UX', 'Schnellere Eingabe', 'Mobile-optimiert']
  },
  {
    id: 'v3',
    name: 'Interactive Flow',
    version: 'V3',
    description: 'Interaktiver Wizard mit Animationen',
    path: '/umzugsofferten-v3',
    color: 'bg-purple-500',
    features: ['Smooth Animations', 'Progress Tracking', 'Visual Feedback']
  },
  {
    id: 'v4',
    name: 'Smart Flow',
    version: 'V4',
    description: 'Intelligenter Funnel mit Preisvorschau',
    path: '/umzugsofferten-v4',
    color: 'bg-orange-500',
    features: ['Live-Preisberechnung', 'Smart Defaults', 'Upsell-Optionen']
  },
  {
    id: 'v5',
    name: 'Premium Flow',
    version: 'V5',
    description: 'Premium-Erlebnis mit Service-Levels',
    path: '/umzugsofferten-v5',
    color: 'bg-pink-500',
    features: ['Service-Level Slider', 'Premium Design', 'Crew Preview']
  },
  {
    id: 'v6',
    name: 'Ultimate Wizard',
    version: 'V6',
    description: 'Das ultimative 0-100 System',
    path: '/umzugsofferten-v6',
    color: 'bg-indigo-500',
    features: ['6-Tier Architektur', 'Video-Scan Konzept', 'Trust Engine']
  },
  {
    id: 'v7',
    name: 'SwissMove',
    version: 'V7',
    description: '90-Sekunden Buchung',
    path: '/umzugsofferten-v7',
    color: 'bg-cyan-500',
    features: ['Instant Quote', 'Live Tracking', 'Crew Profiles']
  },
  {
    id: 'v8',
    name: 'Decision-Free',
    version: 'V8',
    description: 'KI-gestütztes Relocation OS',
    path: '/umzugsofferten-v8',
    color: 'bg-emerald-500',
    features: ['Computer Vision Scan', 'Auto-Proposal', 'Zero Decisions']
  },
  {
    id: 'v9',
    name: 'Zero Friction',
    version: 'V9',
    description: 'Minimaler Aufwand, maximale Conversion',
    path: '/umzugsofferten-v9',
    color: 'bg-rose-500',
    features: ['3-Klick Flow', 'Smart Defaults', 'Instant Quote', 'Zero Friction']
  }
];

const RATING_CRITERIA = [
  { id: 'clarity', label: 'Klarheit', description: 'Wie klar waren die Schritte?' },
  { id: 'speed', label: 'Geschwindigkeit', description: 'Wie schnell ging es?' },
  { id: 'trust', label: 'Vertrauen', description: 'Wie vertrauenswürdig wirkt es?' },
  { id: 'design', label: 'Design', description: 'Wie ansprechend ist das Design?' },
  { id: 'mobile', label: 'Mobile UX', description: 'Wie gut funktioniert es mobil?' }
];

export default function FlowTester() {
  const [testerInfo, setTesterInfo] = useState<TesterInfo>({ name: '', email: '', role: 'user' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentFlowIndex, setCurrentFlowIndex] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, FlowFeedback>>({});
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentStepFeedback, setCurrentStepFeedback] = useState<{
    rating: number;
    comment: string;
  }>({ rating: 0, comment: '' });

  // Initialize feedbacks
  useEffect(() => {
    const initialFeedbacks: Record<string, FlowFeedback> = {};
    FLOWS.forEach(flow => {
      initialFeedbacks[flow.id] = {
        flowId: flow.id,
        stepRatings: {},
        overallRating: 0,
        wouldRecommend: false,
        completedAt: null,
        abandoned: false,
        totalTime: 0
      };
    });
    setFeedbacks(initialFeedbacks);
  }, []);

  const handleRegister = () => {
    if (!testerInfo.name || !testerInfo.email) {
      toast.error('Bitte Name und E-Mail eingeben');
      return;
    }
    setIsRegistered(true);
    toast.success(`Willkommen, ${testerInfo.name}! Starte mit dem Testen.`);
  };

  const startTestingFlow = (index: number) => {
    setCurrentFlowIndex(index);
    setTestStartTime(new Date());
    // Open flow in new tab
    window.open(FLOWS[index].path, '_blank');
  };

  const submitFlowFeedback = (flowId: string, rating: number, recommend: boolean, comments: string) => {
    const endTime = new Date();
    const totalTime = testStartTime ? (endTime.getTime() - testStartTime.getTime()) / 1000 : 0;
    
    setFeedbacks(prev => ({
      ...prev,
      [flowId]: {
        ...prev[flowId],
        overallRating: rating,
        wouldRecommend: recommend,
        completedAt: endTime,
        totalTime,
        stepRatings: {
          ...prev[flowId].stepRatings,
          overall: { rating, comment: comments, timeSpent: totalTime }
        }
      }
    }));
    
    setCurrentFlowIndex(null);
    setTestStartTime(null);
    toast.success(`Feedback für ${FLOWS.find(f => f.id === flowId)?.name} gespeichert!`);
  };

  const markAsAbandoned = (flowId: string, atStep: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [flowId]: {
        ...prev[flowId],
        abandoned: true,
        abandonedAtStep: atStep
      }
    }));
    setCurrentFlowIndex(null);
    toast.info('Flow als abgebrochen markiert');
  };

  const getCompletedCount = () => Object.values(feedbacks).filter(f => f.completedAt).length;
  
  const getBestFlow = () => {
    const completed = Object.values(feedbacks).filter(f => f.completedAt && f.overallRating > 0);
    if (completed.length === 0) return null;
    return completed.reduce((best, current) => 
      current.overallRating > best.overallRating ? current : best
    );
  };

  const calculateResults = () => {
    const results = FLOWS.map(flow => {
      const fb = feedbacks[flow.id];
      return {
        ...flow,
        rating: fb.overallRating,
        recommend: fb.wouldRecommend,
        time: fb.totalTime,
        completed: !!fb.completedAt,
        abandoned: fb.abandoned
      };
    }).sort((a, b) => b.rating - a.rating);
    
    return results;
  };

  const renderRegistration = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Flow Tester Registrierung</CardTitle>
        <p className="text-muted-foreground text-sm">
          Testen Sie alle 9 Umzugsofferten-Flows und helfen Sie uns, den besten zu finden.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input 
            placeholder="Ihr Name"
            value={testerInfo.name}
            onChange={(e) => setTesterInfo({ ...testerInfo, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>E-Mail</Label>
          <Input 
            type="email"
            placeholder="ihre@email.ch"
            value={testerInfo.email}
            onChange={(e) => setTesterInfo({ ...testerInfo, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Rolle</Label>
          <RadioGroup 
            value={testerInfo.role} 
            onValueChange={(v) => setTesterInfo({ ...testerInfo, role: v })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">Normaler Nutzer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ux" id="ux" />
              <Label htmlFor="ux">UX/Design Experte</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="business" />
              <Label htmlFor="business">Business/Marketing</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleRegister}>
          <Play className="mr-2 h-4 w-4" />
          Mit Testen beginnen
        </Button>
      </CardFooter>
    </Card>
  );

  const renderFlowCard = (flow: FlowConfig, index: number) => {
    const fb = feedbacks[flow.id];
    const isCompleted = fb?.completedAt;
    const isAbandoned = fb?.abandoned;
    const isCurrent = currentFlowIndex === index;
    
    return (
      <motion.div
        key={flow.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`relative overflow-hidden ${isCurrent ? 'ring-2 ring-primary' : ''} ${isCompleted ? 'bg-green-500/5' : ''}`}>
          {isCompleted && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Getestet
              </Badge>
            </div>
          )}
          {isAbandoned && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">Abgebrochen</Badge>
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${flow.color} flex items-center justify-center text-white font-bold`}>
                {flow.version}
              </div>
              <div>
                <CardTitle className="text-lg">{flow.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{flow.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {flow.features.map((f, i) => (
                <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
              ))}
            </div>
            {isCompleted && fb.overallRating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Bewertung:</span>
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= fb.overallRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{fb.overallRating}/5</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {!isCurrent && !isCompleted && (
              <Button className="flex-1" onClick={() => startTestingFlow(index)}>
                <Play className="mr-2 h-4 w-4" />
                Testen
              </Button>
            )}
            {isCurrent && (
              <Button variant="outline" className="flex-1" onClick={() => setCurrentFlowIndex(null)}>
                Feedback geben
              </Button>
            )}
            {isCompleted && (
              <Button variant="ghost" className="flex-1" onClick={() => startTestingFlow(index)}>
                <Eye className="mr-2 h-4 w-4" />
                Nochmal ansehen
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <a href={flow.path} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  const renderFeedbackModal = () => {
    if (currentFlowIndex === null) return null;
    const flow = FLOWS[currentFlowIndex];
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${flow.color} flex items-center justify-center text-white font-bold`}>
                {flow.version}
              </div>
              Feedback für {flow.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Rating */}
            <div className="space-y-3">
              <Label>Gesamtbewertung</Label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setCurrentStepFeedback(prev => ({ ...prev, rating }))}
                    className="p-2 hover:scale-110 transition-transform"
                  >
                    <Star className={`h-8 w-8 ${rating <= currentStepFeedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/50 stroke-current'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria Ratings */}
            <div className="space-y-4">
              <Label>Detailbewertung</Label>
              {RATING_CRITERIA.map(criterion => (
                <div key={criterion.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{criterion.label}</div>
                    <div className="text-xs text-muted-foreground">{criterion.description}</div>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(r => (
                      <button key={r} className="p-1">
                        <Star className="h-4 w-4 text-muted-foreground/50 stroke-current hover:text-yellow-500 hover:fill-yellow-500" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Would Recommend */}
            <div className="space-y-3">
              <Label>Würden Sie diesen Flow empfehlen?</Label>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => submitFlowFeedback(flow.id, currentStepFeedback.rating, true, currentStepFeedback.comment)}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Ja
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => submitFlowFeedback(flow.id, currentStepFeedback.rating, false, currentStepFeedback.comment)}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Nein
                </Button>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label>Kommentare & Verbesserungsvorschläge</Label>
              <Textarea 
                placeholder="Was hat Ihnen gefallen? Was könnte besser sein?"
                value={currentStepFeedback.comment}
                onChange={(e) => setCurrentStepFeedback(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              variant="ghost" 
              onClick={() => markAsAbandoned(flow.id, 'feedback')}
            >
              Abbrechen
            </Button>
            <Button 
              className="flex-1"
              onClick={() => submitFlowFeedback(flow.id, currentStepFeedback.rating, true, currentStepFeedback.comment)}
              disabled={currentStepFeedback.rating === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              Feedback absenden
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderResults = () => {
    const results = calculateResults();
    const best = results[0];
    
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
            <Trophy className="h-10 w-10 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold">Ihre Testergebnisse</h2>
          <p className="text-muted-foreground">
            Vielen Dank, {testerInfo.name}! Hier ist Ihre persönliche Auswertung.
          </p>
        </div>

        {/* Winner */}
        {best && best.rating > 0 && (
          <Card className="border-2 border-yellow-500 bg-yellow-500/5 max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <Badge className="bg-yellow-500 mb-4">🏆 Ihr Favorit</Badge>
              <div className={`w-16 h-16 rounded-xl ${best.color} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4`}>
                {best.version}
              </div>
              <h3 className="text-xl font-bold">{best.name}</h3>
              <div className="flex justify-center mt-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-5 w-5 ${s <= best.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Results */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Alle Bewertungen</h3>
          {results.map((result, index) => (
            <div 
              key={result.id} 
              className="flex items-center gap-4 p-4 rounded-lg border bg-card"
            >
              <div className="text-2xl font-bold text-muted-foreground w-8">
                #{index + 1}
              </div>
              <div className={`w-12 h-12 rounded-lg ${result.color} flex items-center justify-center text-white font-bold`}>
                {result.version}
              </div>
              <div className="flex-1">
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-muted-foreground">{result.description}</div>
              </div>
              <div className="flex items-center gap-2">
                {result.completed ? (
                  <>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-4 w-4 ${s <= result.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                      ))}
                    </div>
                    <span className="font-bold">{result.rating}/5</span>
                  </>
                ) : result.abandoned ? (
                  <Badge variant="destructive">Abgebrochen</Badge>
                ) : (
                  <Badge variant="outline">Nicht getestet</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Results */}
        <div className="text-center">
          <Button size="lg" onClick={() => {
            toast.success('Ergebnisse wurden gespeichert!');
            // Here you would save to database
          }}>
            <Send className="mr-2 h-5 w-5" />
            Ergebnisse final absenden
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg">Flow Tester</span>
                <Badge variant="outline" className="ml-2">Beta</Badge>
              </div>
            </div>
            {isRegistered && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{getCompletedCount()}</span> / {FLOWS.length} getestet
                </div>
                <Progress value={(getCompletedCount() / FLOWS.length) * 100} className="w-32 h-2" />
                {getCompletedCount() >= 3 && (
                  <Button variant="outline" size="sm" onClick={() => setShowResults(true)}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Ergebnisse
                  </Button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {!isRegistered ? (
            renderRegistration()
          ) : showResults ? (
            renderResults()
          ) : (
            <div className="space-y-8">
              {/* Instructions */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">So funktioniert's</h3>
                      <ol className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">1</span>
                          Klicken Sie auf "Testen" um einen Flow in einem neuen Tab zu öffnen
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">2</span>
                          Durchlaufen Sie den Flow wie ein echter Kunde
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">3</span>
                          Kommen Sie zurück und geben Sie Ihr Feedback
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">4</span>
                          Nach 3+ Tests sehen Sie Ihre Ergebnisse
                        </li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flow Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {FLOWS.map((flow, index) => renderFlowCard(flow, index))}
              </div>

              {/* Quick Actions */}
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <Zap className="mr-2 h-4 w-4" />
                  Neuer Test starten
                </Button>
                {getCompletedCount() >= 3 && (
                  <Button onClick={() => setShowResults(true)}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ergebnisse anzeigen
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Feedback Modal */}
        {renderFeedbackModal()}

        {/* Footer */}
        <footer className="border-t py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            Flow Tester • Umzugscheck.ch A/B Testing Suite
          </div>
        </footer>
      </div>
    </>
  );
}

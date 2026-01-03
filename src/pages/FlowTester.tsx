import { useState } from 'react';
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
  Sparkles, Target, Timer, Zap, Users, Award, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';

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
  detailedAnswers: Record<string, number | string>;
}

interface FinalSurvey {
  bestFlow: string;
  worstFlow: string;
  missingFeatures: string;
  priceClarity: number;
  trustLevel: number;
  mobileExperience: number;
  wouldUseAgain: boolean;
  recommendToFriend: boolean;
  additionalComments: string;
  preferredFlowFeatures: string[];
}

interface TesterInfo {
  name: string;
  email: string;
  role: string;
}

// All registered flows
const FLOWS: FlowConfig[] = [
  { id: 'v1', name: 'Classic Flow', version: 'V1', description: 'Ursprünglicher 5-Schritt Funnel', path: '/umzugsofferten', color: 'bg-blue-500', features: ['5 Schritte', 'Firmenauswahl', 'Standard-Formular'] },
  { id: 'v2', name: 'Premium Journey', version: 'V2', description: 'Full-Journey mit Progress-Tracking', path: '/umzugsofferten-v2', color: 'bg-green-500', features: ['Progress-Ring', 'Trust-Elemente', 'Mobile-optimiert'] },
  { id: 'v3', name: 'Mobile First', version: 'V3', description: 'Touch-optimiert für Smartphones', path: '/umzugsofferten-v3', color: 'bg-purple-500', features: ['Touch-Targets', 'Swipe-Navigation', 'Bottom-Sheet'] },
  { id: 'v4', name: 'Video-First AI', version: 'V4', description: 'Mit Dringlichkeit & Social Proof', path: '/umzugsofferten-v4', color: 'bg-orange-500', features: ['Countdown', 'Live-Activity', 'Urgency'] },
  { id: 'v5', name: 'Marketplace', version: 'V5', description: 'Accessibility & Service-Levels', path: '/umzugsofferten-v5', color: 'bg-pink-500', features: ['High Contrast', 'Keyboard-Nav', 'Screen-Reader'] },
  { id: 'v6', name: 'Ultimate 6-Tier', version: 'V6', description: 'Das ultimative 0-100 System', path: '/umzugsofferten-v6', color: 'bg-indigo-500', features: ['6-Tier-Architektur', 'AI-Modus', 'Trust-Engine'] },
  { id: 'v7', name: 'SwissMove 90s', version: 'V7', description: '90-Sekunden Buchung', path: '/umzugsofferten-v7', color: 'bg-cyan-500', features: ['Instant Quote', 'Live Tracking', 'Schnell'] },
  { id: 'v8', name: 'Decision-Free', version: 'V8', description: 'KI-gestütztes Relocation OS', path: '/umzugsofferten-v8', color: 'bg-emerald-500', features: ['Auto-Proposal', 'Zero Decisions', 'Smart'] },
  { id: 'v9', name: 'Zero Friction', version: 'V9', description: 'Minimaler Aufwand, maximale Conversion', path: '/umzugsofferten-v9', color: 'bg-rose-500', features: ['3-Klick', 'Smart Defaults', 'Express'] },
  { id: 'v1b', name: 'V1b Feedback-Optimiert', version: 'V1.B', description: 'Basierend auf User-Feedback', path: '/umzugsofferten?v=v1b', color: 'bg-blue-600', features: ['Optimierte UX', 'Klare Labels', 'Schneller'] },
  { id: 'v2c', name: 'V2c Trust-Fokus', version: 'V2.C', description: 'Maximales Vertrauen', path: '/umzugsofferten?v=v2c', color: 'bg-green-600', features: ['Trust-Badges', 'Garantien', 'Testimonials'] },
  { id: 'v3a', name: 'V3a Mobile-First', version: 'V3.A', description: 'Touch-optimiert', path: '/umzugsofferten?v=v3a', color: 'bg-purple-600', features: ['Large Touch', 'Bottom Nav', 'Mobile Hero'] },
  { id: 'v4b', name: 'V4b Social Proof', version: 'V4.B', description: 'Live-Aktivität & Reviews', path: '/umzugsofferten?v=v4b', color: 'bg-orange-600', features: ['Live Activity', 'Reviews', 'User Count'] },
  { id: 'v6f', name: 'V6f Ultimate', version: 'V6.F', description: 'Die ultimative Version', path: '/umzugsofferten?v=v6f', color: 'bg-indigo-600', features: ['Best of All', 'AI-Enhanced', 'Premium'] },
  { id: 'v9a', name: 'V9a Zero-Friction', version: 'V9.A', description: 'Minimal & schnell', path: '/umzugsofferten?v=v9a', color: 'bg-rose-600', features: ['Minimal Steps', 'Smart Defaults', 'Express'] },
  { id: 'ultimate-v7', name: 'Ultimate V7', version: 'ULT', description: 'Kombiniert alle Best Practices', path: '/umzugsofferten?v=ultimate-v7', color: 'bg-gradient-to-r from-purple-500 to-pink-500', features: ['Best Practices', 'AI-Optimiert', 'Top Performance'] }
];

const FLOW_QUESTIONS = [
  { id: 'q1', question: 'Wie einfach war der Einstieg in den Flow?', type: 'rating' as const },
  { id: 'q2', question: 'War der Preisbereich sofort ersichtlich?', type: 'rating' as const },
  { id: 'q3', question: 'Wie verständlich waren die Eingabefelder?', type: 'rating' as const },
  { id: 'q4', question: 'Wie gut hat die Firmenauswahl funktioniert?', type: 'rating' as const },
  { id: 'q5', question: 'War das Kontaktformular angenehm auszufüllen?', type: 'rating' as const },
  { id: 'q6', question: 'Wie professionell wirkte der gesamte Ablauf?', type: 'rating' as const },
  { id: 'q7', question: 'Gab es verwirrende oder überflüssige Schritte?', type: 'yesno' as const },
  { id: 'q8', question: 'Haben Sie das Gefühl, dass Ihre Daten sicher sind?', type: 'rating' as const },
  { id: 'q9', question: 'Würden Sie den Flow auf dem Handy nutzen?', type: 'yesno' as const },
  { id: 'q10', question: 'Was hat Ihnen am meisten gefallen/gefehlt?', type: 'text' as const },
];

const FINAL_QUESTIONS = [
  { id: 'priceClarity', question: 'Wie klar war die Preiskommunikation insgesamt?', type: 'rating' as const },
  { id: 'trustLevel', question: 'Wie hoch war Ihr Vertrauensgefühl?', type: 'rating' as const },
  { id: 'mobileExperience', question: 'Wie war die Mobile-Erfahrung?', type: 'rating' as const },
];

export default function FlowTester() {
  const [testerInfo, setTesterInfo] = useState<TesterInfo>({ name: '', email: '', role: 'user' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentFlowIndex, setCurrentFlowIndex] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, FlowFeedback>>(() => {
    const initial: Record<string, FlowFeedback> = {};
    FLOWS.forEach(flow => {
      initial[flow.id] = {
        flowId: flow.id,
        stepRatings: {},
        overallRating: 0,
        wouldRecommend: false,
        completedAt: null,
        abandoned: false,
        totalTime: 0,
        detailedAnswers: {},
      };
    });
    return initial;
  });
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showFinalSurvey, setShowFinalSurvey] = useState(false);
  const [currentStepFeedback, setCurrentStepFeedback] = useState<{
    rating: number;
    comment: string;
    detailedAnswers: Record<string, number | string>;
  }>({ rating: 0, comment: '', detailedAnswers: {} });
  const [finalSurvey, setFinalSurvey] = useState<FinalSurvey>({
    bestFlow: '',
    worstFlow: '',
    missingFeatures: '',
    priceClarity: 0,
    trustLevel: 0,
    mobileExperience: 0,
    wouldUseAgain: false,
    recommendToFriend: false,
    additionalComments: '',
    preferredFlowFeatures: [],
  });

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
        detailedAnswers: { ...currentStepFeedback.detailedAnswers },
        stepRatings: {
          ...prev[flowId].stepRatings,
          overall: { rating, comment: comments, timeSpent: totalTime }
        }
      }
    }));
    
    setCurrentFlowIndex(null);
    setTestStartTime(null);
    setCurrentStepFeedback({ rating: 0, comment: '', detailedAnswers: {} });
    toast.success(`Feedback für ${FLOWS.find(f => f.id === flowId)?.name} gespeichert!`);
  };

  const markAsAbandoned = (flowId: string, atStep: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [flowId]: { ...prev[flowId], abandoned: true, abandonedAtStep: atStep }
    }));
    setCurrentFlowIndex(null);
    toast.info('Flow als abgebrochen markiert');
  };

  const getCompletedCount = () => Object.values(feedbacks).filter(f => f.completedAt).length;

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
        transition={{ delay: index * 0.05 }}
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>Umzugscheck Flow-Tester | Umzugscheck.ch</title>
        <meta name="description" content="Testen Sie verschiedene Umzugsofferten-Flows und helfen Sie uns, den besten zu finden." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-lg sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">Umzugscheck Flow-Tester</span>
              <Badge variant="outline" className="ml-2">Live</Badge>
            </div>
          </div>
          {isRegistered && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{getCompletedCount()}</span> / {FLOWS.length} getestet
              </div>
              <Progress value={(getCompletedCount() / FLOWS.length) * 100} className="w-32 h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isRegistered ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Umzugscheck Flow-Tester</CardTitle>
              <p className="text-muted-foreground text-sm">
                Testen Sie {FLOWS.length} verschiedene Umzugsofferten-Flows und helfen Sie uns, den besten zu finden.
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
                    <h3 className="font-bold text-lg mb-2">So funktioniert es</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">1</span>
                        Klicken Sie auf Testen um einen Flow in einem neuen Tab zu öffnen
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">2</span>
                        Durchlaufen Sie den Flow wie ein echter Kunde
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">3</span>
                        Kommen Sie zurück und beantworten Sie die Fragen
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">4</span>
                        Nach 3+ Tests folgt die Abschlussbefragung
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
                <Button onClick={() => setShowFinalSurvey(true)}>
                  <Award className="mr-2 h-4 w-4" />
                  Abschlussbefragung starten
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

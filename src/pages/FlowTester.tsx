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
  detailedAnswers: Record<string, number | string>; // For 10 specific questions
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

const FLOWS: FlowConfig[] = [
  // === MAIN FLOWS (V1-V9) ===
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
  },
  
  // === V2 SUB-VARIANTS (UX-Optimierung) ===
  {
    id: 'v2a',
    name: 'V2a Progress Enhanced',
    version: 'V2.A',
    description: 'Visueller Fortschritt mit Micro-Animations',
    path: '/umzugsofferten?v=2a',
    color: 'bg-green-400',
    features: ['Progress Ring', 'Micro-Animations', 'Step Tracker']
  },
  {
    id: 'v2b',
    name: 'V2b Simplified Labels',
    version: 'V2.B',
    description: 'Vereinfachte Beschriftungen & Texte',
    path: '/umzugsofferten?v=2b',
    color: 'bg-green-600',
    features: ['Simple Labels', 'Klare Sprache', 'Weniger Text']
  },
  {
    id: 'v2c',
    name: 'V2c Trust Focused',
    version: 'V2.C',
    description: 'Vertrauenselemente überall',
    path: '/umzugsofferten?v=2c',
    color: 'bg-green-700',
    features: ['Trust Badges', 'Testimonials', 'Garantien']
  },
  {
    id: 'v2d',
    name: 'V2d Speed Optimized',
    version: 'V2.D',
    description: 'Auf Geschwindigkeit getrimmt',
    path: '/umzugsofferten?v=2d',
    color: 'bg-green-800',
    features: ['Minimal Fields', 'Auto-Complete', 'Fast Track']
  },
  {
    id: 'v2e',
    name: 'V2e Experimental',
    version: 'V2.E',
    description: 'Experimentelle Features',
    path: '/umzugsofferten?v=2e',
    color: 'bg-lime-500',
    features: ['AI Suggestions', 'Smart Defaults', 'Predictions']
  },

  // === V3 SUB-VARIANTS (Mobile-First) ===
  {
    id: 'v3a',
    name: 'V3a Mobile First',
    version: 'V3.A',
    description: 'Touch-optimiert für Mobile',
    path: '/umzugsofferten?v=3a',
    color: 'bg-purple-400',
    features: ['Large Touch Targets', 'Bottom Nav', 'Mobile Hero']
  },
  {
    id: 'v3b',
    name: 'V3b Swipe Navigation',
    version: 'V3.B',
    description: 'Swipe zwischen Steps',
    path: '/umzugsofferten?v=3b',
    color: 'bg-purple-600',
    features: ['Swipe Gestures', 'Carousel Steps', 'Fluid Motion']
  },
  {
    id: 'v3c',
    name: 'V3c Bottom Sheet',
    version: 'V3.C',
    description: 'Native Bottom Sheet UX',
    path: '/umzugsofferten?v=3c',
    color: 'bg-purple-700',
    features: ['Bottom Sheet', 'Pull-to-Dismiss', 'Overlay Inputs']
  },
  {
    id: 'v3d',
    name: 'V3d Thumb Zone',
    version: 'V3.D',
    description: 'Optimiert für Daumen-Erreichbarkeit',
    path: '/umzugsofferten?v=3d',
    color: 'bg-purple-800',
    features: ['Thumb Zone', 'Bottom Actions', 'One-Hand Use']
  },
  {
    id: 'v3e',
    name: 'V3e Fullscreen',
    version: 'V3.E',
    description: 'Immersives Fullscreen-Erlebnis',
    path: '/umzugsofferten?v=3e',
    color: 'bg-violet-500',
    features: ['Fullscreen', 'No Distractions', 'Focus Mode']
  },

  // === V4 SUB-VARIANTS (Conversion-Focused) ===
  {
    id: 'v4a',
    name: 'V4a Urgency Based',
    version: 'V4.A',
    description: 'FOMO & Dringlichkeit',
    path: '/umzugsofferten?v=4a',
    color: 'bg-orange-400',
    features: ['Countdown Timer', 'Limited Slots', 'Urgency Badges']
  },
  {
    id: 'v4b',
    name: 'V4b Social Proof',
    version: 'V4.B',
    description: 'Social Proof überall',
    path: '/umzugsofferten?v=4b',
    color: 'bg-orange-600',
    features: ['Live Activity', 'Reviews', 'User Count']
  },
  {
    id: 'v4c',
    name: 'V4c Value First',
    version: 'V4.C',
    description: 'Wert vor Preis',
    path: '/umzugsofferten?v=4c',
    color: 'bg-orange-700',
    features: ['Value Props', 'Benefits First', 'ROI Calculator']
  },
  {
    id: 'v4d',
    name: 'V4d Gamified',
    version: 'V4.D',
    description: 'Gamification-Elemente',
    path: '/umzugsofferten?v=4d',
    color: 'bg-orange-800',
    features: ['Points', 'Achievements', 'Progress Rewards']
  },
  {
    id: 'v4e',
    name: 'V4e Minimal Friction',
    version: 'V4.E',
    description: 'Minimal Friction Design',
    path: '/umzugsofferten?v=4e',
    color: 'bg-amber-500',
    features: ['Smart Defaults', 'Skip Options', 'Express Lane']
  },

  // === V5 SUB-VARIANTS (Accessibility-Focused) ===
  {
    id: 'v5a',
    name: 'V5a High Contrast',
    version: 'V5.A',
    description: 'Hoher Kontrast für Sichtbarkeit',
    path: '/umzugsofferten?v=5a',
    color: 'bg-pink-400',
    features: ['High Contrast', 'Large Text', 'Clear Borders']
  },
  {
    id: 'v5b',
    name: 'V5b Screen Reader',
    version: 'V5.B',
    description: 'Screen Reader optimiert',
    path: '/umzugsofferten?v=5b',
    color: 'bg-pink-600',
    features: ['ARIA Labels', 'Screen Reader', 'Focus Management']
  },
  {
    id: 'v5c',
    name: 'V5c Keyboard Nav',
    version: 'V5.C',
    description: 'Vollständige Tastatur-Navigation',
    path: '/umzugsofferten?v=5c',
    color: 'bg-pink-700',
    features: ['Tab Navigation', 'Shortcuts', 'No Mouse Required']
  },
  {
    id: 'v5d',
    name: 'V5d Large Text',
    version: 'V5.D',
    description: 'Extra grosse Schrift',
    path: '/umzugsofferten?v=5d',
    color: 'bg-pink-800',
    features: ['Large Text', 'Readable Fonts', 'Generous Spacing']
  },
  {
    id: 'v5e',
    name: 'V5e Reduced Motion',
    version: 'V5.E',
    description: 'Weniger Animationen',
    path: '/umzugsofferten?v=5e',
    color: 'bg-rose-400',
    features: ['No Animations', 'Calm UI', 'Focus on Content']
  }
];

const RATING_CRITERIA = [
  { id: 'clarity', label: 'Klarheit', description: 'Wie klar waren die Schritte?' },
  { id: 'speed', label: 'Geschwindigkeit', description: 'Wie schnell ging es?' },
  { id: 'trust', label: 'Vertrauen', description: 'Wie vertrauenswürdig wirkt es?' },
  { id: 'design', label: 'Design', description: 'Wie ansprechend ist das Design?' },
  { id: 'mobile', label: 'Mobile UX', description: 'Wie gut funktioniert es mobil?' }
];

// 10 specific questions per flow
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

// Final survey questions
const FINAL_QUESTIONS = [
  { id: 'priceClarity', question: 'Wie klar war die Preiskommunikation insgesamt?', type: 'rating' as const },
  { id: 'trustLevel', question: 'Wie hoch war Ihr Vertrauensgefühl?', type: 'rating' as const },
  { id: 'mobileExperience', question: 'Wie war die Mobile-Erfahrung?', type: 'rating' as const },
];

export default function FlowTester() {
  // Debug log to verify component renders
  console.log('[FlowTester] Component is rendering');
  
  const [testerInfo, setTesterInfo] = useState<TesterInfo>({ name: '', email: '', role: 'user' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentFlowIndex, setCurrentFlowIndex] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, FlowFeedback>>({});
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
        totalTime: 0,
        detailedAnswers: {},
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
          Testen Sie alle 29 Umzugsofferten-Flows (9 Haupt-Varianten + 20 Sub-Varianten) und helfen Sie uns, den besten zu finden.
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
    
    const setDetailedAnswer = (questionId: string, value: number | string) => {
      setCurrentStepFeedback(prev => ({
        ...prev,
        detailedAnswers: { ...prev.detailedAnswers, [questionId]: value }
      }));
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${flow.color} flex items-center justify-center text-white font-bold`}>
                {flow.version}
              </div>
              Feedback für {flow.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Beantworten Sie bitte alle 10 Fragen zu diesem Flow</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Rating */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Gesamtbewertung</Label>
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

            {/* 10 Specific Questions */}
            <div className="space-y-4 border-t pt-4">
              <Label className="text-base font-semibold">10 spezifische Fragen</Label>
              {FLOW_QUESTIONS.map((q, index) => (
                <div key={q.id} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{q.question}</span>
                  </div>
                  
                  {q.type === 'rating' && (
                    <div className="flex gap-1 ml-7">
                      {[1,2,3,4,5].map(r => (
                        <button 
                          key={r} 
                          onClick={() => setDetailedAnswer(q.id, r)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`h-5 w-5 ${(currentStepFeedback.detailedAnswers[q.id] as number) >= r ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/40 stroke-current'}`} />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {q.type === 'yesno' && (
                    <div className="flex gap-2 ml-7">
                      <Button 
                        size="sm" 
                        variant={currentStepFeedback.detailedAnswers[q.id] === 'yes' ? 'default' : 'outline'}
                        onClick={() => setDetailedAnswer(q.id, 'yes')}
                      >
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Ja
                      </Button>
                      <Button 
                        size="sm" 
                        variant={currentStepFeedback.detailedAnswers[q.id] === 'no' ? 'default' : 'outline'}
                        onClick={() => setDetailedAnswer(q.id, 'no')}
                      >
                        <ThumbsDown className="mr-1 h-3 w-3" />
                        Nein
                      </Button>
                    </div>
                  )}
                  
                  {q.type === 'text' && (
                    <Textarea 
                      className="ml-7 text-sm"
                      placeholder="Ihre Antwort..."
                      rows={2}
                      value={(currentStepFeedback.detailedAnswers[q.id] as string) || ''}
                      onChange={(e) => setDetailedAnswer(q.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Comments */}
            <div className="space-y-2 border-t pt-4">
              <Label>Zusätzliche Kommentare</Label>
              <Textarea 
                placeholder="Weitere Anmerkungen zu diesem Flow..."
                value={currentStepFeedback.comment}
                onChange={(e) => setCurrentStepFeedback(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
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
              disabled={currentStepFeedback.rating === 0 || Object.keys(currentStepFeedback.detailedAnswers).length < 8}
            >
              <Send className="mr-2 h-4 w-4" />
              Feedback absenden ({Object.keys(currentStepFeedback.detailedAnswers).length}/10 beantwortet)
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderFinalSurvey = () => {
    const completedFlows = FLOWS.filter(f => feedbacks[f.id]?.completedAt);
    
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Award className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Abschlussbefragung</h2>
          <p className="text-muted-foreground">
            Sie haben {completedFlows.length} Flows getestet. Bitte beantworten Sie diese finalen Fragen.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Best Flow */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Welcher Flow war der beste?</Label>
              <div className="grid grid-cols-3 gap-2">
                {completedFlows.map(flow => (
                  <button
                    key={flow.id}
                    onClick={() => setFinalSurvey(prev => ({ ...prev, bestFlow: flow.id }))}
                    className={`p-3 rounded-lg border-2 transition-all ${finalSurvey.bestFlow === flow.id ? 'border-green-500 bg-green-50' : 'border-muted hover:border-primary'}`}
                  >
                    <div className={`w-8 h-8 rounded ${flow.color} flex items-center justify-center text-white font-bold text-sm mx-auto mb-1`}>
                      {flow.version}
                    </div>
                    <div className="text-xs font-medium truncate">{flow.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Worst Flow */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Welcher Flow war der schlechteste?</Label>
              <div className="grid grid-cols-3 gap-2">
                {completedFlows.map(flow => (
                  <button
                    key={flow.id}
                    onClick={() => setFinalSurvey(prev => ({ ...prev, worstFlow: flow.id }))}
                    className={`p-3 rounded-lg border-2 transition-all ${finalSurvey.worstFlow === flow.id ? 'border-red-500 bg-red-50' : 'border-muted hover:border-primary'}`}
                  >
                    <div className={`w-8 h-8 rounded ${flow.color} flex items-center justify-center text-white font-bold text-sm mx-auto mb-1`}>
                      {flow.version}
                    </div>
                    <div className="text-xs font-medium truncate">{flow.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Questions */}
            {FINAL_QUESTIONS.map(q => (
              <div key={q.id} className="space-y-3">
                <Label className="text-base font-semibold">{q.question}</Label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(r => (
                    <button
                      key={r}
                      onClick={() => setFinalSurvey(prev => ({ ...prev, [q.id]: r }))}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star className={`h-7 w-7 ${(finalSurvey[q.id as keyof FinalSurvey] as number) >= r ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/40 stroke-current'}`} />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Missing Features */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Was hat Ihnen insgesamt gefehlt?</Label>
              <Textarea
                placeholder="z.B. bessere Preisanzeige, mehr Firmeninfos, schnellerer Ablauf..."
                value={finalSurvey.missingFeatures}
                onChange={(e) => setFinalSurvey(prev => ({ ...prev, missingFeatures: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Would use again */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Würden Sie Umzugscheck.ch wieder nutzen?</Label>
              <div className="flex gap-4">
                <Button 
                  variant={finalSurvey.wouldUseAgain ? 'default' : 'outline'}
                  onClick={() => setFinalSurvey(prev => ({ ...prev, wouldUseAgain: true }))}
                  className="flex-1"
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Ja, definitiv
                </Button>
                <Button 
                  variant={finalSurvey.wouldUseAgain === false ? 'destructive' : 'outline'}
                  onClick={() => setFinalSurvey(prev => ({ ...prev, wouldUseAgain: false }))}
                  className="flex-1"
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Eher nicht
                </Button>
              </div>
            </div>

            {/* Recommend to friend */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Würden Sie uns Freunden empfehlen?</Label>
              <div className="flex gap-4">
                <Button 
                  variant={finalSurvey.recommendToFriend ? 'default' : 'outline'}
                  onClick={() => setFinalSurvey(prev => ({ ...prev, recommendToFriend: true }))}
                  className="flex-1"
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Ja
                </Button>
                <Button 
                  variant={finalSurvey.recommendToFriend === false ? 'destructive' : 'outline'}
                  onClick={() => setFinalSurvey(prev => ({ ...prev, recommendToFriend: false }))}
                  className="flex-1"
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Nein
                </Button>
              </div>
            </div>

            {/* Additional Comments */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Abschliessende Bemerkungen</Label>
              <Textarea
                placeholder="Haben Sie noch weitere Anmerkungen oder Verbesserungsvorschläge?"
                value={finalSurvey.additionalComments}
                onChange={(e) => setFinalSurvey(prev => ({ ...prev, additionalComments: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFinalSurvey(false)}>
              Zurück
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                setShowFinalSurvey(false);
                setShowResults(true);
                toast.success('Vielen Dank für Ihre ausführliche Bewertung!');
              }}
              disabled={!finalSurvey.bestFlow || finalSurvey.priceClarity === 0}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Abschlussbefragung absenden
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
      <SEOHead 
        pageType="main-page"
        pageName="Flow Tester"
        url="/flow-tester"
      />
      <div className="min-h-[60vh] bg-gradient-to-b from-background to-muted/30">
        {/* Inline Header - no duplicate navigation */}
        <div className="border-b bg-background/80 backdrop-blur-lg sticky top-16 z-30">
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
                {getCompletedCount() >= 3 && !showFinalSurvey && !showResults && (
                  <Button variant="outline" size="sm" onClick={() => setShowFinalSurvey(true)}>
                    <Award className="mr-2 h-4 w-4" />
                    Abschluss
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {!isRegistered ? (
            renderRegistration()
          ) : showFinalSurvey ? (
            renderFinalSurvey()
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
                          Kommen Sie zurück und beantworten Sie 10 spezifische Fragen
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

        {/* Feedback Modal */}
        {renderFeedbackModal()}
      </div>
    </>
  );
}

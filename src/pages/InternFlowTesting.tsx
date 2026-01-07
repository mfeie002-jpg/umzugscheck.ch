/**
 * Intern Flow Testing Page
 * 
 * Landing page for interns to test top 10 flows, rate them step-by-step,
 * and provide detailed feedback at the end.
 */

import { useState, useCallback, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Star,
  Trophy,
  Play,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clipboard,
  User,
  Send,
  X,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Timer,
  Eye,
  MessageSquare,
  Award,
  Target,
  Sparkles,
} from 'lucide-react';
import { getFlowComponent } from '@/lib/flowComponentRegistry';
import { toast } from 'sonner';

// Top 10 Flows based on ChatGPT analysis - sorted by conversion potential & UX quality
export const TOP_10_FLOWS = [
  {
    rank: 1,
    id: "chatgpt-flow-1",
    name: "ChatGPT Flow 1 (Zero Friction Pro)",
    description: "2 Steps, Sticky CTA, Trust Badges, Preisvorschau",
    reason: "Extrem kurze Completion-Time, perfekte Conversion-Basis. Ideal als Benchmark.",
    color: "from-emerald-500 to-teal-600",
    steps: 2,
    estimatedTime: "45–90 Sek.",
    url: "https://umzugscheck.ch/chatgpt-flow-1",
  },
  {
    rank: 2,
    id: "v8a",
    name: "V8a Decision-Free (Feedback)",
    description: "2 Steps, Review-Card, Transparenz-Panel",
    reason: "Decision-Free + Review-Pattern reduziert Unsicherheit, sehr gute UX fürs Handy.",
    color: "from-sky-500 to-indigo-600",
    steps: 2,
    estimatedTime: "60–120 Sek.",
    url: "https://umzugscheck.ch/umzugsofferten-v8a",
  },
  {
    rank: 3,
    id: "v1f",
    name: "V1f Sticky CTA + Trust",
    description: "2 Steps, Sticky CTA, Micro-Feedback, Trust Pills",
    reason: "Trust-Mechaniken + kleinstes Formular. Super Vergleich zu #1.",
    color: "from-blue-500 to-cyan-600",
    steps: 2,
    estimatedTime: "60–120 Sek.",
    url: "https://umzugscheck.ch/umzugsofferten-v1f",
  },
  {
    rank: 4,
    id: "v6a",
    name: "V6a Ultimate Optimized",
    description: "3 Steps (Details → Paket → Kontakt) mit Sticky CTA & Trust",
    reason: "Bestes 3-Step Premium-Pattern: klar, schnell, dennoch Upsell-fähig.",
    color: "from-violet-500 to-fuchsia-600",
    steps: 3,
    estimatedTime: "2–4 Min.",
    url: "https://umzugscheck.ch/umzugsofferten-v6a",
  },
  {
    rank: 5,
    id: "v5f",
    name: "V5f Marketplace (Feedback)",
    description: "3 Steps, Top-3 Empfehlungen, Trust-Badges, Filter/Sort",
    reason: "Marketplace-Value ohne Overload. Wichtig für euer 'Vergleich'-Versprechen.",
    color: "from-amber-500 to-orange-600",
    steps: 3,
    estimatedTime: "2–4 Min.",
    url: "https://umzugscheck.ch/umzugsofferten-v5?variant=v5f",
  },
  {
    rank: 6,
    id: "umzugsofferten-ultimate-best36",
    name: "Ultimate Best36",
    description: "4 Steps, Best-of 36 Varianten (Ziel: 98/100)",
    reason: "Euer 'Best-of'-Kandidat: sehr stark für Gesamtqualität vs. Steps.",
    color: "from-rose-500 to-pink-600",
    steps: 4,
    estimatedTime: "3–6 Min.",
    url: "https://umzugscheck.ch/umzugsofferten-ultimate-best36",
  },
  {
    rank: 7,
    id: "v6f",
    name: "V6f Ultimate (Best of All)",
    description: "5 Steps, kombiniert V6a–V6e (sticky footer, timeline, price flow)",
    reason: "Komplexer, aber wahrscheinlich 'Sweet Spot' zwischen Premium & Conversion.",
    color: "from-slate-600 to-slate-900",
    steps: 5,
    estimatedTime: "4–7 Min.",
    url: "https://umzugscheck.ch/umzugsofferten-v6f",
  },
  {
    rank: 8,
    id: "ultimate-v7",
    name: "Ultimate V7",
    description: "6 Steps, Best Practices aus 50+ Flow-Analysen",
    reason: "Super Referenz für 'voller Funnel' inkl. Firmen-Step & Sort/Filter.",
    color: "from-lime-500 to-green-700",
    steps: 6,
    estimatedTime: "5–8 Min.",
    url: "https://umzugscheck.ch/umzugsofferten-ultimate-v7",
  },
  {
    rank: 9,
    id: "v9c",
    name: "V9c Zero Friction Optimized",
    description: "6 Steps, Tooltips, keine Vorauswahl, Filter/Sort, Trust-Badges",
    reason: "Euer 'Anti-Rechner'-Mindset: Guidance ohne Manipulation, sehr stark für Trust.",
    color: "from-teal-500 to-emerald-700",
    steps: 6,
    estimatedTime: "5–9 Min.",
    url: "https://umzugscheck.ch/umzugsofferten-v9c",
  },
  {
    rank: 10,
    id: "v2-archetyp",
    name: "V2 Archetyp",
    description: "6 Steps, 4 Kundentypen (Security/Efficiency/Value/Overwhelmed)",
    reason: "Wichtig für Personalisierung & Emotional UX (Stress-Event Umzug).",
    color: "from-purple-500 to-indigo-700",
    steps: 6,
    estimatedTime: "5–9 Min.",
    url: "https://umzugscheck.ch/umzugsofferten-v2-archetyp",
  },
] as const;

// Rating criteria for each flow
const RATING_CRITERIA = [
  { id: 'usability', label: 'Benutzerfreundlichkeit', description: 'Wie einfach war der Flow zu bedienen?' },
  { id: 'clarity', label: 'Klarheit', description: 'Waren die Schritte und Optionen verständlich?' },
  { id: 'speed', label: 'Geschwindigkeit', description: 'Wie schnell konntest du den Flow abschliessen?' },
  { id: 'design', label: 'Design & Optik', description: 'Wie ansprechend war das visuelle Design?' },
  { id: 'mobile', label: 'Mobile-Tauglichkeit', description: 'Wie gut funktioniert es auf dem Handy?' },
  { id: 'trust', label: 'Vertrauenswürdigkeit', description: 'Wirkt der Flow seriös und vertrauenswürdig?' },
];

interface FlowRating {
  flowId: string;
  ratings: Record<string, number>;
  pros: string;
  cons: string;
  wouldRecommend: boolean;
  completedAt: Date;
}

interface TestSession {
  testerName: string;
  startedAt: Date;
  flowRatings: FlowRating[];
  finalFeedback: string;
  overallRanking: string[];
  completedAt?: Date;
}

export default function InternFlowTesting() {
  const [phase, setPhase] = useState<'intro' | 'testing' | 'summary'>('intro');
  const [testerName, setTesterName] = useState('');
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentRatings, setCurrentRatings] = useState<Record<string, number>>({});
  const [currentPros, setCurrentPros] = useState('');
  const [currentCons, setCurrentCons] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [session, setSession] = useState<TestSession | null>(null);
  const [finalFeedback, setFinalFeedback] = useState('');
  const [overallRanking, setOverallRanking] = useState<string[]>([]);

  const currentFlow = TOP_10_FLOWS[currentFlowIndex];
  const FlowComponent = currentFlow ? getFlowComponent(currentFlow.id) : null;

  const startTesting = useCallback(() => {
    if (!testerName.trim()) {
      toast.error('Bitte gib deinen Namen ein');
      return;
    }
    setSession({
      testerName: testerName.trim(),
      startedAt: new Date(),
      flowRatings: [],
      finalFeedback: '',
      overallRanking: [],
    });
    setPhase('testing');
  }, [testerName]);

  const submitFlowRating = useCallback(() => {
    // Validate all ratings are set
    const missingRatings = RATING_CRITERIA.filter(c => !currentRatings[c.id]);
    if (missingRatings.length > 0) {
      toast.error(`Bitte bewerte alle Kriterien: ${missingRatings.map(r => r.label).join(', ')}`);
      return;
    }
    if (wouldRecommend === null) {
      toast.error('Bitte gib an, ob du den Flow weiterempfehlen würdest');
      return;
    }

    const rating: FlowRating = {
      flowId: currentFlow.id,
      ratings: { ...currentRatings },
      pros: currentPros,
      cons: currentCons,
      wouldRecommend,
      completedAt: new Date(),
    };

    setSession(prev => prev ? {
      ...prev,
      flowRatings: [...prev.flowRatings, rating],
    } : null);

    // Reset for next flow
    setCurrentRatings({});
    setCurrentPros('');
    setCurrentCons('');
    setWouldRecommend(null);
    setIsFlowOpen(false);

    if (currentFlowIndex < TOP_10_FLOWS.length - 1) {
      setCurrentFlowIndex(prev => prev + 1);
      toast.success(`Flow ${currentFlowIndex + 1} bewertet! Weiter zu Flow ${currentFlowIndex + 2}`);
    } else {
      setPhase('summary');
      toast.success('Alle Flows bewertet! Bitte gib noch dein Gesamtfeedback ab.');
    }
  }, [currentFlow, currentFlowIndex, currentRatings, currentPros, currentCons, wouldRecommend]);

  const submitFinalFeedback = useCallback(() => {
    if (!finalFeedback.trim()) {
      toast.error('Bitte gib ein Gesamtfeedback ein');
      return;
    }

    const completedSession: TestSession = {
      ...session!,
      finalFeedback,
      overallRanking,
      completedAt: new Date(),
    };

    // Copy to clipboard as JSON
    const output = JSON.stringify(completedSession, null, 2);
    navigator.clipboard.writeText(output);
    toast.success('Feedback kopiert! Du kannst es jetzt teilen.');

    console.log('Test Session Complete:', completedSession);
  }, [session, finalFeedback, overallRanking]);

  const progress = ((currentFlowIndex + (isFlowOpen ? 0.5 : 0)) / TOP_10_FLOWS.length) * 100;

  // Intro Phase
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Helmet>
          <title>Flow Testing für Praktikanten | Umzugscheck.ch</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white mb-6">
              <Clipboard className="h-10 w-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Flow Testing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Teste unsere Top 10 Umzugsofferten-Flows, bewerte jeden einzelnen Step-by-Step und hilf uns, das beste Nutzererlebnis zu finden.
            </p>
          </motion.div>

          {/* How it works */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                So funktioniert's
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">1</div>
                  <div>
                    <p className="font-medium">Flow testen</p>
                    <p className="text-sm text-muted-foreground">Öffne jeden Flow und gehe alle Schritte durch</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">2</div>
                  <div>
                    <p className="font-medium">Bewerten</p>
                    <p className="text-sm text-muted-foreground">Rate 6 Kriterien und gib Pro/Contra an</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">3</div>
                  <div>
                    <p className="font-medium">Feedback geben</p>
                    <p className="text-sm text-muted-foreground">Am Ende dein Gesamtfazit teilen</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top 10 Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top 10 Flows zum Testen
              </CardTitle>
              <CardDescription>
                Diese Flows wurden basierend auf Analyse-Scores vorausgewählt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {TOP_10_FLOWS.map((flow) => (
                    <div
                      key={flow.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                    >
                      <div className={`
                        flex items-center justify-center w-10 h-10 rounded-xl 
                        bg-gradient-to-br ${flow.color} text-white font-bold text-lg
                      `}>
                        {flow.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{flow.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{flow.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Timer className="h-4 w-4" />
                        {flow.estimatedTime}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Name Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Dein Name
              </CardTitle>
              <CardDescription>
                Damit wir dein Feedback zuordnen können
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Vorname Nachname"
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && startTesting()}
                />
                <Button onClick={startTesting} size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Test starten
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Testing Phase
  if (phase === 'testing') {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Flow {currentFlowIndex + 1}/10 | Testing | Umzugscheck.ch</title>
        </Helmet>

        {/* Progress Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  <User className="h-3 w-3" />
                  {session?.testerName}
                </Badge>
                <span className="text-sm font-medium">
                  Flow {currentFlowIndex + 1} von {TOP_10_FLOWS.length}
                </span>
              </div>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {session?.flowRatings.length} bewertet
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Current Flow Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    flex items-center justify-center w-14 h-14 rounded-xl 
                    bg-gradient-to-br ${currentFlow.color} text-white font-bold text-xl shadow-lg
                  `}>
                    #{currentFlow.rank}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{currentFlow.name}</CardTitle>
                    <CardDescription>{currentFlow.description}</CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        {currentFlow.steps} Schritte
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {currentFlow.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
                {!isFlowOpen && (
                  <Button onClick={() => setIsFlowOpen(true)} size="lg" className="gap-2">
                    <Play className="h-4 w-4" />
                    Flow öffnen & testen
                  </Button>
                )}
              </div>
              {currentFlow.reason && (
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm">
                    <strong>Warum dieser Flow?</strong> {currentFlow.reason}
                  </p>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Flow Preview or Rating Form */}
          <AnimatePresence mode="wait">
            {isFlowOpen ? (
              <motion.div
                key="flow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Flow Container */}
                <Card className="mb-6 overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between py-3 bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Flow-Vorschau</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="gap-1"
                      >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        {isFullscreen ? 'Verkleinern' : 'Vollbild'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFlowOpen(false)}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" />
                        Schliessen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className={`p-0 ${isFullscreen ? 'h-[80vh]' : 'max-h-[600px]'} overflow-auto`}>
                    <Suspense fallback={
                      <div className="h-96 flex items-center justify-center">
                        <p className="text-muted-foreground">Flow wird geladen...</p>
                      </div>
                    }>
                      {FlowComponent ? (
                        <FlowComponent />
                      ) : (
                        <div className="h-96 flex items-center justify-center">
                          <p className="text-muted-foreground">Flow-Komponente nicht gefunden: {currentFlow.id}</p>
                        </div>
                      )}
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Rating Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Bewertung für {currentFlow.name}
                    </CardTitle>
                    <CardDescription>
                      Bewerte den Flow nach diesen Kriterien (1 = schlecht, 5 = exzellent)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rating Criteria */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {RATING_CRITERIA.map((criterion) => (
                        <div key={criterion.id} className="space-y-2">
                          <Label className="font-medium">{criterion.label}</Label>
                          <p className="text-xs text-muted-foreground">{criterion.description}</p>
                          <RadioGroup
                            value={currentRatings[criterion.id]?.toString() || ''}
                            onValueChange={(val) => setCurrentRatings(prev => ({
                              ...prev,
                              [criterion.id]: parseInt(val),
                            }))}
                            className="flex gap-2"
                          >
                            {[1, 2, 3, 4, 5].map((val) => (
                              <div key={val} className="flex flex-col items-center gap-1">
                                <RadioGroupItem value={val.toString()} id={`${criterion.id}-${val}`} className="sr-only" />
                                <Label
                                  htmlFor={`${criterion.id}-${val}`}
                                  className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer
                                    border-2 transition-all font-medium
                                    ${currentRatings[criterion.id] === val
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-muted/50 hover:bg-muted border-transparent'
                                    }
                                  `}
                                >
                                  {val}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pros & Cons */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          Was war gut? (Pro)
                        </Label>
                        <Textarea
                          placeholder="z.B. Schnelle Ladezeit, klare Struktur, ansprechendes Design..."
                          value={currentPros}
                          onChange={(e) => setCurrentPros(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <ThumbsDown className="h-4 w-4 text-red-500" />
                          Was war schlecht? (Contra)
                        </Label>
                        <Textarea
                          placeholder="z.B. Unklare Buttons, zu viele Schritte, langsam auf Mobile..."
                          value={currentCons}
                          onChange={(e) => setCurrentCons(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Would Recommend */}
                    <div className="space-y-3">
                      <Label className="font-medium">Würdest du diesen Flow weiterempfehlen?</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={wouldRecommend === true ? 'default' : 'outline'}
                          onClick={() => setWouldRecommend(true)}
                          className="gap-2 flex-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Ja, empfehle ich
                        </Button>
                        <Button
                          type="button"
                          variant={wouldRecommend === false ? 'destructive' : 'outline'}
                          onClick={() => setWouldRecommend(false)}
                          className="gap-2 flex-1"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          Nein, eher nicht
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Submit */}
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => setIsFlowOpen(false)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Zurück zur Übersicht
                      </Button>
                      <Button onClick={submitFlowRating} size="lg" className="gap-2">
                        Bewertung speichern
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Play className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Bereit zum Testen?</h3>
                <p className="text-muted-foreground mb-6">
                  Klicke oben auf "Flow öffnen & testen" um den Flow durchzugehen.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  // Summary Phase
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>Feedback Zusammenfassung | Umzugscheck.ch</title>
      </Helmet>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-6">
            <Award className="h-10 w-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Alle Flows getestet! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Super gemacht, {session?.testerName}! Bitte gib noch dein Gesamtfeedback.
          </p>
        </motion.div>

        {/* Summary of ratings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Deine Bewertungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {session?.flowRatings.map((rating, index) => {
                const flow = TOP_10_FLOWS.find(f => f.id === rating.flowId);
                const avgRating = Object.values(rating.ratings).reduce((a, b) => a + b, 0) / Object.values(rating.ratings).length;
                return (
                  <div
                    key={rating.flowId}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg bg-gradient-to-br ${flow?.color || 'from-gray-500 to-gray-600'}
                        flex items-center justify-center text-white font-bold text-sm
                      `}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{flow?.name || rating.flowId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{avgRating.toFixed(1)}</span>
                      </div>
                      {rating.wouldRecommend ? (
                        <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700">
                          <ThumbsUp className="h-3 w-3" />
                          Empfohlen
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 bg-red-100 text-red-700">
                          <ThumbsDown className="h-3 w-3" />
                          Nicht empfohlen
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Final Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Dein Gesamtfeedback
            </CardTitle>
            <CardDescription>
              Was ist dein Fazit? Welcher Flow hat dir am besten gefallen? Was sollten wir verbessern?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="final-feedback">Detailliertes Feedback</Label>
              <Textarea
                id="final-feedback"
                placeholder="Schreibe hier dein ausführliches Feedback... 

z.B.:
- Welcher Flow war insgesamt am besten?
- Was hat dich am meisten überzeugt?
- Was hat dich am meisten gestört?
- Welche Features fehlen?
- Sonstige Anmerkungen..."
                value={finalFeedback}
                onChange={(e) => setFinalFeedback(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={submitFinalFeedback} size="lg" className="gap-2 flex-1">
                <Send className="h-4 w-4" />
                Feedback absenden & kopieren
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Dein Feedback wird als JSON in die Zwischenablage kopiert. Du kannst es dann per Email oder Slack teilen.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

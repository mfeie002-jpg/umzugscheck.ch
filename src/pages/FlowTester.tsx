import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, Star, Clock, CheckCircle2, ArrowRight, 
  ExternalLink, MessageSquare, ThumbsUp, ThumbsDown,
  BarChart3, Trophy, Send, ChevronRight, Eye,
  Sparkles, Target, Timer, Zap, Users, Award, Loader2,
  Filter, Search, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS, FlowConfig } from '@/data/flowConfigs';
import { FLOW_COMPONENT_REGISTRY, hasFlowComponent } from '@/lib/flowComponentRegistry';
import { supabase } from '@/integrations/supabase/client';

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

interface TesterInfo {
  name: string;
  email: string;
  role: string;
}

// Combine all flows from configs
function getAllFlows(): FlowConfig[] {
  const mainFlows = Object.values(FLOW_CONFIGS);
  const subVariants = Object.values(SUB_VARIANT_CONFIGS);
  return [...mainFlows, ...subVariants];
}

// Check if a flow has a working component
function isFlowAvailable(flowId: string): boolean {
  // Normalize the ID
  const normalizedId = flowId.replace('umzugsofferten-', '');
  return hasFlowComponent(normalizedId) || hasFlowComponent(flowId);
}

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

export default function FlowTester() {
  const allFlows = useMemo(() => getAllFlows(), []);
  
  const [testerInfo, setTesterInfo] = useState<TesterInfo>({ name: '', email: '', role: 'user' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentFlowIndex, setCurrentFlowIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'main' | 'sub' | 'available'>('available');
  const [feedbacks, setFeedbacks] = useState<Record<string, FlowFeedback>>(() => {
    const initial: Record<string, FlowFeedback> = {};
    allFlows.forEach(flow => {
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
  const [isSaving, setIsSaving] = useState(false);
  const [currentStepFeedback, setCurrentStepFeedback] = useState<{
    rating: number;
    comment: string;
    detailedAnswers: Record<string, number | string>;
  }>({ rating: 0, comment: '', detailedAnswers: {} });

  // Filter flows based on search and type
  const filteredFlows = useMemo(() => {
    let flows = allFlows;
    
    // Filter by type
    if (filterType === 'main') {
      flows = flows.filter(f => !f.parentFlow && f.id.startsWith('umzugsofferten-'));
    } else if (filterType === 'sub') {
      flows = flows.filter(f => f.parentFlow || !f.id.startsWith('umzugsofferten-'));
    } else if (filterType === 'available') {
      flows = flows.filter(f => isFlowAvailable(f.id));
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      flows = flows.filter(f => 
        f.id.toLowerCase().includes(query) ||
        f.label.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
      );
    }
    
    return flows;
  }, [allFlows, filterType, searchQuery]);

  const handleRegister = async () => {
    if (!testerInfo.name || !testerInfo.email) {
      toast.error('Bitte Name und E-Mail eingeben');
      return;
    }
    
    setIsSaving(true);
    try {
      // Try to create session in database
      const { data, error } = await supabase
        .from('flow_tester_sessions' as any)
        .insert({
          tester_name: testerInfo.name,
          tester_email: testerInfo.email,
          tester_role: testerInfo.role,
        })
        .select('id')
        .single();
      
      if (!error && data) {
        setSessionId((data as any).id);
      }
    } catch (err) {
      console.warn('Could not save session to database:', err);
    } finally {
      setIsSaving(false);
    }
    
    setIsRegistered(true);
    toast.success(`Willkommen, ${testerInfo.name}! Starte mit dem Testen.`);
  };

  const startTestingFlow = (flow: FlowConfig) => {
    const index = allFlows.findIndex(f => f.id === flow.id);
    setCurrentFlowIndex(index);
    setTestStartTime(new Date());
    window.open(flow.path, '_blank');
  };

  const submitFlowFeedback = async (flowId: string, rating: number, recommend: boolean, comments: string) => {
    const endTime = new Date();
    const totalTime = testStartTime ? (endTime.getTime() - testStartTime.getTime()) / 1000 : 0;
    const flow = allFlows.find(f => f.id === flowId);
    const isSubVariant = flow ? (!!flow.parentFlow || !flow.id.startsWith('umzugsofferten-')) : false;
    
    // Update local state
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
    
    // Save to database if session exists
    if (sessionId) {
      try {
        await supabase
          .from('flow_tester_feedback' as any)
          .insert({
            session_id: sessionId,
            flow_id: flowId,
            flow_name: flow?.label || flowId,
            flow_type: isSubVariant ? 'sub' : 'main',
            rating,
            feedback: comments || null,
            abandoned: false,
          });
          
        // Update session total count
        await supabase
          .from('flow_tester_sessions' as any)
          .update({ total_flows_tested: getCompletedCount() + 1 })
          .eq('id', sessionId);
      } catch (err) {
        console.warn('Could not save feedback to database:', err);
      }
    }
    
    setCurrentFlowIndex(null);
    setTestStartTime(null);
    setCurrentStepFeedback({ rating: 0, comment: '', detailedAnswers: {} });
    
    const flowLabel = flow?.label || flowId;
    toast.success(`Feedback für ${flowLabel} gespeichert!`);
  };

  const markAsAbandoned = async (flowId: string, atStep: string) => {
    const flow = allFlows.find(f => f.id === flowId);
    const isSubVariant = flow ? (!!flow.parentFlow || !flow.id.startsWith('umzugsofferten-')) : false;
    
    setFeedbacks(prev => ({
      ...prev,
      [flowId]: { ...prev[flowId], abandoned: true, abandonedAtStep: atStep }
    }));
    
    // Save to database if session exists
    if (sessionId) {
      try {
        await supabase
          .from('flow_tester_feedback' as any)
          .insert({
            session_id: sessionId,
            flow_id: flowId,
            flow_name: flow?.label || flowId,
            flow_type: isSubVariant ? 'sub' : 'main',
            rating: 1,
            feedback: `Abgebrochen bei: ${atStep}`,
            abandoned: true,
          });
      } catch (err) {
        console.warn('Could not save abandoned feedback to database:', err);
      }
    }
    
    setCurrentFlowIndex(null);
    toast.info('Flow als abgebrochen markiert');
  };

  const getCompletedCount = () => Object.values(feedbacks).filter(f => f.completedAt).length;
  const getAvailableCount = () => allFlows.filter(f => isFlowAvailable(f.id)).length;

  const renderFlowCard = (flow: FlowConfig, index: number) => {
    const fb = feedbacks[flow.id];
    const isCompleted = fb?.completedAt;
    const isAbandoned = fb?.abandoned;
    const isCurrent = currentFlowIndex !== null && allFlows[currentFlowIndex]?.id === flow.id;
    const isAvailable = isFlowAvailable(flow.id);
    const isSubVariant = !!flow.parentFlow || !flow.id.startsWith('umzugsofferten-');
    
    return (
      <motion.div
        key={flow.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
      >
        <Card className={`relative overflow-hidden ${isCurrent ? 'ring-2 ring-primary' : ''} ${isCompleted ? 'bg-green-500/5' : ''} ${!isAvailable ? 'opacity-60' : ''}`}>
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
          {!isAvailable && !isCompleted && !isAbandoned && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="text-muted-foreground">
                Kein Komponente
              </Badge>
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${flow.color || 'bg-muted'} flex items-center justify-center text-white font-bold text-xs`}>
                {flow.id.replace('umzugsofferten-', '').toUpperCase().slice(0, 4)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base truncate">{flow.label}</CardTitle>
                  {isSubVariant && (
                    <Badge variant="outline" className="text-xs shrink-0">Sub</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{flow.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">{flow.steps?.length || '?'} Schritte</Badge>
              <span className="truncate">{flow.path}</span>
            </div>
            {isCompleted && fb.overallRating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Bewertung:</span>
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-3 w-3 ${s <= fb.overallRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            {!isCurrent && !isCompleted && isAvailable && (
              <Button size="sm" className="flex-1" onClick={() => startTestingFlow(flow)}>
                <Play className="mr-1 h-3 w-3" />
                Testen
              </Button>
            )}
            {isCurrent && (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setCurrentFlowIndex(null)}>
                Feedback geben
              </Button>
            )}
            {isCompleted && isAvailable && (
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => startTestingFlow(flow)}>
                <Eye className="mr-1 h-3 w-3" />
                Nochmal
              </Button>
            )}
            {!isAvailable && (
              <Button variant="ghost" size="sm" className="flex-1" disabled>
                Nicht verfügbar
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={flow.path} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  // Feedback Dialog for current flow
  const renderFeedbackDialog = () => {
    if (currentFlowIndex === null) return null;
    const flow = allFlows[currentFlowIndex];
    if (!flow) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setCurrentFlowIndex(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border rounded-xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-bold text-lg mb-4">Feedback: {flow.label}</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Gesamtbewertung</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setCurrentStepFeedback(prev => ({ ...prev, rating }))}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      currentStepFeedback.rating === rating
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm">Kommentar</Label>
              <Textarea
                placeholder="Was hat gut funktioniert? Was nicht?"
                value={currentStepFeedback.comment}
                onChange={(e) => setCurrentStepFeedback(prev => ({ ...prev, comment: e.target.value }))}
                className="mt-2"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => markAsAbandoned(flow.id, 'unknown')}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Abgebrochen
              </Button>
              <Button
                className="flex-1"
                onClick={() => submitFlowFeedback(
                  flow.id,
                  currentStepFeedback.rating,
                  currentStepFeedback.rating >= 4,
                  currentStepFeedback.comment
                )}
                disabled={currentStepFeedback.rating === 0}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Speichern
              </Button>
            </div>
          </div>
        </motion.div>
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">Flow-Tester</span>
              <Badge variant="outline" className="ml-2">{getAvailableCount()} verfügbar</Badge>
            </div>
          </div>
          {isRegistered && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{getCompletedCount()}</span> / {getAvailableCount()} getestet
              </div>
              <Progress value={(getCompletedCount() / getAvailableCount()) * 100} className="w-32 h-2" />
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
                Testen Sie {getAvailableCount()} verschiedene Umzugsofferten-Flows und helfen Sie uns, den besten zu finden.
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
          <div className="space-y-6">
            {/* Instructions */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">So funktioniert es</h3>
                    <p className="text-sm text-muted-foreground">
                      Klicken Sie auf <strong>Testen</strong> um einen Flow in neuem Tab zu öffnen. 
                      Nach dem Testen klicken Sie <strong>Feedback geben</strong>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Flow suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="available">Verfügbar</TabsTrigger>
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="main">Haupt</TabsTrigger>
                  <TabsTrigger value="sub">Sub</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Flow stats */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>{filteredFlows.length} Flows angezeigt</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{filteredFlows.filter(f => isFlowAvailable(f.id)).length} verfügbar</span>
            </div>

            {/* Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFlows.map((flow, i) => renderFlowCard(flow, i))}
            </div>

            {filteredFlows.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Keine Flows gefunden.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setFilterType('available'); }}>
                  Filter zurücksetzen
                </Button>
              </div>
            )}

            {/* Summary when testing is complete */}
            {getCompletedCount() >= 5 && (
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Trophy className="h-10 w-10 text-green-500" />
                    <div>
                      <h3 className="font-bold text-lg">Super gemacht!</h3>
                      <p className="text-sm text-muted-foreground">
                        Sie haben bereits {getCompletedCount()} Flows getestet. Vielen Dank für Ihr Feedback!
                      </p>
                    </div>
                    <Button variant="outline" className="ml-auto shrink-0">
                      <Send className="mr-2 h-4 w-4" />
                      Ergebnisse senden
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Feedback Dialog */}
      <AnimatePresence>
        {currentFlowIndex !== null && renderFeedbackDialog()}
      </AnimatePresence>
    </div>
  );
}

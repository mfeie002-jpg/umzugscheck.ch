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
  Play, Star, CheckCircle2, ArrowRight, 
  ExternalLink, ThumbsUp, ThumbsDown,
  BarChart3, Trophy, Send, Eye,
  Target, Users, Filter, Search
} from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS, FlowConfig } from '@/data/flowConfigs';

// Simple check for flow component availability
function hasFlowComponent(flowId: string): boolean {
  const normalizedId = flowId.toLowerCase().replace('umzugsofferten-', '');
  const workingFlows = [
    'v1', 'v1a', 'v1b', 'v1c', 'v1d', 'v1e',
    'v2', 'v2a', 'v2b', 'v2c', 'v2d', 'v2e', 'v2f',
    'v3', 'v3a', 'v3b', 'v3c', 'v3d', 'v3e',
    'v4', 'v4a', 'v4b', 'v4c', 'v4d', 'v4e', 'v4f',
    'v5', 'v5a', 'v5b', 'v5c', 'v5d', 'v5e', 'v5f',
    'v6', 'v6a', 'v6b', 'v6c', 'v6d', 'v6e', 'v6f',
    'v7', 'v7a', 'v8', 'v8a', 'v9', 'v9a', 'v9b', 'v9c', 'v9d',
    'ultimate-v7', 'multi-a'
  ];
  return workingFlows.includes(normalizedId) || workingFlows.includes(flowId.toLowerCase());
}

interface FlowFeedback {
  flowId: string;
  overallRating: number;
  wouldRecommend: boolean;
  completedAt: Date | null;
  abandoned: boolean;
  comment: string;
}

interface TesterInfo {
  name: string;
  email: string;
  role: string;
}

export default function FlowTester() {
  // Get all flows
  const allFlows = useMemo(() => {
    const mainFlows = Object.values(FLOW_CONFIGS);
    const subVariants = Object.values(SUB_VARIANT_CONFIGS);
    return [...mainFlows, ...subVariants];
  }, []);
  
  const [testerInfo, setTesterInfo] = useState<TesterInfo>({ name: '', email: '', role: 'user' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentFlowIndex, setCurrentFlowIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'main' | 'sub' | 'available'>('available');
  const [feedbacks, setFeedbacks] = useState<Record<string, FlowFeedback>>({});
  const [currentRating, setCurrentRating] = useState(0);
  const [currentComment, setCurrentComment] = useState('');

  // Initialize feedbacks when allFlows is ready
  useEffect(() => {
    if (allFlows.length > 0 && Object.keys(feedbacks).length === 0) {
      const initial: Record<string, FlowFeedback> = {};
      allFlows.forEach(flow => {
        initial[flow.id] = {
          flowId: flow.id,
          overallRating: 0,
          wouldRecommend: false,
          completedAt: null,
          abandoned: false,
          comment: '',
        };
      });
      setFeedbacks(initial);
    }
  }, [allFlows, feedbacks]);

  // Filter flows
  const filteredFlows = useMemo(() => {
    let flows = allFlows;
    
    if (filterType === 'main') {
      flows = flows.filter(f => !f.parentFlow && f.id.startsWith('umzugsofferten-'));
    } else if (filterType === 'sub') {
      flows = flows.filter(f => f.parentFlow || !f.id.startsWith('umzugsofferten-'));
    } else if (filterType === 'available') {
      flows = flows.filter(f => hasFlowComponent(f.id));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      flows = flows.filter(f => 
        f.label.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
      );
    }
    
    return flows;
  }, [allFlows, filterType, searchQuery]);

  const handleRegister = () => {
    if (!testerInfo.name.trim() || !testerInfo.email.trim()) {
      toast.error('Bitte alle Felder ausfüllen');
      return;
    }
    setIsRegistered(true);
    toast.success(`Willkommen, ${testerInfo.name}!`);
  };

  const startTest = (index: number) => {
    const flow = filteredFlows[index];
    if (!flow) return;
    
    // Open flow in new tab
    window.open(flow.path, '_blank');
    setCurrentFlowIndex(index);
    setCurrentRating(0);
    setCurrentComment('');
  };

  const submitFeedback = (flowId: string) => {
    if (currentRating === 0) {
      toast.error('Bitte eine Bewertung abgeben');
      return;
    }
    
    setFeedbacks(prev => ({
      ...prev,
      [flowId]: {
        ...prev[flowId],
        overallRating: currentRating,
        wouldRecommend: currentRating >= 4,
        completedAt: new Date(),
        comment: currentComment,
      }
    }));
    
    setCurrentFlowIndex(null);
    toast.success('Feedback gespeichert!');
  };

  const getCompletedCount = () => Object.values(feedbacks).filter(f => f.completedAt).length;
  const getAvailableCount = () => allFlows.filter(f => hasFlowComponent(f.id)).length;

  const renderFlowCard = (flow: FlowConfig, index: number) => {
    const fb = feedbacks[flow.id];
    const isCompleted = fb?.completedAt;
    const isAvailable = hasFlowComponent(flow.id);
    const isSubVariant = !!flow.parentFlow || !flow.id.startsWith('umzugsofferten-');
    
    return (
      <Card key={flow.id} className={`relative overflow-hidden ${isCompleted ? 'bg-green-500/5 border-green-500/30' : ''} ${!isAvailable ? 'opacity-60' : ''}`}>
        {isCompleted && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Getestet
            </Badge>
          </div>
        )}
        {!isAvailable && !isCompleted && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-muted-foreground">
              Nicht verfügbar
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
        <CardContent className="py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">{flow.steps?.length || '?'} Schritte</Badge>
            <span className="truncate">{flow.path}</span>
          </div>
          {isCompleted && fb.overallRating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Bewertung:</span>
              <div className="flex">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`h-3 w-3 ${star <= fb.overallRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => window.open(flow.path, '_blank')}
            disabled={!isAvailable}
          >
            <Eye className="h-3 w-3 mr-1" />
            Ansehen
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => startTest(index)}
            disabled={!isAvailable}
          >
            <Play className="h-3 w-3 mr-1" />
            {isCompleted ? 'Nochmal' : 'Testen'}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Feedback dialog
  const renderFeedbackDialog = () => {
    if (currentFlowIndex === null) return null;
    const flow = filteredFlows[currentFlowIndex];
    if (!flow) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setCurrentFlowIndex(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background rounded-xl p-6 max-w-md w-full shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold mb-4">Feedback für {flow.label}</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Gesamtbewertung</Label>
              <div className="flex gap-1 mt-2">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    onClick={() => setCurrentRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`h-8 w-8 ${star <= currentRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted hover:text-yellow-400'}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Kommentar (optional)</Label>
              <Textarea
                placeholder="Was hat Ihnen gefallen/gefehlt?"
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentFlowIndex(null)}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Abbrechen
              </Button>
              <Button
                className="flex-1"
                onClick={() => submitFeedback(flow.id)}
                disabled={currentRating === 0}
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
        <title>Flow-Tester | Umzugscheck.ch</title>
        <meta name="description" content="Testen Sie verschiedene Umzugsofferten-Flows" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-30">
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
              <Progress value={(getCompletedCount() / Math.max(getAvailableCount(), 1)) * 100} className="w-32 h-2" />
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
              <CardTitle>Flow-Tester</CardTitle>
              <p className="text-muted-foreground text-sm">
                Testen Sie {getAvailableCount()} verschiedene Flows und helfen Sie uns, den besten zu finden.
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
                      Nach dem Testen geben Sie Ihr Feedback.
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

            {/* Summary */}
            {getCompletedCount() >= 3 && (
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Trophy className="h-10 w-10 text-green-500" />
                    <div>
                      <h3 className="font-bold text-lg">Super gemacht!</h3>
                      <p className="text-sm text-muted-foreground">
                        Sie haben {getCompletedCount()} Flows getestet. Vielen Dank!
                      </p>
                    </div>
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

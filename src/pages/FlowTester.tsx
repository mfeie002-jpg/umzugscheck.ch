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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, Star, CheckCircle2, 
  ThumbsUp, ThumbsDown,
  BarChart3, Eye,
  Target, Users, Search, Download, ChevronDown, ExternalLink, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { FlowExportDialog } from '@/components/flow-tester/FlowExportDialog';

// Build main flows with their sub-variants
const MAIN_FLOWS = [
  { id: 'v1', configId: 'umzugsofferten-v1', prefix: 'v1' },
  { id: 'v2', configId: 'umzugsofferten-v2', prefix: 'v2' },
  { id: 'v3', configId: 'umzugsofferten-v3', prefix: 'v3' },
  { id: 'v4', configId: 'umzugsofferten-v4', prefix: 'v4' },
  { id: 'v5', configId: 'umzugsofferten-v5', prefix: 'v5' },
  { id: 'v6', configId: 'umzugsofferten-v6', prefix: 'v6' },
  { id: 'v7', configId: 'umzugsofferten-v7', prefix: 'v7' },
  { id: 'v8', configId: 'umzugsofferten-v8', prefix: 'v8' },
  { id: 'v9', configId: 'umzugsofferten-v9', prefix: 'v9' },
];

// Get sub-variants for a main flow prefix
const getSubVariants = (prefix: string) => {
  return Object.entries(SUB_VARIANT_CONFIGS)
    .filter(([key]) => key.startsWith(prefix) && key !== prefix)
    .map(([key, config]) => ({
      id: key,
      label: config.label,
      path: config.path,
      description: config.description,
      steps: config.steps.length,
    }));
};

// Build complete flow list with sub-variants
const FLOW_LIST = MAIN_FLOWS.map(main => {
  const config = FLOW_CONFIGS[main.configId];
  const subVariants = getSubVariants(main.prefix);
  return {
    id: main.id,
    label: config?.label || main.id.toUpperCase(),
    path: config?.path || `/umzugsofferten-${main.id}`,
    color: config?.color || 'bg-gray-500',
    description: config?.description || '',
    steps: config?.steps.length || 4,
    subVariants,
  };
});

interface FlowFeedback {
  flowId: string;
  rating: number;
  comment: string;
  completedAt: Date | null;
}

interface TesterInfo {
  name: string;
  email: string;
  role: string;
}

export default function FlowTesterPage() {
  const [testerInfo, setTesterInfo] = useState<TesterInfo>({ name: '', email: '', role: 'user' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentFlowIndex, setCurrentFlowIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbacks, setFeedbacks] = useState<Record<string, FlowFeedback>>({});
  const [currentRating, setCurrentRating] = useState(0);
  const [currentComment, setCurrentComment] = useState('');

  const [expandedFlows, setExpandedFlows] = useState<Record<string, boolean>>({});

  // Initialize feedbacks for all flows including sub-variants
  useEffect(() => {
    if (Object.keys(feedbacks).length === 0) {
      const initial: Record<string, FlowFeedback> = {};
      FLOW_LIST.forEach(flow => {
        initial[flow.id] = { flowId: flow.id, rating: 0, comment: '', completedAt: null };
        flow.subVariants.forEach(sub => {
          initial[sub.id] = { flowId: sub.id, rating: 0, comment: '', completedAt: null };
        });
      });
      setFeedbacks(initial);
    }
  }, []);

  const filteredFlows = useMemo(() => {
    if (!searchQuery) return FLOW_LIST;
    const q = searchQuery.toLowerCase();
    return FLOW_LIST.filter(f => 
      f.label.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleRegister = () => {
    if (!testerInfo.name.trim()) {
      toast.error('Bitte Namen eingeben');
      return;
    }
    setIsRegistered(true);
    toast.success(`Willkommen, ${testerInfo.name}!`);
  };

  const startTest = (flowId: string, path: string) => {
    window.open(path, '_blank');
    setCurrentFlowIndex(FLOW_LIST.findIndex(f => f.id === flowId) ?? 0);
    setCurrentRating(0);
    setCurrentComment('');
  };


  // Count total flows including sub-variants
  const totalFlowCount = FLOW_LIST.reduce((acc, f) => acc + 1 + f.subVariants.length, 0);

  const submitFeedback = (flowId: string) => {
    if (currentRating === 0) {
      toast.error('Bitte eine Bewertung abgeben');
      return;
    }
    setFeedbacks(prev => ({
      ...prev,
      [flowId]: { ...prev[flowId], rating: currentRating, comment: currentComment, completedAt: new Date() }
    }));
    setCurrentFlowIndex(null);
    toast.success('Feedback gespeichert!');
  };

  const completedCount = Object.values(feedbacks).filter(f => f.completedAt).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>Flow-Tester | Umzugscheck.ch</title>
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
              <Badge variant="outline" className="ml-2">{totalFlowCount} Flows</Badge>
            </div>
          </div>
          {isRegistered && (
            <div className="flex items-center gap-4">
              <FlowExportDialog />
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{completedCount}</span> / {totalFlowCount} getestet
              </span>
              <Progress value={(completedCount / FLOW_LIST.length) * 100} className="w-32 h-2" />
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
                Testen Sie {totalFlowCount} verschiedene Flows (inkl. Sub-Varianten).
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
                    <Label htmlFor="user">Nutzer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ux" id="ux" />
                    <Label htmlFor="ux">UX Experte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">Business</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleRegister}>
                <Play className="mr-2 h-4 w-4" />
                Starten
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
                      Klicken Sie auf <strong>Testen</strong> um einen Flow zu öffnen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Flow suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFlows.map((flow) => {
                const mainFb = feedbacks[flow.id];
                const mainCompleted = mainFb?.completedAt;
                const hasSubVariants = flow.subVariants.length > 0;
                const isExpanded = expandedFlows[flow.id];
                
                // Count completed sub-variants
                const completedSubCount = flow.subVariants.filter(sub => feedbacks[sub.id]?.completedAt).length;
                const totalCount = 1 + flow.subVariants.length;
                const completedTotal = (mainCompleted ? 1 : 0) + completedSubCount;
                
                return (
                  <Card key={flow.id} className="relative overflow-hidden">
                    {/* Main Flow Header - Clickable to expand */}
                    <CardHeader 
                      className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedFlows(prev => ({ ...prev, [flow.id]: !prev[flow.id] }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${flow.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {flow.id.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{flow.label}</CardTitle>
                            {completedTotal === totalCount && (
                              <Badge className="bg-green-500 text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Alle getestet
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{flow.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {totalCount} Flows
                          </Badge>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                          >
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="py-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{flow.steps} Schritte</Badge>
                        <Badge variant="outline" className="text-xs">
                          {completedTotal}/{totalCount} getestet
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Expanded Flow with Live Previews */}
            {filteredFlows.map((flow) => {
              const isExpanded = expandedFlows[flow.id];
              if (!isExpanded) return null;

              // All variants including main
              const allVariants = [
                { id: flow.id, label: `${flow.id.toUpperCase()} - Hauptversion`, path: flow.path, description: flow.description },
                ...flow.subVariants.map(sub => ({
                  id: sub.id,
                  label: `${sub.id.toUpperCase()} - ${sub.label}`,
                  path: sub.path,
                  description: sub.description
                }))
              ];

              return (
                <motion.div
                  key={`expanded-${flow.id}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  <Card className="border-2 border-primary/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg ${flow.color} flex items-center justify-center text-white font-bold`}>
                            {flow.id.toUpperCase()}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{flow.label}</CardTitle>
                            <p className="text-sm text-muted-foreground">{allVariants.length} Varianten zum Testen</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpandedFlows(prev => ({ ...prev, [flow.id]: false }))}
                        >
                          <ChevronDown className="h-5 w-5 rotate-180" />
                          Schliessen
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {allVariants.map((variant, index) => {
                        const fb = feedbacks[variant.id];
                        const isCompleted = fb?.completedAt;

                        return (
                          <div key={variant.id} className="space-y-3">
                            {/* Variant Header */}
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${isCompleted ? 'bg-green-500/5 border-green-500/30' : 'bg-muted/30'}`}>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="font-bold text-sm px-3 py-1">
                                  {variant.id.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{variant.label}</p>
                                  <p className="text-xs text-muted-foreground">{variant.description}</p>
                                </div>
                                {isCompleted && (
                                  <Badge className="bg-green-500">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Getestet
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {isCompleted && fb.rating > 0 && (
                                  <div className="flex mr-2">
                                    {[1,2,3,4,5].map(star => (
                                      <Star key={star} className={`h-4 w-4 ${star <= fb.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                                    ))}
                                  </div>
                                )}
                                <Button size="sm" variant="outline" onClick={() => window.open(variant.path, '_blank')}>
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Neues Tab
                                </Button>
                                <Button size="sm" onClick={() => startTest(variant.id, variant.path)}>
                                  <Play className="h-3 w-3 mr-1" />
                                  {isCompleted ? 'Nochmal' : 'Testen'}
                                </Button>
                              </div>
                            </div>

                            {/* Live Preview iframe */}
                            <div className="relative rounded-xl border-2 border-border overflow-hidden bg-background shadow-lg">
                              {/* Toolbar */}
                              <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                                    {variant.id.toUpperCase()}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded">
                                    Live Preview
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="secondary"
                                    className="h-7 text-xs bg-background/90 backdrop-blur-sm"
                                    onClick={() => {
                                      // Reset iframe by updating key
                                      const iframe = document.getElementById(`iframe-${variant.id}`) as HTMLIFrameElement;
                                      if (iframe) {
                                        iframe.src = iframe.src;
                                      }
                                    }}
                                  >
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    Neu starten
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="h-7 text-xs"
                                    onClick={() => startTest(variant.id, variant.path)}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Fertig - Bewerten
                                  </Button>
                                </div>
                              </div>
                              <iframe
                                id={`iframe-${variant.id}`}
                                src={variant.path}
                                className="w-full h-[700px] border-0 pt-10"
                                title={`Preview ${variant.id}`}
                              />
                            </div>

                            {index < allVariants.length - 1 && (
                              <div className="border-b border-dashed pt-4" />
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {filteredFlows.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Keine Flows gefunden.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Feedback Dialog */}
      <AnimatePresence>
        {currentFlowIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setCurrentFlowIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-background rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Feedback für {filteredFlows[currentFlowIndex]?.label}</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Bewertung</Label>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setCurrentRating(star)} className="p-1 hover:scale-110 transition-transform">
                        <Star className={`h-8 w-8 ${star <= currentRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted hover:text-yellow-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Kommentar</Label>
                  <Textarea
                    placeholder="Was hat Ihnen gefallen?"
                    value={currentComment}
                    onChange={(e) => setCurrentComment(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCurrentFlowIndex(null)}>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Abbrechen
                  </Button>
                  <Button className="flex-1" onClick={() => submitFeedback(filteredFlows[currentFlowIndex]?.id)} disabled={currentRating === 0}>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Speichern
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

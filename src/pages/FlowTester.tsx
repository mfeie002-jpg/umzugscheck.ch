import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Star, BarChart3, Search, ArrowRight, Sparkles, Zap, Trophy, MessageSquare, Target
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { FlowExportDialog } from '@/components/flow-tester/FlowExportDialog';
import { TopTenFlowSelector } from '@/components/flow-tester/TopTenFlowSelector';

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

// ChatGPT Flows as special group
const CHATGPT_FLOWS = [
  { id: 'chatgpt-flow-1', label: 'ChatGPT Flow 1 ⭐⭐', path: '/chatgpt-flow-1', description: 'Zero Friction Pro: 2 Steps', steps: 2 },
  { id: 'chatgpt-flow-2', label: 'ChatGPT Flow 2 ⭐⭐', path: '/chatgpt-flow-2', description: 'Social Proof Boosted: 3 Steps', steps: 3 },
  { id: 'chatgpt-flow-3', label: 'ChatGPT Flow 3 ⭐⭐', path: '/chatgpt-flow-3', description: 'Personalized Guided Chat', steps: 3 },
];

// Swiss Premium Flows (new ChatGPT-designed flows with reusable components)
const SWISS_PREMIUM_FLOWS = [
  { id: 'swiss-lightning', label: 'Swiss Lightning ⚡', path: '/swiss-lightning', description: '2 Steps, 90 Sek. bis Lead', steps: 2 },
  { id: 'swiss-premium-choice', label: 'Swiss Premium Choice 💎', path: '/swiss-premium-choice', description: '3 Steps mit Paketauswahl', steps: 3 },
  { id: 'swiss-concierge-hybrid', label: 'Swiss Concierge Hybrid 🎬', path: '/swiss-concierge-hybrid', description: '4 Steps, optionales Video', steps: 4 },
];

// Gemini Top-Flows (highest scoring flows from Gemini analysis)
const GEMINI_TOP_FLOWS = [
  { id: 'v9-zero-friction', label: 'V9 Zero Friction ⭐4.9', path: '/v9-zero-friction', description: '5 Steps, Route-Fokus, Labor Illusion', steps: 5 },
  { id: 'ultimate-best36', label: 'Ultimate Best36 ⭐4.8', path: '/ultimate-best36', description: '4 Steps, Auto-Advance, High-Contrast', steps: 4 },
  { id: 'golden-flow-v10', label: 'Golden Flow V10 ⭐5.0', path: '/golden-flow-v10', description: '6 Steps, Glassmorphism, Perfekter Score', steps: 6 },
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
const FLOW_LIST = [
  // Gemini Top-Flows as TOP group (highest scoring)
  {
    id: 'gemini-top',
    familyId: 'gemini-top',
    label: 'Gemini Top 🏆⭐',
    path: '/flows/gemini-top',
    color: 'bg-gradient-to-r from-amber-500 to-orange-600',
    description: '3 Top-Flows mit Score 4.8-5.0 (Gemini Analyse)',
    steps: 5,
    icon: Trophy,
    subVariants: GEMINI_TOP_FLOWS,
  },
  // Swiss Premium Flows as second group
  {
    id: 'swiss-premium',
    familyId: 'swiss-premium',
    label: 'Swiss Premium ⚡💎',
    path: '/flows/swiss-premium',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    description: '3 neue Flows mit Flow-Components (beste UX)',
    steps: 2,
    icon: Sparkles,
    subVariants: SWISS_PREMIUM_FLOWS,
  },
  // ChatGPT Flows as third group
  {
    id: 'chatgpt',
    familyId: 'chatgpt',
    label: 'ChatGPT Optimized ⭐⭐',
    path: '/flows/chatgpt',
    color: 'bg-gradient-to-r from-blue-500 to-teal-500',
    description: '3 Premium-Flows von ChatGPT optimiert',
    steps: 2,
    icon: MessageSquare,
    subVariants: CHATGPT_FLOWS,
  },
  // Main flows
  ...MAIN_FLOWS.map(main => {
    const config = FLOW_CONFIGS[main.configId];
    const subVariants = getSubVariants(main.prefix);
    return {
      id: main.id,
      familyId: main.id,
      label: config?.label || main.id.toUpperCase(),
      path: `/flows/${main.id}`,
      color: config?.color || 'bg-gray-500',
      description: config?.description || '',
      steps: config?.steps.length || 4,
      icon: main.id === 'v9' ? Star : main.id === 'v7' ? Zap : Target,
      subVariants,
    };
  }),
];

export default function FlowTesterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced search: also search in subVariants
  const filteredFlows = useMemo(() => {
    if (!searchQuery) return FLOW_LIST;
    const q = searchQuery.toLowerCase();
    
    return FLOW_LIST.filter(f => {
      // Check main flow
      const mainMatches = f.label.toLowerCase().includes(q) || 
                          f.description.toLowerCase().includes(q) ||
                          f.id.toLowerCase().includes(q);
      
      // Check subvariants
      const subMatches = f.subVariants.some(sub => 
        sub.label.toLowerCase().includes(q) || 
        sub.description.toLowerCase().includes(q) ||
        sub.id.toLowerCase().includes(q)
      );
      
      return mainMatches || subMatches;
    });
  }, [searchQuery]);

  // Count total flows including sub-variants
  const totalFlowCount = FLOW_LIST.reduce((acc, f) => acc + 1 + f.subVariants.length, 0);

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
          <div className="flex items-center gap-4">
            <TopTenFlowSelector />
            <FlowExportDialog />
            <Link to="/flow-command-center">
              <Button variant="outline" size="sm">
                Command Center
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Info */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">Flow-Familien</h3>
                  <p className="text-sm text-muted-foreground">
                    Klicken Sie auf eine Flow-Familie um alle Varianten auf einer eigenen Landingpage zu sehen.
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

          {/* Flow Grid - Links to Family Landing Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFlows.map((flow, index) => {
              const totalCount = 1 + flow.subVariants.length;
              const IconComponent = flow.icon;
              
              return (
                <motion.div
                  key={flow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link to={flow.path}>
                    <Card className="relative overflow-hidden group hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg ${flow.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base group-hover:text-primary transition-colors">
                                {flow.label}
                              </CardTitle>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{flow.description}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{flow.steps} Schritte</Badge>
                          <Badge variant="outline" className="text-xs">
                            {totalCount} Flows
                          </Badge>
                        </div>
                      </CardContent>

                      {/* Hover Gradient Overlay */}
                      <div className={`absolute inset-0 ${flow.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <Link to="/flow-overview">
              <Button variant="outline">
                Flow-Übersicht
              </Button>
            </Link>
            <Link to="/flow-command-center">
              <Button variant="outline">
                Command Center
              </Button>
            </Link>
            <Link to="/flow-comparison">
              <Button variant="outline">
                Flow-Vergleich
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

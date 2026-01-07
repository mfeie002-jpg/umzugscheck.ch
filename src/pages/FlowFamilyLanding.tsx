import { useMemo, Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Sparkles, Zap, Trophy, MessageSquare, Target } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { getFlowComponent } from '@/lib/flowComponentRegistry';

// Flow family configurations
const FLOW_FAMILIES = {
  'v1': {
    id: 'v1',
    label: 'V1 - Control Flow',
    description: 'Original 4-Step Wizard mit klassischem Formular-Design. Bewährter Baseline-Flow.',
    color: 'from-blue-500 to-blue-700',
    icon: Target,
    prefix: 'v1',
    configId: 'umzugsofferten-v1',
  },
  'v2': {
    id: 'v2',
    label: 'V2 - Premium Full-Journey',
    description: 'Premium-Erlebnis mit erweiterten Optionen und Multi-Step Progress.',
    color: 'from-purple-500 to-purple-700',
    icon: Star,
    prefix: 'v2',
    configId: 'umzugsofferten-v2',
  },
  'v3': {
    id: 'v3',
    label: 'V3 - God Mode',
    description: 'Slider-basierte schnelle Eingabe mit visuellen Elementen.',
    color: 'from-red-500 to-red-700',
    icon: Zap,
    prefix: 'v3',
    configId: 'umzugsofferten-v3',
  },
  'v4': {
    id: 'v4',
    label: 'V4 - Video-First AI',
    description: 'KI-gestützte Video-Analyse für moderne User Experience.',
    color: 'from-amber-500 to-orange-600',
    icon: Sparkles,
    prefix: 'v4',
    configId: 'umzugsofferten-v4',
  },
  'v5': {
    id: 'v5',
    label: 'V5 - Marketplace Wizard',
    description: 'Marktplatz mit Firmen-Bidding und direkter Kontaktaufnahme.',
    color: 'from-green-500 to-emerald-600',
    icon: Target,
    prefix: 'v5',
    configId: 'umzugsofferten-v5',
  },
  'v6': {
    id: 'v6',
    label: 'V6 - Ultimate (6-Tier)',
    description: '6-stufiger Premium-Flow mit allen Features kombiniert.',
    color: 'from-pink-500 to-rose-600',
    icon: Trophy,
    prefix: 'v6',
    configId: 'umzugsofferten-v6',
  },
  'v7': {
    id: 'v7',
    label: 'V7 - SwissMove (90s)',
    description: 'Speed-optimiert für 90 Sekunden Lead-Generierung.',
    color: 'from-cyan-500 to-teal-600',
    icon: Zap,
    prefix: 'v7',
    configId: 'umzugsofferten-v7',
  },
  'v8': {
    id: 'v8',
    label: 'V8 - Decision-Free',
    description: 'Minimale Entscheidungen, maximale Conversion.',
    color: 'from-indigo-500 to-violet-600',
    icon: Target,
    prefix: 'v8',
    configId: 'umzugsofferten-v8',
  },
  'v9': {
    id: 'v9',
    label: 'V9 - Zero Friction ⭐',
    description: 'Frictionless Design - unser Favorit mit höchstem Score.',
    color: 'from-yellow-500 to-amber-600',
    icon: Star,
    prefix: 'v9',
    configId: 'umzugsofferten-v9',
  },
  'chatgpt': {
    id: 'chatgpt',
    label: 'ChatGPT Optimized ⭐⭐',
    description: '3 Premium-Flows von ChatGPT optimiert für maximale Conversion.',
    color: 'from-teal-500 to-cyan-600',
    icon: MessageSquare,
    prefix: 'chatgpt-flow',
    subFlows: [
      { id: 'chatgpt-flow-1', label: 'ChatGPT Flow 1 - Zero Friction Pro', path: '/chatgpt-flow-1', description: '2 Steps, minimale Friction', steps: 2 },
      { id: 'chatgpt-flow-2', label: 'ChatGPT Flow 2 - Social Proof', path: '/chatgpt-flow-2', description: '3 Steps, Trust-optimiert', steps: 3 },
      { id: 'chatgpt-flow-3', label: 'ChatGPT Flow 3 - Guided Chat', path: '/chatgpt-flow-3', description: '3 Steps, conversational UX', steps: 3 },
    ]
  },
  'swiss-premium': {
    id: 'swiss-premium',
    label: 'Swiss Premium ⚡💎',
    description: '3 neue Flows mit Flow-Components (beste UX) - schweizweit einzigartig.',
    color: 'from-emerald-500 to-teal-600',
    icon: Sparkles,
    prefix: 'swiss',
    subFlows: [
      { id: 'swiss-lightning', label: 'Swiss Lightning ⚡', path: '/swiss-lightning', description: '2 Steps, 90 Sek. bis Lead', steps: 2 },
      { id: 'swiss-premium-choice', label: 'Swiss Premium Choice 💎', path: '/swiss-premium-choice', description: '3 Steps mit Paketauswahl', steps: 3 },
      { id: 'swiss-concierge-hybrid', label: 'Swiss Concierge Hybrid 🎬', path: '/swiss-concierge-hybrid', description: '4 Steps, optionales Video', steps: 4 },
    ]
  },
  'gemini-top': {
    id: 'gemini-top',
    label: 'Gemini Top 🏆⭐',
    description: '3 Top-Flows mit Score 4.8-5.0 - die besten nach Gemini Deep Analysis.',
    color: 'from-amber-500 to-orange-600',
    icon: Trophy,
    prefix: 'gemini',
    subFlows: [
      { id: 'v9-zero-friction', label: 'V9 Zero Friction ⭐4.9', path: '/v9-zero-friction', description: '5 Steps, Route-Fokus, Labor Illusion', steps: 5 },
      { id: 'ultimate-best36', label: 'Ultimate Best36 ⭐4.8', path: '/ultimate-best36', description: '4 Steps, Auto-Advance, High-Contrast', steps: 4 },
      { id: 'golden-flow-v10', label: 'Golden Flow V10 ⭐5.0', path: '/golden-flow-v10', description: '6 Steps, Glassmorphism, Perfekter Score', steps: 6 },
    ]
  },
};

// Get sub-variants for a main flow prefix from config
const getSubVariants = (prefix: string) => {
  const mainFlowConfig = FLOW_CONFIGS[`umzugsofferten-${prefix}`];
  const mainPath = mainFlowConfig?.path || `/umzugsofferten-${prefix}`;
  const mainSteps = mainFlowConfig?.steps?.length || 4;
  
  // Start with main flow
  const variants = [
    { 
      id: prefix, 
      label: `${prefix.toUpperCase()} - Hauptversion`, 
      path: mainPath, 
      description: mainFlowConfig?.description || 'Hauptversion',
      steps: mainSteps 
    }
  ];
  
  // Add sub-variants
  Object.entries(SUB_VARIANT_CONFIGS)
    .filter(([key]) => key.startsWith(prefix) && key !== prefix)
    .forEach(([key, config]) => {
      variants.push({
        id: key,
        label: `${key.toUpperCase()} - ${config.label}`,
        path: config.path,
        description: config.description,
        steps: config.steps?.length || 4,
      });
    });
  
  return variants;
};

export default function FlowFamilyLanding() {
  const { familyId } = useParams<{ familyId: string }>();
  
  const family = familyId ? FLOW_FAMILIES[familyId as keyof typeof FLOW_FAMILIES] : null;
  
  // Get all variants for this family
  const variants = useMemo(() => {
    if (!family) return [];
    
    // Special families with predefined subFlows
    if ('subFlows' in family && family.subFlows) {
      return family.subFlows;
    }
    
    // Regular V1-V9 families
    return getSubVariants(family.prefix);
  }, [family]);
  
  if (!family) {
    return <Navigate to="/flow-tester" replace />;
  }
  
  const IconComponent = family.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Helmet>
        <title>{family.label} | Flow-Familie | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/flow-tester">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${family.color} flex items-center justify-center text-white shadow-lg`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{family.label}</h1>
                  <p className="text-sm text-muted-foreground">{variants.length} Varianten</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              Flow-Familie
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`py-12 bg-gradient-to-r ${family.color} text-white`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{family.label}</h2>
            <p className="text-lg md:text-xl opacity-90">{family.description}</p>
            <div className="flex items-center gap-4 mt-6">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {variants.length} Flows
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                Mobile-optimiert
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flow List - Direct Embedding */}
      <main className="py-8">
        <div className="space-y-16">
          {variants.map((variant, index) => {
            const FlowComponent = getFlowComponent(variant.id);
            
            return (
              <motion.section
                key={variant.id}
                id={variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="scroll-mt-20"
              >
                {/* Flow Header */}
                <div className="container mx-auto px-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 border">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-xl bg-gradient-to-br ${family.color} 
                        flex items-center justify-center text-white font-bold text-sm shadow-md
                      `}>
                        {variant.id.toUpperCase().slice(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{variant.label}</h3>
                        <p className="text-sm text-muted-foreground">{variant.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {variant.steps} Schritte
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Flow Component - Full Width */}
                <div className="w-full">
                  <Suspense fallback={
                    <div className="container mx-auto px-4">
                      <div className="h-[600px] rounded-2xl bg-muted/30 animate-pulse flex items-center justify-center">
                        <p className="text-muted-foreground">Flow wird geladen...</p>
                      </div>
                    </div>
                  }>
                    {FlowComponent ? (
                      <FlowComponent />
                    ) : (
                      <div className="container mx-auto px-4">
                        <div className="h-[400px] rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-muted-foreground mb-2">Flow-Komponente nicht gefunden</p>
                            <Badge variant="outline">{variant.id}</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </Suspense>
                </div>
                
                {/* Divider */}
                {index < variants.length - 1 && (
                  <div className="container mx-auto px-4 mt-12">
                    <div className="border-t border-dashed" />
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Alle {variants.length} Varianten von {family.label} testen
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/flow-tester">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Alle Flows
              </Button>
            </Link>
            <Link to="/flow-overview">
              <Button variant="outline">
                Flow-Übersicht
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

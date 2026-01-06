/**
 * Flow Showcase - Standalone Landing Pages für einzelne Flows
 * Mobile-optimiert, Flow direkt eingebettet (kein iframe!)
 */

import { lazy, Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Shield, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazy load Flow Components
const V9ZeroFrictionFlow = lazy(() => import('@/components/calculator-variants/V9ZeroFrictionFlow'));
const UltimateBest36Flow = lazy(() => import('@/components/calculator-variants/UltimateBest36Flow'));
const GoldenFlowV10 = lazy(() => import('@/components/calculator-variants/GoldenFlowV10'));
const SwissLightningFlow = lazy(() => import('@/components/calculator-variants/SwissLightningFlow'));
const SwissPremiumChoiceFlow = lazy(() => import('@/components/calculator-variants/SwissPremiumChoiceFlow'));
const SwissConciergeHybridFlow = lazy(() => import('@/components/calculator-variants/SwissConciergeHybridFlow'));
const UltimateV7Flow = lazy(() => import('@/components/calculator-variants/UltimateV7Flow'));

// Flow definitions with direct component mapping
const FLOWS: Record<string, {
  title: string;
  subtitle: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  score?: string;
  color: string;
}> = {
  'v9-zero-friction': {
    title: 'Zero Friction Flow',
    subtitle: 'Schnell & unkompliziert zum Angebot',
    component: V9ZeroFrictionFlow,
    score: '4.9',
    color: 'from-amber-500 to-orange-600',
  },
  'ultimate-best36': {
    title: 'Ultimate Best36',
    subtitle: 'Optimiert für beste Conversion',
    component: UltimateBest36Flow,
    score: '4.8',
    color: 'from-orange-500 to-red-600',
  },
  'golden-flow-v10': {
    title: 'Golden Flow V10',
    subtitle: 'Der perfekte Score',
    component: GoldenFlowV10,
    score: '5.0',
    color: 'from-yellow-500 to-amber-600',
  },
  'swiss-lightning': {
    title: 'Swiss Lightning',
    subtitle: '90 Sekunden zum Lead',
    component: SwissLightningFlow,
    color: 'from-emerald-500 to-teal-600',
  },
  'swiss-premium-choice': {
    title: 'Swiss Premium Choice',
    subtitle: 'Mit Paketauswahl',
    component: SwissPremiumChoiceFlow,
    color: 'from-teal-500 to-cyan-600',
  },
  'swiss-concierge-hybrid': {
    title: 'Swiss Concierge Hybrid',
    subtitle: 'Optionales Video-Feature',
    component: SwissConciergeHybridFlow,
    color: 'from-cyan-500 to-blue-600',
  },
  'ultimate-v7': {
    title: 'Ultimate V7',
    subtitle: 'Social Proof & Live-Chat',
    component: UltimateV7Flow,
    score: '4.5',
    color: 'from-purple-500 to-pink-600',
  },
};

// Minimal Trust Bar for flow pages
const FlowTrustBar = () => (
  <div className="flex items-center justify-center gap-4 py-2 px-4 bg-muted/50 text-xs text-muted-foreground">
    <span className="flex items-center gap-1">
      <Shield className="h-3 w-3 text-emerald-600" />
      SSL-gesichert
    </span>
    <span className="flex items-center gap-1">
      <Clock className="h-3 w-3" />
      ~2 Min
    </span>
    <span className="flex items-center gap-1">
      <Star className="h-3 w-3 text-amber-500" />
      4.8/5
    </span>
  </div>
);

// Loading fallback
const FlowLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-muted-foreground">Flow wird geladen...</p>
    </div>
  </div>
);

export default function FlowShowcase() {
  const { flowId } = useParams<{ flowId: string }>();
  const flow = flowId ? FLOWS[flowId] : null;

  // Redirect to main flow tester if flow not found
  if (!flow) {
    return <Navigate to="/flow-tester" replace />;
  }

  const FlowComponent = flow.component;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{flow.title} | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Minimal Header - only on larger screens or as floating back button on mobile */}
      <header className="fixed top-4 left-4 z-50 md:relative md:top-0 md:left-0 md:border-b md:bg-background/95 md:backdrop-blur">
        <div className="md:container md:mx-auto md:px-4 md:py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              asChild 
              className="h-10 w-10 rounded-full shadow-lg md:shadow-none md:rounded-md bg-background"
            >
              <Link to="/flow-tester">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="hidden md:block">
              <h1 className="font-semibold">{flow.title}</h1>
              <p className="text-sm text-muted-foreground">{flow.subtitle}</p>
            </div>
            {flow.score && (
              <span className="hidden md:inline-flex ml-auto px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                Score: {flow.score}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Trust Bar - visible on mobile */}
      <div className="md:hidden">
        <FlowTrustBar />
      </div>

      {/* Flow Component - Full Screen */}
      <main className="flex-1">
        <Suspense fallback={<FlowLoader />}>
          <FlowComponent />
        </Suspense>
      </main>
    </div>
  );
}

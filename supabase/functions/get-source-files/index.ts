import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapping of flow IDs to their source file paths
const FLOW_SOURCE_FILES: Record<string, string[]> = {
  'umzugsofferten': [
    'src/components/homepage/MultiStepCalculatorVariant.tsx',
  ],
  'umzugsofferten-v2': [
    'src/components/premium-v2/PremiumCalculator.tsx',
  ],
  'umzugsofferten-v3': [
    'src/components/god-mode-v3/GodModeCalculator.tsx',
  ],
  'umzugsofferten-v4': [
    'src/components/video-first-v4/VideoFirstCalculator.tsx',
  ],
  'umzugsofferten-v5': [
    'src/components/marketplace-v5/MarketplaceWizard.tsx',
  ],
  'umzugsofferten-v6': [
    'src/components/ultimate-v6/UltimateWizard.tsx',
  ],
  'umzugsofferten-v7': [
    'src/components/swissmove-v7/SwissMoveWizard.tsx',
  ],
  'umzugsofferten-v8': [
    'src/components/decisionfree-v8/DecisionFreeWizard.tsx',
  ],
  'umzugsofferten-v9': [
    'src/components/zerofriction-v9/ZeroFrictionWizard.tsx',
  ],
};

// Shared configuration files
const SHARED_FILES = [
  'src/config/flow-variants.ts',
  'src/components/UmzugsoffertenVariant.tsx',
];

// Pre-defined source code for all flows (since we can't access the actual file system)
const SOURCE_CODE_TEMPLATES: Record<string, string> = {
  'flow-variants.ts': `// Flow Variants Configuration
// This file defines all available calculator flow variants for A/B testing

export interface FlowVariant {
  id: string;
  name: string;
  path: string;
  description: string;
  active: boolean;
  weight: number; // A/B test weight percentage
}

export const FLOW_VARIANTS: FlowVariant[] = [
  {
    id: 'umzugsofferten',
    name: 'V1 - Control Flow',
    path: '/umzugsofferten',
    description: 'Original multi-step calculator with traditional form flow',
    active: true,
    weight: 20,
  },
  {
    id: 'umzugsofferten-v2',
    name: 'V2 - Premium Full-Journey',
    path: '/umzugsofferten-v2',
    description: 'Premium experience with full journey visualization',
    active: true,
    weight: 10,
  },
  {
    id: 'umzugsofferten-v3',
    name: 'V3 - God Mode',
    path: '/umzugsofferten-v3',
    description: 'All-in-one view with maximum information density',
    active: true,
    weight: 10,
  },
  {
    id: 'umzugsofferten-v4',
    name: 'V4 - Video-First AI',
    path: '/umzugsofferten-v4',
    description: 'AI-powered with video upload for instant quotes',
    active: true,
    weight: 10,
  },
  {
    id: 'umzugsofferten-v5',
    name: 'V5 - Marketplace Wizard',
    path: '/umzugsofferten-v5',
    description: 'Marketplace-style with company comparison focus',
    active: true,
    weight: 10,
  },
  {
    id: 'umzugsofferten-v6',
    name: 'V6 - Ultimate (6-Tier)',
    path: '/umzugsofferten-v6',
    description: '6-tier pricing model with clear upsell path',
    active: true,
    weight: 10,
  },
  {
    id: 'umzugsofferten-v7',
    name: 'V7 - SwissMove (90s)',
    path: '/umzugsofferten-v7',
    description: 'Speed-optimized: complete in under 90 seconds',
    active: true,
    weight: 10,
  },
  {
    id: 'umzugsofferten-v8',
    name: 'V8 - Decision-Free',
    path: '/umzugsofferten-v8',
    description: 'Smart defaults minimize user decisions',
    active: true,
    weight: 10,
  },
  {
    id: 'umzugsofferten-v9',
    name: 'V9 - Zero Friction',
    path: '/umzugsofferten-v9',
    description: 'Minimum steps, maximum conversion focus',
    active: true,
    weight: 10,
  },
];

export const getActiveVariants = () => FLOW_VARIANTS.filter(v => v.active);

export const getVariantById = (id: string) => FLOW_VARIANTS.find(v => v.id === id);

export const selectRandomVariant = (): FlowVariant => {
  const activeVariants = getActiveVariants();
  const totalWeight = activeVariants.reduce((sum, v) => sum + v.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const variant of activeVariants) {
    random -= variant.weight;
    if (random <= 0) return variant;
  }
  
  return activeVariants[0];
};
`,

  'UmzugsoffertenVariant.tsx': `// UmzugsoffertenVariant.tsx
// Router component that renders the appropriate flow variant

import { lazy, Suspense } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy-loaded flow components
const V1Control = lazy(() => import('./homepage/MultiStepCalculatorVariant'));
const V2Premium = lazy(() => import('./premium-v2/PremiumCalculator'));
const V3GodMode = lazy(() => import('./god-mode-v3/GodModeCalculator'));
const V4VideoFirst = lazy(() => import('./video-first-v4/VideoFirstCalculator'));
const V5Marketplace = lazy(() => import('./marketplace-v5/MarketplaceWizard'));
const V6Ultimate = lazy(() => import('./ultimate-v6/UltimateWizard'));
const V7SwissMove = lazy(() => import('./swissmove-v7/SwissMoveWizard'));
const V8DecisionFree = lazy(() => import('./decisionfree-v8/DecisionFreeWizard'));
const V9ZeroFriction = lazy(() => import('./zerofriction-v9/ZeroFrictionWizard'));

const VARIANT_MAP: Record<string, React.ComponentType> = {
  'v1': V1Control,
  'v2': V2Premium,
  'v3': V3GodMode,
  'v4': V4VideoFirst,
  'v5': V5Marketplace,
  'v6': V6Ultimate,
  'v7': V7SwissMove,
  'v8': V8DecisionFree,
  'v9': V9ZeroFriction,
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export function UmzugsoffertenVariant() {
  const { variant = 'v1' } = useParams();
  const [searchParams] = useSearchParams();
  const forceVariant = searchParams.get('variant');
  
  const selectedVariant = forceVariant || variant;
  const Component = VARIANT_MAP[selectedVariant] || VARIANT_MAP['v1'];
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}

export default UmzugsoffertenVariant;
`,
};

// Generate placeholder source code for each flow variant
const generateFlowSourceCode = (flowId: string, flowName: string): string => {
  const componentName = flowId
    .replace('umzugsofferten-', '')
    .replace('umzugsofferten', 'v1')
    .replace('v', 'V')
    .replace(/-./g, x => x[1].toUpperCase());
    
  return `// ${flowName} Component
// Flow ID: ${flowId}
// 
// This is a placeholder representing the component structure.
// The actual component contains the full implementation.
//
// Key Features:
// - Multi-step wizard flow
// - Address input with Swiss postal code validation
// - Apartment size selection
// - Date picker with availability hints
// - Company matching and selection
// - Lead submission

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Component Props
interface ${componentName}Props {
  initialStep?: number;
  onComplete?: (leadId: string) => void;
}

// Flow State
interface FlowState {
  step: number;
  fromPostal: string;
  fromCity: string;
  toPostal: string;
  toCity: string;
  apartmentSize: string;
  moveDate: Date | null;
  services: string[];
  selectedCompanies: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
    comments: string;
  };
}

export function ${componentName}({ initialStep = 1, onComplete }: ${componentName}Props) {
  const navigate = useNavigate();
  const [state, setState] = useState<FlowState>({
    step: initialStep,
    fromPostal: '',
    fromCity: '',
    toPostal: '',
    toCity: '',
    apartmentSize: '3-zimmer',
    moveDate: null,
    services: [],
    selectedCompanies: [],
    contact: {
      name: '',
      email: '',
      phone: '',
      comments: '',
    },
  });

  // Step navigation
  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  // Submit handler
  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-funnel-lead', {
        body: {
          fromPostal: state.fromPostal,
          fromCity: state.fromCity,
          toPostal: state.toPostal,
          toCity: state.toCity,
          apartmentSize: state.apartmentSize,
          moveDate: state.moveDate?.toISOString(),
          services: state.services,
          selectedCompanyIds: state.selectedCompanies,
          ...state.contact,
          source: '${flowId}',
        },
      });

      if (error) throw error;
      
      toast.success('Offerten-Anfrage erfolgreich gesendet!');
      onComplete?.(data.leadId);
      navigate(\`/offerten-bestaetigung?id=\${data.leadId}\`);
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Fehler beim Senden. Bitte erneut versuchen.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Step Progress */}
      <div className="h-1 bg-muted">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: \`\${(state.step / 5) * 100}%\` }}
        />
      </div>

      {/* Flow Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="container max-w-4xl mx-auto py-8 px-4"
        >
          {/* Step content rendered here based on state.step */}
          {/* Each step has its own UI component */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ${componentName};
`;
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { flowIds, includeShared = true } = await req.json();
    
    console.log('Fetching source files for flows:', flowIds);
    
    const result: Record<string, Record<string, string>> = {};
    
    // Get source code for each requested flow
    for (const flowId of flowIds || Object.keys(FLOW_SOURCE_FILES)) {
      const flowName = flowId.replace('umzugsofferten-', 'V').replace('umzugsofferten', 'V1');
      result[flowId] = {
        'main.tsx': generateFlowSourceCode(flowId, flowName),
      };
    }
    
    // Add shared files if requested
    if (includeShared) {
      result['shared'] = {
        'flow-variants.ts': SOURCE_CODE_TEMPLATES['flow-variants.ts'],
        'UmzugsoffertenVariant.tsx': SOURCE_CODE_TEMPLATES['UmzugsoffertenVariant.tsx'],
      };
    }
    
    console.log('Source files prepared successfully');
    
    return new Response(JSON.stringify({
      success: true,
      files: result,
      flowMapping: FLOW_SOURCE_FILES,
      generatedAt: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error: unknown) {
    console.error('Error fetching source files:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Flow Comparison Page - Shows all sub-variants of a flow stacked vertically
 * 
 * Access: /admin/flow-comparison/1 (for V1), /admin/flow-comparison/2 (for V2), etc.
 * 
 * Each variant is rendered in a card with its calculator component
 */

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';

// Import all V1 variant components
import { MultiStepCalculator } from '@/components/homepage/MultiStepCalculator';

// Import all calculator variant components
import {
  // V1 variants
  V1aFeedbackBased,
  V1bFeedbackBased,
  V1cFeedbackBased,
  // V2 variants
  V2aProgressEnhanced,
  V2bFeedbackBased,
  V2cTrustFocused,
  V2dFeedbackBased,
  V2eExperimental,
  V2fFeedbackBased,
  // V3 variants
  V3aMobileFirst,
  V3bSwipeNavigation,
  V3cBottomSheet,
  V3dThumbZone,
  V3eFullscreen,
  V3aFeedbackBased,
  V3bFeedbackBased,
  V3gFeedbackBased,
  // V4 variants
  V4aUrgencyBased,
  V4bSocialProof,
  V4cValueFirst,
  V4dGamified,
  V4eMinimalFriction,
  V4fFeedbackBased,
  // V5 variants
  V5aHighContrast,
  V5bScreenReader,
  V5cKeyboardNav,
  V5dLargeText,
  V5eReducedMotion,
  V5fFeedbackBased,
  // V6 variants
  V6aFeedbackBased,
  // V7 variants
  V7aFeedbackBased,
  // V8 variants
  V8aFeedbackBased,
  // V9 variants
  V9aFeedbackBased,
  V9bFeedbackBased,
  V9cFeedbackBased,
  V9dFeedbackBased,
  // Multi variants
  MultiAFeedbackBased,
} from '@/components/calculator-variants';

// Map flow codes to components
const VARIANT_COMPONENT_MAP: Record<string, React.ComponentType> = {
  // V1 main + variants
  'umzugsofferten-v1': MultiStepCalculator,
  'v1': MultiStepCalculator,
  'v1a': V1aFeedbackBased,
  'v1b': V1bFeedbackBased,
  // V2 variants
  'v2a': V2aProgressEnhanced,
  'v2b': V2bFeedbackBased,
  'v2c': V2cTrustFocused,
  'v2d': V2dFeedbackBased,
  'v2e': V2eExperimental,
  'v2f': V2fFeedbackBased,
  // V3 variants
  'v3a': V3aMobileFirst,
  'v3a-pro': V3aFeedbackBased,
  'v3b': V3bSwipeNavigation,
  'v3b-feedback': V3bFeedbackBased,
  'v3c': V3cBottomSheet,
  'v3d': V3dThumbZone,
  'v3e': V3eFullscreen,
  'v3g': V3gFeedbackBased,
  // V4 variants
  'v4a': V4aUrgencyBased,
  'v4b': V4bSocialProof,
  'v4c': V4cValueFirst,
  'v4d': V4dGamified,
  'v4e': V4eMinimalFriction,
  'v4f': V4fFeedbackBased,
  // V5 variants
  'v5a': V5aHighContrast,
  'v5b': V5bScreenReader,
  'v5c': V5cKeyboardNav,
  'v5d': V5dLargeText,
  'v5e': V5eReducedMotion,
  'v5f': V5fFeedbackBased,
  // V6 variants
  'v6a': V6aFeedbackBased,
  // V7 variants
  'v7a': V7aFeedbackBased,
  // V8 variants
  'v8a': V8aFeedbackBased,
  // V9 variants
  'v9a': V9aFeedbackBased,
  'v9b': V9bFeedbackBased,
  'v9c': V9cFeedbackBased,
  'v9d': V9dFeedbackBased,
  // Multi variants
  'multi-a': MultiAFeedbackBased,
};

// Get main flow key for a number
function getMainFlowKey(flowNumber: number): string {
  return `umzugsofferten-v${flowNumber}`;
}

// Get all variants for a flow number
function getVariantsForFlow(flowNumber: number) {
  const mainFlowKey = getMainFlowKey(flowNumber);
  const mainFlow = FLOW_CONFIGS[mainFlowKey];
  
  const variants: Array<{
    id: string;
    label: string;
    description: string;
    color: string;
    path: string;
    stepCount: number;
    isMain: boolean;
  }> = [];
  
  // Add main flow
  if (mainFlow) {
    variants.push({
      id: mainFlowKey,
      label: mainFlow.label,
      description: mainFlow.description,
      color: mainFlow.color,
      path: mainFlow.path,
      stepCount: mainFlow.steps.length,
      isMain: true,
    });
  }
  
  // Add sub-variants
  Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
    // Check if this variant belongs to this flow
    const match = id.match(/^v(\d+)([a-z])$/i);
    if (match && parseInt(match[1], 10) === flowNumber) {
      variants.push({
        id,
        label: config.label,
        description: config.description,
        color: config.color,
        path: config.path,
        stepCount: config.steps.length,
        isMain: false,
      });
    }
  });
  
  return variants;
}

// Get all available flow numbers
function getAllFlowNumbers(): number[] {
  const numbers = new Set<number>();
  
  // From main flows
  Object.keys(FLOW_CONFIGS).forEach(key => {
    const match = key.match(/umzugsofferten-v(\d+)/);
    if (match) numbers.add(parseInt(match[1], 10));
  });
  
  // From sub-variants
  Object.keys(SUB_VARIANT_CONFIGS).forEach(key => {
    const match = key.match(/^v(\d+)/i);
    if (match) numbers.add(parseInt(match[1], 10));
  });
  
  return Array.from(numbers).sort((a, b) => a - b);
}

export default function FlowComparison() {
  const { flowNumber } = useParams<{ flowNumber: string }>();
  const flowNum = parseInt(flowNumber || '1', 10);
  
  const variants = getVariantsForFlow(flowNum);
  const allFlowNumbers = getAllFlowNumbers();
  const mainFlowConfig = FLOW_CONFIGS[getMainFlowKey(flowNum)];
  
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/tools?tab=flow-automation">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">
                  V{flowNum} Flow Vergleich
                </h1>
                <p className="text-sm text-muted-foreground">
                  {variants.length} Varianten • {mainFlowConfig?.description || 'Alle Sub-Varianten untereinander'}
                </p>
              </div>
            </div>
            
            {/* Flow Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Flow:</span>
              {allFlowNumbers.map(num => (
                <Link key={num} to={`/admin/flow-comparison/${num}`}>
                  <Button 
                    variant={num === flowNum ? 'default' : 'outline'} 
                    size="sm"
                  >
                    V{num}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {variants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Keine Varianten für V{flowNum} gefunden.
              </p>
            </CardContent>
          </Card>
        ) : (
          variants.map((variant, index) => {
            const Component = VARIANT_COMPONENT_MAP[variant.id];
            
            return (
              <div key={variant.id} id={variant.id} className="scroll-mt-24">
                <Card className="overflow-hidden border-2">
                  <CardHeader className={`${variant.color} text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-white/20 text-white text-lg px-3 py-1">
                            #{index + 1}
                          </Badge>
                          <Badge variant="secondary" className="bg-white/10 text-white font-mono">
                            {variant.id}
                          </Badge>
                          {variant.isMain && (
                            <Badge variant="secondary" className="bg-white/30 text-white">
                              Hauptflow
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl mt-3">{variant.label}</CardTitle>
                        <CardDescription className="text-white/80 mt-1">
                          {variant.description} • {variant.stepCount} Steps
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link to={variant.path} target="_blank">
                          <Button variant="secondary" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Live
                          </Button>
                        </Link>
                        <Link to={`/admin/tools?tab=calculator-review&flow=${variant.id}`}>
                          <Button variant="secondary" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Screenshot
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="bg-background p-6 lg:p-8">
                      {Component ? (
                        <div className="max-w-4xl mx-auto">
                          <Component />
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <p>Komponente für <code className="bg-muted px-2 py-1 rounded">{variant.id}</code> nicht gefunden</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        )}
      </main>
      
      {/* Quick Navigation */}
      {variants.length > 1 && (
        <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
          <Card className="p-2">
            <div className="space-y-1">
              {variants.map((variant, index) => (
                <a
                  key={variant.id}
                  href={`#${variant.id}`}
                  className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  #{index + 1} {variant.id}
                </a>
              ))}
            </div>
          </Card>
        </nav>
      )}
    </div>
  );
}

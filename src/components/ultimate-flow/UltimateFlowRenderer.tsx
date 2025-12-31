/**
 * UltimateFlowRenderer - Renders the Ultimate Flow from database configuration
 * 
 * Dynamically renders the flow steps based on the JSON configuration
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Users,
  Clock,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowStep {
  number: number;
  name: string;
  features: string[];
  sourceElements: string[];
  archetypeValue: Record<string, string>;
}

interface KeyFeature {
  feature: string;
  impact: string;
  implementation: string;
  sourceFlow: string;
}

interface UltimateFlowConfig {
  name: string;
  description: string;
  flowCode: string;
  expectedScore: number;
  expectedConversionLift: string;
  keyFeatures: KeyFeature[];
  steps: FlowStep[];
}

interface SuccessMetrics {
  targetScore: number;
  conversionGoal: string;
  kpis: Array<{
    metric: string;
    current: string;
    target: string;
  }>;
  archetypeCoverage?: Record<string, number>;
}

interface UltimateFlowRendererProps {
  flow: UltimateFlowConfig;
  metrics?: SuccessMetrics;
  flowId: string;
}

const archetypeIcons: Record<string, typeof Shield> = {
  securitySeeker: Shield,
  efficiencyMaximizer: Zap,
  valueHunter: Target,
  overwhelmedParent: Users,
};

const archetypeLabels: Record<string, string> = {
  securitySeeker: 'Sicherheits-Sucher',
  efficiencyMaximizer: 'Effizienz-Maximierer',
  valueHunter: 'Preis-Jäger',
  overwhelmedParent: 'Chaos-Manager',
};

export const UltimateFlowRenderer = ({ flow, metrics, flowId }: UltimateFlowRendererProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'details'>('preview');

  const totalSteps = flow.steps?.length || 7;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = flow.steps?.[currentStep];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Star className="h-4 w-4 text-primary fill-primary" />
          <span className="text-sm font-medium text-primary">Ultimate Flow</span>
          <Badge variant="secondary" className="ml-2">
            Score: {flow.expectedScore}/100
          </Badge>
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          {flow.name}
        </h2>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {flow.description}
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            {flow.expectedConversionLift} Conversion
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Award className="h-3 w-3" />
            {totalSteps} Steps
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            ~2 Min.
          </Badge>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          variant={viewMode === 'preview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('preview')}
        >
          Flow Preview
        </Button>
        <Button
          variant={viewMode === 'details' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('details')}
        >
          Details & Features
        </Button>
      </div>

      {viewMode === 'preview' ? (
        <>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Schritt {currentStep + 1} von {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {currentStepData?.number || currentStep + 1}
                    </div>
                    <CardTitle className="text-xl">
                      {currentStepData?.name || `Schritt ${currentStep + 1}`}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Features
                    </h4>
                    <div className="grid gap-2">
                      {currentStepData?.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Archetype Values */}
                  {currentStepData?.archetypeValue && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Archetyp-Mehrwert
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {Object.entries(currentStepData.archetypeValue).map(([key, value]) => {
                          const Icon = archetypeIcons[key] || Users;
                          return (
                            <div 
                              key={key} 
                              className="p-3 bg-muted/50 rounded-lg border border-border/50"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-4 w-4 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">
                                  {archetypeLabels[key] || key}
                                </span>
                              </div>
                              <p className="text-sm">{value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Source Elements */}
                  {currentStepData?.sourceElements && (
                    <div className="flex flex-wrap gap-2">
                      {currentStepData.sourceElements.map((source, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Button>

            {/* Step Indicators */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentStep 
                      ? "w-6 bg-primary" 
                      : idx < currentStep
                        ? "bg-primary/60"
                        : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentStep === totalSteps - 1}
              className="gap-2"
            >
              Weiter
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        /* Details View */
        <div className="space-y-8">
          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Schlüssel-Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {flow.keyFeatures?.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{feature.feature}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.implementation}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="default" className="bg-green-600">
                          {feature.impact}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          von {feature.sourceFlow}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KPIs */}
          {metrics?.kpis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Erwartete KPIs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {metrics.kpis.map((kpi, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        {kpi.metric}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-muted-foreground line-through">
                          {kpi.current}
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span className="text-xl font-bold text-primary">
                          {kpi.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Archetype Coverage */}
          {metrics?.archetypeCoverage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Archetyp-Abdeckung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(metrics.archetypeCoverage).map(([key, value]) => {
                    const Icon = archetypeIcons[key] || Users;
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {archetypeLabels[key] || key}
                            </span>
                          </div>
                          <span className="text-sm font-bold">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Steps Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Alle {totalSteps} Schritte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flow.steps?.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentStep(idx);
                      setViewMode('preview');
                    }}
                    className="w-full p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-4"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{step.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {step.features?.[0] || 'Keine Features'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UltimateFlowRenderer;

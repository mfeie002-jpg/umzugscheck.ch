/**
 * SixStepFrameworkPanel - Swiss 6-Step Framework Analysis Panel
 * 
 * Based on Gemini analysis - the 6 critical steps for Swiss moving market:
 * 1. Hook (Entry & Geolocation)
 * 2. Wann (Temporal Logic)
 * 3. Inventar (Cognitive Core)
 * 4. Upselling (Service Enrichment)
 * 5. Trust (Identity & Verification)
 * 6. Dashboard (Conversion & Nurturing)
 */

import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Package, ShoppingCart, Shield, LayoutDashboard,
  Check, X, AlertTriangle, ArrowRight, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SixStepAnalysis {
  step: number;
  name: string;
  score: number;
  implemented: string[];
  missing: string[];
  swissSpecificScore: number;
}

interface SixStepFrameworkPanelProps {
  sixStepAnalysis?: SixStepAnalysis[];
  className?: string;
}

// Swiss 6-Step Framework configuration
const FRAMEWORK_STEPS = [
  {
    step: 1,
    name: 'Hook',
    germanName: 'Der "Hook"',
    fullName: 'Kontextueller Einstieg & Geolocation',
    icon: MapPin,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    benchmark: 'Movu: Einfaches PLZ-Formular',
    criticalElements: ['Smart Location', 'Intent-Segmentierung', 'Etagen-Frage'],
    swissSpecific: ['Quartierbezeichnungen', 'LKW-Zufahrt', 'Möbellift-Metadaten']
  },
  {
    step: 2,
    name: 'Wann',
    germanName: 'Das "Wann"',
    fullName: 'Temporale Logik & Flexibilität',
    icon: Calendar,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    benchmark: 'Movu: Starre Datumswähler',
    criticalElements: ['Zügeltag-Ampel', 'Flex-Date Interface', 'Yield Management'],
    swissSpecific: ['31.3, 30.6, 30.9 Termine', 'Kantonale Unterschiede', 'Surge Pricing']
  },
  {
    step: 3,
    name: 'Inventar',
    germanName: 'Der kognitive Kern',
    fullName: 'Inventar-Erfassung',
    icon: Package,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    benchmark: 'Movu: Manuelle Listen, Fehlerquote',
    criticalElements: ['KI-Video-Inventar', 'Raum-Presets', 'Granulare Suche'],
    swissSpecific: ['Keller typisch CH', 'Estrich/Dachboden', 'Kartonanzahl-Berechnung']
  },
  {
    step: 4,
    name: 'Upselling',
    germanName: 'Upselling mit Kontext',
    fullName: 'Service-Anreicherung',
    icon: ShoppingCart,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    benchmark: 'Movu: Checkbox-Listen',
    criticalElements: ['Kontextuelles Upselling', 'Abnahmegarantie', 'Montage intelligent'],
    swissSpecific: ['Endreinigung = Pflicht', 'Abnahmegarantie', 'Downsizing-Optionen']
  },
  {
    step: 5,
    name: 'Trust',
    germanName: 'Point of Sale',
    fullName: 'Identität, Vertrauen & Verifikation',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    benchmark: 'Movu: "Geprüfte Partner" vage',
    criticalElements: ['OTP-Auth SMS', 'Trust Badges', 'Social Proof'],
    swissSpecific: ['ASTAG Plus', 'nDSG-Konformität', 'Serverstandort CH']
  },
  {
    step: 6,
    name: 'Dashboard',
    germanName: 'Das Dashboard',
    fullName: 'Conversion & Nurturing',
    icon: LayoutDashboard,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    benchmark: 'Movu: "Danke, wir melden uns"',
    criticalElements: ['Interaktives Dashboard', 'Preisaufschlüsselung', 'Experten-Call'],
    swissSpecific: ['Ummeldecheck-liste', 'Karton-Partner', 'T-8 Nurturing']
  }
];

export function SixStepFrameworkPanel({ sixStepAnalysis = [], className = '' }: SixStepFrameworkPanelProps) {
  // Calculate overall framework score
  const overallScore = sixStepAnalysis.length > 0
    ? Math.round(sixStepAnalysis.reduce((sum, step) => sum + step.score, 0) / sixStepAnalysis.length)
    : 0;

  const swissScore = sixStepAnalysis.length > 0
    ? Math.round(sixStepAnalysis.reduce((sum, step) => sum + (step.swissSpecificScore || 0), 0) / sixStepAnalysis.length)
    : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Swiss 6-Step Framework
            </CardTitle>
            <CardDescription>
              Benchmark gegen Movu.ch - die 6 kritischen Schritte
            </CardDescription>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-xs text-muted-foreground">Framework</p>
              <span className={`text-2xl font-bold ${overallScore >= 80 ? 'text-green-500' : overallScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {overallScore || '—'}%
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Swissness</p>
              <span className={`text-2xl font-bold ${swissScore >= 80 ? 'text-green-500' : swissScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {swissScore || '—'}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step Pipeline */}
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {FRAMEWORK_STEPS.map((step, idx) => {
            const analysisStep = sixStepAnalysis.find(s => s.step === step.step);
            const StepIcon = step.icon;
            const score = analysisStep?.score || 0;
            
            return (
              <div key={step.step} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex flex-col items-center p-2 rounded-lg ${step.bgColor} min-w-[80px]`}
                >
                  <div className={`p-2 rounded-full bg-background shadow-sm`}>
                    <StepIcon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <span className="text-xs font-medium mt-1">{step.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 text-xs ${
                      score >= 80 ? 'border-green-500 text-green-500' :
                      score >= 60 ? 'border-amber-500 text-amber-500' :
                      score > 0 ? 'border-red-500 text-red-500' :
                      'border-muted text-muted-foreground'
                    }`}
                  >
                    {score > 0 ? `${score}%` : '—'}
                  </Badge>
                </motion.div>
                {idx < FRAMEWORK_STEPS.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Steps */}
        <div className="grid gap-3">
          {FRAMEWORK_STEPS.map((step, idx) => {
            const analysisStep = sixStepAnalysis.find(s => s.step === step.step);
            const StepIcon = step.icon;
            const implemented = analysisStep?.implemented || [];
            const missing = analysisStep?.missing || [];

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="border rounded-lg p-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${step.bgColor} flex-shrink-0`}>
                    <StepIcon className={`h-4 w-4 ${step.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{step.step}. {step.fullName}</span>
                      <Badge variant="outline" className="text-xs">
                        {step.germanName}
                      </Badge>
                      {analysisStep && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            analysisStep.score >= 80 ? 'border-green-500 text-green-500' :
                            analysisStep.score >= 60 ? 'border-amber-500 text-amber-500' :
                            'border-red-500 text-red-500'
                          }`}
                        >
                          {analysisStep.score}%
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      Benchmark: {step.benchmark}
                    </p>

                    {/* Implemented & Missing */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {implemented.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Check className="h-3 w-3" />
                          <span>{implemented.length} implementiert</span>
                        </div>
                      )}
                      {missing.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{missing.length} fehlt</span>
                        </div>
                      )}
                      {analysisStep?.swissSpecificScore !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Shield className="h-3 w-3" />
                          <span>Swiss: {analysisStep.swissSpecificScore}%</span>
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    {analysisStep && (
                      <Progress value={analysisStep.score} className="h-1 mt-2" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

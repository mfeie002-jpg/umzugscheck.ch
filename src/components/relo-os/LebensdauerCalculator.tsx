/**
 * LebensdauerCalculator - Swiss Fixture Depreciation Calculator
 * 
 * Interactive calculator for determining residual value of apartment fixtures
 * based on the paritätische Lebensdauertabelle.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Paintbrush,
  UtensilsCrossed,
  Bath,
  DoorOpen,
  Zap,
  Thermometer,
  TreePine,
  Package
} from 'lucide-react';
import { useFixtureLifespans } from '@/lib/relo-os/swiss-integration/lebensdauer/useLebensdauer';
import { 
  calculateDepreciation, 
  assessDamage,
  CATEGORY_LABELS,
  type FixtureCategory,
  type FixtureLifespan,
  type DamageAssessment 
} from '@/lib/relo-os/swiss-integration/lebensdauer';

// Category icons
const CATEGORY_ICONS: Record<FixtureCategory, React.ReactNode> = {
  walls: <Paintbrush className="w-4 h-4" />,
  floors: <Building className="w-4 h-4" />,
  kitchen: <UtensilsCrossed className="w-4 h-4" />,
  bathroom: <Bath className="w-4 h-4" />,
  doors_windows: <DoorOpen className="w-4 h-4" />,
  electrical: <Zap className="w-4 h-4" />,
  heating: <Thermometer className="w-4 h-4" />,
  exterior: <TreePine className="w-4 h-4" />,
  miscellaneous: <Package className="w-4 h-4" />,
};

interface LebensdauerCalculatorProps {
  onAssessmentComplete?: (assessment: DamageAssessment) => void;
  initialCategory?: FixtureCategory;
  compact?: boolean;
}

export function LebensdauerCalculator({ 
  onAssessmentComplete,
  initialCategory,
  compact = false 
}: LebensdauerCalculatorProps) {
  const { data: fixtures, isLoading } = useFixtureLifespans();
  
  const [selectedCategory, setSelectedCategory] = useState<FixtureCategory | ''>(initialCategory || '');
  const [selectedFixtureId, setSelectedFixtureId] = useState<string>('');
  const [installationYear, setInstallationYear] = useState<string>('');
  const [replacementCost, setReplacementCost] = useState<string>('');
  
  const currentYear = new Date().getFullYear();
  
  // Filter fixtures by category
  const categoryFixtures = useMemo(() => {
    if (!fixtures || !selectedCategory) return [];
    return fixtures.filter(f => f.category === selectedCategory);
  }, [fixtures, selectedCategory]);
  
  // Get selected fixture
  const selectedFixture = useMemo(() => {
    return fixtures?.find(f => f.id === selectedFixtureId);
  }, [fixtures, selectedFixtureId]);
  
  // Calculate depreciation when all inputs are valid
  const assessment = useMemo(() => {
    if (!selectedFixture || !installationYear) return null;
    
    const year = parseInt(installationYear, 10);
    if (isNaN(year) || year > currentYear || year < 1900) return null;
    
    const cost = replacementCost ? parseFloat(replacementCost) : 0;
    
    return assessDamage(
      selectedFixture,
      year,
      cost,
      currentYear
    );
  }, [selectedFixture, installationYear, replacementCost, currentYear]);
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as FixtureCategory);
    setSelectedFixtureId('');
  };
  
  // Handle confirm
  const handleConfirm = () => {
    if (assessment && onAssessmentComplete) {
      onAssessmentComplete(assessment);
    }
  };
  
  // Year options (last 50 years)
  const yearOptions = Array.from({ length: 51 }, (_, i) => currentYear - i);

  if (isLoading) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse text-muted-foreground">Lade Lebensdauertabelle...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? '' : 'shadow-lg'}>
      <CardHeader className={compact ? 'pb-3' : ''}>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <CardTitle className={compact ? 'text-lg' : ''}>Lebensdauer-Rechner</CardTitle>
        </div>
        <CardDescription>
          Berechnung nach paritätischer Lebensdauertabelle (SMV/HEV)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label>Kategorie</Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Kategorie wählen..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([key, labels]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[key as FixtureCategory]}
                    <span>{labels.de}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Item Selection */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label>Gegenstand</Label>
              <Select value={selectedFixtureId} onValueChange={setSelectedFixtureId}>
                <SelectTrigger>
                  <SelectValue placeholder="Gegenstand wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {categoryFixtures.map((fixture) => (
                    <SelectItem key={fixture.id} value={fixture.id}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{fixture.item_de}</span>
                        <Badge variant="outline" className="text-xs">
                          {fixture.lifespan_years} Jahre
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Installation Year */}
        <AnimatePresence mode="wait">
          {selectedFixture && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label>Einbaujahr / Letzte Erneuerung</Label>
              <Select value={installationYear} onValueChange={setInstallationYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Jahr wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedFixture.notes_de && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                  <Info className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{selectedFixture.notes_de}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Replacement Cost (optional) */}
        <AnimatePresence mode="wait">
          {assessment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label>Ersatzkosten (CHF) - optional</Label>
              <Input
                type="number"
                placeholder="z.B. 500"
                value={replacementCost}
                onChange={(e) => setReplacementCost(e.target.value)}
                min="0"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <Separator className="my-4" />
        
        {/* Results */}
        <AnimatePresence mode="wait">
          {assessment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {assessment.depreciation.isFullyAmortized ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Kein Abzug
                  </Badge>
                ) : assessment.depreciation.isNormalWear ? (
                  <Badge variant="secondary">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Normale Abnützung
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Restwert vorhanden
                  </Badge>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Abschreibung</span>
                  <span className="font-medium">
                    {100 - assessment.depreciation.residualPercent}% amortisiert
                  </span>
                </div>
                <Progress 
                  value={100 - assessment.depreciation.residualPercent} 
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Einbau {assessment.installationYear}</span>
                  <span>Lebensdauer {assessment.depreciation.lifespanYears} Jahre</span>
                </div>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground text-xs">Alter</div>
                  <div className="font-semibold text-lg">
                    {assessment.depreciation.ageYears} Jahre
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground text-xs">Restwert</div>
                  <div className="font-semibold text-lg">
                    {assessment.depreciation.residualPercent}%
                  </div>
                </div>
              </div>
              
              {/* Cost Breakdown (if cost provided) */}
              {assessment.replacementCostCHF > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <div className="text-sm font-medium">Kostenaufteilung</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Mieter zahlt</div>
                      <div className="font-bold text-lg text-primary">
                        CHF {assessment.tenantPaysCHF.toLocaleString('de-CH')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Vermieter zahlt</div>
                      <div className="font-bold text-lg">
                        CHF {assessment.landlordPaysCHF.toLocaleString('de-CH')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Confirm Button */}
              {onAssessmentComplete && (
                <Button onClick={handleConfirm} className="w-full">
                  Zum Protokoll hinzufügen
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Empty State */}
        {!assessment && !selectedCategory && (
          <div className="text-center py-6 text-muted-foreground">
            <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Wählen Sie eine Kategorie und einen Gegenstand,<br />
              um die Abschreibung zu berechnen.
            </p>
          </div>
        )}
        
        {/* Source Attribution */}
        <div className="text-xs text-muted-foreground text-center pt-2">
          Quelle: Paritätische Lebensdauertabelle (Mieterverband / HEV Schweiz)
        </div>
      </CardContent>
    </Card>
  );
}

export default LebensdauerCalculator;

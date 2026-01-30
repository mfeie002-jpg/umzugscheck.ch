/**
 * ECO-SCORE DISPLAY COMPONENT
 * Shows CO2 footprint and sustainability score for moves
 */

import { memo } from 'react';
import { 
  Leaf, 
  Truck, 
  Trash2, 
  Package, 
  TreePine, 
  Car,
  Heart,
  Recycle,
  Users,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { EcoScoreResult, EcoRecommendation } from '@/lib/relo-os/sustainability/types';
import { getEcoScoreColor, formatCO2 } from '@/lib/relo-os/sustainability/eco-score-calculator';

interface EcoScoreDisplayProps {
  result: EcoScoreResult;
  compact?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  'Truck': Truck,
  'Recycle': Recycle,
  'Heart': Heart,
  'Package': Package,
  'Calendar': Calendar,
  'Users': Users,
};

export const EcoScoreDisplay = memo(function EcoScoreDisplay({ 
  result, 
  compact = false 
}: EcoScoreDisplayProps) {
  const scoreColor = getEcoScoreColor(result.overallScore);
  
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${scoreColor}`}>
          {result.overallScore}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{formatCO2(result.totalCO2kg)}</div>
          <div className="text-xs text-muted-foreground">
            {result.comparison.vsAverageCH >= 0 
              ? `${result.comparison.vsAverageCH}% über Durchschnitt`
              : `${Math.abs(result.comparison.vsAverageCH)}% unter Durchschnitt`
            }
          </div>
        </div>
        <Leaf className={`w-5 h-5 ${result.overallScore === 'A' || result.overallScore === 'B' ? 'text-green-500' : 'text-muted-foreground'}`} />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Öko-Bilanz Ihres Umzugs
            </CardTitle>
            <CardDescription>
              CO₂-Fussabdruck und Nachhaltigkeitstipps
            </CardDescription>
          </div>
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-3xl border-2 ${scoreColor}`}>
            {result.overallScore}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Total CO2 */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold">{formatCO2(result.totalCO2kg)}</div>
          <div className="text-sm text-muted-foreground mt-1">
            Geschätzter CO₂-Ausstoss
          </div>
        </div>
        
        {/* Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Aufschlüsselung</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-muted-foreground" />
                Transport
              </div>
              <span className="font-medium">{formatCO2(result.breakdown.transport)}</span>
            </div>
            <Progress value={(result.breakdown.transport / result.totalCO2kg) * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Trash2 className="w-4 h-4 text-muted-foreground" />
                Entsorgung
              </div>
              <span className="font-medium">{formatCO2(result.breakdown.waste)}</span>
            </div>
            <Progress value={(result.breakdown.waste / result.totalCO2kg) * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                Verpackung
              </div>
              <span className="font-medium">{formatCO2(result.breakdown.packaging)}</span>
            </div>
            <Progress value={(result.breakdown.packaging / result.totalCO2kg) * 100} className="h-2" />
          </div>
        </div>
        
        {/* Comparison */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className={`text-lg font-bold ${result.comparison.vsAverageCH < 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {result.comparison.vsAverageCH >= 0 ? '+' : ''}{result.comparison.vsAverageCH}%
            </div>
            <div className="text-xs text-muted-foreground">vs. Durchschnitt</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <TreePine className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold">{result.comparison.treesEquivalent}</span>
            </div>
            <div className="text-xs text-muted-foreground">Bäume/Jahr</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Car className="w-4 h-4 text-muted-foreground" />
              <span className="text-lg font-bold">{result.comparison.carKmEquivalent}</span>
            </div>
            <div className="text-xs text-muted-foreground">km Auto</div>
          </div>
        </div>
        
        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              So sparen Sie CO₂
            </h4>
            
            <div className="space-y-2">
              {result.recommendations.slice(0, 3).map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

function RecommendationCard({ recommendation }: { recommendation: EcoRecommendation }) {
  const IconComponent = ICON_MAP[recommendation.icon] || Leaf;
  
  return (
    <div className="flex items-start gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
        <IconComponent className="w-4 h-4 text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{recommendation.title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {recommendation.description}
        </div>
      </div>
      <Badge variant="outline" className="shrink-0 text-green-700 border-green-500/30 bg-green-500/5">
        -{formatCO2(recommendation.savingsCO2kg)}
      </Badge>
    </div>
  );
}

export default EcoScoreDisplay;

/**
 * Canton Scarcity Control Panel
 */

import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CantonCoverage as CantonCoverageType } from './types';

interface CantonCoverageProps {
  cantons: CantonCoverageType[];
}

export function CantonCoverage({ cantons }: CantonCoverageProps) {
  const overLimitCantons = cantons.filter(c => c.isOverLimit);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kantons-Abdeckung</CardTitle>
        <CardDescription>
          Scarcity-Kontrolle: Zu viele Partner = Race to Bottom und Churn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {overLimitCantons.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              ⚠️ Scarcity-Verletzung in {overLimitCantons.length} Kanton(en)! Partner-Limit überschritten.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          {cantons.map(canton => {
            const progress = (canton.currentActive / canton.targetMax) * 100;
            const isWarning = canton.currentActive >= canton.targetMax * 0.8;
            
            return (
              <div 
                key={canton.cantonCode}
                className={`p-4 rounded-lg border ${
                  canton.isOverLimit ? 'border-red-500 bg-red-500/5' :
                  isWarning ? 'border-yellow-500 bg-yellow-500/5' :
                  'bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{canton.canton}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={canton.isOverLimit ? 'destructive' : isWarning ? 'secondary' : 'outline'}>
                      {canton.currentActive} / {canton.targetMin}–{canton.targetMax}
                    </Badge>
                    {canton.isOverLimit ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
                <Progress 
                  value={Math.min(100, progress)} 
                  className={`h-2 ${
                    canton.isOverLimit ? '[&>div]:bg-red-500' :
                    isWarning ? '[&>div]:bg-yellow-500' : ''
                  }`}
                />
                {canton.isOverLimit && (
                  <p className="text-xs text-red-600 mt-2">
                    Überschreitung: {canton.currentActive - canton.targetMax} Partner zu viel
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          <strong>Richtlinie:</strong> Scarcity erhöht den Lead-Wert. Zu viele Partner führen zu Race to Bottom und hoher Churn.
          <ul className="mt-2 ml-4 list-disc">
            <li>Zürich: 5–7 Partner max</li>
            <li>Zug/Aargau: 2–3 Partner</li>
            <li>Rest: 1 nationaler Partner</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

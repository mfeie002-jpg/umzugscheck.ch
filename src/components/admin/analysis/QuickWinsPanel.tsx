/**
 * QuickWinsPanel - Displays prioritized quick wins with effort/impact matrix
 * Quick Wins = High Impact + Low Effort improvements
 */

import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface QuickWin {
  title: string;
  description?: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  category?: string;
  recommendation?: string;
}

interface QuickWinsPanelProps {
  quickWins: (string | QuickWin)[];
  onImplement?: (win: QuickWin) => void;
  maxItems?: number;
}

const EFFORT_CONFIG = {
  low: { label: '1-2h', color: 'bg-green-500', textColor: 'text-green-600' },
  medium: { label: '1-2d', color: 'bg-amber-500', textColor: 'text-amber-600' },
  high: { label: '1w+', color: 'bg-red-500', textColor: 'text-red-600' },
};

const IMPACT_CONFIG = {
  low: { label: 'Gering', color: 'bg-gray-400' },
  medium: { label: 'Mittel', color: 'bg-blue-500' },
  high: { label: 'Hoch', color: 'bg-green-500' },
};

export function QuickWinsPanel({ quickWins, onImplement, maxItems = 5 }: QuickWinsPanelProps) {
  // Normalize quick wins to structured format
  const normalizedWins: QuickWin[] = quickWins.slice(0, maxItems).map((win, index) => {
    if (typeof win === 'string') {
      return {
        title: win,
        effort: 'low' as const,
        impact: 'high' as const,
      };
    }
    return win;
  });

  // Sort by impact (high first) then by effort (low first)
  const sortedWins = [...normalizedWins].sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    const effortOrder = { low: 0, medium: 1, high: 2 };
    
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    if (impactDiff !== 0) return impactDiff;
    return effortOrder[a.effort] - effortOrder[b.effort];
  });

  if (sortedWins.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p className="text-muted-foreground">Keine Quick Wins gefunden – der Flow ist bereits optimiert!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Quick Wins</CardTitle>
              <CardDescription>Hoher Impact, geringer Aufwand</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
            {sortedWins.length} Vorschläge
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {sortedWins.map((win, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-3 rounded-lg border hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Priority indicator */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{win.title}</p>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs bg-yellow-500 hover:bg-yellow-600">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Top-Priorität
                      </Badge>
                    )}
                  </div>
                  
                  {win.description && (
                    <p className="text-xs text-muted-foreground mb-2">{win.description}</p>
                  )}

                  {/* Effort/Impact Tags */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className={`h-3 w-3 ${EFFORT_CONFIG[win.effort].textColor}`} />
                      <span className="text-muted-foreground">Aufwand:</span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {EFFORT_CONFIG[win.effort].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-muted-foreground">Impact:</span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {IMPACT_CONFIG[win.impact].label}
                      </Badge>
                    </div>
                    {win.category && (
                      <Badge variant="secondary" className="text-xs">
                        {win.category}
                      </Badge>
                    )}
                  </div>

                  {win.recommendation && (
                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" />
                      {win.recommendation}
                    </p>
                  )}
                </div>

                {/* Action button */}
                {onImplement && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onImplement(win)}
                  >
                    Umsetzen
                  </Button>
                )}
              </div>

              {/* Visual priority bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg">
                <div 
                  className={`h-full rounded-l-lg ${
                    index === 0 ? 'bg-yellow-500' : 
                    index < 3 ? 'bg-primary/60' : 'bg-muted'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {quickWins.length > maxItems && (
          <>
            <Separator className="my-4" />
            <p className="text-xs text-center text-muted-foreground">
              +{quickWins.length - maxItems} weitere Quick Wins verfügbar
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default QuickWinsPanel;

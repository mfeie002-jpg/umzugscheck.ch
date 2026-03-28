/**
 * ArchetypeRadar - Visual radar/spider chart for Swiss market archetypes
 * Displays scores for the 4 archetypes: Security-Seeker, Efficiency-Maximizer, Value-Hunter, Chaos-Manager
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, BadgePercent, Brain, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArchetypeScore {
  archetype: string;
  score: number;
  reasoning: string;
  missingElements: string[];
  improvements: string[];
}

interface ArchetypeRadarProps {
  scores: ArchetypeScore[];
  flowName?: string;
}

const ARCHETYPE_CONFIG = {
  'Sicherheits-Sucher': {
    key: 'securitySeeker',
    icon: Shield,
    color: 'hsl(var(--chart-1))',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600',
    description: 'Familien 45+, risikoavers',
    triggers: ['Garantie', 'ASTAG', 'Fixpreis', 'Versicherung'],
  },
  'Effizienz-Maximierer': {
    key: 'efficiencyMaximizer',
    icon: Zap,
    color: 'hsl(var(--chart-2))',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600',
    description: 'Expats/Professionals 25-45',
    triggers: ['One-Click', 'KI-Video', 'Full-Service', 'English'],
  },
  'Preis-Jäger': {
    key: 'valueHunter',
    icon: BadgePercent,
    color: 'hsl(var(--chart-3))',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600',
    description: 'Studenten, junge Paare',
    triggers: ['Preisvergleich', 'Sparen', 'Rabatt', 'Transparenz'],
  },
  'Chaos-Manager': {
    key: 'overwhelmedParent',
    icon: Brain,
    color: 'hsl(var(--chart-4))',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600',
    description: 'Familien im Umbruch',
    triggers: ['Checkliste', 'Speichern', 'Erinnerung', 'Struktur'],
  },
};

export function ArchetypeRadar({ scores, flowName }: ArchetypeRadarProps) {
  const normalizedScores = useMemo(() => {
    const archetypeOrder = [
      'Sicherheits-Sucher',
      'Effizienz-Maximierer',
      'Preis-Jäger',
      'Chaos-Manager',
    ];
    
    return archetypeOrder.map((name) => {
      const found = scores.find(s => 
        s.archetype === name || 
        s.archetype === ARCHETYPE_CONFIG[name as keyof typeof ARCHETYPE_CONFIG]?.key
      );
      return {
        name,
        score: found?.score ?? 0,
        reasoning: found?.reasoning ?? '',
        missingElements: found?.missingElements ?? [],
        improvements: found?.improvements ?? [],
        config: ARCHETYPE_CONFIG[name as keyof typeof ARCHETYPE_CONFIG],
      };
    });
  }, [scores]);

  const avgScore = useMemo(() => {
    const sum = normalizedScores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / normalizedScores.length);
  }, [normalizedScores]);

  // Calculate radar polygon points
  const radarPoints = useMemo(() => {
    const centerX = 100;
    const centerY = 100;
    const maxRadius = 80;
    const angles = normalizedScores.map((_, i) => (i * 2 * Math.PI) / 4 - Math.PI / 2);
    
    return normalizedScores.map((s, i) => {
      const radius = (s.score / 100) * maxRadius;
      return {
        x: centerX + radius * Math.cos(angles[i]),
        y: centerY + radius * Math.sin(angles[i]),
      };
    });
  }, [normalizedScores]);

  const polygonPath = radarPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  // Grid circles for reference
  const gridCircles = [25, 50, 75, 100];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Archetypen-Analyse
            </CardTitle>
            <CardDescription>
              {flowName ? `${flowName} – ` : ''}Bewertung für 4 Schweizer Markt-Archetypen
            </CardDescription>
          </div>
          <Badge variant={avgScore >= 80 ? 'default' : avgScore >= 60 ? 'secondary' : 'destructive'}>
            Ø {avgScore} Punkte
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[280px] h-auto">
              {/* Grid circles */}
              {gridCircles.map((pct) => (
                <circle
                  key={pct}
                  cx={100}
                  cy={100}
                  r={(pct / 100) * 80}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                  strokeDasharray={pct === 100 ? '0' : '2,2'}
                  opacity={0.5}
                />
              ))}
              
              {/* Axis lines */}
              {normalizedScores.map((s, i) => {
                const angle = (i * 2 * Math.PI) / 4 - Math.PI / 2;
                const endX = 100 + 85 * Math.cos(angle);
                const endY = 100 + 85 * Math.sin(angle);
                return (
                  <line
                    key={s.name}
                    x1={100}
                    y1={100}
                    x2={endX}
                    y2={endY}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.5}
                    opacity={0.5}
                  />
                );
              })}

              {/* Labels */}
              {normalizedScores.map((s, i) => {
                const angle = (i * 2 * Math.PI) / 4 - Math.PI / 2;
                const labelRadius = 95;
                const x = 100 + labelRadius * Math.cos(angle);
                const y = 100 + labelRadius * Math.sin(angle);
                const Icon = s.config.icon;
                
                return (
                  <g key={s.name}>
                    <foreignObject
                      x={x - 12}
                      y={y - 12}
                      width={24}
                      height={24}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${s.config.bgColor}`}>
                        <Icon className={`h-3.5 w-3.5 ${s.config.textColor}`} />
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Score polygon */}
              <motion.path
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                d={polygonPath}
                fill="hsl(var(--primary) / 0.2)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                style={{ transformOrigin: 'center' }}
              />

              {/* Score points */}
              {radarPoints.map((p, i) => (
                <motion.circle
                  key={i}
                  initial={{ r: 0 }}
                  animate={{ r: 4 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  cx={p.x}
                  cy={p.y}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}

              {/* Center score */}
              <text
                x={100}
                y={105}
                textAnchor="middle"
                className="fill-foreground font-bold text-lg"
              >
                {avgScore}
              </text>
            </svg>
          </div>

          {/* Archetype Details */}
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-3">
              {normalizedScores.map((s) => {
                const Icon = s.config.icon;
                return (
                  <TooltipProvider key={s.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${s.config.bgColor}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${s.config.textColor}`} />
                              <span className="font-medium text-sm">{s.name}</span>
                            </div>
                            <Badge 
                              variant={s.score >= 80 ? 'default' : s.score >= 60 ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {s.score}/100
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${s.score}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="h-1.5 rounded-full"
                              style={{ backgroundColor: s.config.color }}
                            />
                          </div>
                          {s.reasoning && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {s.reasoning}
                            </p>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-sm p-4">
                        <div className="space-y-2">
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.config.description}</p>
                          {s.reasoning && (
                            <p className="text-sm">{s.reasoning}</p>
                          )}
                          {s.missingElements.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-destructive">Fehlend:</p>
                              <ul className="text-xs list-disc list-inside">
                                {s.missingElements.slice(0, 3).map((el, i) => (
                                  <li key={i}>{el}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {s.improvements.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-primary">Verbesserungen:</p>
                              <ul className="text-xs list-disc list-inside">
                                {s.improvements.slice(0, 3).map((imp, i) => (
                                  <li key={i}>{imp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Trigger Keywords */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Conversion-Trigger pro Archetyp</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {normalizedScores.map((s) => (
              <div key={s.name} className="flex gap-1">
                {s.config.triggers.slice(0, 2).map((trigger) => (
                  <Badge key={trigger} variant="outline" className="text-xs">
                    {trigger}
                  </Badge>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ArchetypeRadar;

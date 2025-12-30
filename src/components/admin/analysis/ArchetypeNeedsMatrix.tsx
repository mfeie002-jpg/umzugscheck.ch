/**
 * ArchetypeNeedsMatrix - Matrix showing archetype UX focus, must-haves, and conversion triggers
 * 
 * Based on Gemini analysis:
 * - Security-Seeker: Families 45+, risk-averse
 * - Efficiency-Maximizer: Expats/Professionals 25-45
 * - Value-Hunter: Students, young couples, price-conscious
 * - Overwhelmed Parent (Chaos-Manager): Families in transition
 */

import { motion } from 'framer-motion';
import { Shield, Zap, PiggyBank, Users, Target, Sparkles, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ArchetypeScore {
  archetype: string;
  score: number;
  reasoning: string;
  missingElements: string[];
  improvements: string[];
}

interface ArchetypeNeedsMatrixProps {
  archetypeScores?: ArchetypeScore[];
  className?: string;
}

// Archetype configurations based on Gemini analysis
const ARCHETYPES_CONFIG = {
  'Sicherheits-Sucher': {
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    uxFocus: 'Validierung',
    mustHaves: ['Versicherung & Garantie', 'ASTAG Zertifikat', 'Fixpreis'],
    conversionTrigger: '"ASTAG Zertifiziert", "Abnahmegarantie"',
    demographics: 'Familien 45+, Langzeitmieter',
    painPoints: ['Hidden Costs', 'Unseriöse Anbieter', 'Schäden']
  },
  'Effizienz-Maximierer': {
    icon: Zap,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    uxFocus: 'Speed',
    mustHaves: ['Video-Upload', 'Apple Pay', 'One-Click'],
    conversionTrigger: '"Fertig in 2 Minuten", "Alles aus einer Hand"',
    demographics: 'Expats/Professionals 25-45',
    painPoints: ['Lange Formulare', 'Telefonanrufe', 'Sprachbarrieren']
  },
  'Preis-Jäger': {
    icon: PiggyBank,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    uxFocus: 'Vergleich',
    mustHaves: ['Spartipps', 'Kalender mit Preisen', 'Transparenz'],
    conversionTrigger: '"Sparen Sie 20% am 15. des Monats"',
    demographics: 'Studenten, junge Paare',
    painPoints: ['Intransparente Preise', 'Versteckte Kosten', 'Abzocke']
  },
  'Chaos-Manager': {
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    uxFocus: 'Struktur',
    mustHaves: ['Checklisten', 'Speicherfunktion', 'Erinnerungen'],
    conversionTrigger: '"Wir denken an alles", "Nichts vergessen"',
    demographics: 'Familien im Umbruch',
    painPoints: ['Zu viele Entscheidungen', 'Überforderung', 'Keine Zeit']
  }
};

// Get archetype config by name (fuzzy match)
const getArchetypeConfig = (name: string) => {
  const key = Object.keys(ARCHETYPES_CONFIG).find(k => 
    name.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(name.toLowerCase().split(' ')[0])
  );
  return key ? ARCHETYPES_CONFIG[key as keyof typeof ARCHETYPES_CONFIG] : null;
};

export function ArchetypeNeedsMatrix({ archetypeScores = [], className = '' }: ArchetypeNeedsMatrixProps) {
  // Use default archetypes if none provided
  const displayArchetypes = archetypeScores.length > 0 
    ? archetypeScores 
    : Object.keys(ARCHETYPES_CONFIG).map(name => ({
        archetype: name,
        score: 0,
        reasoning: 'Keine Analyse verfügbar',
        missingElements: [],
        improvements: []
      }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Archetypen-Bedürfnis-Matrix
        </CardTitle>
        <CardDescription>
          UX-Fokus, Must-Haves und Conversion-Trigger nach Gemini-Analyse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Archetyp</TableHead>
                <TableHead>UX-Fokus</TableHead>
                <TableHead>Must-Have Features</TableHead>
                <TableHead>Conversion-Trigger</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayArchetypes.map((archetype, idx) => {
                const config = getArchetypeConfig(archetype.archetype);
                const Icon = config?.icon || Users;
                
                return (
                  <motion.tr
                    key={archetype.archetype}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${config?.bgColor || 'bg-muted'}`}>
                          <Icon className={`h-4 w-4 ${config?.color || 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{archetype.archetype}</div>
                          <div className="text-xs text-muted-foreground">
                            {config?.demographics || ''}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={config?.color || ''}>
                        {config?.uxFocus || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {config?.mustHaves.map((item, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm italic text-muted-foreground">
                        {config?.conversionTrigger || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`font-bold ${
                          archetype.score >= 80 ? 'text-green-500' :
                          archetype.score >= 60 ? 'text-amber-500' :
                          archetype.score > 0 ? 'text-red-500' : 'text-muted-foreground'
                        }`}>
                          {archetype.score > 0 ? archetype.score : '—'}
                        </span>
                        {archetype.missingElements.length > 0 && (
                          <Badge variant="outline" className="text-xs text-amber-500 border-amber-500">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {archetype.missingElements.length} fehlt
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Archetype Details */}
        {archetypeScores.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {archetypeScores.map((archetype, idx) => {
              const config = getArchetypeConfig(archetype.archetype);
              const Icon = config?.icon || Users;

              return (
                <motion.div
                  key={archetype.archetype}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${config?.bgColor || 'bg-muted'}`}>
                      <Icon className={`h-4 w-4 ${config?.color || 'text-muted-foreground'}`} />
                    </div>
                    <span className="font-medium">{archetype.archetype}</span>
                    <Badge 
                      variant="outline" 
                      className={archetype.score >= 80 ? 'border-green-500 text-green-500' : 
                                 archetype.score >= 60 ? 'border-amber-500 text-amber-500' : 
                                 'border-red-500 text-red-500'}
                    >
                      {archetype.score}%
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {archetype.reasoning}
                  </p>

                  {archetype.missingElements.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-amber-500 mb-1">Fehlende Elemente:</p>
                      <div className="flex flex-wrap gap-1">
                        {archetype.missingElements.map((el, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {el}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {archetype.improvements.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-500 mb-1">Verbesserungen:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {archetype.improvements.slice(0, 3).map((imp, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <Sparkles className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

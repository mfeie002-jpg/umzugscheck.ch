/**
 * SwissnessPanel - Swiss Market Trust Signals & Compliance Panel
 * 
 * Displays Swiss-specific trust elements from the Gemini analysis:
 * - ASTAG/VSU Certifications
 * - nDSG Compliance
 * - Zügeltage awareness
 * - Abnahmegarantie (Handover Guarantee)
 * - Swiss Hosting
 */

import { motion } from 'framer-motion';
import { Shield, Award, Calendar, Home, Server, Check, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SwissnessElement {
  name: string;
  present: boolean;
  quality: 'excellent' | 'good' | 'needs-improvement' | 'missing';
  recommendation?: string;
}

interface SwissnessCategory {
  category: string;
  score: number;
  elements: SwissnessElement[];
}

interface SwissnessPanelProps {
  swissMarketScores?: SwissnessCategory[];
  className?: string;
}

// Swiss trust categories with icons and descriptions
const SWISS_CATEGORIES = [
  {
    id: 'trust',
    name: 'Trust Signals',
    icon: Shield,
    description: 'ASTAG, VSU, E-Commerce Trustmark',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'zügeltage',
    name: 'Zügeltage-Awareness',
    icon: Calendar,
    description: '31.3, 30.6, 30.9 - Kantonale Termine',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  {
    id: 'abnahme',
    name: 'Abnahmegarantie',
    icon: Home,
    description: 'Wohnungsübergabe-Sicherheit',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 'datenschutz',
    name: 'nDSG Compliance',
    icon: Server,
    description: 'Schweizer Datenschutz & Hosting',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 'zertifikate',
    name: 'Zertifizierungen',
    icon: Award,
    description: 'ASTAG Plus, VSU, Swiss Made',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  }
];

const getQualityConfig = (quality: SwissnessElement['quality']) => {
  switch (quality) {
    case 'excellent':
      return { icon: Check, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Exzellent' };
    case 'good':
      return { icon: Check, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Gut' };
    case 'needs-improvement':
      return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Verbesserbar' };
    case 'missing':
      return { icon: X, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Fehlt' };
    default:
      return { icon: AlertTriangle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Unbekannt' };
  }
};

export function SwissnessPanel({ swissMarketScores = [], className = '' }: SwissnessPanelProps) {
  // Calculate overall Swissness score
  const overallScore = swissMarketScores.length > 0
    ? Math.round(swissMarketScores.reduce((sum, cat) => sum + cat.score, 0) / swissMarketScores.length)
    : 0;

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  if (swissMarketScores.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Swissness Score
          </CardTitle>
          <CardDescription>Schweizer Markt-Kriterien</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Keine Swiss-Market-Daten verfügbar. Führe eine neue Analyse durch.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Swissness Score
            </CardTitle>
            <CardDescription>Schweizer Markt-Kriterien nach Gemini-Analyse</CardDescription>
          </div>
          <div className="text-right">
            <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <Progress value={overallScore} className="h-2" />
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4">
          {swissMarketScores.map((category, idx) => {
            const categoryConfig = SWISS_CATEGORIES.find(c => 
              category.category.toLowerCase().includes(c.id) || 
              c.name.toLowerCase().includes(category.category.toLowerCase())
            ) || SWISS_CATEGORIES[0];
            
            const CategoryIcon = categoryConfig.icon;

            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border rounded-lg p-4 space-y-3"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${categoryConfig.bgColor}`}>
                      <CategoryIcon className={`h-4 w-4 ${categoryConfig.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{category.category}</h4>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={category.score >= 80 ? 'border-green-500 text-green-500' : 
                               category.score >= 60 ? 'border-amber-500 text-amber-500' : 
                               'border-red-500 text-red-500'}
                  >
                    {category.score}%
                  </Badge>
                </div>

                {/* Elements */}
                <div className="space-y-2">
                  {category.elements.map((element, elemIdx) => {
                    const qualityConfig = getQualityConfig(element.quality);
                    const QualityIcon = qualityConfig.icon;

                    return (
                      <div 
                        key={elemIdx}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className={`p-1 rounded ${qualityConfig.bg}`}>
                          <QualityIcon className={`h-3 w-3 ${qualityConfig.color}`} />
                        </div>
                        <div className="flex-1">
                          <span className={element.present ? '' : 'text-muted-foreground'}>
                            {element.name}
                          </span>
                          {element.recommendation && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              → {element.recommendation}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className={`text-xs ${qualityConfig.color}`}>
                          {qualityConfig.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Swiss Market Info */}
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            <strong>Swissness-Kriterien:</strong> ASTAG Plus, Abnahmegarantie, Zügeltage-Awareness, 
            nDSG-Konformität, Serverstandort Schweiz. Diese Faktoren sind entscheidend für Vertrauen 
            im Schweizer Umzugsmarkt.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

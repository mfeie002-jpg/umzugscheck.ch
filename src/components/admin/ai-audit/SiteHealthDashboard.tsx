/**
 * Site Health Dashboard
 * 4 separate audit modules: SEO, UX, Performance, Trust
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Palette, Zap, Shield, 
  AlertTriangle, CheckCircle, Info,
  TrendingUp, RefreshCw, Download
} from 'lucide-react';
import { SiteHealthReport, AuditCategory, AuditIssue, AuditFocusArea } from './types';

// Mock data generator for demo
const generateMockReport = (): SiteHealthReport => ({
  overallScore: 78,
  generatedAt: new Date().toISOString(),
  categories: {
    seo: {
      id: 'seo',
      name: 'SEO & Sichtbarkeit',
      icon: 'Search',
      score: 82,
      maxScore: 100,
      issues: [
        {
          id: 'seo-1',
          severity: 'warning',
          title: 'Meta Descriptions fehlen auf 3 Seiten',
          description: 'Einige Seiten haben keine oder zu kurze Meta Descriptions',
          impact: 'Reduzierte CTR in Suchergebnissen',
          fix: 'Meta Descriptions mit 150-160 Zeichen hinzufügen',
          category: 'seo',
          affectedPages: ['/firmen', '/ratgeber', '/checkliste']
        },
        {
          id: 'seo-2',
          severity: 'info',
          title: 'Schema.org Markup optimierbar',
          description: 'LocalBusiness Schema vorhanden, aber unvollständig',
          impact: 'Weniger Rich Snippets in Google',
          fix: 'Öffnungszeiten und Bewertungen zum Schema hinzufügen',
          category: 'seo'
        }
      ],
      recommendations: [
        'Interne Verlinkung zwischen Regionen-Seiten stärken',
        'FAQ-Seiten für Long-Tail Keywords erstellen',
        'Google Business Profile optimieren'
      ]
    },
    ux: {
      id: 'ux',
      name: 'UX & Conversion',
      icon: 'Palette',
      score: 75,
      maxScore: 100,
      issues: [
        {
          id: 'ux-1',
          severity: 'critical',
          title: 'CTA-Button auf Mobile zu klein',
          description: 'Touch-Target unter 44px auf mehreren Seiten',
          impact: 'Schwierige Bedienung auf Smartphones',
          fix: 'Mindestgrösse 44x44px für alle CTAs',
          category: 'ux'
        },
        {
          id: 'ux-2',
          severity: 'warning',
          title: 'Formular-Validierung fehlt',
          description: 'Keine Inline-Validierung bei Eingabefeldern',
          impact: 'Höhere Abbruchrate bei Formular-Ausfüllen',
          fix: 'Echtzeit-Validierung mit Fehlermeldungen implementieren',
          category: 'ux'
        }
      ],
      recommendations: [
        'Sticky CTA-Bar auf Mobile hinzufügen',
        'Progress-Indikator im Formular einbauen',
        'Trust-Badges neben CTA platzieren'
      ]
    },
    performance: {
      id: 'performance',
      name: 'Performance',
      icon: 'Zap',
      score: 68,
      maxScore: 100,
      issues: [
        {
          id: 'perf-1',
          severity: 'critical',
          title: 'LCP über 2.5s',
          description: 'Largest Contentful Paint bei 3.2s auf Homepage',
          impact: 'Schlechte Core Web Vitals, SEO-Ranking-Faktor',
          fix: 'Hero-Bild optimieren, Critical CSS inlinen',
          category: 'performance'
        },
        {
          id: 'perf-2',
          severity: 'warning',
          title: 'Ungenutzte JavaScript-Bundles',
          description: '~120KB ungenutzter JS-Code wird geladen',
          impact: 'Längere Ladezeit, höherer Datenverbrauch',
          fix: 'Code-Splitting und Lazy Loading implementieren',
          category: 'performance'
        }
      ],
      recommendations: [
        'WebP/AVIF Bildformate verwenden',
        'Service Worker für Caching einrichten',
        'Font-Loading optimieren'
      ]
    },
    trust: {
      id: 'trust',
      name: 'Trust & Conversion',
      icon: 'Shield',
      score: 85,
      maxScore: 100,
      issues: [
        {
          id: 'trust-1',
          severity: 'info',
          title: 'Mehr Social Proof möglich',
          description: 'Nur 2 von 5 Trust-Signal-Typen aktiv',
          impact: 'Potenzielle Conversion-Steigerung nicht ausgeschöpft',
          fix: 'Video-Testimonials und Fallstudien hinzufügen',
          category: 'trust'
        }
      ],
      recommendations: [
        'Google Reviews Widget einbinden',
        'ASTAG/VSU Zertifikate prominent zeigen',
        'Team-Fotos auf Über-uns-Seite'
      ]
    }
  },
  quickWins: [],
  criticalIssues: []
});

const getSeverityColor = (severity: AuditIssue['severity']) => {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'warning': return 'bg-amber-500 text-white';
    case 'info': return 'bg-blue-500 text-white';
  }
};

const getSeverityIcon = (severity: AuditIssue['severity']) => {
  switch (severity) {
    case 'critical': return <AlertTriangle className="w-4 h-4" />;
    case 'warning': return <AlertTriangle className="w-4 h-4" />;
    case 'info': return <Info className="w-4 h-4" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-500';
  if (score >= 70) return 'text-amber-500';
  return 'text-red-500';
};

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'seo': return <Search className="w-5 h-5" />;
    case 'ux': return <Palette className="w-5 h-5" />;
    case 'performance': return <Zap className="w-5 h-5" />;
    case 'trust': return <Shield className="w-5 h-5" />;
    default: return <Info className="w-5 h-5" />;
  }
};

interface CategoryCardProps {
  category: AuditCategory;
  onViewDetails: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onViewDetails }) => (
  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onViewDetails}>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getCategoryIcon(category.id)}
          <CardTitle className="text-lg">{category.name}</CardTitle>
        </div>
        <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
          {category.score}%
        </span>
      </div>
    </CardHeader>
    <CardContent>
      <Progress value={category.score} className="h-2 mb-3" />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{category.issues.length} Issues</span>
        <span>{category.recommendations.length} Empfehlungen</span>
      </div>
      {category.issues.filter(i => i.severity === 'critical').length > 0 && (
        <Badge variant="destructive" className="mt-2">
          {category.issues.filter(i => i.severity === 'critical').length} Kritisch
        </Badge>
      )}
    </CardContent>
  </Card>
);

interface IssueListProps {
  issues: AuditIssue[];
}

const IssueList: React.FC<IssueListProps> = ({ issues }) => (
  <div className="space-y-3">
    {issues.map((issue) => (
      <Card key={issue.id} className="p-4">
        <div className="flex items-start gap-3">
          <Badge className={getSeverityColor(issue.severity)}>
            {getSeverityIcon(issue.severity)}
          </Badge>
          <div className="flex-1">
            <h4 className="font-semibold">{issue.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
            <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
              <strong>Impact:</strong> {issue.impact}
            </div>
            <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded text-sm">
              <strong>Fix:</strong> {issue.fix}
            </div>
            {issue.affectedPages && (
              <div className="mt-2 flex flex-wrap gap-1">
                {issue.affectedPages.map(page => (
                  <Badge key={page} variant="outline" className="text-xs">{page}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const SiteHealthDashboard: React.FC = () => {
  const [report, setReport] = useState<SiteHealthReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AuditFocusArea>('seo');

  const runScan = async () => {
    setIsScanning(true);
    // Simulate scan
    await new Promise(r => setTimeout(r, 2000));
    setReport(generateMockReport());
    setIsScanning(false);
  };

  if (!report) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Site Health Check</h2>
          <p className="text-muted-foreground mb-6">
            Analysiere deine Website auf SEO, UX, Performance und Trust-Signale.
          </p>
          <Button onClick={runScan} disabled={isScanning} size="lg">
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Scanne...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Jetzt scannen
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  const categories = Object.values(report.categories);
  const currentCategory = report.categories[activeCategory];

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-muted-foreground">Gesamt-Score</h2>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore}
                </span>
                <span className="text-2xl text-muted-foreground">/ 100</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Zuletzt gescannt: {new Date(report.generatedAt).toLocaleString('de-CH')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={runScan} disabled={isScanning}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                Neu scannen
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            onViewDetails={() => setActiveCategory(cat.id as AuditFocusArea)}
          />
        ))}
      </div>

      {/* Detailed View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCategoryIcon(currentCategory.id)}
              <CardTitle>{currentCategory.name}</CardTitle>
              <Badge className={getScoreColor(currentCategory.score)}>
                {currentCategory.score}%
              </Badge>
            </div>
          </div>
          <CardDescription>
            {currentCategory.issues.length} Issues gefunden, {currentCategory.recommendations.length} Empfehlungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="issues">
            <TabsList>
              <TabsTrigger value="issues">
                Issues ({currentCategory.issues.length})
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                Empfehlungen ({currentCategory.recommendations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="mt-4">
              <IssueList issues={currentCategory.issues} />
            </TabsContent>

            <TabsContent value="recommendations" className="mt-4">
              <div className="space-y-2">
                {currentCategory.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteHealthDashboard;

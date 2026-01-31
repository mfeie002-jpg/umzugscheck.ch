/**
 * Keyword Clusters Panel
 * Display keyword architecture with export capability
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, ExternalLink, Target, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KeywordCluster {
  id: string;
  name: string;
  keywords: string[];
  intentStage: 'high' | 'medium' | 'research';
  suggestedLanding: string;
  negatives: string[];
  notes?: string;
  estCPC: string;
}

const KEYWORD_CLUSTERS: KeywordCluster[] = [
  {
    id: 'core-zurich',
    name: 'Core Premium Zürich',
    keywords: ['umzugsfirma zürich', 'zügelunternehmen zürich', 'umzug zürich', 'zügelfirma zürich'],
    intentStage: 'high',
    suggestedLanding: '/paid/zuerich',
    negatives: ['günstig', 'billig', 'gratis', 'student'],
    notes: 'Primary volume cluster',
    estCPC: 'CHF 6-8',
  },
  {
    id: 'core-zug',
    name: 'Core Premium Zug',
    keywords: ['umzugsfirma zug', 'umzug zug', 'zügelunternehmen zug', 'zügelfirma zug'],
    intentStage: 'high',
    suggestedLanding: '/paid/zug',
    negatives: ['günstig', 'billig', 'gratis'],
    notes: 'Secondary volume',
    estCPC: 'CHF 4-6',
  },
  {
    id: 'vip-premium',
    name: 'VIP/Premium Service',
    keywords: ['vip umzug', 'premium umzug zürich', 'white glove umzug', 'luxus umzug', 'executive umzug'],
    intentStage: 'high',
    suggestedLanding: '/plan/vip-umzug',
    negatives: ['günstig', 'billig'],
    notes: 'Lower volume, highest value',
    estCPC: 'CHF 10-12',
  },
  {
    id: 'full-service',
    name: 'Full Service',
    keywords: ['umzug mit packservice', 'umzug und reinigung zürich', 'alles aus einer hand umzug', 'komplettumzug'],
    intentStage: 'high',
    suggestedLanding: '/paid/zuerich',
    negatives: ['nur transport'],
    notes: 'Add-on services signal premium',
    estCPC: 'CHF 5-7',
  },
  {
    id: 'senior-moves',
    name: 'Senior Moves',
    keywords: ['seniorenumzug zürich', 'umzugshilfe senioren', 'umzug betreutes wohnen', 'seniorenumzug'],
    intentStage: 'high',
    suggestedLanding: '/plan/seniorenumzug',
    negatives: [],
    notes: 'Emotional + premium margin. Pro Senectute competes.',
    estCPC: 'CHF 4-6',
  },
  {
    id: 'office-business',
    name: 'Office/Business',
    keywords: ['büroumzug zürich', 'firmenumzug zug', 'geschäftsumzug', 'büroumzug'],
    intentStage: 'high',
    suggestedLanding: '/plan/bueroumzug',
    negatives: ['privat'],
    notes: 'Weekend availability key differentiator',
    estCPC: 'CHF 5-8',
  },
  {
    id: 'special-transport',
    name: 'Special Transport',
    keywords: ['klaviertransport zürich', 'möbellift zürich', 'antiquitäten transport', 'tresor transport'],
    intentStage: 'high',
    suggestedLanding: '/plan/klaviertransport',
    negatives: ['DIY', 'selber'],
    notes: 'Specialist signals trust',
    estCPC: 'CHF 3-5',
  },
  {
    id: 'expat-international',
    name: 'Expat/International',
    keywords: ['relocation zürich', 'expat moving switzerland', 'international umzug', 'moving zurich english'],
    intentStage: 'high',
    suggestedLanding: '/en/moving-zurich',
    negatives: [],
    notes: 'English campaign required',
    estCPC: 'CHF 6-10',
  },
  {
    id: 'goldkueste-suburbs',
    name: 'Goldküste/Premium Suburbs',
    keywords: ['umzug zollikon', 'umzug küsnacht', 'umzug kilchberg', 'umzug meilen', 'umzug goldküste'],
    intentStage: 'high',
    suggestedLanding: '/paid/zuerich',
    negatives: [],
    notes: 'Highest income areas',
    estCPC: 'CHF 8-12',
  },
  {
    id: 'cost-seekers',
    name: 'Cost/Quote Seekers',
    keywords: ['umzugskosten zürich', 'umzug offerte', 'umzug preis berechnen', 'umzugskosten rechner'],
    intentStage: 'research',
    suggestedLanding: '/umzugsofferten',
    negatives: ['kostenlos selber'],
    notes: 'Route to Umzugscheck.ch portal',
    estCPC: 'CHF 3-5',
  },
];

const NEGATIVE_KEYWORDS = [
  'günstig', 'günstigste', 'billig', 'billigste',
  'gratis', 'kostenlos', 'free',
  'student', 'studentenrabatt',
  'selbst', 'selber', 'diy',
  'mieten', 'leihen',
  'vergleich', 'vergleichen',
  'jobs', 'arbeit', 'karriere', 'stelle',
  'erfahrung', 'bewertung',
];

const INTENT_CONFIG = {
  high: { label: 'High Intent', color: 'bg-green-500/20 text-green-700', icon: Target },
  medium: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-700', icon: TrendingUp },
  research: { label: 'Research', color: 'bg-blue-500/20 text-blue-700', icon: Users },
};

export function KeywordClustersPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredClusters = KEYWORD_CLUSTERS.filter(cluster => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      cluster.name.toLowerCase().includes(q) ||
      cluster.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  const exportToCSV = () => {
    const rows: string[] = [
      'Cluster,Keyword,Intent,Landing Page,Match Type,CPC Est.',
    ];
    
    KEYWORD_CLUSTERS.forEach(cluster => {
      cluster.keywords.forEach(keyword => {
        rows.push(`"${cluster.name}","${keyword}","${cluster.intentStage}","${cluster.suggestedLanding}","[phrase]","${cluster.estCPC}"`);
        // Also add exact match variant
        rows.push(`"${cluster.name}","[${keyword}]","${cluster.intentStage}","${cluster.suggestedLanding}","[exact]","${cluster.estCPC}"`);
      });
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feierabend-keywords-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Keywords exportiert', description: 'CSV-Datei wurde heruntergeladen' });
  };

  const exportNegatives = () => {
    const rows = NEGATIVE_KEYWORDS.map(kw => `-"${kw}"`);
    const blob = new Blob([rows.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feierabend-negatives.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Negatives exportiert', description: 'TXT-Datei wurde heruntergeladen' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Keywords suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportNegatives} className="gap-2">
            <Download className="h-4 w-4" />
            Negatives
          </Button>
          <Button size="sm" onClick={exportToCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Clusters Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cluster</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Landing</TableHead>
                <TableHead className="text-right">Est. CPC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClusters.map(cluster => {
                const intentConfig = INTENT_CONFIG[cluster.intentStage];
                return (
                  <TableRow key={cluster.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{cluster.name}</p>
                        {cluster.notes && (
                          <p className="text-xs text-muted-foreground">{cluster.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cluster.keywords.slice(0, 3).map(kw => (
                          <Badge key={kw} variant="outline" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                        {cluster.keywords.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{cluster.keywords.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={intentConfig.color}>
                        {intentConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={cluster.suggestedLanding} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {cluster.suggestedLanding}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {cluster.estCPC}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Negative Keywords Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-destructive">
            Negative Keywords ({NEGATIVE_KEYWORDS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {NEGATIVE_KEYWORDS.map(kw => (
              <Badge key={kw} variant="destructive" className="text-xs">
                -{kw}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

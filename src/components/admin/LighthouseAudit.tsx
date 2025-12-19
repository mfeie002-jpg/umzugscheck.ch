import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Gauge, 
  Loader2, 
  Zap, 
  Eye, 
  Shield, 
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LighthouseResult {
  url: string;
  fetchTime: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    firstContentfulPaint: string;
    largestContentfulPaint: string;
    totalBlockingTime: string;
    cumulativeLayoutShift: string;
    speedIndex: string;
    timeToInteractive: string;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

const TEST_URLS = [
  { label: "Homepage", url: "https://umzugscheck.ch" },
  { label: "Umzugsofferten", url: "https://umzugscheck.ch/umzugsofferten" },
  { label: "Preisrechner", url: "https://umzugscheck.ch/preisrechner" },
  { label: "Firmen", url: "https://umzugscheck.ch/firmen" },
  { label: "Beste Firma", url: "https://umzugscheck.ch/beste-umzugsfirma" },
];

export function LighthouseAudit() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LighthouseResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, url: "" });

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number): string => {
    if (score >= 90) return "bg-green-100";
    if (score >= 50) return "bg-orange-100";
    return "bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (score >= 50) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const runAudit = async (strategy: 'mobile' | 'desktop' = 'mobile') => {
    setLoading(true);
    setResults([]);
    setProgress({ current: 0, total: TEST_URLS.length, url: "" });

    const auditResults: LighthouseResult[] = [];

    for (let i = 0; i < TEST_URLS.length; i++) {
      const { url } = TEST_URLS[i];
      setProgress({ current: i + 1, total: TEST_URLS.length, url });
      
      try {
        console.log(`Auditing ${url}...`);
        const { data, error } = await supabase.functions.invoke('lighthouse', {
          body: { url, strategy }
        });

        if (error) {
          console.error(`Lighthouse error for ${url}:`, error);
          toast.error(`Fehler bei ${url}`);
          continue;
        }

        if (data) {
          auditResults.push(data);
        }

        // Rate limiting - PageSpeed API has limits
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Audit failed for ${url}:`, error);
      }
    }

    setResults(auditResults);
    setLoading(false);
    toast.success(`${auditResults.length} Seiten geprüft!`);
  };

  const calculateAverage = (key: keyof LighthouseResult['scores']): number => {
    if (results.length === 0) return 0;
    return Math.round(
      results.reduce((sum, r) => sum + r.scores[key], 0) / results.length
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Lighthouse Performance Audit
        </CardTitle>
        <CardDescription>
          Automatische Performance-, SEO- und Accessibility-Analyse via Google PageSpeed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => runAudit('mobile')} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Prüfe...
              </>
            ) : (
              <>
                <Gauge className="h-4 w-4 mr-2" />
                Mobile Audit
              </>
            )}
          </Button>
          <Button 
            onClick={() => runAudit('desktop')} 
            disabled={loading}
            variant="outline"
          >
            Desktop Audit
          </Button>
        </div>

        {/* Progress */}
        {loading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Prüfe: {progress.url}</span>
              <span>{progress.current}/{progress.total}</span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} />
          </div>
        )}

        {/* Average Scores */}
        {results.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg text-center ${getScoreBg(calculateAverage('performance'))}`}>
              <Zap className="h-5 w-5 mx-auto mb-1" />
              <div className={`text-2xl font-bold ${getScoreColor(calculateAverage('performance'))}`}>
                {calculateAverage('performance')}
              </div>
              <div className="text-xs text-muted-foreground">Performance</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${getScoreBg(calculateAverage('accessibility'))}`}>
              <Eye className="h-5 w-5 mx-auto mb-1" />
              <div className={`text-2xl font-bold ${getScoreColor(calculateAverage('accessibility'))}`}>
                {calculateAverage('accessibility')}
              </div>
              <div className="text-xs text-muted-foreground">Accessibility</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${getScoreBg(calculateAverage('bestPractices'))}`}>
              <Shield className="h-5 w-5 mx-auto mb-1" />
              <div className={`text-2xl font-bold ${getScoreColor(calculateAverage('bestPractices'))}`}>
                {calculateAverage('bestPractices')}
              </div>
              <div className="text-xs text-muted-foreground">Best Practices</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${getScoreBg(calculateAverage('seo'))}`}>
              <Search className="h-5 w-5 mx-auto mb-1" />
              <div className={`text-2xl font-bold ${getScoreColor(calculateAverage('seo'))}`}>
                {calculateAverage('seo')}
              </div>
              <div className="text-xs text-muted-foreground">SEO</div>
            </div>
          </div>
        )}

        {/* Individual Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{new URL(result.url).pathname || '/'}</span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(result.fetchTime).toLocaleTimeString('de-CH')}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(result.scores).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-1">
                        {getScoreIcon(value)}
                        <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Web Vitals */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">FCP</div>
                    <div className="text-muted-foreground">{result.metrics.firstContentfulPaint}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">LCP</div>
                    <div className="text-muted-foreground">{result.metrics.largestContentfulPaint}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">TBT</div>
                    <div className="text-muted-foreground">{result.metrics.totalBlockingTime}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">CLS</div>
                    <div className="text-muted-foreground">{result.metrics.cumulativeLayoutShift}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">SI</div>
                    <div className="text-muted-foreground">{result.metrics.speedIndex}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">TTI</div>
                    <div className="text-muted-foreground">{result.metrics.timeToInteractive}</div>
                  </div>
                </div>

                {/* Opportunities */}
                {result.opportunities.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium mb-1 text-orange-600">Optimierungsmöglichkeiten:</div>
                    <div className="flex flex-wrap gap-1">
                      {result.opportunities.map((opp) => (
                        <Badge key={opp.id} variant="outline" className="text-xs">
                          {opp.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Gauge className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Starte einen Audit um Performance-Daten zu erhalten</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

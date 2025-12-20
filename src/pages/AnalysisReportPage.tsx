import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Search, Zap, Smartphone, Shield, FileText, Code, Users, Target, MapPin, 
  BarChart3, TrendingDown, UserMinus, DollarSign, AlertTriangle, 
  ChevronDown, ChevronRight, Download, Clock, AlertCircle, Info,
  CheckCircle, XCircle, ArrowRight, Loader2, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search, Zap, Smartphone, Shield, FileText, Code, Users, Target, MapPin,
  BarChart3, TrendingDown, UserMinus, DollarSign, AlertTriangle,
  CheckCircle, XCircle, Clock, Info, AlertCircle
};

interface Issue {
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  hoursToFix: number;
  costIfIgnored: number;
}

interface Category {
  name: string;
  score: number;
  icon: string;
  issues: Issue[];
}

interface Consequence {
  icon: string;
  title: string;
  description: string;
}

interface AnalysisReport {
  id: string;
  token: string;
  website_url: string;
  site_name: string;
  overall_score: number;
  total_issues: number;
  critical_issues: number;
  warning_issues: number;
  info_issues: number;
  total_hours: number;
  hourly_rate: number;
  monthly_loss: number;
  current_revenue: number;
  projected_revenue: number;
  categories: Category[];
  consequences: Consequence[];
  created_at: string;
  viewed_at: string | null;
}

export default function AnalysisReportPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (token) {
      fetchReport(token);
    }
  }, [token]);

  const fetchReport = async (reportToken: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.functions.invoke('get-analysis-report', {
        body: { token: reportToken }
      });

      if (fetchError) throw fetchError;

      if (data?.error) {
        setError(data.error);
        return;
      }

      if (data?.report) {
        setReport(data.report);
        // Auto-expand first category with critical issues
        const firstCritical = data.report.categories?.find((c: Category) => 
          c.issues?.some((i: Issue) => i.severity === 'critical')
        );
        if (firstCritical) {
          setExpandedCategories(new Set([firstCritical.name]));
        }
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Report konnte nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const downloadPDF = async () => {
    if (!report) return;
    
    toast.info('PDF-Export wird vorbereitet...');
    
    // Simple PDF generation using print
    const printContent = document.getElementById('report-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Website-Analyse: ${report.site_name}</title>
              <style>
                body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                h1 { color: #1a1a1a; }
                h2 { color: #333; margin-top: 30px; }
                .score { font-size: 48px; font-weight: bold; }
                .critical { color: #ef4444; }
                .warning { color: #f59e0b; }
                .info { color: #3b82f6; }
                .issue { border: 1px solid #e5e5e5; padding: 15px; margin: 10px 0; border-radius: 8px; }
                .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
                .metric { text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; }
              </style>
            </head>
            <body>
              <h1>Website-Analyse: ${report.site_name}</h1>
              <p>Erstellt am: ${new Date(report.created_at).toLocaleDateString('de-CH')}</p>
              
              <div class="metrics">
                <div class="metric">
                  <div class="score ${report.overall_score >= 60 ? '' : 'critical'}">${report.overall_score}</div>
                  <div>Gesamtscore</div>
                </div>
                <div class="metric">
                  <div style="font-size: 24px; font-weight: bold;">${report.total_issues}</div>
                  <div>Gefundene Probleme</div>
                </div>
                <div class="metric">
                  <div style="font-size: 24px; font-weight: bold;" class="critical">CHF ${report.monthly_loss.toLocaleString()}</div>
                  <div>Monatlicher Verlust</div>
                </div>
              </div>

              <h2>Kritische Probleme (${report.critical_issues})</h2>
              ${report.categories.flatMap(c => 
                c.issues.filter(i => i.severity === 'critical').map(i => `
                  <div class="issue">
                    <strong class="critical">${i.title}</strong>
                    <p>${i.description}</p>
                    <small>Aufwand: ${i.hoursToFix}h | Kosten bei Ignorieren: CHF ${i.costIfIgnored}/Monat</small>
                  </div>
                `)
              ).join('')}

              <h2>Warnungen (${report.warning_issues})</h2>
              ${report.categories.flatMap(c => 
                c.issues.filter(i => i.severity === 'warning').map(i => `
                  <div class="issue">
                    <strong class="warning">${i.title}</strong>
                    <p>${i.description}</p>
                  </div>
                `)
              ).join('')}

              <h2>Business Impact</h2>
              <p>Aktueller geschätzter Umsatz: CHF ${report.current_revenue.toLocaleString()}/Monat</p>
              <p>Potentieller Umsatz nach Optimierung: CHF ${report.projected_revenue.toLocaleString()}/Monat</p>
              <p><strong>Mögliche Umsatzsteigerung: CHF ${(report.projected_revenue - report.current_revenue).toLocaleString()}/Monat</strong></p>

              <h2>Geschätzter Aufwand für DIY</h2>
              <p>Gesamtstunden: ${report.total_hours}h</p>
              <p>Bei CHF ${report.hourly_rate}/h = CHF ${(report.total_hours * report.hourly_rate).toLocaleString()}</p>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Analyse wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-semibold">Report nicht gefunden</h2>
            <p className="text-muted-foreground">
              {error || 'Der angeforderte Report existiert nicht oder ist abgelaufen.'}
            </p>
            <Button onClick={() => navigate('/')}>
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div id="report-content" className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Badge variant="secondary" className="mb-2">
              Erstellt am {new Date(report.created_at).toLocaleDateString('de-CH')}
            </Badge>
            <h1 className="text-3xl font-bold">
              Website-Analyse: {report.site_name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <ExternalLink className="h-4 w-4" />
              {report.website_url}
            </p>
          </div>
          <Button onClick={downloadPDF} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Als PDF exportieren
          </Button>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="md:col-span-1">
            <CardContent className="pt-6 text-center">
              <div className={cn("text-5xl font-bold mb-2", getScoreColor(report.overall_score))}>
                {report.overall_score}
              </div>
              <p className="text-sm text-muted-foreground">Gesamtscore</p>
              <Progress 
                value={report.overall_score} 
                className={cn("mt-3 h-2", getScoreBgColor(report.overall_score))}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-red-500">{report.critical_issues}</div>
              <p className="text-sm text-muted-foreground">Kritische Probleme</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow-500">{report.warning_issues}</div>
              <p className="text-sm text-muted-foreground">Warnungen</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-500">{report.info_issues}</div>
              <p className="text-sm text-muted-foreground">Hinweise</p>
            </CardContent>
          </Card>
        </div>

        {/* Cost of Inaction */}
        <Card className="mb-8 border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Kosten des Nichtstuns
            </CardTitle>
            <CardDescription>
              Was Sie jeden Monat verlieren, wenn diese Probleme nicht behoben werden
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-background rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold text-red-500">
                  CHF {report.monthly_loss.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Monatlicher Verlust</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">
                  {report.total_hours}+ Stunden
                </div>
                <p className="text-sm text-muted-foreground">DIY-Aufwand zur Behebung</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">
                  CHF {(report.monthly_loss * 12).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Jährlicher Verlust</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consequences */}
        {report.consequences && report.consequences.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Konsequenzen bei Ignorieren</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.consequences.map((consequence, index) => {
                  const IconComponent = iconMap[consequence.icon] || AlertTriangle;
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <IconComponent className="h-6 w-6 mb-2 text-red-500" />
                      <h4 className="font-semibold">{consequence.title}</h4>
                      <p className="text-sm text-muted-foreground">{consequence.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Before vs After */}
        <Card className="mb-8 border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingDown className="h-5 w-5 rotate-180" />
              Ihr Potential nach Optimierung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center p-6 bg-background rounded-lg flex-1">
                <p className="text-sm text-muted-foreground mb-2">Aktuell geschätzt</p>
                <div className="text-3xl font-bold">
                  CHF {report.current_revenue.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">pro Monat</p>
              </div>
              <ArrowRight className="h-8 w-8 text-green-500 hidden md:block" />
              <div className="text-center p-6 bg-green-500/10 rounded-lg flex-1 border-2 border-green-500/30">
                <p className="text-sm text-muted-foreground mb-2">Nach Optimierung</p>
                <div className="text-3xl font-bold text-green-600">
                  CHF {report.projected_revenue.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">pro Monat</p>
                <Badge className="mt-2 bg-green-500">
                  +{Math.round(((report.projected_revenue - report.current_revenue) / report.current_revenue) * 100)}% Wachstum
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold">Detaillierte Analyse</h2>
          
          {report.categories?.map((category) => {
            const IconComponent = iconMap[category.icon] || FileText;
            const isExpanded = expandedCategories.has(category.name);
            const criticalCount = category.issues?.filter(i => i.severity === 'critical').length || 0;
            
            return (
              <Collapsible key={category.name} open={isExpanded} onOpenChange={() => toggleCategory(category.name)}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            category.score >= 80 ? "bg-green-500/10 text-green-500" :
                            category.score >= 60 ? "bg-yellow-500/10 text-yellow-500" :
                            "bg-red-500/10 text-red-500"
                          )}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <CardDescription>
                              {category.issues?.length || 0} Probleme gefunden
                              {criticalCount > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                  {criticalCount} kritisch
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={cn("text-2xl font-bold", getScoreColor(category.score))}>
                              {category.score}
                            </div>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {category.issues?.map((issue, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "p-4 rounded-lg border",
                            getSeverityStyles(issue.severity)
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <h4 className="font-semibold">{issue.title}</h4>
                              <p className="text-sm opacity-80 mt-1">{issue.description}</p>
                              <div className="flex flex-wrap gap-4 mt-3 text-xs">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Aufwand: {issue.hoursToFix}h
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  Kosten bei Ignorieren: CHF {issue.costIfIgnored}/Monat
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-background rounded-lg">
                <h3 className="text-xl font-bold mb-2">Wir machen es für dich</h3>
                <p className="text-muted-foreground mb-4">
                  Lass unsere Experten alle Probleme professionell beheben
                </p>
                <div className="text-3xl font-bold text-primary mb-2">
                  Ab CHF 2'990
                </div>
                <p className="text-sm text-muted-foreground mb-4">Einmalig, inkl. 3 Monate Support</p>
                <Button size="lg" className="w-full" onClick={() => navigate('/kontakt')}>
                  Angebot anfordern
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-center p-6 bg-background rounded-lg opacity-70">
                <h3 className="text-xl font-bold mb-2">DIY (Do It Yourself)</h3>
                <p className="text-muted-foreground mb-4">
                  Behebe die Probleme selbst mit unserer Anleitung
                </p>
                <div className="text-3xl font-bold mb-2">
                  {report.total_hours}+ Stunden
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Wert: CHF {(report.total_hours * report.hourly_rate).toLocaleString()}
                </p>
                <Button size="lg" variant="outline" className="w-full" disabled>
                  Nicht empfohlen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

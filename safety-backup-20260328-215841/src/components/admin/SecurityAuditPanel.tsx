/**
 * Security Audit Panel - Phase 5 Launch Security Review
 * Displays security check results and recommendations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  runSecurityAudit, 
  SECURITY_CATEGORIES,
  SECURITY_TIPS,
  type SecurityAuditReport,
  type SecurityCheck 
} from '@/lib/security-audit';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const statusConfig = {
  pass: { 
    icon: CheckCircle2, 
    color: 'text-green-500', 
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    label: 'Bestanden' 
  },
  warn: { 
    icon: AlertTriangle, 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    label: 'Warnung' 
  },
  fail: { 
    icon: XCircle, 
    color: 'text-red-500', 
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Fehlgeschlagen' 
  },
  pending: { 
    icon: RefreshCw, 
    color: 'text-muted-foreground', 
    bg: 'bg-muted/50',
    border: 'border-muted',
    label: 'Ausstehend' 
  },
};

const severityColors = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-blue-500 text-white',
};

export function SecurityAuditPanel() {
  const [report, setReport] = useState<SecurityAuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const runAudit = async () => {
    setLoading(true);
    try {
      const result = await runSecurityAudit();
      setReport(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <ShieldCheck className="h-8 w-8 text-green-500" />;
    if (score >= 70) return <Shield className="h-8 w-8 text-yellow-500" />;
    if (score >= 50) return <ShieldAlert className="h-8 w-8 text-orange-500" />;
    return <ShieldX className="h-8 w-8 text-red-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  // Group checks by category
  const checksByCategory = report?.checks.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, SecurityCheck[]>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Security Audit</h2>
            <p className="text-muted-foreground">Phase 5: Sicherheitsüberprüfung</p>
          </div>
        </div>
        <Button onClick={runAudit} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Audit starten
        </Button>
      </div>

      {report && (
        <>
          {/* Overall Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                {getScoreIcon(report.overallScore)}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-4xl font-bold ${getScoreColor(report.overallScore)}`}>
                      {report.overallScore}%
                    </span>
                    <span className="text-muted-foreground">Security Score</span>
                  </div>
                  <Progress value={report.overallScore} className="h-2" />
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{report.passCount}</div>
                    <div className="text-muted-foreground">Bestanden</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{report.warnCount}</div>
                    <div className="text-muted-foreground">Warnungen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{report.failCount}</div>
                    <div className="text-muted-foreground">Fehler</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Issues */}
          {report.criticalIssues.length > 0 && (
            <Card className="border-red-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <ShieldX className="h-5 w-5" />
                  Kritische Probleme ({report.criticalIssues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.criticalIssues.map((issue) => (
                    <div 
                      key={issue.id}
                      className="p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={severityColors.critical}>Kritisch</Badge>
                        <span className="font-medium">{issue.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.details}</p>
                      {issue.recommendation && (
                        <p className="text-sm mt-2 font-mono bg-muted/50 p-2 rounded">
                          💡 {issue.recommendation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Checks by Category */}
          <div className="space-y-4">
            {Object.entries(SECURITY_CATEGORIES).map(([categoryKey, categoryMeta]) => {
              const checks = checksByCategory[categoryKey] || [];
              const passCount = checks.filter((c) => c.status === 'pass').length;
              const isExpanded = expandedCategories.has(categoryKey);

              return (
                <Collapsible key={categoryKey} open={isExpanded}>
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleCategory(categoryKey)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{categoryMeta.icon}</span>
                            <div>
                              <CardTitle className="text-base">{categoryMeta.label}</CardTitle>
                              <p className="text-sm text-muted-foreground">{categoryMeta.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">
                              {passCount}/{checks.length} bestanden
                            </Badge>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {checks.map((check) => {
                            const config = statusConfig[check.status];
                            const StatusIcon = config.icon;

                            return (
                              <div 
                                key={check.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg} ${config.border}`}
                              >
                                <StatusIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium">{check.name}</span>
                                    <Badge className={severityColors[check.severity]} variant="secondary">
                                      {check.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{check.description}</p>
                                  {check.details && (
                                    <p className="text-sm mt-1 opacity-80">{check.details}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>

          {/* Security Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💡 Security Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {SECURITY_TIPS.map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Timestamp */}
          <p className="text-xs text-muted-foreground text-center">
            Letzter Scan: {report.timestamp.toLocaleString('de-CH')}
          </p>
        </>
      )}
    </div>
  );
}

export default SecurityAuditPanel;

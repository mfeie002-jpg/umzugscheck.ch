import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, FileText, Image } from "lucide-react";

interface TestResult {
  title: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  file: string;
  error?: string;
}

interface TestSuite {
  suites: Array<{
    title: string;
    specs: Array<{
      title: string;
      ok: boolean;
      tests: Array<{
        status: string;
        duration: number;
        errors?: Array<{ message: string }>;
      }>;
    }>;
  }>;
  stats: {
    expected: number;
    unexpected: number;
    skipped: number;
    duration: number;
  };
}

export default function TestReport() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState({ passed: 0, failed: 0, skipped: 0, duration: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/test-results/results.json")
      .then((res) => {
        if (!res.ok) throw new Error("Results file not found");
        return res.json();
      })
      .then((data: TestSuite) => {
        const parsed: TestResult[] = [];
        
        data.suites?.forEach((suite) => {
          suite.specs?.forEach((spec) => {
            spec.tests?.forEach((test) => {
              parsed.push({
                title: spec.title,
                status: test.status === "expected" ? "passed" : test.status === "skipped" ? "skipped" : "failed",
                duration: test.duration || 0,
                file: suite.title,
                error: test.errors?.[0]?.message,
              });
            });
          });
        });

        setResults(parsed);
        setStats({
          passed: data.stats?.expected || parsed.filter((r) => r.status === "passed").length,
          failed: data.stats?.unexpected || parsed.filter((r) => r.status === "failed").length,
          skipped: data.stats?.skipped || parsed.filter((r) => r.status === "skipped").length,
          duration: data.stats?.duration || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground">Lade Test-Ergebnisse...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <FileText className="w-5 h-5" />
                Keine Test-Ergebnisse gefunden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Die Datei <code className="bg-muted px-2 py-1 rounded">/test-results/results.json</code> wurde nicht gefunden.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                <p className="text-foreground mb-2"># Tests lokal ausführen:</p>
                <p className="text-primary">npx playwright test e2e/all-20-funnels.spec.ts</p>
                <p className="text-muted-foreground mt-2"># Dann results.json nach public/test-results/ kopieren</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const passRate = stats.passed + stats.failed > 0 
    ? Math.round((stats.passed / (stats.passed + stats.failed)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              E2E Test Report
            </h1>
            <p className="text-muted-foreground">
              Playwright Test-Ergebnisse für alle 20 Funnels
            </p>
          </div>
          <Badge 
            variant={passRate === 100 ? "success" : passRate >= 80 ? "default" : "destructive"}
            className="text-lg px-4 py-2"
          >
            {passRate}% Passed
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
                  <p className="text-sm text-muted-foreground">Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.skipped}</p>
                  <p className="text-sm text-muted-foreground">Skipped</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{(stats.duration / 1000).toFixed(1)}s</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Keine Tests gefunden
                </p>
              ) : (
                results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      result.status === "passed"
                        ? "bg-green-500/5 border-green-500/20"
                        : result.status === "failed"
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-muted/50 border-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.status === "passed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : result.status === "failed" ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{result.title}</p>
                        <p className="text-sm text-muted-foreground">{result.file}</p>
                        {result.error && (
                          <p className="text-xs text-red-500 mt-1 font-mono">
                            {result.error.slice(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {result.duration}ms
                      </span>
                      <a
                        href={`/test-results/all-20-funnel-${idx + 1}-landing.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Image className="w-4 h-4" />
                        Screenshot
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

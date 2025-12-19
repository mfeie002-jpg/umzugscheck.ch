import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, Bug, Download, ExternalLink, AlertTriangle, XCircle } from "lucide-react";

interface ErrorEvent {
  id: string;
  type: 'javascript' | 'network' | 'console' | 'crash';
  message: string;
  page: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  browser: string;
  resolved: boolean;
}

const MOCK_ERRORS: ErrorEvent[] = [
  { id: "e1", type: "javascript", message: "TypeError: Cannot read property 'map' of undefined", page: "/preisrechner", count: 45, firstSeen: "2024-01-10", lastSeen: "2024-01-15", browser: "Chrome 120", resolved: false },
  { id: "e2", type: "network", message: "Failed to fetch: /api/companies", page: "/firmen", count: 12, firstSeen: "2024-01-14", lastSeen: "2024-01-15", browser: "Safari 17", resolved: false },
  { id: "e3", type: "console", message: "Warning: Each child should have a unique 'key' prop", page: "/umzugsfirmen/zuerich", count: 230, firstSeen: "2024-01-01", lastSeen: "2024-01-15", browser: "All", resolved: false },
  { id: "e4", type: "javascript", message: "ReferenceError: analytics is not defined", page: "/", count: 8, firstSeen: "2024-01-13", lastSeen: "2024-01-14", browser: "Firefox 121", resolved: true },
  { id: "e5", type: "crash", message: "Out of memory error", page: "/preisrechner", count: 2, firstSeen: "2024-01-12", lastSeen: "2024-01-12", browser: "Safari Mobile", resolved: true },
];

export function ErrorTracking() {
  const [errors] = useState<ErrorEvent[]>(MOCK_ERRORS);

  const activeErrors = errors.filter(e => !e.resolved).length;
  const totalOccurrences = errors.reduce((sum, e) => sum + e.count, 0);

  const exportErrors = () => {
    const blob = new Blob([JSON.stringify({ 
      errors, 
      activeErrors, 
      totalOccurrences,
      exported: new Date().toISOString() 
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-tracking-${Date.now()}.json`;
    a.click();
  };

  const getTypeIcon = (type: ErrorEvent['type']) => {
    switch (type) {
      case 'javascript': return <Bug className="h-4 w-4 text-red-500" />;
      case 'network': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'console': return <AlertOctagon className="h-4 w-4 text-yellow-500" />;
      case 'crash': return <XCircle className="h-4 w-4 text-red-700" />;
    }
  };

  const getTypeBadge = (type: ErrorEvent['type']) => {
    const variants: Record<ErrorEvent['type'], 'destructive' | 'secondary' | 'outline' | 'default'> = {
      'javascript': 'destructive',
      'network': 'secondary',
      'console': 'outline',
      'crash': 'destructive',
    };
    return variants[type] || 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Error Tracking
        </CardTitle>
        <CardDescription>JavaScript-Fehler und Exceptions überwachen</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Aktive Fehler</p>
            <p className="text-3xl font-bold text-red-600">{activeErrors}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Occurrences</p>
            <p className="text-3xl font-bold">{totalOccurrences}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Behoben</p>
            <p className="text-3xl font-bold text-green-600">{errors.filter(e => e.resolved).length}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-center">
            <Button variant="outline" size="sm" onClick={exportErrors}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Error List */}
        <div className="space-y-3">
          {errors.sort((a, b) => b.count - a.count).map((error) => (
            <div key={error.id} className={`border rounded-lg p-4 ${error.resolved ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-2">
                  {getTypeIcon(error.type)}
                  <div>
                    <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded break-all">
                      {error.message}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">
                      auf {error.page} · {error.browser}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getTypeBadge(error.type)}>{error.type}</Badge>
                  {error.resolved && <Badge variant="outline" className="bg-green-50">Behoben</Badge>}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex gap-4">
                  <span><strong>{error.count}</strong> Occurrences</span>
                  <span>Erste: {error.firstSeen}</span>
                  <span>Letzte: {error.lastSeen}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { SecurityChecks } from '@/hooks/useSecurityHeaders';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';

interface SecurityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  icon: React.ReactNode;
}

export function SecurityDashboard() {
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { fingerprint, isBot, riskScore, confidence } = useDeviceFingerprint();

  const runSecurityChecks = () => {
    setIsLoading(true);
    
    const newChecks: SecurityCheck[] = [];
    
    // HTTPS Check
    const isSecure = SecurityChecks.isSecureContext();
    newChecks.push({
      name: 'HTTPS-Verbindung',
      status: isSecure ? 'pass' : 'fail',
      description: isSecure 
        ? 'Sichere verschlüsselte Verbindung aktiv' 
        : 'Unsichere HTTP-Verbindung erkannt',
      icon: isSecure ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />,
    });

    // Cookies Check
    const cookiesEnabled = SecurityChecks.areCookiesEnabled();
    newChecks.push({
      name: 'Cookies',
      status: cookiesEnabled ? 'pass' : 'warning',
      description: cookiesEnabled 
        ? 'Cookies sind aktiviert' 
        : 'Cookies sind deaktiviert',
      icon: cookiesEnabled ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />,
    });

    // LocalStorage Check
    const storageAvailable = SecurityChecks.isLocalStorageAvailable();
    newChecks.push({
      name: 'Lokaler Speicher',
      status: storageAvailable ? 'pass' : 'warning',
      description: storageAvailable 
        ? 'LocalStorage verfügbar' 
        : 'LocalStorage nicht verfügbar',
      icon: storageAvailable ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />,
    });

    // IFrame Check
    const inIframe = SecurityChecks.isInIframe();
    newChecks.push({
      name: 'IFrame-Schutz',
      status: inIframe ? 'warning' : 'pass',
      description: inIframe 
        ? 'Seite wird in einem IFrame geladen' 
        : 'Seite wird direkt geladen',
      icon: inIframe ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />,
    });

    // XSS Check
    const hasXSS = SecurityChecks.hasXSSInURL();
    newChecks.push({
      name: 'XSS-Schutz',
      status: hasXSS ? 'fail' : 'pass',
      description: hasXSS 
        ? 'Möglicher XSS-Angriff in URL erkannt' 
        : 'Keine XSS-Bedrohungen erkannt',
      icon: hasXSS ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />,
    });

    // Bot Detection
    newChecks.push({
      name: 'Bot-Erkennung',
      status: isBot ? 'fail' : 'pass',
      description: isBot 
        ? 'Automatisiertes Verhalten erkannt' 
        : 'Menschliches Verhalten bestätigt',
      icon: isBot ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />,
    });

    // Risk Score
    newChecks.push({
      name: 'Risikobewertung',
      status: riskScore > 50 ? 'fail' : riskScore > 20 ? 'warning' : 'pass',
      description: `Risiko-Score: ${riskScore}/100`,
      icon: riskScore > 50 
        ? <ShieldAlert className="h-4 w-4" /> 
        : riskScore > 20 
          ? <AlertTriangle className="h-4 w-4" /> 
          : <ShieldCheck className="h-4 w-4" />,
    });

    setChecks(newChecks);
    
    // Calculate overall score
    const { score: secScore } = SecurityChecks.getSecurityScore();
    const adjustedScore = Math.round((secScore + (100 - riskScore)) / 2);
    setScore(adjustedScore);
    
    setIsLoading(false);
  };

  useEffect(() => {
    // Wait for fingerprint to load
    if (fingerprint) {
      runSecurityChecks();
    }
  }, [fingerprint, isBot, riskScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Ausgezeichnet';
    if (score >= 60) return 'Gut';
    if (score >= 40) return 'Verbesserungsbedarf';
    return 'Kritisch';
  };

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Bestanden</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Warnung</Badge>;
      case 'fail':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Fehler</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sicherheits-Dashboard
            </CardTitle>
            <CardDescription>
              Übersicht der Sicherheitsprüfungen
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runSecurityChecks}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Sicherheits-Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}/100
            </span>
          </div>
          <Progress value={score} className="h-2" />
          <p className={`text-sm mt-2 ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </p>
        </div>

        {/* Device Info */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-2">
          <h4 className="text-sm font-medium">Geräte-Identifikation</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Fingerprint:</span>
              <code className="ml-2 px-2 py-0.5 bg-background rounded text-xs">
                {fingerprint?.hash?.substring(0, 12) || '...'}
              </code>
            </div>
            <div>
              <span className="text-muted-foreground">Konfidenz:</span>
              <span className="ml-2">{confidence}%</span>
            </div>
          </div>
        </div>

        {/* Security Checks */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Sicherheitsprüfungen</h4>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {checks.map((check, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      {check.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{check.name}</p>
                      <p className="text-xs text-muted-foreground">{check.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

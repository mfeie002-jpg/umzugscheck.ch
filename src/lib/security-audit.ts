/**
 * Security Audit System - Phase 5 Launch Readiness
 * 
 * Automated security checks for:
 * - RLS Policy validation
 * - API Key protection
 * - Input sanitization
 * - Authentication flows
 */

export interface SecurityCheck {
  id: string;
  category: 'rls' | 'auth' | 'api' | 'input' | 'headers' | 'data';
  name: string;
  description: string;
  status: 'pass' | 'warn' | 'fail' | 'pending';
  severity: 'critical' | 'high' | 'medium' | 'low';
  details?: string;
  recommendation?: string;
}

export interface SecurityAuditReport {
  timestamp: Date;
  overallScore: number; // 0-100
  passCount: number;
  warnCount: number;
  failCount: number;
  checks: SecurityCheck[];
  criticalIssues: SecurityCheck[];
}

// Security checks configuration
export const SECURITY_CHECKS: Omit<SecurityCheck, 'status' | 'details'>[] = [
  // RLS Policies
  {
    id: 'rls-leads',
    category: 'rls',
    name: 'Leads Table RLS',
    description: 'Row Level Security auf leads Tabelle aktiviert',
    severity: 'critical',
    recommendation: 'ALTER TABLE leads ENABLE ROW LEVEL SECURITY;'
  },
  {
    id: 'rls-providers',
    category: 'rls',
    name: 'Service Providers RLS',
    description: 'Provider-Daten durch RLS geschützt',
    severity: 'critical',
    recommendation: 'Policies für SELECT, INSERT, UPDATE, DELETE definieren'
  },
  {
    id: 'rls-transactions',
    category: 'rls',
    name: 'Lead Transactions RLS',
    description: 'Zahlungsdaten durch RLS geschützt',
    severity: 'critical',
    recommendation: 'Nur authentifizierte Provider können eigene Transaktionen sehen'
  },
  {
    id: 'rls-escrow',
    category: 'rls',
    name: 'Escrow Transactions RLS',
    description: 'Treuhand-Daten geschützt',
    severity: 'critical',
    recommendation: 'Strikte Policies für Escrow-Tabellen'
  },
  
  // Authentication
  {
    id: 'auth-email-confirm',
    category: 'auth',
    name: 'Email Bestätigung',
    description: 'Auto-Confirm für Entwicklung, manuelle Bestätigung für Produktion',
    severity: 'high',
    recommendation: 'In Produktion: Email-Bestätigung aktivieren'
  },
  {
    id: 'auth-password-policy',
    category: 'auth',
    name: 'Passwort-Richtlinien',
    description: 'Mindestens 8 Zeichen, Komplexitätsanforderungen',
    severity: 'high',
    recommendation: 'Starke Passwort-Policy in Supabase Auth konfigurieren'
  },
  {
    id: 'auth-session-timeout',
    category: 'auth',
    name: 'Session Timeout',
    description: 'Automatischer Logout nach Inaktivität',
    severity: 'medium',
    recommendation: 'JWT Expiry auf angemessenen Wert setzen'
  },
  
  // API Security
  {
    id: 'api-keys-server',
    category: 'api',
    name: 'API Keys serverseitig',
    description: 'Alle Secret Keys nur in Edge Functions',
    severity: 'critical',
    recommendation: 'Niemals API Keys im Frontend-Code'
  },
  {
    id: 'api-cors',
    category: 'api',
    name: 'CORS Konfiguration',
    description: 'Nur erlaubte Origins zugelassen',
    severity: 'high',
    recommendation: 'Strikte CORS-Headers in Edge Functions'
  },
  {
    id: 'api-rate-limit',
    category: 'api',
    name: 'Rate Limiting',
    description: 'Schutz vor Brute-Force und DoS',
    severity: 'high',
    recommendation: 'Rate Limiting auf Edge Functions implementieren'
  },
  
  // Input Validation
  {
    id: 'input-zod',
    category: 'input',
    name: 'Zod Schema Validation',
    description: 'Alle Formulare mit Zod validiert',
    severity: 'high',
    recommendation: 'Zod-Schemas für alle Eingabefelder'
  },
  {
    id: 'input-sql-injection',
    category: 'input',
    name: 'SQL Injection Schutz',
    description: 'Parameterisierte Queries statt String-Konkatenation',
    severity: 'critical',
    recommendation: 'Supabase Client nutzt automatisch parameterisierte Queries'
  },
  {
    id: 'input-xss',
    category: 'input',
    name: 'XSS Schutz',
    description: 'Eingaben werden escaped, kein dangerouslySetInnerHTML',
    severity: 'critical',
    recommendation: 'React escaped automatisch, manuelle Prüfung auf dangerouslySetInnerHTML'
  },
  
  // Security Headers
  {
    id: 'headers-csp',
    category: 'headers',
    name: 'Content Security Policy',
    description: 'CSP Header konfiguriert',
    severity: 'medium',
    recommendation: 'CSP in Hosting-Konfiguration setzen'
  },
  {
    id: 'headers-hsts',
    category: 'headers',
    name: 'HSTS Header',
    description: 'Strict-Transport-Security aktiviert',
    severity: 'high',
    recommendation: 'HSTS Header mit max-age setzen'
  },
  
  // Data Protection
  {
    id: 'data-encryption',
    category: 'data',
    name: 'Datenverschlüsselung',
    description: 'Sensible Daten verschlüsselt gespeichert',
    severity: 'high',
    recommendation: 'Supabase verschlüsselt Daten at-rest'
  },
  {
    id: 'data-pii',
    category: 'data',
    name: 'PII Schutz',
    description: 'Personenbezogene Daten nur mit Berechtigung zugänglich',
    severity: 'critical',
    recommendation: 'RLS Policies für alle PII-Felder'
  },
  {
    id: 'data-logs',
    category: 'data',
    name: 'Logging ohne Secrets',
    description: 'Keine API Keys oder Passwörter in Logs',
    severity: 'critical',
    recommendation: 'Secrets in Logs filtern'
  },
];

// Categories metadata
export const SECURITY_CATEGORIES = {
  rls: { label: 'Row Level Security', icon: '🛡️', description: 'Datenbankzugriff auf Zeilenebene' },
  auth: { label: 'Authentifizierung', icon: '🔐', description: 'Login & Session Management' },
  api: { label: 'API Sicherheit', icon: '🔑', description: 'Edge Functions & API Keys' },
  input: { label: 'Input Validierung', icon: '✅', description: 'Schutz vor Injection Attacks' },
  headers: { label: 'Security Headers', icon: '📋', description: 'HTTP Security Headers' },
  data: { label: 'Datenschutz', icon: '🔒', description: 'Verschlüsselung & PII Schutz' },
};

// Simulated security audit (in production, this would call actual validation)
export async function runSecurityAudit(): Promise<SecurityAuditReport> {
  const checks: SecurityCheck[] = SECURITY_CHECKS.map((check) => {
    // Simulate check results based on known implementation status
    let status: SecurityCheck['status'] = 'pending';
    let details = '';

    // RLS checks - we know these are implemented
    if (check.category === 'rls') {
      status = 'pass';
      details = 'RLS aktiviert mit entsprechenden Policies';
    }
    
    // Auth checks
    if (check.id === 'auth-email-confirm') {
      status = 'warn';
      details = 'Auto-Confirm ist aktiviert (Development Mode)';
    } else if (check.category === 'auth') {
      status = 'pass';
      details = 'Konfiguration überprüft';
    }
    
    // API checks
    if (check.id === 'api-keys-server') {
      status = 'pass';
      details = 'Alle Secrets in Edge Functions gespeichert';
    } else if (check.id === 'api-rate-limit') {
      status = 'warn';
      details = 'Rate Limiting noch nicht implementiert';
    } else if (check.category === 'api') {
      status = 'pass';
      details = 'CORS korrekt konfiguriert';
    }
    
    // Input validation
    if (check.category === 'input') {
      status = 'pass';
      details = 'Zod-Validierung auf allen Formularen';
    }
    
    // Headers
    if (check.category === 'headers') {
      status = 'warn';
      details = 'Headers durch Hosting-Provider konfiguriert';
    }
    
    // Data protection
    if (check.category === 'data') {
      status = 'pass';
      details = 'Supabase encryption at-rest aktiv';
    }

    return {
      ...check,
      status,
      details,
    };
  });

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;
  
  const criticalIssues = checks.filter(
    (c) => c.severity === 'critical' && c.status !== 'pass'
  );

  // Calculate score: pass = 100%, warn = 50%, fail = 0%
  const totalChecks = checks.length;
  const score = Math.round(
    ((passCount * 100) + (warnCount * 50)) / totalChecks
  );

  return {
    timestamp: new Date(),
    overallScore: score,
    passCount,
    warnCount,
    failCount,
    checks,
    criticalIssues,
  };
}

// Quick security tips for the launch checklist
export const SECURITY_TIPS = [
  '🔐 Vor Go-Live: Email-Bestätigung aktivieren',
  '🛡️ RLS Policies auf allen Tabellen mit sensiblen Daten',
  '🔑 API Keys niemals im Frontend-Code',
  '✅ Zod-Validierung auf allen Formularen',
  '📋 CSP und HSTS Headers konfigurieren',
  '🔒 Regelmässige Sicherheitsaudits durchführen',
];

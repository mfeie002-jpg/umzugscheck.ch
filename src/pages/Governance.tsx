import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Scale, AlertTriangle, CheckCircle2, 
  XCircle, ChevronDown, ChevronRight, FileText, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── Collapsible ───
const Collapsible = ({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 p-3 text-left hover:bg-white/5 transition-colors min-h-[44px]">
        {open ? <ChevronDown className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />}
        <span className="text-sm font-semibold text-white/90">{title}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="p-3 pt-0 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Claim Tracker Data ───
const CLAIMS = [
  { claim: 'Neutraler Marktplatz für Schweizer Umzugsfirmen', status: 'sicher', evidence: 'Plattform-Architektur belegt', risk: 'Nur gültig bei sauberem SaaS-Pivot' },
  { claim: 'AI-gestützte Preisberechnung', status: 'sicher', evidence: 'Calculator-Engine live', risk: 'Genauigkeit nicht validiert' },
  { claim: '20+ optimierte Conversion-Funnels', status: 'sicher', evidence: 'Flow-Analyse-System dokumentiert', risk: 'Conversion Rates unbekannt' },
  { claim: 'Zero CAC durch organischen Traffic', status: 'vorsichtig', evidence: 'Theoretisch via SEO möglich', risk: 'Kein organischer Traffic nachgewiesen' },
  { claim: 'CPL von CHF 20–40', status: 'nicht-verwenden', evidence: 'Keine Kampagne gelaufen', risk: 'Reine Projektion ohne Datenbasis' },
  { claim: '40–45% DB-Marge', status: 'nicht-verwenden', evidence: 'Keine operative Kostenbasis', risk: 'Kann bei DD sofort zerlegt werden' },
  { claim: 'Führende Schweizer Umzugsplattform', status: 'toxisch', evidence: 'Null Marktanteil', risk: 'UWG-Risiko, sofortige Glaubwürdigkeitsverlust' },
  { claim: 'CHF 3M Revenue in 24 Monaten', status: 'toxisch', evidence: 'Keine Revenue-Basis', risk: 'Fantasy-Projektion, Investor-Dealbreaker' },
];

const CONFLICT_POLICIES = [
  {
    title: 'Interessenkonflikt: Portal vs. Eigenausführung',
    description: 'Umzugscheck.ch als neutraler Marktplatz darf Feierabendservices.ch nicht bevorzugen.',
    rules: [
      'Feierabend erhält KEINEN bevorzugten Zugang zu Leads',
      'Gleiches Ranking-Scoring für alle Provider',
      'Kein Cherry-Picking: Feierabend wird wie jeder andere Partner behandelt',
      'Transparente Offenlegung der Verbindung in AGBs',
    ],
    status: 'offen',
  },
  {
    title: 'Preissetzung & Angebotsgestaltung',
    description: 'Fixpreise dürfen nicht durch KI allein bestimmt werden.',
    rules: [
      'HITL-Pflicht: Jede KI-generierte Offerte braucht manuelle Freigabe',
      'Keine automatische Preisunterbietung von Partnern',
      'Transparente Kalkulations-Logik dokumentiert',
      'Vierteljährliche Preis-Audits',
    ],
    status: 'offen',
  },
  {
    title: 'Datenverwendung & Datenschutz',
    description: 'Lead-Daten aus dem Marktplatz dürfen nicht exklusiv für Eigeninteressen genutzt werden.',
    rules: [
      'Keine Verwendung von Partner-Leads für Feierabend-Akquise',
      'Getrennte Datensilos für Marktplatz vs. Eigengeschäft',
      'DSGVO/DSG-konforme Datenverarbeitung',
      'Jährliche Datenschutz-Audits',
    ],
    status: 'offen',
  },
];

const claimStatusConfig: Record<string, { label: string; className: string }> = {
  'sicher': { label: 'SICHER', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  'vorsichtig': { label: 'VORSICHTIG', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  'nicht-verwenden': { label: 'NICHT VERWENDEN', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  'toxisch': { label: 'TOXISCH', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const Governance = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/data-room" className="text-white/50 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" /> Governance & Compliance
            </h1>
            <p className="text-[10px] sm:text-xs text-white/40">Claim Tracker · Interessenkonflikt-Policies · Compliance-Status</p>
          </div>
          <Badge variant="outline" className="border-red-500/30 text-red-400 text-[10px]">
            <AlertTriangle className="w-3 h-3 mr-1" /> ACTION REQUIRED
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Claim Tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400 shrink-0" />
                Claim Tracker — Pitch-Aussagen-Ampel
              </CardTitle>
              <p className="text-xs text-white/40">Jede Aussage im Pitch wird hier auf Belegbarkeit geprüft und kategorisiert.</p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 w-full flex flex-wrap h-auto gap-1 p-1">
                  <TabsTrigger value="all" className="text-[10px] sm:text-xs data-[state=active]:bg-white/10 flex-1 min-w-[60px]">Alle</TabsTrigger>
                  <TabsTrigger value="sicher" className="text-[10px] sm:text-xs data-[state=active]:bg-emerald-500/20 flex-1 min-w-[60px]">Sicher</TabsTrigger>
                  <TabsTrigger value="vorsichtig" className="text-[10px] sm:text-xs data-[state=active]:bg-yellow-500/20 flex-1 min-w-[60px]">Vorsichtig</TabsTrigger>
                  <TabsTrigger value="toxisch" className="text-[10px] sm:text-xs data-[state=active]:bg-red-500/20 flex-1 min-w-[60px]">Toxisch</TabsTrigger>
                </TabsList>
                {['all', 'sicher', 'vorsichtig', 'nicht-verwenden', 'toxisch'].map((tab) => (
                  <TabsContent key={tab} value={tab} className="space-y-2 mt-3">
                    {CLAIMS.filter(c => tab === 'all' || c.status === tab).map((claim, i) => {
                      const config = claimStatusConfig[claim.status];
                      return (
                        <div key={i} className="border border-white/10 rounded-lg p-3 space-y-2">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="text-xs sm:text-sm font-medium text-white flex-1">{claim.claim}</p>
                            <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded border shrink-0 ${config.className}`}>
                              {config.label}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="bg-white/[0.02] rounded p-2">
                              <p className="text-[10px] text-white/40 font-bold mb-0.5">EVIDENZ</p>
                              <p className="text-xs text-white/60">{claim.evidence}</p>
                            </div>
                            <div className="bg-red-500/5 rounded p-2">
                              <p className="text-[10px] text-red-400 font-bold mb-0.5">RISIKO</p>
                              <p className="text-xs text-white/60">{claim.risk}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conflict-of-Interest Policies */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                Interessenkonflikt-Policies
              </CardTitle>
              <p className="text-xs text-white/40">Governance-Regelwerk zur Lösung des Hybrid-Modell-Konflikts</p>
            </CardHeader>
            <CardContent className="space-y-3 px-3 sm:px-6">
              {CONFLICT_POLICIES.map((policy, i) => (
                <Collapsible key={i} title={policy.title} defaultOpen={i === 0}>
                  <p className="text-xs text-white/60 mb-3">{policy.description}</p>
                  <div className="space-y-1.5">
                    {policy.rules.map((rule, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-white/70">{rule}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 bg-red-500/5 border border-red-500/15 rounded p-2">
                    <p className="text-[10px] text-red-400 font-bold">STATUS: {policy.status.toUpperCase()} — Governance-Dokument muss formalisiert werden</p>
                  </div>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Checklist */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-sm sm:text-base text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400 shrink-0" />
                Compliance Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 px-3 sm:px-6">
              {[
                { item: 'GAV-Compliance-Gutachten für Feierabend-Modell', done: false },
                { item: 'UWG Art. 3 Prüfung (Täuschungsverbot)', done: false },
                { item: 'DSG/DSGVO Datenschutz-Audit', done: false },
                { item: 'Arbeitsrechtliche Prüfung (Scheinselbständigkeit)', done: false },
                { item: 'Handelsregistereintrag aktuell', done: false },
                { item: 'Impressum & AGB vollständig', done: true },
                { item: 'Datenschutzerklärung publiziert', done: true },
                { item: 'SSL/TLS Verschlüsselung aktiv', done: true },
                { item: 'RLS-Policies auf allen Tabellen', done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-white/[0.02] transition-colors">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span className={`text-xs sm:text-sm ${item.done ? 'text-white/60' : 'text-white/80 font-medium'}`}>{item.item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
          <p className="text-xs text-white/30">Governance & Compliance · Internes Dokument · Stand: 31. März 2026</p>
          <div className="flex justify-center gap-3 mt-3">
            <Link to="/data-room" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">← Data Room</Link>
            <Link to="/feedback" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Feedback Analysis →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;

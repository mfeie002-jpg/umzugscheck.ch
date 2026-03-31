import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, BarChart3, TrendingUp, Target, AlertTriangle, 
  CheckCircle2, XCircle, Activity, Database, Zap, RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───
interface KPIMetric {
  label: string;
  value: string | number;
  target: string;
  status: 'achieved' | 'on-track' | 'at-risk' | 'not-started';
  phase: string;
  purpose: string;
}

interface FunnelField {
  field: string;
  description: string;
  source: string;
  status: 'live' | 'partial' | 'missing';
}

// ─── KPI Dictionary (from /feedback Block 29) ───
const KPI_DICTIONARY: KPIMetric[] = [
  { label: 'CPL (Cost per Lead)', value: '—', target: '< CHF 35', status: 'not-started', phase: 'Proof', purpose: 'Beweist Akquisitionseffizienz' },
  { label: 'Conversion Rate', value: '—', target: '> 3%', status: 'not-started', phase: 'Proof', purpose: 'Beweist Funnel-Qualität' },
  { label: 'AOV (Avg Order Value)', value: 'CHF 553', target: '> CHF 500', status: 'on-track', phase: 'Proof', purpose: 'Beweist Marktpreisfähigkeit' },
  { label: 'DB-Marge', value: '—', target: '> 25%', status: 'not-started', phase: 'Repeatability', purpose: 'Beweist Unit Economics' },
  { label: 'CAC Payback', value: '—', target: '< 60 Tage', status: 'not-started', phase: 'Repeatability', purpose: 'Beweist Kapitaleffizienz' },
  { label: 'B2B Partner Active', value: '0', target: '≥ 5', status: 'not-started', phase: 'Scale', purpose: 'Beweist Netzwerkeffekt' },
  { label: 'NPS Score', value: '—', target: '> 40', status: 'not-started', phase: 'Scale', purpose: 'Beweist Kundenzufriedenheit' },
];

// ─── Source-of-Truth Funnel Fields ───
const FUNNEL_FIELDS: FunnelField[] = [
  { field: 'Lead-ID', description: 'Eindeutige Kennung pro Lead', source: 'leads.id', status: 'live' },
  { field: 'Quelle', description: 'Traffic-Quelle (UTM, Direct, Organic)', source: 'conversion_events.utm_source', status: 'live' },
  { field: 'Landingpage', description: 'Einstiegsseite des Users', source: 'conversion_events.page_url', status: 'live' },
  { field: 'Serviceart', description: 'Umzug, Reinigung, Entsorgung, etc.', source: 'leads.calculator_type', status: 'live' },
  { field: 'Region', description: 'Von/Nach PLZ + Kanton', source: 'leads.from_postal / to_postal', status: 'live' },
  { field: 'Leadstatus', description: 'Neu, Qualifiziert, Zugewiesen', source: 'leads.status', status: 'live' },
  { field: 'Routingstatus', description: 'Provider-Matching-Ergebnis', source: 'leads.assigned_provider_ids', status: 'live' },
  { field: 'Angebotsstatus', description: 'Offerte erstellt/versendet', source: 'lead_transactions.status', status: 'partial' },
  { field: 'Auftrag', description: 'Konvertiert ja/nein', source: 'lead_transactions.conversion_status', status: 'partial' },
  { field: 'Umsatz', description: 'Tatsächlicher Auftragswert', source: 'lead_transactions.actual_job_value', status: 'partial' },
  { field: 'DB (Deckungsbeitrag)', description: 'Umsatz minus direkte Kosten', source: 'Berechnung', status: 'missing' },
];

// ─── Status styling ───
const statusStyles = {
  'achieved': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'on-track': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'at-risk': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'not-started': 'bg-white/10 text-white/40 border-white/20',
};

const fieldStatusStyles = {
  'live': 'bg-emerald-500/20 text-emerald-400',
  'partial': 'bg-yellow-500/20 text-yellow-400',
  'missing': 'bg-red-500/20 text-red-400',
};

const ProofEngine = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalEvents: 0,
    totalProviders: 0,
    totalTransactions: 0,
    avgEstimate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [leadsRes, eventsRes, providersRes, transactionsRes] = await Promise.all([
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('conversion_events').select('id', { count: 'exact', head: true }),
          supabase.from('service_providers').select('id', { count: 'exact', head: true }).eq('verification_status', 'approved'),
          supabase.from('lead_transactions').select('id, amount', { count: 'exact' }),
        ]);
        
        setStats({
          totalLeads: leadsRes.count || 0,
          totalEvents: eventsRes.count || 0,
          totalProviders: providersRes.count || 0,
          totalTransactions: transactionsRes.count || 0,
          avgEstimate: 0,
        });
      } catch (e) {
        console.error('Error fetching stats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/feedback" className="text-white/50 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-black text-white">Proof Engine</h1>
            <p className="text-[10px] sm:text-xs text-white/40">Messmaschine · Live KPIs · Source-of-Truth Funnel</p>
          </div>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
            <Activity className="w-3 h-3 mr-1" /> LIVE
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Live Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Leads Total', value: stats.totalLeads, icon: Target, color: 'text-blue-400' },
            { label: 'Conversion Events', value: stats.totalEvents, icon: Zap, color: 'text-amber-400' },
            { label: 'Active Providers', value: stats.totalProviders, icon: Database, color: 'text-emerald-400' },
            { label: 'Transactions', value: stats.totalTransactions, icon: TrendingUp, color: 'text-violet-400' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white/[0.03] border-white/10">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color} shrink-0`} />
                  <span className="text-[10px] sm:text-xs text-white/40 truncate">{stat.label}</span>
                </div>
                <p className={`text-xl sm:text-2xl font-black ${stat.color}`}>
                  {loading ? '...' : stat.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* KPI Dictionary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400 shrink-0" />
                KPI Dictionary
              </CardTitle>
              <p className="text-xs text-white/40">7 Kern-KPIs mit Zielwerten, Status und Zuordnung zur Proof-Phase</p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="space-y-2">
                {KPI_DICTIONARY.map((kpi) => (
                  <div key={kpi.label} className="border border-white/10 rounded-lg p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">{kpi.label}</span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] rounded border ${statusStyles[kpi.status]}`}>
                          {kpi.status === 'achieved' ? '✓' : kpi.status === 'on-track' ? '→' : kpi.status === 'at-risk' ? '!' : '○'} {kpi.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30 bg-white/5 rounded px-1.5 py-0.5">{kpi.phase}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-white/40">Aktuell: </span>
                        <span className="text-white/80 font-medium">{kpi.value}</span>
                      </div>
                      <div>
                        <span className="text-white/40">Ziel: </span>
                        <span className="text-emerald-400 font-medium">{kpi.target}</span>
                      </div>
                      <div className="text-white/50 italic">{kpi.purpose}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Source-of-Truth Funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400 shrink-0" />
                Source-of-Truth Funnel — 11 Pflichtfelder
              </CardTitle>
              <p className="text-xs text-white/40">Jedes Feld muss lückenlos erfasst werden, um CPL und Unit Economics berechnen zu können.</p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="space-y-1.5">
                {FUNNEL_FIELDS.map((f, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 border border-white/5 rounded-lg p-2.5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-2 sm:w-40 shrink-0">
                      <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] rounded font-bold ${fieldStatusStyles[f.status]}`}>
                        {f.status === 'live' ? '●' : f.status === 'partial' ? '◐' : '○'} {f.status.toUpperCase()}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white">{f.field}</span>
                    </div>
                    <div className="flex-1 text-xs text-white/50">{f.description}</div>
                    <div className="text-[10px] text-white/30 font-mono truncate">{f.source}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-amber-500/5 border border-amber-500/15 rounded-lg p-3">
                <p className="text-xs text-amber-400 font-bold mb-1">⚠ Proof-Readiness</p>
                <p className="text-xs text-white/60">
                  {FUNNEL_FIELDS.filter(f => f.status === 'live').length}/{FUNNEL_FIELDS.length} Felder live · 
                  {FUNNEL_FIELDS.filter(f => f.status === 'missing').length} fehlend · 
                  Ohne vollständige Erfassung ist keine valide CPL-Berechnung möglich.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Staged Financing Logic */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                Staged Financing Logic — 3 Tranchen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-3 sm:px-6">
              {[
                { tranche: 'Tranche 1: Proof', amount: 'CHF 80k', condition: 'CPL < 35, CR > 3%, 50 Leads', gate: 'Unit Economics validiert', color: 'emerald' },
                { tranche: 'Tranche 2: Repeatability', amount: 'CHF 120k', condition: 'DB > 25%, 5 Partner aktiv, NPS > 40', gate: 'Skalierbare Mechanik bewiesen', color: 'blue' },
                { tranche: 'Tranche 3: Controlled Scale', amount: 'CHF 250k', condition: '3 Kantone, CM2 > 30%, Churn < 5%', gate: 'Multi-Region-Playbook validiert', color: 'violet' },
              ].map((t) => (
                <div key={t.tranche} className={`border border-${t.color}-500/20 bg-${t.color}-500/5 rounded-lg p-3 space-y-2`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-sm font-bold text-${t.color}-400`}>{t.tranche}</span>
                    <span className="text-xs font-bold text-white/80 bg-white/10 rounded px-2 py-0.5">{t.amount}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-white/40">Bedingungen: </span>
                      <span className="text-white/70">{t.condition}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Gate: </span>
                      <span className="text-white/70">{t.gate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
          <p className="text-xs text-white/30">Proof Engine · Datenquelle: Live-Datenbank · Letzte Aktualisierung: Echtzeit</p>
          <div className="flex justify-center gap-3 mt-3">
            <Link to="/feedback" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">← Feedback Analysis</Link>
            <Link to="/data-room" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Data Room →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofEngine;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, FolderOpen, FileText, Shield, BarChart3, 
  CheckCircle2, XCircle, Lock, Eye, Download, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface DataRoomItem {
  category: string;
  documents: { name: string; status: 'ready' | 'draft' | 'missing'; description: string }[];
}

const DATA_ROOM: DataRoomItem[] = [
  {
    category: '📊 Finanzen & Unit Economics',
    documents: [
      { name: 'Pro-Forma P&L (12 Monate)', status: 'missing', description: 'Projektion basierend auf validierten CPL und Conversion' },
      { name: 'Unit Economics Sheet', status: 'missing', description: 'CAC, LTV, DB-Marge, Payback Period' },
      { name: 'Cashflow-Planung', status: 'missing', description: 'Monatliche Mittelverwendung und Runway' },
      { name: 'Cap Table', status: 'missing', description: 'Aktionärsstruktur, ESOP-Pool, Bewertung' },
    ],
  },
  {
    category: '📈 Traction & Proof',
    documents: [
      { name: 'Traffic Analytics Report', status: 'missing', description: 'Google Analytics / Search Console Daten' },
      { name: 'Funnel Conversion Data', status: 'draft', description: 'Conversion Rates pro Funnel-Step' },
      { name: 'Lead Quality Report', status: 'draft', description: 'Lead-Scoring-Verteilung und Qualitätsmetriken' },
      { name: 'Customer Testimonials', status: 'missing', description: 'Mindestens 5 verifizierte Kundenstimmen' },
    ],
  },
  {
    category: '⚖️ Legal & Compliance',
    documents: [
      { name: 'Handelsregisterauszug', status: 'missing', description: 'Aktueller Auszug (< 3 Monate)' },
      { name: 'GAV-Compliance-Gutachten', status: 'missing', description: 'Arbeitsrechtliche Prüfung Feierabend-Modell' },
      { name: 'AGB & Datenschutzerklärung', status: 'ready', description: 'DSGVO/DSG-konform' },
      { name: 'Shareholder Agreement', status: 'missing', description: 'Aktionärsbindungsvertrag' },
    ],
  },
  {
    category: '🏗️ Produkt & Technologie',
    documents: [
      { name: 'Plattform-Architektur', status: 'ready', description: 'System-Übersicht, Tech-Stack, Integrationen' },
      { name: 'Feature Roadmap', status: 'draft', description: 'Priorisierte Feature-Pipeline' },
      { name: 'Flow Analysis Reports', status: 'ready', description: 'UX-Scoring aller 20 Funnels' },
      { name: 'Security & Data Protection', status: 'draft', description: 'RLS-Policies, Auth-System, Encryption' },
    ],
  },
  {
    category: '🤝 Markt & Wettbewerb',
    documents: [
      { name: 'TAM/SAM/SOM Analyse', status: 'missing', description: 'Marktgrössen mit Primärdaten belegt' },
      { name: 'Competitive Landscape', status: 'draft', description: 'Movu, Movu Pro, lokale Anbieter, Differenzierung' },
      { name: 'B2B Partner Pipeline', status: 'missing', description: 'LOIs, Verträge, Pipeline-Status' },
    ],
  },
];

const statusConfig = {
  ready: { icon: CheckCircle2, label: 'Bereit', className: 'text-emerald-400 bg-emerald-500/10' },
  draft: { icon: Clock, label: 'Entwurf', className: 'text-yellow-400 bg-yellow-500/10' },
  missing: { icon: XCircle, label: 'Fehlt', className: 'text-red-400 bg-red-500/10' },
};

const DataRoom = () => {
  const [liveMetrics, setLiveMetrics] = useState({ leads: 0, providers: 0, funnels: 20 });

  useEffect(() => {
    const fetchMetrics = async () => {
      const [leadsRes, providersRes] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('service_providers').select('id', { count: 'exact', head: true }).eq('verification_status', 'approved'),
      ]);
      setLiveMetrics({ leads: leadsRes.count || 0, providers: providersRes.count || 0, funnels: 20 });
    };
    fetchMetrics();
  }, []);

  const totalDocs = DATA_ROOM.reduce((sum, cat) => sum + cat.documents.length, 0);
  const readyDocs = DATA_ROOM.reduce((sum, cat) => sum + cat.documents.filter(d => d.status === 'ready').length, 0);
  const missingDocs = DATA_ROOM.reduce((sum, cat) => sum + cat.documents.filter(d => d.status === 'missing').length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/proof-engine" className="text-white/50 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> Investor Data Room
            </h1>
            <p className="text-[10px] sm:text-xs text-white/40">Vertraulich · Nur für autorisierte Investoren</p>
          </div>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-[10px]">
            <Shield className="w-3 h-3 mr-1" /> CONFIDENTIAL
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Readiness Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="bg-white/[0.03] border-white/10">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-black text-white">{totalDocs}</p>
                <p className="text-[10px] text-white/40">Dokumente Total</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-black text-emerald-400">{readyDocs}</p>
                <p className="text-[10px] text-emerald-400/60">Bereit</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-black text-red-400">{missingDocs}</p>
                <p className="text-[10px] text-red-400/60">Fehlen</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-black text-blue-400">{Math.round((readyDocs / totalDocs) * 100)}%</p>
                <p className="text-[10px] text-blue-400/60">Completion</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Live Platform Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-r from-blue-500/5 to-violet-500/5 border-blue-500/20">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" /> Live Platform Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-black text-blue-400">{liveMetrics.leads}</p>
                  <p className="text-[10px] text-white/40">Total Leads</p>
                </div>
                <div>
                  <p className="text-xl font-black text-emerald-400">{liveMetrics.providers}</p>
                  <p className="text-[10px] text-white/40">Verified Providers</p>
                </div>
                <div>
                  <p className="text-xl font-black text-violet-400">{liveMetrics.funnels}</p>
                  <p className="text-[10px] text-white/40">Active Funnels</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Document Categories */}
        {DATA_ROOM.map((category, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-sm sm:text-base text-white">{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 px-3 sm:px-6">
                {category.documents.map((doc, j) => {
                  const config = statusConfig[doc.status];
                  const Icon = config.icon;
                  return (
                    <div key={j} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${doc.status === 'ready' ? 'text-emerald-400' : doc.status === 'draft' ? 'text-yellow-400' : 'text-red-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium text-white">{doc.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${config.className}`}>{config.label}</span>
                        </div>
                        <p className="text-[11px] text-white/40 mt-0.5">{doc.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Investor Readiness Checklist */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-sm sm:text-base text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                5-Phasen Investor Readiness Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 sm:px-6">
              {[
                { phase: '1. Vor Gespräch', items: ['Pitch Deck finalisiert', 'One-Pager erstellt', 'Ask definiert (CHF 80k)'], status: 'partial' },
                { phase: '2. Vor Due Diligence', items: ['Data Room vollständig', 'Unit Economics validiert', 'Cap Table aktuell'], status: 'not-ready' },
                { phase: '3. Vor Datenraum', items: ['Legal Docs komplett', 'Financial Projections belegt', 'Team-Struktur dokumentiert'], status: 'not-ready' },
                { phase: '4. Vor Skalierung', items: ['Proof of Concept: 50 Leads', 'B2B Partner: 5 aktiv', 'Positive Unit Economics'], status: 'not-ready' },
                { phase: '5. Vor Storytelling', items: ['Customer Stories dokumentiert', 'Press Kit bereit', 'Social Proof aufgebaut'], status: 'not-ready' },
              ].map((p) => (
                <div key={p.phase} className="border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${p.status === 'partial' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                    <span className="text-xs sm:text-sm font-bold text-white">{p.phase}</span>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {p.items.map((item, k) => (
                      <li key={k} className="text-xs text-white/50 flex items-center gap-1.5">
                        <XCircle className="w-3 h-3 text-white/20 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
          <p className="text-xs text-white/30">Data Room · Stand: 31. März 2026 · Vertraulich</p>
          <div className="flex justify-center gap-3 mt-3">
            <Link to="/proof-engine" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">← Proof Engine</Link>
            <Link to="/governance" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Governance →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRoom;

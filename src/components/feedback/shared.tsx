import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

// ─── Reveal (ScrollReveal animation wrapper) ───
export const Reveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
);

// ─── StatusBadge (evidence status) ───
const STATUS_STYLES: Record<string, string> = {
  'BEWIESEN': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'PLAUSIBEL': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'NICHT BELEGT': 'bg-red-500/20 text-red-400 border-red-500/30',
  'REINE ANNAHME': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'RISIKO': 'bg-red-600/20 text-red-300 border-red-600/30',
  'KRITISCHE LÜCKE': 'bg-red-700/20 text-red-300 border-red-700/30',
  'LÜCKE': 'bg-red-700/20 text-red-300 border-red-700/30',
  'ANNAHME': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'INVESTOREN-RISIKO': 'bg-red-600/20 text-red-300 border-red-600/30',
  'OFFEN': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'IN ARBEIT': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded border ${STATUS_STYLES[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
    {status}
  </span>
);

// ─── ScoreCell (color-coded score display) ───
export const ScoreCell = ({ score }: { score: number }) => {
  const color = score <= 3 ? 'text-red-400 bg-red-500/10' : score <= 6 ? 'text-yellow-400 bg-yellow-500/10' : 'text-emerald-400 bg-emerald-500/10';
  return <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${color}`}>{score}</span>;
};

// ─── SeverityBar (visual severity indicator) ───
export const SeverityBar = ({ level, max = 5 }: { level: number; max?: number }) => (
  <div className="flex gap-1 items-center">
    {Array.from({ length: max }).map((_, i) => (
      <div key={i} className={`w-3 h-3 rounded-sm ${i < level ? (level >= 4 ? 'bg-red-500' : level >= 3 ? 'bg-orange-500' : 'bg-yellow-500') : 'bg-white/10'}`} />
    ))}
    <span className="text-xs text-white/40 ml-1">{level}/{max}</span>
  </div>
);

// ─── Collapsible (animated accordion) ───
export const Collapsible = ({ title, children, defaultOpen = false, icon: Icon }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ComponentType<{ className?: string }>;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-teal-400" />}
          <span className="font-semibold text-sm text-white">{title}</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── SectionHeader (consistent section titles) ───
export const SectionHeader = ({ icon: Icon, title, number }: {
  icon: React.ComponentType<{ className?: string }>; title: string; number: string;
}) => (
  <div className="flex items-center gap-3">
    <Icon className="w-6 h-6 text-rose-400" />
    <h3 className="text-xl font-bold text-white">{number} — {title}</h3>
  </div>
);

// ─── SolutionCard (Problem → Zielbild → Umsetzung pattern) ───
export const SolutionCard = ({ problem, target, steps, ai, human, proof }: {
  problem: string; target: string; steps: string[]; ai: string; human: string; proof: string;
}) => (
  <div className="space-y-3">
    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
      <p className="text-xs text-red-300 font-bold">Problem</p>
      <p className="text-xs text-white/60">{problem}</p>
    </div>
    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
      <p className="text-xs text-emerald-300 font-bold">Zielbild</p>
      <p className="text-xs text-white/60">{target}</p>
    </div>
    <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
      <p className="text-xs text-white/80 font-bold">Umsetzung</p>
      <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
        {steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs pt-2 border-t border-white/5">
        <span className="text-cyan-400">🤖 KI: {ai}</span>
        <span className="text-orange-400">👤 Mensch: {human}</span>
      </div>
      <p className="text-xs text-emerald-400">✓ Beweis danach: {proof}</p>
    </div>
  </div>
);

// ─── ChecklistItem ───
export const ChecklistItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2">
    <span className="mt-0.5 w-4 h-4 border border-white/20 rounded flex-shrink-0 text-center text-[8px] leading-4">☐</span>
    <span>{text}</span>
  </li>
);

// ─── RiskCard ───
export const RiskCard = ({ title, desc, why, prob, sev, badge, indicator, mitigation }: {
  title: string; desc: string; why: string; prob: number; sev: number; badge: string; indicator: string; mitigation?: string;
}) => (
  <div className="bg-white/5 border border-red-500/20 rounded-lg p-4 space-y-2">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-white/60">{desc}</p>
      </div>
      <StatusBadge status={badge} />
    </div>
    <p className="text-xs text-red-300"><strong>Warum kritisch:</strong> {why}</p>
    <div className="flex items-center gap-4 text-xs text-white/50">
      <span className="flex items-center gap-1">Eintritt: <SeverityBar level={prob} /></span>
      <span className="flex items-center gap-1">Schwere: <SeverityBar level={sev} /></span>
    </div>
    <p className="text-xs text-white/40"><strong>Frühindikator:</strong> {indicator}</p>
    {mitigation && <p className="text-xs text-cyan-400/70"><strong>Mitigation:</strong> {mitigation}</p>}
  </div>
);

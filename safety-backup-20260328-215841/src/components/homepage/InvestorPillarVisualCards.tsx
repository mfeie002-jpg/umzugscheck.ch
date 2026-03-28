/**
 * Investor Pillar Visual Cards - Premium Edition
 * Business infographic-style cards with generated images
 * Professional pitch deck style with financials, margins, and AI automation
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, Zap, ChevronDown, ArrowRight, DollarSign, 
  Percent, Cpu, BarChart3, PieChart, Target, Rocket,
  LineChart, Building2, Crown
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Import generated Investor images
import invAiVision from "@/assets/investor/inv-1-ai-vision.jpg";
import invFintech from "@/assets/investor/inv-2-fintech.jpg";
import invPricing from "@/assets/investor/inv-3-pricing.jpg";
import invB2b from "@/assets/investor/inv-4-b2b.jpg";
import invApi from "@/assets/investor/inv-5-api.jpg";
import invPartnerOs from "@/assets/investor/inv-6-partner-os.jpg";
import invInsurance from "@/assets/investor/inv-7-insurance.jpg";
import invCircular from "@/assets/investor/inv-8-circular.jpg";
import invData from "@/assets/investor/inv-9-data.jpg";
import invLean from "@/assets/investor/inv-10-lean.jpg";

// Investor Pillars with detailed financials
const investorPillarsVisual = [
  {
    id: 1,
    image: invAiVision,
    title: "Computer Vision Asset",
    subtitle: "AI Acquisition Engine",
    tagline: "Tech-Monopol",
    concept: "Proprietäre Datenbasis aus Millionen Videos – unser Computer-Vision-Modell erkennt Inventar präziser als jeder Mensch.",
    financials: {
      revenue: "20 CHF/Scan",
      savings: "150 CHF Besichtigungs-Kosten gespart",
      margin: "CAC -80%"
    },
    revenueModel: "Lizenzgebühr pro Scan + Firmen-Pakete",
    moat: "Trainingsdaten-Monopol: Jedes Video macht die KI besser. Wettbewerber starten bei Null.",
    aiAutomation: 100,
    color: "from-blue-600 to-cyan-500",
    bgColor: "bg-slate-900",
    accentColor: "text-cyan-400"
  },
  {
    id: 2,
    image: invFintech,
    title: "Fintech & Escrow",
    subtitle: "Cashflow-Hebel",
    tagline: "Geldfluss-Kontrolle",
    concept: "Wir kontrollieren den gesamten Geldfluss (GMV). Wir sind nicht nur Makler – wir sind die Bank der Branche.",
    financials: {
      revenue: "30 CHF/Transaktion",
      savings: "2'000 CHF Float pro Umzug",
      margin: "1.5% Take-Rate"
    },
    revenueModel: "Transaktionsgebühr + Float-Rendite + Zinseinnahmen",
    moat: "Zero Leakage: Geld fliesst nur durch uns. Kein Weg vorbei.",
    aiAutomation: 95,
    color: "from-green-600 to-emerald-500",
    bgColor: "bg-slate-900",
    accentColor: "text-emerald-400"
  },
  {
    id: 3,
    image: invPricing,
    title: "Dynamic Pricing Engine",
    subtitle: "Yield Management",
    tagline: "Surge Pricing",
    concept: "Wir diktieren Marktpreise basierend auf Angebot/Nachfrage – wie Uber Surge Pricing, aber für Umzüge.",
    financials: {
      revenue: "15-25% Take-Rate",
      savings: "+10% Umsatz in Peak",
      margin: "Variable Marge"
    },
    revenueModel: "Standard: 15% | Peak-Zeiten: 20-25% | Last-Minute: Premium",
    moat: "Preismacht: Wir kennen Angebot & Nachfrage in Echtzeit besser als der Markt.",
    aiAutomation: 100,
    color: "from-orange-600 to-amber-500",
    bgColor: "bg-slate-900",
    accentColor: "text-amber-400"
  },
  {
    id: 4,
    image: invB2b,
    title: "B2B / HR-Relocation Suite",
    subtitle: "Enterprise SaaS",
    tagline: "High-Value LTV",
    concept: "SaaS-Plattform für HR-Abteilungen (Expat-Umzüge). Ein Firmenkunde = Hunderte Umzüge pro Jahr.",
    financials: {
      revenue: "500 CHF/Monat + 3'000 CHF/Umzug",
      savings: "HR spart 5h pro Relocation",
      margin: "LTV >50'000 CHF"
    },
    revenueModel: "Abo-Modell + Provision pro Umzug + Premium-Support",
    moat: "Integration: Einmal angebunden, nie wieder gewechselt. Hohe Switching-Costs.",
    aiAutomation: 90,
    color: "from-violet-600 to-purple-500",
    bgColor: "bg-slate-900",
    accentColor: "text-purple-400"
  },
  {
    id: 5,
    image: invApi,
    title: "Bureaucracy API Layer",
    subtitle: "Recurring Revenue",
    tagline: "Behörden-Schnittstelle",
    concept: "Direkte API-Anbindung an Gemeinden, Versorger, Versicherer. Schwer zu kopieren, schwer zu umgehen.",
    financials: {
      revenue: "49 CHF/Kunde",
      savings: "100 CHF Affiliate (Telco/Strom)",
      margin: "95% Marge"
    },
    revenueModel: "Service-Fee + Affiliate-Provisionen (Telco, Strom, Versicherung)",
    moat: "API-Lock-in: Jahre an Integrationsarbeit. Behörden wechseln Partner nicht leichtfertig.",
    aiAutomation: 99,
    color: "from-pink-600 to-rose-500",
    bgColor: "bg-slate-900",
    accentColor: "text-rose-400"
  },
  {
    id: 6,
    image: invPartnerOs,
    title: "Partner Operating System",
    subtitle: "Vendor Lock-in SaaS",
    tagline: "Betriebssystem",
    concept: "Umzugsfirmen nutzen unsere Software für Disposition, Routing, Abrechnung. Wechselkosten extrem hoch.",
    financials: {
      revenue: "99 CHF MRR",
      savings: "225 CHF/Umzug Provision",
      margin: "90% SaaS-Marge"
    },
    revenueModel: "Monatliches SaaS-Abo + Transaktions-Provision",
    moat: "Vendor Lock-in: Firmen organisieren ihren Alltag mit uns. Wechsel = Chaos.",
    aiAutomation: 90,
    color: "from-cyan-600 to-blue-500",
    bgColor: "bg-slate-900",
    accentColor: "text-blue-400"
  },
  {
    id: 7,
    image: invInsurance,
    title: "Micro-Insurance",
    subtitle: "Insurtech Margin",
    tagline: "Sekundengenaue Policen",
    concept: "Versicherungspolicen basierend auf Video-Daten. Wir kennen das Risiko besser als jede Versicherung.",
    financials: {
      revenue: "50-99 CHF/Police",
      savings: "Schadenquote <20%",
      margin: "60% Marge"
    },
    revenueModel: "Prämieneinnahme – niedrige Schadenquote = hohe Marge",
    moat: "Daten-Vorteil: Video-Beweis = minimaler Streit. KI bewertet Risiko präzise.",
    aiAutomation: 90,
    color: "from-indigo-600 to-blue-500",
    bgColor: "bg-slate-900",
    accentColor: "text-indigo-400"
  },
  {
    id: 8,
    image: invCircular,
    title: "Circular Economy Hub",
    subtitle: "Pre-Move Disposal",
    tagline: "Doppelte Einnahme",
    concept: "Monetarisierung von Altmöbeln vor dem Umzug. Entsorgungsgebühr + Resale-Provision = doppelter Revenue.",
    financials: {
      revenue: "50-200 CHF Entsorgung",
      savings: "20% Resale-Provision",
      margin: "Dual Revenue"
    },
    revenueModel: "Entsorgungsgebühr + Vermittlung (Ricardo/Tutti) + Recycling-Partner",
    moat: "Pre-Move Window: Einziger Zeitpunkt, wo Leute aussortieren. Wir sind da.",
    aiAutomation: 80,
    color: "from-teal-600 to-emerald-500",
    bgColor: "bg-slate-900",
    accentColor: "text-teal-400"
  },
  {
    id: 9,
    image: invData,
    title: "Relocation Data Intelligence",
    subtitle: "Data Monetization",
    tagline: "Lead-Gold",
    concept: "Wir wissen als Erste, wer wohin zieht, wie kaufkräftig, welche Bedürfnisse. Premium-Daten für Partner.",
    financials: {
      revenue: "50-150 CHF/Lead",
      savings: "3× verkaufbar",
      margin: "100% Digital"
    },
    revenueModel: "Lead-Verkauf an Telco, Versicherung, Möbelhäuser, Banken",
    moat: "First-Mover-Data: Wir wissen von der Adressänderung bevor die Post es weiss.",
    aiAutomation: 100,
    color: "from-rose-600 to-pink-500",
    bgColor: "bg-slate-900",
    accentColor: "text-pink-400"
  },
  {
    id: 10,
    image: invLean,
    title: "Lean Operations",
    subtitle: "Die 95/5 Formel",
    tagline: ">40% EBITDA",
    concept: "Umsatz wächst exponentiell, Headcount bleibt flach. 3 Mitarbeiter für 10'000 Umzüge/Jahr.",
    financials: {
      revenue: "553 CHF/Kunde",
      savings: "~2 Mio CHF/Jahr Personal",
      margin: ">40% EBITDA"
    },
    revenueModel: "95% KI-Automatisierung + 5% strategische Mitarbeiter",
    moat: "Exponential Leverage: Jeder neue Kunde kostet uns fast nichts extra.",
    aiAutomation: 95,
    color: "from-amber-600 to-orange-500",
    bgColor: "bg-slate-900",
    accentColor: "text-orange-400"
  }
];

// Revenue Stacking Summary
const revenueStack = [
  { label: "Basis-Provision", value: 225, color: "bg-blue-500" },
  { label: "Escrow/Fintech", value: 30, color: "bg-green-500" },
  { label: "Versicherung", value: 99, color: "bg-violet-500" },
  { label: "Bürokratie", value: 49, color: "bg-pink-500" },
  { label: "Lead-Verkauf", value: 100, color: "bg-amber-500" },
  { label: "Circular Economy", value: 50, color: "bg-teal-500" }
];

const totalRevenue = revenueStack.reduce((sum, item) => sum + item.value, 0);
const totalCosts = 50;
const profit = totalRevenue - totalCosts;

// Investor Pillar Card Component
const InvestorPillarCard = memo(({ pillar, index }: { pillar: typeof investorPillarsVisual[0]; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: "easeOut" }}
      className={`group relative rounded-3xl overflow-hidden border border-slate-700 ${pillar.bgColor} hover:border-slate-500 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500`}
    >
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pillar.image} 
          alt={pillar.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
          loading="lazy"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-30 mix-blend-overlay`} />
        
        {/* Pillar number */}
        <div className={`absolute top-4 left-4 w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center shadow-xl`}>
          <span className="font-black text-xl text-white">{pillar.id}</span>
        </div>
        
        {/* Tagline badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-600 text-xs font-bold ${pillar.accentColor}`}>
            <Crown className="w-3 h-3" />
            {pillar.tagline}
          </span>
        </div>
        
        {/* AI Automation gauge */}
        <div className="absolute bottom-4 right-4 flex flex-col items-end">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">KI-Grad</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${pillar.color} rounded-full`}
                style={{ width: `${pillar.aiAutomation}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${pillar.accentColor}`}>{pillar.aiAutomation}%</span>
          </div>
        </div>
        
        {/* Title on image */}
        <div className="absolute bottom-4 left-4 right-24">
          <p className="text-xs text-slate-400 font-medium mb-1">{pillar.subtitle}</p>
          <h3 className="text-xl font-black text-white leading-tight">{pillar.title}</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Concept */}
        <p className="text-sm text-slate-300 mb-5 leading-relaxed">
          {pillar.concept}
        </p>
        
        {/* Financial Metrics - 3 boxes */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
            <DollarSign className={`w-4 h-4 mx-auto mb-1 ${pillar.accentColor}`} />
            <p className="text-xs text-slate-500 mb-0.5">Revenue</p>
            <p className={`text-sm font-bold ${pillar.accentColor}`}>{pillar.financials.revenue}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-400" />
            <p className="text-xs text-slate-500 mb-0.5">Savings/Extra</p>
            <p className="text-sm font-bold text-green-400">{pillar.financials.savings}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
            <Percent className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            <p className="text-xs text-slate-500 mb-0.5">Marge/KPI</p>
            <p className="text-sm font-bold text-amber-400">{pillar.financials.margin}</p>
          </div>
        </div>
        
        {/* Revenue Model */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl p-4 mb-4">
          <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">💰 Revenue Model</p>
          <p className="text-sm text-green-300">{pillar.revenueModel}</p>
        </div>

        {/* Expandable Moat section */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-white transition-colors py-2"
        >
          <span className="font-medium flex items-center gap-2">
            <Target className="w-4 h-4" />
            Moat & Wettbewerbsvorteil
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`mt-2 p-4 rounded-xl bg-gradient-to-r ${pillar.color} bg-opacity-20 border border-slate-600`}>
                <p className={`text-sm font-medium ${pillar.accentColor}`}>
                  🏰 {pillar.moat}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

InvestorPillarCard.displayName = 'InvestorPillarCard';

// Revenue Stacking Card
const RevenueStackingCard = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-slate-900 border border-slate-700 rounded-3xl p-8 mb-16"
  >
    <div className="text-center mb-8">
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold mb-4">
        <BarChart3 className="w-4 h-4" />
        Unit Economics Pro Kunde
      </span>
      <h3 className="text-2xl md:text-3xl font-black text-white">Revenue Stacking: {totalRevenue} CHF</h3>
      <p className="text-slate-400 mt-2">Mehrere Einnahmequellen pro Transaktion = maximaler Customer LTV</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8">
      {/* Revenue Bars */}
      <div className="space-y-4">
        {revenueStack.map((item, idx) => (
          <motion.div 
            key={item.label}
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="w-32 text-right text-sm text-slate-400">{item.label}</div>
            <div className="flex-1 bg-slate-800 rounded-full h-8 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(item.value / totalRevenue) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                className={`h-full ${item.color} flex items-center justify-end pr-3`}
              >
                <span className="text-sm font-bold text-white">{item.value} CHF</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Profit Summary */}
      <div className="flex flex-col justify-center">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">Total Revenue</p>
              <p className="text-3xl font-black text-green-400">{totalRevenue} CHF</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">Variable Kosten</p>
              <p className="text-3xl font-black text-red-400">-{totalCosts} CHF</p>
            </div>
          </div>
          
          <div className="border-t border-slate-600 pt-6 text-center">
            <p className="text-sm text-slate-400 mb-2">Contribution Margin pro Kunde</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {profit} CHF
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                +{Math.round((profit / totalCosts) * 100)}% ROI
              </span>
            </div>
            <p className="text-slate-500 mt-2 text-sm">= 10× Profit-Multiple auf variable Kosten</p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

RevenueStackingCard.displayName = 'RevenueStackingCard';

// Main Section Component
export const InvestorPillarVisualCards = memo(() => {
  return (
    <section className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/20 text-violet-400 text-sm font-bold mb-6 border border-violet-500/30">
            <LineChart className="w-4 h-4" />
            10 Säulen für Investoren
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5">
            Die <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Investment-These</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            10 strategische Säulen. Jede mit eigenem Moat, Revenue-Stream und KI-Automation.
            <br />
            <span className="text-white font-semibold">Zusammen: Ein Fintech-Plattform-Monopol im CHF 500 Mio. Markt.</span>
          </p>
        </motion.div>
        
        {/* Key metrics bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 border border-green-700/50 text-green-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            {">"}40% EBITDA-Marge
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-400 text-sm font-medium">
            <Cpu className="w-4 h-4" />
            95% KI-Automatisierung
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/30 border border-amber-700/50 text-amber-400 text-sm font-medium">
            <DollarSign className="w-4 h-4" />
            {profit} CHF Contribution/Kunde
          </div>
        </motion.div>

        {/* Revenue Stacking Summary */}
        <RevenueStackingCard />
        
        {/* Pillar Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {investorPillarsVisual.map((pillar, idx) => (
            <InvestorPillarCard key={pillar.id} pillar={pillar} index={idx} />
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/fuer-firmen">
            <Button size="lg" className="h-16 px-12 text-lg font-black bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105">
              Pitch Deck anfordern
              <Rocket className="ml-3 w-6 h-6" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            Für Investoren, Partner und strategische Allianzen
          </p>
        </motion.div>
      </div>
    </section>
  );
});

InvestorPillarVisualCards.displayName = 'InvestorPillarVisualCards';

export default InvestorPillarVisualCards;

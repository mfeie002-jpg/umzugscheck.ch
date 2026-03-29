/**
 * SEOMarketSizeSection
 * Shows keyword clusters, search volumes, and estimated traffic
 * at different SERP positions for Swiss moving market
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Search, TrendingUp, MapPin, BarChart3,
  Target, Zap, Globe, ArrowRight, Crown
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

// ═══════════════════════════════════════════════════════
// KEYWORD DATA — Based on Swiss Google Ads estimates
// Monthly search volumes (CH market, German-speaking)
// ═══════════════════════════════════════════════════════

interface KeywordCluster {
  category: string;
  icon: typeof Search;
  color: string;
  keywords: { term: string; volume: number }[];
  totalVolume: number;
}

const SERVICE_CLUSTERS: KeywordCluster[] = [
  {
    category: "Umzug & Zügeln",
    icon: MapPin,
    color: "from-blue-500 to-blue-700",
    keywords: [
      { term: "umzugsfirma", volume: 6600 },
      { term: "umzug", volume: 4400 },
      { term: "zügelfirma", volume: 2900 },
      { term: "umzugsunternehmen", volume: 1900 },
      { term: "umzugsofferte", volume: 1300 },
      { term: "umzugskosten", volume: 1000 },
      { term: "umzug kosten schweiz", volume: 720 },
      { term: "günstig umziehen", volume: 590 },
      { term: "umzugsfirma vergleich", volume: 480 },
      { term: "umzugshelfer", volume: 390 },
    ],
    totalVolume: 20_280,
  },
  {
    category: "Reinigung",
    icon: Zap,
    color: "from-emerald-500 to-emerald-700",
    keywords: [
      { term: "endreinigung", volume: 3600 },
      { term: "wohnungsreinigung", volume: 2400 },
      { term: "umzugsreinigung", volume: 1600 },
      { term: "endreinigung kosten", volume: 880 },
      { term: "reinigungsfirma", volume: 720 },
      { term: "abnahmegarantie reinigung", volume: 390 },
    ],
    totalVolume: 9_590,
  },
  {
    category: "Entsorgung & Räumung",
    icon: BarChart3,
    color: "from-amber-500 to-amber-700",
    keywords: [
      { term: "entrümpelung", volume: 2400 },
      { term: "wohnungsräumung", volume: 1300 },
      { term: "sperrgut entsorgen", volume: 880 },
      { term: "möbel entsorgen", volume: 720 },
      { term: "haushaltsauflösung", volume: 590 },
      { term: "räumungsfirma", volume: 390 },
    ],
    totalVolume: 6_280,
  },
  {
    category: "Transport & Lagerung",
    icon: Globe,
    color: "from-violet-500 to-violet-700",
    keywords: [
      { term: "möbeltransport", volume: 1600 },
      { term: "selfstorage", volume: 1300 },
      { term: "lagerraum mieten", volume: 1000 },
      { term: "kleintransport", volume: 720 },
      { term: "möbellift", volume: 480 },
      { term: "klaviertransport", volume: 390 },
    ],
    totalVolume: 5_490,
  },
  {
    category: "Firmenumzug",
    icon: Target,
    color: "from-rose-500 to-rose-700",
    keywords: [
      { term: "büroumzug", volume: 880 },
      { term: "firmenumzug", volume: 720 },
      { term: "geschäftsumzug", volume: 390 },
      { term: "firmenumzug kosten", volume: 260 },
    ],
    totalVolume: 2_250,
  },
];

interface CantonVolume {
  canton: string;
  code: string;
  volume: number;
}

const CANTON_VOLUMES: CantonVolume[] = [
  { canton: "Zürich", code: "ZH", volume: 14_800 },
  { canton: "Bern", code: "BE", volume: 5_400 },
  { canton: "Basel", code: "BS/BL", volume: 3_900 },
  { canton: "Aargau", code: "AG", volume: 3_200 },
  { canton: "Luzern", code: "LU", volume: 2_800 },
  { canton: "St. Gallen", code: "SG", volume: 2_400 },
  { canton: "Genf", code: "GE", volume: 2_100 },
  { canton: "Waadt", code: "VD", volume: 1_900 },
  { canton: "Thurgau", code: "TG", volume: 1_400 },
  { canton: "Solothurn", code: "SO", volume: 1_200 },
  { canton: "Zug", code: "ZG", volume: 1_100 },
  { canton: "Übrige 15", code: "—", volume: 5_600 },
];

const TOTAL_CANTON_VOLUME = CANTON_VOLUMES.reduce((s, c) => s + c.volume, 0);

// CTR estimates by SERP position (Google organic)
const POSITION_CTR = [
  { label: "Position 1–3", ctr: 0.285, color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30" },
  { label: "Position 4–5", ctr: 0.08, color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30" },
  { label: "Position 10", ctr: 0.025, color: "text-red-400", bg: "bg-red-500/20 border-red-500/30" },
];

const TOTAL_MONTHLY = SERVICE_CLUSTERS.reduce((s, c) => s + c.totalVolume, 0);

// Average lead value for traffic estimation
const AVG_LEAD_VALUE_CHF = 53; // from vision page

export function SEOMarketSizeSection({ language }: { language: VisionLanguage }) {
  const isDe = language === "de";

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            <Search className="w-3 h-3 mr-1.5" />
            {isDe ? "SEO Marktgrösse" : "SEO Market Size"}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isDe ? (
              <>43'890+ monatliche Suchanfragen.<br className="hidden sm:block" /> 1 Plattform.</>
            ) : (
              <>43,890+ Monthly Searches.<br className="hidden sm:block" /> 1 Platform.</>
            )}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {isDe
              ? "Der Schweizer Umzugsmarkt generiert zehntausende organische Suchanfragen pro Monat — und niemand dominiert alle Cluster."
              : "The Swiss moving market generates tens of thousands of organic searches per month — and nobody dominates all clusters."}
          </p>
        </motion.div>

        {/* ═══ SERVICE CATEGORY CLUSTERS ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {isDe ? "Keyword-Cluster nach Service" : "Keyword Clusters by Service"}
          </h3>

          <div className="grid gap-4">
            {SERVICE_CLUSTERS.map((cluster, i) => {
              const Icon = cluster.icon;
              return (
                <motion.div
                  key={cluster.category}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card/60 backdrop-blur border border-border/50 rounded-xl p-4 md:p-5"
                >
                  {/* Category header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cluster.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">{cluster.category}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {cluster.keywords.length} Keywords
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        {cluster.totalVolume.toLocaleString("de-CH")}
                      </div>
                      <div className="text-xs text-muted-foreground">/Monat</div>
                    </div>
                  </div>

                  {/* Keywords grid */}
                  <div className="flex flex-wrap gap-2">
                    {cluster.keywords.map((kw) => (
                      <span
                        key={kw.term}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-md text-xs"
                      >
                        <span className="text-foreground/80">{kw.term}</span>
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {kw.volume.toLocaleString("de-CH")}
                        </span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Total bar */}
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold text-foreground">
              {isDe ? "Total über alle Service-Cluster" : "Total across all service clusters"}
            </span>
            <span className="text-2xl font-bold text-primary">
              {TOTAL_MONTHLY.toLocaleString("de-CH")} {isDe ? "Suchen/Monat" : "searches/mo"}
            </span>
          </div>
        </motion.div>

        {/* ═══ CANTON DISTRIBUTION ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {isDe ? "Suchvolumen nach Kanton" : "Search Volume by Canton"}
          </h3>

          <div className="bg-card/60 backdrop-blur border border-border/50 rounded-xl p-5 md:p-6">
            <div className="space-y-3">
              {CANTON_VOLUMES.map((cv, i) => {
                const pct = (cv.volume / CANTON_VOLUMES[0].volume) * 100;
                return (
                  <motion.div
                    key={cv.code}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-16 sm:w-20 text-xs font-mono text-muted-foreground shrink-0">
                      {cv.code}
                    </span>
                    <span className="w-20 sm:w-28 text-sm text-foreground truncate shrink-0">
                      {cv.canton}
                    </span>
                    <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden relative">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.04 }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-16 text-right shrink-0">
                      {cv.volume.toLocaleString("de-CH")}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {isDe ? "Total alle Kantone (lokale Queries)" : "Total all cantons (local queries)"}
              </span>
              <span className="text-lg font-bold text-primary">
                {TOTAL_CANTON_VOLUME.toLocaleString("de-CH")} /Mo
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══ POSITION-BASED TRAFFIC ESTIMATION ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            {isDe ? "Traffic-Potenzial nach SERP-Position" : "Traffic Potential by SERP Position"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {isDe
              ? `Basierend auf ${TOTAL_MONTHLY.toLocaleString("de-CH")} monatlichen Suchanfragen und durchschnittlichen organischen CTR-Werten.`
              : `Based on ${TOTAL_MONTHLY.toLocaleString("de-CH")} monthly searches and average organic CTR rates.`}
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {POSITION_CTR.map((pos, i) => {
              const monthlyClicks = Math.round(TOTAL_MONTHLY * pos.ctr);
              const monthlyLeads = Math.round(monthlyClicks * 0.04); // 4% conversion
              const monthlyRevenue = monthlyLeads * AVG_LEAD_VALUE_CHF;
              return (
                <motion.div
                  key={pos.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`rounded-xl border p-5 ${pos.bg} text-center`}
                >
                  <div className={`text-sm font-semibold mb-3 ${pos.color}`}>
                    {pos.label}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    CTR ~{(pos.ctr * 100).toFixed(1)}%
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {monthlyClicks.toLocaleString("de-CH")}
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    {isDe ? "Klicks/Monat" : "clicks/mo"}
                  </div>

                  <div className="border-t border-border/30 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {isDe ? "Leads (4% CR)" : "Leads (4% CR)"}
                      </span>
                      <span className="font-semibold text-foreground">
                        {monthlyLeads.toLocaleString("de-CH")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {isDe ? "Umsatz/Mo" : "Revenue/mo"}
                      </span>
                      <span className="font-bold text-foreground">
                        CHF {monthlyRevenue.toLocaleString("de-CH")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {isDe ? "Umsatz/Jahr" : "Revenue/yr"}
                      </span>
                      <span className="font-bold text-primary">
                        CHF {(monthlyRevenue * 12).toLocaleString("de-CH")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom insight */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                {isDe ? (
                  <>
                    <strong className="text-foreground">Allein Position 1–3</strong> generiert potenziell{" "}
                    <strong className="text-primary">
                      CHF {(Math.round(TOTAL_MONTHLY * 0.285 * 0.04 * AVG_LEAD_VALUE_CHF * 12)).toLocaleString("de-CH")}
                    </strong>{" "}
                    organischen Umsatz pro Jahr — <em>ohne einen Franken Ad-Spend</em>.
                    Mit 2'110 Gemeinde-Seiten multipliziert sich dieses Potenzial durch den Long-Tail-Effekt um den Faktor 3–5×.
                  </>
                ) : (
                  <>
                    <strong className="text-foreground">Position 1–3 alone</strong> potentially generates{" "}
                    <strong className="text-primary">
                      CHF {(Math.round(TOTAL_MONTHLY * 0.285 * 0.04 * AVG_LEAD_VALUE_CHF * 12)).toLocaleString("de-CH")}
                    </strong>{" "}
                    in organic revenue per year — <em>with zero ad spend</em>.
                    With 2,110 municipality pages, this potential multiplies 3–5× through long-tail effects.
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

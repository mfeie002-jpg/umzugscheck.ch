/**
 * GrowthPRStrategySection
 * Infographic: Das Projekt selbst ist das grösste Marketing-Asset
 * SVG-based, self-explanatory, Infographic-First
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const COLORS = {
  teal: "#008080",
  orange: "#FF6B1A",
  slate: "#475569",
  slateLight: "#94A3B8",
  green: "#22C55E",
  amber: "#F59E0B",
  bg: "#0F172A",
  cardBg: "#1E293B",
  white: "#F8FAFC",
  muted: "#CBD5E1",
  purple: "#8B5CF6",
  blue: "#3B82F6",
};

/* ─── 1. The Story Card ─── */
const StoryInfographic = memo(() => {
  const W = 1000;
  const H = 320;
  const pillars = [
    { emoji: "🤖", label: "95% AI-Built", sub: "KI baut & betreibt\ndie Plattform", color: COLORS.teal },
    { emoji: "🇨🇭", label: "Härtester Markt", sub: "Kompetitivste\nVolkswirtschaft", color: COLORS.orange },
    { emoji: "💰", label: "Reichstes Land", sub: "Höchste Kaufkraft\nweltweit", color: COLORS.amber },
    { emoji: "🏗️", label: "Letzte Analog-Branche", sub: "Umzugsmarkt 2025:\nnoch 90% offline", color: COLORS.green },
    { emoji: "📡", label: "Weltweit Einzigartig", sub: "Kein Vergleichbares\nProjekt existiert", color: COLORS.purple },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <rect width={W} height={H} rx="16" fill={COLORS.bg} />
      <text x={W / 2} y="36" textAnchor="middle" fill={COLORS.white} fontSize="20" fontWeight="800">
        Warum die Welt darüber spricht
      </text>
      <text x={W / 2} y="58" textAnchor="middle" fill={COLORS.muted} fontSize="12">
        Das Projekt selbst ist das grösste Marketing-Asset — die Story schreibt sich selbst
      </text>

      {pillars.map((p, i) => {
        const cx = 100 + i * 180;
        return (
          <g key={i}>
            <rect x={cx - 70} y={80} width={140} height={200} rx="12" fill={COLORS.cardBg} stroke={p.color} strokeWidth="1.5" />
            <text x={cx} y={115} textAnchor="middle" fontSize="28">{p.emoji}</text>
            <text x={cx} y={142} textAnchor="middle" fill={p.color} fontSize="13" fontWeight="800">{p.label}</text>
            {p.sub.split("\n").map((line, j) => (
              <text key={j} x={cx} y={165 + j * 16} textAnchor="middle" fill={COLORS.muted} fontSize="10.5">
                {line}
              </text>
            ))}
            {/* Connecting arrow */}
            {i < pillars.length - 1 && (
              <text x={cx + 85} y={160} textAnchor="middle" fill={COLORS.slateLight} fontSize="16">→</text>
            )}
          </g>
        );
      })}

      <rect x={100} y={H - 35} width={W - 200} height="22" rx="11" fill={COLORS.teal} opacity="0.15" />
      <text x={W / 2} y={H - 20} textAnchor="middle" fill={COLORS.teal} fontSize="11" fontWeight="700">
        → Kombination die es nirgendwo sonst gibt = Medienstory die sich selbst verbreitet
      </text>
    </svg>
  );
});
StoryInfographic.displayName = "StoryInfographic";

/* ─── 2. Outreach Map ─── */
const OutreachMapInfographic = memo(() => {
  const W = 1000;
  const H = 380;

  const targets = [
    { x: 160, y: 130, label: "USA", outlets: "TechCrunch · Wired\nProductHunt · HN", angle: "95% AI-built startup\nin hardest market", color: COLORS.orange, emoji: "🇺🇸" },
    { x: 500, y: 100, label: "EU / DACH", outlets: "t3n · Handelszeitung\nNZZ · Gründerszene", angle: "Letzte analoge Branche\nautomatisiert", color: COLORS.teal, emoji: "🇪🇺" },
    { x: 840, y: 130, label: "JAPAN / ASIA", outlets: "Nikkei · TechNode\nThe Bridge", angle: "How AI solves\nrelocations globally", color: COLORS.purple, emoji: "🇯🇵" },
    { x: 330, y: 280, label: "STARTUP", outlets: "ProductHunt\nY Combinator Blog", angle: "Zero-budget launch\nin premium market", color: COLORS.amber, emoji: "🚀" },
    { x: 670, y: 280, label: "AWARDS", outlets: "Swiss Startup Award\nAI Innovation Prize", angle: "Best Case: KI im\nhärtesten Markt", color: COLORS.green, emoji: "🏆" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <rect width={W} height={H} rx="16" fill={COLORS.bg} />
      <text x={W / 2} y="36" textAnchor="middle" fill={COLORS.white} fontSize="20" fontWeight="800">
        Globaler Outreach-Plan
      </text>
      <text x={W / 2} y="56" textAnchor="middle" fill={COLORS.muted} fontSize="12">
        Jede Region hat einen eigenen Pitch-Angle — KI-Translation in Landessprache
      </text>

      {/* Center hub */}
      <circle cx={W / 2} cy={200} r="30" fill={COLORS.teal} opacity="0.2" stroke={COLORS.teal} strokeWidth="2" />
      <text x={W / 2} y={196} textAnchor="middle" fill={COLORS.white} fontSize="10" fontWeight="700">Umzugs-</text>
      <text x={W / 2} y={210} textAnchor="middle" fill={COLORS.white} fontSize="10" fontWeight="700">check.ch</text>

      {targets.map((t, i) => (
        <g key={i}>
          {/* Connection line to center */}
          <line x1={W / 2} y1={200} x2={t.x} y2={t.y + 20} stroke={t.color} strokeWidth="1" opacity="0.3" strokeDasharray="4 3" />

          {/* Target card */}
          <rect x={t.x - 75} y={t.y - 25} width={150} height={95} rx="10" fill={COLORS.cardBg} stroke={t.color} strokeWidth="1.5" />
          <text x={t.x - 60} y={t.y - 5} fill={COLORS.white} fontSize="12">{t.emoji}</text>
          <text x={t.x - 45} y={t.y - 5} fill={t.color} fontSize="12" fontWeight="800">{t.label}</text>
          {t.outlets.split("\n").map((line, j) => (
            <text key={`o${j}`} x={t.x} y={t.y + 14 + j * 13} textAnchor="middle" fill={COLORS.muted} fontSize="9">{line}</text>
          ))}
          <line x1={t.x - 60} y1={t.y + 38} x2={t.x + 60} y2={t.y + 38} stroke={t.color} strokeWidth="0.5" opacity="0.3" />
          {t.angle.split("\n").map((line, j) => (
            <text key={`a${j}`} x={t.x} y={t.y + 52 + j * 12} textAnchor="middle" fill={t.color} fontSize="8.5" fontWeight="600" fontStyle="italic">{line}</text>
          ))}
        </g>
      ))}
    </svg>
  );
});
OutreachMapInfographic.displayName = "OutreachMapInfographic";

/* ─── 3. Content Flywheel ─── */
const ContentFlywheelInfographic = memo(() => {
  const W = 1000;
  const H = 360;
  const cx = W / 2;
  const cy = 195;
  const r = 115;

  const steps = [
    { angle: -90, label: "Projekt-Story", sub: "95% AI-built", emoji: "📖", color: COLORS.teal },
    { angle: -30, label: "Presse & Medien", sub: "TechCrunch, NZZ", emoji: "📰", color: COLORS.orange },
    { angle: 30, label: "Backlinks", sub: "DA 60+ Domains", emoji: "🔗", color: COLORS.purple },
    { angle: 90, label: "SEO-Boost", sub: "Top-3 Rankings", emoji: "📈", color: COLORS.green },
    { angle: 150, label: "Traffic", sub: "Organisch × Paid", emoji: "👥", color: COLORS.amber },
    { angle: 210, label: "Bessere Story", sub: "Mehr Zahlen & Proof", emoji: "🔄", color: COLORS.blue },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <rect width={W} height={H} rx="16" fill={COLORS.bg} />
      <text x={W / 2} y="36" textAnchor="middle" fill={COLORS.white} fontSize="20" fontWeight="800">
        Content-Flywheel: Je mehr wir wachsen, desto stärker die Story
      </text>
      <text x={W / 2} y="56" textAnchor="middle" fill={COLORS.muted} fontSize="12">
        Selbstverstärkender Kreislauf — jede Runde macht die nächste stärker
      </text>

      {/* Circular arrows (simplified arc) */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.slateLight} strokeWidth="1.5" opacity="0.2" strokeDasharray="8 4" />

      {/* Direction arrows on circle */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const ax = cx + (r + 2) * Math.cos(rad);
        const ay = cy + (r + 2) * Math.sin(rad);
        return (
          <text key={i} x={ax} y={ay} textAnchor="middle" fill={COLORS.slateLight} fontSize="12"
            transform={`rotate(${deg + 90}, ${ax}, ${ay})`}>
            ›
          </text>
        );
      })}

      {/* Center label */}
      <circle cx={cx} cy={cy} r="35" fill={COLORS.teal} opacity="0.15" stroke={COLORS.teal} strokeWidth="2" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={COLORS.teal} fontSize="10" fontWeight="800">FLYWHEEL</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={COLORS.muted} fontSize="8">Selbstverstärkend</text>

      {/* Steps around the circle */}
      {steps.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const sx = cx + (r + 55) * Math.cos(rad);
        const sy = cy + (r + 55) * Math.sin(rad);
        const dotX = cx + r * Math.cos(rad);
        const dotY = cy + r * Math.sin(rad);
        return (
          <g key={i}>
            {/* Line from circle to label */}
            <line x1={dotX} y1={dotY} x2={sx} y2={sy} stroke={s.color} strokeWidth="1" opacity="0.4" />
            <circle cx={dotX} cy={dotY} r="4" fill={s.color} />

            {/* Label */}
            <text x={sx} y={sy - 12} textAnchor="middle" fontSize="16">{s.emoji}</text>
            <text x={sx} y={sy + 4} textAnchor="middle" fill={s.color} fontSize="10" fontWeight="700">{s.label}</text>
            <text x={sx} y={sy + 17} textAnchor="middle" fill={COLORS.muted} fontSize="8.5">{s.sub}</text>
          </g>
        );
      })}
    </svg>
  );
});
ContentFlywheelInfographic.displayName = "ContentFlywheelInfographic";

/* ─── 4. Award Pipeline ─── */
const AwardPipelineInfographic = memo(() => {
  const W = 1000;
  const H = 200;

  const awards = [
    { label: "ProductHunt Launch", time: "Q2 2026", emoji: "🚀", color: COLORS.orange },
    { label: "Swiss Startup Award", time: "Q3 2026", emoji: "🇨🇭", color: COLORS.teal },
    { label: "AI Innovation Prize", time: "Q4 2026", emoji: "🏆", color: COLORS.amber },
    { label: "Digital Marketing Award", time: "2027", emoji: "🎖️", color: COLORS.green },
    { label: "Best Case: Global", time: "2027+", emoji: "🌍", color: COLORS.purple },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <rect width={W} height={H} rx="16" fill={COLORS.bg} />
      <text x={W / 2} y="32" textAnchor="middle" fill={COLORS.white} fontSize="18" fontWeight="800">
        Award-Pipeline: Vom Launch zum Best-Case-Award
      </text>

      {/* Timeline line */}
      <line x1={60} y1={100} x2={W - 60} y2={100} stroke={COLORS.slateLight} strokeWidth="2" opacity="0.3" />

      {awards.map((a, i) => {
        const ax = 100 + i * ((W - 200) / (awards.length - 1));
        return (
          <g key={i}>
            <circle cx={ax} cy={100} r="8" fill={a.color} />
            <text x={ax} y={78} textAnchor="middle" fontSize="20">{a.emoji}</text>
            <text x={ax} y={125} textAnchor="middle" fill={a.color} fontSize="10" fontWeight="700">{a.label}</text>
            <text x={ax} y={140} textAnchor="middle" fill={COLORS.muted} fontSize="9">{a.time}</text>
            {/* Arrow between */}
            {i < awards.length - 1 && (
              <text x={ax + (W - 200) / (awards.length - 1) / 2} y={96} textAnchor="middle" fill={COLORS.slateLight} fontSize="14">→</text>
            )}
          </g>
        );
      })}

      {/* Bottom note */}
      <text x={W / 2} y={H - 18} textAnchor="middle" fill={COLORS.teal} fontSize="10" fontWeight="600">
        Ziel: "KI baut Startup im härtesten Markt der Welt" → Swiss & International Awards
      </text>
    </svg>
  );
});
AwardPipelineInfographic.displayName = "AwardPipelineInfographic";

/* ─── Main Section ─── */
export const GrowthPRStrategySection = memo(() => {
  return (
    <section className="py-16 bg-muted/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">Growth & PR</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Das Projekt IST der Content
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            95% AI-built · Kompetitivster Markt · Reichstes Land — eine Story die Medien weltweit von sich aus aufgreifen
          </p>
        </motion.div>

        <div className="space-y-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <StoryInfographic />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <ContentFlywheelInfographic />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <OutreachMapInfographic />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <AwardPipelineInfographic />
          </motion.div>

          {/* Multilingual note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center p-6 rounded-xl border border-primary/20 bg-primary/5"
          >
            <p className="text-sm text-muted-foreground">
              🌐 <span className="font-bold text-foreground">Multilingual by Default:</span> KI-Translation in alle Sprachen — 
              direktes Outreach an japanische Portale auf Japanisch, US-Medien auf Englisch, DACH auf Deutsch.
              Die Investoren-Seite selbst wird zum Showcase.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

GrowthPRStrategySection.displayName = "GrowthPRStrategySection";

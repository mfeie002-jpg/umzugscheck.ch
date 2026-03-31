import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const segments = [
  { label: "Kundengewinnung", detail: "SEO, Ads, Content", pct: 35, chf: "28k", color: "hsl(var(--primary))" },
  { label: "Produkt & Conversion", detail: "Funnel, UX, Tracking", pct: 25, chf: "20k", color: "hsl(var(--secondary))" },
  { label: "Operative Delivery", detail: "Prozesse, Qualität", pct: 20, chf: "16k", color: "hsl(180 100% 30%)" },
  { label: "Brand & Trust", detail: "Reviews, Cases", pct: 10, chf: "8k", color: "hsl(180 60% 50%)" },
  { label: "Reserve", detail: "Working Capital", pct: 10, chf: "8k", color: "hsl(var(--muted-foreground))" },
];

export function UseOfFundsSection() {
  const barWidth = 800;
  const barHeight = 56;
  const barY = 30;

  let cumX = 0;
  const rects = segments.map((s) => {
    const w = (s.pct / 100) * barWidth;
    const x = cumX;
    cumX += w;
    return { ...s, x, w };
  });

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">Use of Funds</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Wofür das Kapital arbeitet
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            CHF 80'000 — gezielt in Nachfrage, Conversion und operative Exzellenz.
          </p>
        </motion.div>

        {/* SVG Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 mb-8 overflow-x-auto"
        >
          <svg viewBox={`0 0 ${barWidth} ${barY + barHeight + 10}`} className="w-full h-auto" aria-label="Use of Funds Balkendiagramm">
            {rects.map((r, i) => (
              <motion.rect
                key={r.label}
                x={r.x}
                y={barY}
                width={r.w}
                height={barHeight}
                rx={i === 0 ? 8 : 0}
                ry={i === 0 ? 8 : 0}
                fill={r.color}
                initial={{ width: 0 }}
                whileInView={{ width: r.w }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              />
            ))}
            {/* Last segment rounded right */}
            {rects.length > 0 && (
              <rect
                x={rects[rects.length - 1].x + rects[rects.length - 1].w - 8}
                y={barY}
                width={8}
                height={barHeight}
                rx={8}
                ry={8}
                fill={rects[rects.length - 1].color}
              />
            )}
            {/* Percentage labels inside */}
            {rects.map((r) => (
              r.w > 50 && (
                <text
                  key={`pct-${r.label}`}
                  x={r.x + r.w / 2}
                  y={barY + barHeight / 2 + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {r.pct}%
                </text>
              )
            ))}
          </svg>
        </motion.div>

        {/* Detail Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {segments.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style={{ backgroundColor: s.color }}
              />
              <p className="text-xs font-bold text-foreground">{s.label}</p>
              <p className="text-lg font-black text-foreground">CHF {s.chf}</p>
              <p className="text-xs text-muted-foreground">{s.detail}</p>
              <p className="text-xs font-semibold text-primary mt-1">{s.pct}%</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Clock, Calculator, Shield, Heart, Lock, Rocket } from 'lucide-react';

const investArgs = [
  {
    icon: Clock,
    title: 'Timing',
    stat: "450'000 Umzüge/Jahr",
    desc: 'Kein digitaler Marktführer. Der Schweizer Umzugsmarkt ist hochfragmentiert — perfektes Fenster für eine Plattform.',
  },
  {
    icon: Calculator,
    title: 'Unit Economics',
    stat: 'CHF 553 Revenue/Kunde',
    desc: '90%+ Marge bei einem asset-light Plattformmodell. Kapitaleffizient ab Tag 1.',
  },
  {
    icon: Shield,
    title: 'Technical Moat',
    stat: "2'110 Gemeinde-SEO",
    desc: 'AI-Pipeline + programmatische Gemeinde-Seiten = organischer Traffic-Flywheel, der schwer kopierbar ist.',
  },
  {
    icon: Heart,
    title: 'Skin in the Game',
    stat: 'Kein Gründerlohn',
    desc: 'Gründer arbeitet ohne Lohn. 100% des Kapitals wird direkt reinvestiert. Maximale Alignment.',
  },
  {
    icon: Lock,
    title: 'De-Risked Structure',
    stat: 'Max CHF 15k Erstrisiko',
    desc: 'Meilenstein-basierte Tranchen. Kapital wird nur freigegeben, wenn messbare Ziele erreicht sind.',
  },
  {
    icon: Rocket,
    title: 'Scalability',
    stat: '95% Automation',
    desc: '6 Revenue Streams, Multi-Brand ready. Plattform, nicht Service — skaliert ohne linearen Personalaufbau.',
  },
];

interface WhyInvestSectionProps {
  language?: string;
}

export function WhyInvestSection({ language = 'de' }: WhyInvestSectionProps) {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Investment Thesis
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Warum jetzt investieren?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sechs Gründe, warum Umzugscheck.ch das attraktivste Pre-Seed-Investment im Schweizer Logistik-Markt ist.
          </p>
        </motion.div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12 md:mb-16">
          {investArgs.map((arg, i) => (
            <motion.div
              key={arg.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative group rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <arg.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{arg.title}</h3>
                <p className="text-primary font-semibold text-sm mb-2">{arg.stat}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{arg.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 md:p-10 text-center max-w-4xl mx-auto"
        >
          <p className="text-lg md:text-xl font-semibold text-foreground leading-relaxed">
            CHF 60k Pre-Seed. 3 Tranchen. Klare Milestones. Break-even in 6–9 Monaten.
            <br className="hidden sm:block" />
            Kein Gründerlohn. Der Schweizer Umzugsmarkt hat keinen digitalen Champion —{' '}
            <span className="text-primary">wir bauen ihn.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

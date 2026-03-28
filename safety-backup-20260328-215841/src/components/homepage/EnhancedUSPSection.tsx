import { memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, HeartHandshake, Leaf, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const usps = [
  {
    icon: Clock,
    title: 'Schnell & Einfach',
    description: 'In 2 Minuten zum Vergleich – kostenlos und unverbindlich.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    title: 'Geprüfte Partner',
    description: 'Nur verifizierte Firmen mit Versicherung und Bewilligungen.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Award,
    title: 'Beste Preise',
    description: 'Bis zu 40% sparen durch transparenten Wettbewerb.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: HeartHandshake,
    title: 'Persönliche Beratung',
    description: 'Unser Team hilft Ihnen bei Fragen – per Chat, Mail oder Telefon.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Leaf,
    title: 'Nachhaltigkeit',
    description: 'Partner mit Fokus auf umweltfreundliche Umzugslösungen.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'AI-gestützte Analyse',
    description: 'Modernste Technologie für präzise Preisschätzungen.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

export const EnhancedUSPSection = memo(function EnhancedUSPSection() {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-medium text-secondary bg-secondary/10 px-4 py-1.5 rounded-full mb-4"
          >
            Warum Umzugscheck.ch?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Die Nr. 1 für Umzugsvergleiche
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            15'000+ erfolgreiche Umzüge sprechen für sich
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usps.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-medium transition-shadow"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", usp.bg)}>
                <usp.icon className={cn("w-6 h-6", usp.color)} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{usp.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {usp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

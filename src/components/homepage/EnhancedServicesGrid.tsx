import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, Sparkles, Trash2, Package, Wrench, 
  Building2, Plane, Piano, ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Truck,
    title: 'Privatumzug',
    description: 'Professioneller Umzugsservice für Ihr Zuhause',
    href: '/umzug',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    hoverBg: 'hover:bg-blue-500/15',
  },
  {
    icon: Building2,
    title: 'Firmenumzug',
    description: 'Büro- und Geschäftsumzüge ohne Betriebsunterbruch',
    href: '/firmenumzug',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    hoverBg: 'hover:bg-purple-500/15',
  },
  {
    icon: Sparkles,
    title: 'Reinigung',
    description: 'Professionelle Endreinigung mit Abnahmegarantie',
    href: '/reinigung',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    hoverBg: 'hover:bg-cyan-500/15',
  },
  {
    icon: Trash2,
    title: 'Entsorgung',
    description: 'Fachgerechte Entsorgung und Räumungen',
    href: '/entsorgung',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    hoverBg: 'hover:bg-amber-500/15',
  },
  {
    icon: Package,
    title: 'Lagerung',
    description: 'Sichere Zwischen- und Langzeitlagerung',
    href: '/lagerung',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    hoverBg: 'hover:bg-green-500/15',
  },
  {
    icon: Wrench,
    title: 'Möbelmontage',
    description: 'Auf- und Abbau Ihrer Möbel',
    href: '/moebelmontage',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    hoverBg: 'hover:bg-orange-500/15',
  },
  {
    icon: Piano,
    title: 'Klaviertransport',
    description: 'Spezialtransporte für empfindliche Instrumente',
    href: '/klaviertransport',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    hoverBg: 'hover:bg-rose-500/15',
  },
  {
    icon: Plane,
    title: 'International',
    description: 'Umzüge ins und aus dem Ausland',
    href: '/international',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    hoverBg: 'hover:bg-indigo-500/15',
  },
];

export const EnhancedServicesGrid = memo(function EnhancedServicesGrid() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            Unsere Dienstleistungen
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Alles aus einer Hand
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Von der Planung bis zur Reinigung - unsere Partner bieten umfassende Services
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={service.href}
                className={cn(
                  "group flex flex-col p-5 md:p-6 rounded-xl border border-border bg-card transition-all",
                  "hover:shadow-medium hover:-translate-y-1",
                  service.hoverBg
                )}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", service.bg)}>
                  <service.icon className={cn("w-6 h-6", service.color)} />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Mehr erfahren
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

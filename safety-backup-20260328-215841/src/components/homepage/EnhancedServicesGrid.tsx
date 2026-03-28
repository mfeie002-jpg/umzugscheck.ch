import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, Sparkles, Trash2, Package, Wrench, 
  Building2, ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Truck,
    title: 'Privatumzug',
    description: 'Professioneller Umzugsservice für Ihr Zuhause – wie ein neues Zuhause',
    href: '/umzug',
    price: 'ab CHF 450',
    color: 'text-primary',
    bg: 'bg-primary/10',
    hoverBg: 'hover:bg-primary/15',
    featured: true,
  },
  {
    icon: Building2,
    title: 'Firmenumzug',
    description: 'Büro- und Geschäftsumzüge ohne Betriebsunterbruch',
    href: '/firmenumzug',
    price: 'ab CHF 1\'200',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    hoverBg: 'hover:bg-purple-500/15',
    featured: true,
  },
  {
    icon: Sparkles,
    title: 'Reinigung',
    description: 'Professionelle Endreinigung mit Abnahmegarantie',
    href: '/reinigung',
    price: 'ab CHF 300',
    color: 'text-cyan-600',
    bg: 'bg-cyan-500/10',
    hoverBg: 'hover:bg-cyan-500/15',
    featured: true,
  },
  {
    icon: Trash2,
    title: 'Entsorgung',
    description: 'Fachgerechte Entsorgung und Räumungen',
    href: '/entsorgung',
    price: 'ab CHF 150',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    hoverBg: 'hover:bg-amber-500/15',
    featured: true,
  },
  {
    icon: Wrench,
    title: 'Möbelmontage',
    description: 'Professioneller Auf- und Abbau Ihrer Möbel',
    href: '/moebelmontage',
    price: 'ab CHF 80',
    color: 'text-orange-600',
    bg: 'bg-orange-500/10',
    hoverBg: 'hover:bg-orange-500/15',
    featured: true,
  },
  {
    icon: Package,
    title: 'Lagerung',
    description: 'Sichere Zwischen- und Langzeitlagerung',
    href: '/lagerung',
    price: 'ab CHF 50/Mt.',
    color: 'text-green-600',
    bg: 'bg-green-500/10',
    hoverBg: 'hover:bg-green-500/15',
    featured: true,
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
            Von der Planung bis zur Reinigung – unsere Partner bieten umfassende Services
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                  "group flex flex-col h-full p-5 md:p-6 rounded-xl border border-border bg-card transition-all",
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
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                  {service.description}
                </p>
                
                {/* Price indicator */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <span className={cn("text-sm font-semibold", service.color)}>
                    {service.price}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Mehr
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Preise variieren je nach Distanz, Etage und Zusatzleistungen. Nutzen Sie unseren Rechner für Ihre individuelle Offerte.
        </motion.p>
      </div>
    </section>
  );
});

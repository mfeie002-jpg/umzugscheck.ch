import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

const regions = [
  { code: 'zurich', name: 'Zürich', companies: 45, popular: true },
  { code: 'bern', name: 'Bern', companies: 32, popular: true },
  { code: 'basel', name: 'Basel', companies: 28, popular: true },
  { code: 'luzern', name: 'Luzern', companies: 22 },
  { code: 'aargau', name: 'Aargau', companies: 25 },
  { code: 'stgallen', name: 'St. Gallen', companies: 18 },
  { code: 'thurgau', name: 'Thurgau', companies: 12 },
  { code: 'zug', name: 'Zug', companies: 14 },
  { code: 'solothurn', name: 'Solothurn', companies: 15 },
  { code: 'graubuenden', name: 'Graubünden', companies: 10 },
  { code: 'wallis', name: 'Wallis', companies: 11 },
  { code: 'tessin', name: 'Tessin', companies: 16 },
];

export const EnhancedRegionsGrid = memo(function EnhancedRegionsGrid() {
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
            <MapPin className="w-4 h-4 inline mr-1" />
            Schweizweit
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Umzugsfirmen in Ihrer Region
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            200+ geprüfte Partner in allen 26 Kantonen
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {regions.map((region, index) => (
            <motion.div
              key={region.code}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                to={`/umzugsfirmen/${region.code}`}
                className={cn(
                  "group flex flex-col items-center p-4 rounded-xl border bg-card transition-all",
                  "hover:shadow-medium hover:-translate-y-1 hover:border-primary/30",
                  region.popular && "border-primary/20 bg-primary/5"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-2",
                  region.popular ? "bg-primary/10" : "bg-muted"
                )}>
                  <Building2 className={cn(
                    "w-5 h-5",
                    region.popular ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <span className="font-medium text-sm text-center group-hover:text-primary transition-colors">
                  {region.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {region.companies} Firmen
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/umzugsfirmen"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Alle Regionen anzeigen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

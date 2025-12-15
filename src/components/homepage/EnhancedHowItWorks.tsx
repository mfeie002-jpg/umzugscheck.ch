import { memo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Search, BadgeCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Umzugsdetails eingeben',
    description: 'Start- und Zielort, Wohnungsgrösse, Datum – in unter 2 Minuten ausgefüllt.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    number: '02',
    icon: Search,
    title: 'Wir checken für Sie',
    description: 'Unser System inkl. KI vergleicht automatisch passende Firmen aus 200+ Partnern.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    number: '03',
    icon: BadgeCheck,
    title: 'Vergleichen & sparen',
    description: 'Sie erhalten mehrere Offerten, vergleichen Preise & Bewertungen und wählen das beste Angebot.',
    color: 'text-green-600',
    bg: 'bg-green-500/10',
  },
];

export const EnhancedHowItWorks = memo(function EnhancedHowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            So funktioniert's
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            In 3 einfachen Schritten zum besten Angebot
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Kostenlos, unverbindlich und in wenigen Minuten erledigt
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-green-500/20" />
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Arrow between cards (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                  </div>
                )}
                
                <div className="bg-card rounded-2xl border border-border p-6 md:p-8 text-center relative hover:shadow-medium transition-shadow h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                      step.bg, step.color
                    )}>
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className={cn(
                    "w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center",
                    step.bg
                  )}>
                    <step.icon className={cn("w-8 h-8", step.color)} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 shadow-cta">
            <Link to="/umzugsofferten">
              Jetzt checken lassen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

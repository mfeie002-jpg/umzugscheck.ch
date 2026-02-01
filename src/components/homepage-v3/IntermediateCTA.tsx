/**
 * Intermediate CTA V3 - Zwischen Info-Sections
 * Addresses gap: "nach 2-3 inhaltlichen Sektionen CTA-Block einschieben"
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface IntermediateCTAProps {
  variant?: 'primary' | 'secondary';
}

export const IntermediateCTA = memo(function IntermediateCTA({ 
  variant = 'primary' 
}: IntermediateCTAProps) {
  if (variant === 'secondary') {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-secondary/5 rounded-2xl px-6 py-4 border border-secondary/20">
          <span className="text-foreground font-medium">
            Bereit für Ihren Umzug?
          </span>
          <Link to="/umzugsofferten">
            <Button size="lg" className="gap-2">
              Jetzt Offerten vergleichen
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary to-primary/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="text-white">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
                Jetzt starten
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">
              In 30 Sekunden zur Offerte
            </h3>
          </div>
          <Link to="/umzugsofferten">
            <Button 
              size="lg" 
              variant="secondary"
              className="h-14 px-8 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Kostenlos Offerten erhalten
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});

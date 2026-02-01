/**
 * Final CTA V1 - Einheitlicher CTA-Style
 * P2 Improvement #14 from Analysis
 * 
 * Ein Style, eine Farbe (secondary), ein Text. Konsistenz = Professionalität.
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalCTAV1 = memo(function FinalCTAV1() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-medium">4.9/5 von 25'000+ Kunden</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Bereit für Ihren{' '}
            <span className="text-secondary">stressfreien Umzug</span>?
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto">
            Vergleichen Sie jetzt kostenlos und sparen Sie bis zu 40% 
            mit SMA-zertifizierten Schweizer Firmen.
          </p>

          {/* CTA Button - Consistent Style */}
          <Link to="/umzugsofferten">
            <Button 
              size="lg"
              className="h-14 md:h-16 px-10 md:px-12 text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Jetzt kostenlos vergleichen
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>

          {/* Trust Pills */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>100% kostenlos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Unverbindlich</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>SMA-zertifiziert</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              <span>200+ Firmen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

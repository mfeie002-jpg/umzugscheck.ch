/**
 * Hero V1 - Konkrete Zahlen statt vage Versprechen
 * P0 Improvement #2 from Analysis
 * 
 * Konkrete Zahlen: "30 Sekunden", "bis zu 40%", "200+ Firmen"
 */
import { memo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroV1 = memo(function HeroV1() {
  // Animated counter for companies
  const [companyCount, setCompanyCount] = useState(180);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCompanyCount(prev => {
        const newVal = prev + Math.floor(Math.random() * 3);
        return newVal > 250 ? 180 : newVal;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&auto=format&fit=crop"
          alt="Professionelles Umzugsteam bei der Arbeit"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl">
          {/* Live Counter Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-white text-sm font-medium">
              <span className="font-bold text-green-400">{companyCount}+</span> geprüfte Umzugsfirmen verfügbar
            </span>
          </div>

          {/* Main Headline - Konkret */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Vergleiche Umzugsfirmen in{' '}
            <span className="text-secondary">30 Sekunden</span>.
            <br />
            <span className="text-white/90">Spare bis zu 40%.</span>
          </h1>

          {/* Subtitle with Specific Promise */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl leading-relaxed">
            Gib deine PLZ ein, erhalte sofort Preise von{' '}
            <span className="font-semibold text-white">SMA-zertifizierten Schweizer Firmen</span> – 
            100% kostenlos und unverbindlich.
          </p>

          {/* Trust Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 Sterne</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              <Users className="w-4 h-4 text-blue-400" />
              <span>25'000+ Umzüge</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              <Clock className="w-4 h-4 text-green-400" />
              <span>Antwort in 24h</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Alle versichert</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/umzugsofferten">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto"
              >
                Jetzt kostenlos vergleichen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/umzugsrechner">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full sm:w-auto"
              >
                Kosten berechnen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

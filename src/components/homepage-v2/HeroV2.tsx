/**
 * Hero V2 - Radikal reduziert für Mobile
 * 
 * Struktur: Logo -> Claim -> 2 grosse Buttons (Video/Formular) -> Trust-Ticker
 */
import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Video, FileText, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrustTickerV2 } from './TrustTickerV2';

export const HeroV2 = memo(function HeroV2() {
  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&auto=format&fit=crop"
          alt="Professioneller Umzug"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content - Centered */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-12">
        <div className="text-center max-w-2xl">
          {/* Google Rating Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-semibold">4.9/5</span>
            <span className="text-white/70 text-sm">auf Google</span>
          </div>

          {/* Main Claim - Super kurz */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Umzug vergleichen.
            <br />
            <span className="text-secondary">Bis zu 40% sparen.</span>
          </h1>

          {/* Subline - Eine Zeile */}
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Kostenlos Offerten von SMA-zertifizierten Firmen erhalten.
          </p>

          {/* 2 Grosse Buttons - Video oder Formular */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Primary: Video Scan */}
            <Link to="/video-scan">
              <Button 
                size="lg"
                className="h-16 px-8 text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto gap-3"
              >
                <Video className="w-6 h-6" />
                KI Video-Scan
                <span className="text-sm font-normal opacity-80">(30 Sek.)</span>
              </Button>
            </Link>

            {/* Secondary: Classic Form */}
            <Link to="/umzugsofferten">
              <Button 
                size="lg"
                variant="outline"
                className="h-16 px-8 text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full sm:w-auto gap-3"
              >
                <FileText className="w-6 h-6" />
                Klassisches Formular
              </Button>
            </Link>
          </div>

          {/* Digital Trust Badge - Bei Video Button */}
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xs">✓</span>
            </div>
            <span>Digital Trust Label zertifiziert – Ihre Daten sind sicher</span>
          </div>
        </div>
      </div>

      {/* Trust Ticker - Am unteren Rand */}
      <div className="relative z-10">
        <TrustTickerV2 />
      </div>
    </section>
  );
});

/**
 * Hero V3 - Emotional & Trust-optimiert für 100/100
 * 
 * Änderungen:
 * - Trust-Reassurance direkt unter CTA
 * - Emotionales Hintergrundbild (Menschen beim Umzug)
 * - "Stressfrei" statt nur "Sparen" Messaging
 * - Qualitäts-Badge prominent
 */
import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, CheckCircle2, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HeroV3 = memo(function HeroV3() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Emotional Background - Happy people moving */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&auto=format&fit=crop"
          alt="Glückliche Familie beim stressfreien Umzug"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl">
          {/* Quality Badge - Swiss Trust */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20"
          >
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">Schweizer Qualitätssiegel 2026</span>
          </motion.div>

          {/* Main Headline - Emotional + Spar-Fokus */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Stressfrei umziehen.
            <br />
            <span className="text-secondary">Bis zu 40% sparen.</span>
          </motion.h1>

          {/* Subline - Qualität + Preis */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-lg"
          >
            Vergleichen Sie 200+ geprüfte Schweizer Umzugsfirmen und finden Sie 
            das beste Angebot für Ihren Umzug – in nur 30 Sekunden.
          </motion.p>

          {/* Trust Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 md:gap-6 mb-8"
          >
            <div className="flex items-center gap-2 text-white">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.9/5</span>
              <span className="text-white/70 text-sm hidden sm:inline">Kundenbewertung</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">15'000+</span>
              <span className="text-white/70 text-sm hidden sm:inline">Umzüge</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="font-semibold">&lt;24h</span>
              <span className="text-white/70 text-sm hidden sm:inline">Offerten</span>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/umzugsofferten">
              <Button 
                size="lg"
                className="h-16 px-10 text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-xl hover:shadow-2xl transition-all"
              >
                Jetzt kostenlos Offerten erhalten
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>

            {/* Trust-Reassurance - DIREKT unter CTA */}
            <p className="mt-4 text-white/80 text-sm flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Nur geprüfte & versicherte Firmen
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                100% kostenlos & unverbindlich
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Keine Spam-Anrufe
              </span>
            </p>
          </motion.div>

          {/* Live Activity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center gap-2 text-white/60 text-sm"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>14 Personen vergleichen gerade Umzugsofferten</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

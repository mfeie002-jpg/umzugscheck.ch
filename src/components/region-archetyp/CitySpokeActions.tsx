/**
 * City Spoke Actions Component
 * 
 * TRANSACTIONAL content for City (Spoke) pages:
 * - Parking/Halteverbot quick info
 * - Recycling centers
 * - Local emergency numbers
 * - Quick action buttons
 * 
 * This differentiates City pages from Canton pages (informational)
 * to prevent SEO keyword cannibalization.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ParkingCircle, 
  Recycle, 
  Phone, 
  Zap,
  MapPin,
  Clock,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSpokeContent, type SpokeContentData } from '@/lib/seo-hub-spoke';

interface CitySpokeActionsProps {
  citySlug: string;
  cityName: string;
  cantonName: string;
  cantonSlug: string;
}

export const CitySpokeActions = memo(({ citySlug, cityName, cantonName, cantonSlug }: CitySpokeActionsProps) => {
  const spokeData = getSpokeContent(citySlug);
  
  // Use default data if no specific data available
  const parkingData = spokeData?.parkingRules || {
    halteverbotszone: { cost: '80–150 CHF', leadTime: '5-7 Werktage' },
    freeParking: false,
    zones: ['Blaue Zone', 'Weisse Zone']
  };
  
  const recyclingData = spokeData?.recyclingInfo || {
    centers: [],
    bulkyWastePickup: { available: true, cost: 'Ab 50 CHF' }
  };

  const emergencyNumbers = spokeData?.emergencyNumbers || {
    local: '–',
    police: '117',
    fire: '118'
  };

  return (
    <section className="py-12 bg-muted/30" id="local-services">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Lokale Services
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Schnellhilfe für Ihren Umzug in {cityName}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Alle wichtigen lokalen Informationen für Ihren Umzug: Parkzonen, Entsorgung, Notfallnummern.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Parking / Halteverbot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ParkingCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Halteverbot</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Kosten</span>
                  <span className="font-medium">{parkingData.halteverbotszone.cost}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vorlaufzeit</span>
                  <span className="font-medium">{parkingData.halteverbotszone.leadTime}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                  {parkingData.zones.map((zone, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
                {parkingData.halteverbotszone.contactUrl && (
                  <a 
                    href={parkingData.halteverbotszone.contactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
                  >
                    Online beantragen
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Recycling / Entsorgung */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Entsorgung</h3>
              </div>
              <div className="space-y-3">
                {recyclingData.bulkyWastePickup.available && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sperrgut-Abholung</span>
                    <span className="font-medium">{recyclingData.bulkyWastePickup.cost || 'Verfügbar'}</span>
                  </div>
                )}
                {recyclingData.centers.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    {recyclingData.centers.slice(0, 2).map((center, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {center.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 ml-4">
                          <Clock className="w-3 h-3" />
                          {center.openHours}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Recyclinghöfe in {cityName} – kontaktieren Sie die Gemeinde für genaue Standorte.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Emergency Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Wichtige Nummern</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Polizei (Notruf)</span>
                  <a href="tel:117" className="font-bold text-primary hover:underline">117</a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Feuerwehr</span>
                  <a href="tel:118" className="font-bold text-primary hover:underline">118</a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sanitätsnotruf</span>
                  <a href="tel:144" className="font-bold text-primary hover:underline">144</a>
                </div>
                {emergencyNumbers.local !== '–' && (
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                    <span className="text-muted-foreground">Gemeinde {cityName}</span>
                    <a href={`tel:${emergencyNumbers.local.replace(/\s/g, '')}`} className="font-medium text-primary hover:underline">
                      {emergencyNumbers.local}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Umzugsfirmen in {cityName} vergleichen
                </h3>
                <p className="text-muted-foreground">
                  Erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen – inklusive Halteverbot-Organisation und Entsorgung.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/rechner">
                    Jetzt vergleichen
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to={`/umzugsfirmen/kanton-${cantonSlug}`}>
                    Kanton {cantonName}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

CitySpokeActions.displayName = 'CitySpokeActions';

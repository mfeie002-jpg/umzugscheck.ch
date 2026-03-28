/**
 * Privacy Video Section V5 - Data sovereignty for video upload
 * Addresses: "'Datenschutz-Schalter' beim Video-Upload"
 */
import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Shield, Lock, MapPin, Eye, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';

export const PrivacyVideoSection = memo(function PrivacyVideoSection() {
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-2 mb-6">
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">KI-Video-Scan</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ihre Privatsphäre,{' '}
                <span className="text-secondary">Ihre Kontrolle</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-6">
                Filmen Sie Ihre Wohnung – unsere KI erstellt automatisch ein 
                präzises Inventar. Ihre Daten bleiben dabei zu 100% in der Schweiz.
              </p>

              {/* Privacy Controls */}
              <div className="bg-card rounded-2xl border p-6 mb-6">
                {/* AI Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">KI-Analyse aktivieren</div>
                      <div className="text-sm text-muted-foreground">
                        Automatische Möbelerkennung
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={aiEnabled} 
                    onCheckedChange={setAiEnabled}
                    aria-label="KI-Analyse aktivieren"
                  />
                </div>

                {/* Trust Signals */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Daten bleiben auf Schweizer Servern 🇨🇭</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Video wird nach 24h automatisch gelöscht</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Keine Weitergabe an Dritte</span>
                  </div>
                </div>

                {/* Swiss Hosting Badge */}
                <div className="mt-6 flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Swiss Hosting Zertifiziert
                    </div>
                    <div className="text-xs text-emerald-600/80">
                      Geschützt nach DSG & DSGVO
                    </div>
                  </div>
                  <img 
                    src="/logos/swiss-made-software.png" 
                    alt="Swiss Made Software" 
                    className="h-8 object-contain"
                  />
                </div>
              </div>

              {/* CTA */}
              <Link to="/video-scan">
                <Button size="lg" className="w-full md:w-auto gap-2">
                  <Video className="w-5 h-5" />
                  Video-Scan starten
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Phone Mockup */}
              <div className="relative mx-auto max-w-[280px]">
                <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="bg-gray-800 rounded-[2.5rem] p-2">
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2rem] aspect-[9/16] flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                          <Video className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-white font-medium text-sm">
                          Scannen Sie Ihre Räume
                        </p>
                        <p className="text-white/60 text-xs mt-2">
                          Die KI erkennt Möbel automatisch
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute -left-8 top-1/4 bg-card rounded-xl shadow-lg p-3 border"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-xs font-medium">End-to-End verschlüsselt</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -right-4 bottom-1/3 bg-card rounded-xl shadow-lg p-3 border"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-xs font-medium">Server in Zürich</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

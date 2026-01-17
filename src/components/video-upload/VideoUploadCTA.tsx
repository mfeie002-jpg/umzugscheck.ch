import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Sparkles, ArrowRight, Shield, Clock, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VideoUploadWidget } from './VideoUploadWidget';

interface VideoUploadCTAProps {
  variant?: 'hero' | 'section' | 'compact';
  className?: string;
}

export function VideoUploadCTA({ variant = 'section', className = '' }: VideoUploadCTAProps) {
  const [showUpload, setShowUpload] = useState(false);

  if (variant === 'compact') {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={className}
        >
          <Button
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 gap-2 shadow-lg"
          >
            <Video className="h-4 w-4" />
            Video-Analyse starten
            <Sparkles className="h-3 w-3" />
          </Button>
        </motion.div>

        {showUpload && (
          <VideoUploadWidget
            onClose={() => setShowUpload(false)}
            onUploadComplete={() => {}}
          />
        )}
      </>
    );
  }

  if (variant === 'hero') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`relative ${className}`}
        >
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                      <Video className="h-10 w-10 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center"
                    >
                      <Sparkles className="h-3 w-3 text-white" />
                    </motion.div>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    KI Video-Analyse: <span className="text-secondary">30% sparen</span>
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Laden Sie ein Video Ihrer Wohnung hoch – unsere KI analysiert alles und erstellt eine präzise Offerte.
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Shield className="h-4 w-4 text-success" />
                      <span>100% Datenschutz</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="h-4 w-4 text-info" />
                      <span>Analyse in 24h</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Percent className="h-4 w-4 text-secondary" />
                      <span>Bis 30% günstiger</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowUpload(true)}
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 text-white gap-2 shadow-cta animate-pulse-subtle"
                  >
                    Video jetzt hochladen
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {showUpload && (
          <VideoUploadWidget
            onClose={() => setShowUpload(false)}
            onUploadComplete={() => {}}
          />
        )}
      </>
    );
  }

  // Default section variant
  return (
    <>
      <section className={`py-16 bg-gradient-to-b from-muted/50 to-background ${className}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden border-0 shadow-premium bg-gradient-to-br from-primary/10 via-background to-secondary/10">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
                  >
                    <Video className="h-8 w-8 text-primary" />
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Sparen Sie <span className="text-secondary">30%</span> mit unserer KI Video-Analyse
                  </h2>
                  
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Keine mühsame Inventarliste mehr! Laden Sie einfach ein Video Ihrer Wohnung hoch – 
                    unsere künstliche Intelligenz erkennt alle Möbel und berechnet den optimalen Preis.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-success">1</span>
                    </div>
                    <h4 className="font-semibold mb-1">Video aufnehmen</h4>
                    <p className="text-sm text-muted-foreground">
                      Filmen Sie jeden Raum für 30-60 Sekunden
                    </p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-info">2</span>
                    </div>
                    <h4 className="font-semibold mb-1">KI analysiert</h4>
                    <p className="text-sm text-muted-foreground">
                      Unsere KI erkennt Möbel, Volumen und Gewicht
                    </p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-secondary">3</span>
                    </div>
                    <h4 className="font-semibold mb-1">Offerte erhalten</h4>
                    <p className="text-sm text-muted-foreground">
                      Präzise Offerte in 24h – bis zu 30% günstiger
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    onClick={() => setShowUpload(true)}
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 text-white gap-2 shadow-cta px-8 text-lg"
                  >
                    <Video className="h-5 w-5" />
                    Video-Analyse starten
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Kostenlos & unverbindlich
                  </p>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-success" />
                    <span>SSL-verschlüsselt</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Schweizer Datenschutz</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-info" />
                    <span>Auto-Löschung nach 30 Tagen</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {showUpload && (
        <VideoUploadWidget
          onClose={() => setShowUpload(false)}
          onUploadComplete={() => {}}
        />
      )}
    </>
  );
}

/**
 * Speed Promise Section V6 - Communicate quick response times
 * Addresses: "Schnelligkeit und Reaktionszeit vermitteln"
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, CheckCircle2, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const SpeedPromiseSection = memo(function SpeedPromiseSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Blitzschnell</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Offerten in{' '}
                <span className="text-secondary">24-48 Stunden</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-6">
                Keine langen Wartezeiten. Nach Ihrer Anfrage erhalten Sie 
                innert 24-48 Stunden bis zu 5 passende Offerten – garantiert.
              </p>

              {/* Promise List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Anfrage in unter 2 Minuten</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Bis zu 5 Offerten vergleichen</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Persönlicher Ansprechpartner</span>
                </div>
              </div>

              {/* CTA */}
              <Link to="/umzugsofferten">
                <Button size="lg" className="gap-2">
                  Jetzt starten
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Time Cards */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-2xl border p-5 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-2xl">2 Min.</div>
                      <div className="text-sm text-muted-foreground">Formular ausfüllen</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl border p-5 shadow-lg ml-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-2xl">24-48h</div>
                      <div className="text-sm text-muted-foreground">Offerten erhalten</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-2xl border p-5 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="font-bold text-2xl">Bis 40%</div>
                      <div className="text-sm text-muted-foreground">Sparpotenzial</div>
                    </div>
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

/**
 * Zug Video Section Component
 * #36-42: Video testimonial and explainer section
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const benefits = [
  "Kostenlose Offerten in 2 Minuten",
  "Bis zu 40% sparen durch Vergleich",
  "Nur geprüfte Schweizer Firmen",
  "Persönlicher Support bei Fragen",
];

export const ZugVideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden bg-muted/20"
          >
            {/* Placeholder for video - replace with actual video */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 mx-auto shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-primary-foreground" />
                  ) : (
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  )}
                </motion.button>
                <p className="text-sm text-background/70">
                  {isPlaying ? "Video läuft..." : "Video abspielen"}
                </p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="w-10 h-10 rounded-full bg-background/20 hover:bg-background/30"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Duration Badge */}
            <Badge className="absolute top-4 left-4 bg-background/20 text-background border-none">
              2:30 Min
            </Badge>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 border-background/30 text-background/70">
              So funktioniert's
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              In 3 Schritten zum perfekten Umzug
            </h2>
            <p className="text-background/70 text-base sm:text-lg mb-6">
              Erfahre, wie du mit umzugscheck.ch ganz einfach die besten 
              Umzugsfirmen im Kanton Zug findest und dabei Zeit und Geld sparst.
            </p>

            {/* Benefits List */}
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-background/90">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                Jetzt Offerten erhalten
              </Button>
              <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                Mehr erfahren
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

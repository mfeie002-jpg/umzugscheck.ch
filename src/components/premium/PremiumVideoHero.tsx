import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PremiumVideoHero = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            So einfach funktioniert's
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sehen Sie in 60 Sekunden, wie Sie mit Umzugscheck.ch den besten Preis finden
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-muted">
            {/* Thumbnail */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"
              alt="Video Thumbnail"
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <motion.button
                onClick={() => setIsPlaying(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl"
              >
                <Play className="w-8 h-8 md:w-10 md:h-10 text-primary fill-primary ml-1" />
              </motion.button>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              1:24
            </div>
          </div>

          {/* Video Modal */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4"
              onClick={() => setIsPlaying(false)}
            >
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p className="text-lg">Video würde hier abgespielt werden</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

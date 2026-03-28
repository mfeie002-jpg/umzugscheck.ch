import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VideoTestimonial = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-premium aspect-video bg-muted"
          >
            {!isPlaying ? (
              <>
                <img
                  src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
                  alt="Video Testimonial"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="rounded-full w-20 h-20 bg-white/90 hover:bg-white text-secondary shadow-lift"
                    onClick={() => setIsPlaying(true)}
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-sm font-medium">Kundenstory: Familie Müller</p>
                  <p className="text-xs text-muted-foreground">2:34 Min</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <p className="text-white">Video wird geladen...</p>
              </div>
            )}
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Quote className="w-12 h-12 text-secondary/20" />
            
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-swiss-gold text-swiss-gold" />
              ))}
            </div>
            
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed">
              "Der Umzug mit unserer Familie war dank Umzugscheck.ch so einfach. Innerhalb von 24 Stunden hatten wir drei tolle Angebote und haben über CHF 800 gespart!"
            </blockquote>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-muted overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  alt="Thomas Müller"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">Thomas Müller</p>
                <p className="text-sm text-muted-foreground">
                  Umzug von Zürich nach Bern • 4.5-Zimmer
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

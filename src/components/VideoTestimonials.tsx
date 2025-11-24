import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Familie Schneider",
    location: "Zürich",
    rating: 5,
    thumbnail: "/lovable-uploads/1bdb4b13-ea35-4ded-a82e-4aa0714e0608.png",
    videoUrl: "https://example.com/video1.mp4",
    quote: "Der KI-Rechner war unglaublich präzise. Wir haben exakt den vorhergesagten Preis bezahlt!"
  },
  {
    id: 2,
    name: "Thomas Weber",
    location: "Bern",
    rating: 5,
    thumbnail: "/lovable-uploads/d4aa8c36-01f9-47b7-8e18-bd2a8e22467a.png",
    videoUrl: "https://example.com/video2.mp4",
    quote: "Professionell, schnell und transparent. Die beste Umzugserfahrung, die ich je hatte."
  },
  {
    id: 3,
    name: "Sarah Müller",
    location: "Basel",
    rating: 5,
    thumbnail: "/lovable-uploads/1bdb4b13-ea35-4ded-a82e-4aa0714e0608.png",
    videoUrl: "https://example.com/video3.mp4",
    quote: "Der Familienservice war ausgezeichnet. Alles lief reibungslos und stressfrei."
  }
];

export const VideoTestimonials = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-semibold text-primary mb-6">
            <Play className="w-5 h-5" />
            <span>Video-Bewertungen</span>
          </div>
          <h2 className="mb-6">Echte Kunden, echte Erfahrungen</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sehen Sie selbst, was unsere Kunden über ihre Umzugserfahrung mit Umzugscheck.ch sagen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-2 hover:border-primary/30 transition-all hover-lift overflow-hidden group">
                <div className="relative aspect-video bg-muted">
                  <img 
                    src={testimonial.thumbnail} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPlayingId(playingId === testimonial.id ? null : testimonial.id)}
                      className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      {playingId === testimonial.id ? (
                        <Pause className="w-8 h-8 text-primary" />
                      ) : (
                        <Play className="w-8 h-8 text-primary ml-1" />
                      )}
                    </motion.button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

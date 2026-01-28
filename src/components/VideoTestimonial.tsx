import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import familyImage from "@/assets/moving-family.jpg";

const VideoTestimonial = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const featuredTestimonial = {
    name: "Familie Brunner",
    location: "Zürich → Winterthur",
    quote: "Der Umzug mit Feierabend war ein Erlebnis. Das Team hat sich um alles gekümmert – von der ersten Besichtigung bis zum letzten Karton. Wir konnten uns zurücklehnen und den Prozess geniessen.",
    rating: 5,
    image: familyImage,
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Video/Image Section */}
          <AnimatedSection animation="slide-left">
            <div className="relative rounded-2xl overflow-hidden shadow-strong group cursor-pointer">
              <img
                src={featuredTestimonial.image}
                alt={featuredTestimonial.name}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Play Button Overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-strong group-hover:bg-white transition-colors">
                  <Play className="h-8 w-8 text-alpine ml-1" />
                </div>
              </motion.div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-bold">{featuredTestimonial.name}</p>
                <p className="text-sm opacity-80">{featuredTestimonial.location}</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Content Section */}
          <AnimatedSection animation="slide-right" className="space-y-6">
            <SectionBadge variant="warm">Kundenstimme</SectionBadge>
            
            <div className="flex gap-1">
              {[...Array(featuredTestimonial.rating)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-warm fill-warm" />
              ))}
            </div>

            <div className="relative">
              <Quote className="absolute -top-4 -left-4 h-12 w-12 text-alpine/10" />
              <blockquote className="text-xl lg:text-2xl font-display leading-relaxed pl-8">
                "{featuredTestimonial.quote}"
              </blockquote>
            </div>

            <div className="pt-4">
              <p className="font-bold text-lg">{featuredTestimonial.name}</p>
              <p className="text-muted-foreground">{featuredTestimonial.location}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/references">
                <Button size="lg" variant="outline" className="border-2">
                  Alle Referenzen ansehen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonial;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  videoUrl?: string;
  thumbnail?: string;
  moveType: string;
  savings: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Familie Müller',
    location: 'Zürich → Bern',
    rating: 5,
    text: 'Dank umzugscheck.ch haben wir in nur 2 Tagen 5 Offerten erhalten und CHF 800 gespart. Der Umzug war perfekt organisiert!',
    moveType: '4.5 Zimmer Wohnung',
    savings: 'CHF 800 gespart'
  },
  {
    id: '2',
    name: 'Thomas K.',
    location: 'Basel',
    rating: 5,
    text: 'Als Single dachte ich, ein Umzug wäre stressig. Mit der richtigen Firma war alles in 4 Stunden erledigt. Top Service!',
    moveType: '2 Zimmer Studio',
    savings: 'CHF 350 gespart'
  },
  {
    id: '3',
    name: 'Schneider GmbH',
    location: 'St. Gallen',
    rating: 5,
    text: 'Unser Büroumzug mit 15 Arbeitsplätzen wurde professionell und ohne Ausfallzeiten durchgeführt. Sehr empfehlenswert!',
    moveType: 'Büroumzug',
    savings: 'CHF 2\'500 gespart'
  },
  {
    id: '4',
    name: 'Anna & Peter',
    location: 'Luzern → Zug',
    rating: 5,
    text: 'Der KI-Rechner hat unsere Umzugskosten genau vorhergesagt. Die Firma war pünktlich und sehr sorgfältig mit unseren Möbeln.',
    moveType: '3.5 Zimmer Wohnung',
    savings: 'CHF 620 gespart'
  }
];

export const VideoTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">Kundenstimmen</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Was unsere Kunden sagen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Echte Erfahrungen von echten Menschen
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Testimonial Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2">
                      {/* Video/Image Section */}
                      <div className="relative aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl font-bold text-primary">
                              {testimonials[currentIndex].name.charAt(0)}
                            </span>
                          </div>
                          <Badge variant="secondary" className="mb-2">
                            {testimonials[currentIndex].moveType}
                          </Badge>
                          <div className="text-lg font-semibold text-green-600">
                            {testimonials[currentIndex].savings}
                          </div>
                        </div>
                        
                        {testimonials[currentIndex].videoUrl && (
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                          >
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                              {isPlaying ? (
                                <Pause className="h-6 w-6 text-primary" />
                              ) : (
                                <Play className="h-6 w-6 text-primary ml-1" />
                              )}
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-8 flex flex-col justify-center">
                        <Quote className="h-10 w-10 text-primary/20 mb-4" />
                        
                        <p className="text-lg mb-6 leading-relaxed">
                          "{testimonials[currentIndex].text}"
                        </p>

                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonials[currentIndex].rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>

                        <div>
                          <div className="font-semibold">
                            {testimonials[currentIndex].name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonials[currentIndex].location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

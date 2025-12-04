/**
 * Zug Testimonials Component
 * #28-35: Enhanced testimonials with video, avatars, and animations
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Play, ChevronLeft, ChevronRight, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Sandra M.",
    location: "Zug → Baar",
    date: "November 2024",
    rating: 5,
    company: "Happy Moving GmbH",
    text: "Der Umzug von Zug nach Baar verlief reibungslos. Das Team war pünktlich, freundlich und hat alle Möbel sorgfältig behandelt. Besonders die Kommunikation über umzugscheck.ch war super einfach.",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    highlight: "Pünktlich & professionell",
    savedAmount: "CHF 420",
  },
  {
    id: 2,
    name: "Thomas K.",
    location: "Zürich → Zug",
    date: "Oktober 2024",
    rating: 5,
    company: "Zuger Umzüge",
    text: "Durch den Vergleich auf umzugscheck.ch habe ich über 500 Franken gespart! Die Offerten kamen schnell und die gewählte Firma hat hervorragend gearbeitet. Kann ich nur empfehlen.",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    highlight: "Beste Preise",
    savedAmount: "CHF 520",
  },
  {
    id: 3,
    name: "Maria & Peter L.",
    location: "Cham (intern)",
    date: "September 2024",
    rating: 5,
    company: "Martinas Umzugsservice",
    text: "Wir haben Umzug + Reinigung als Paket gebucht. Alles aus einer Hand, die Wohnung wurde bei der Abgabe sofort abgenommen. Stressfrei und professionell!",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop",
    highlight: "Abgabegarantie",
    savedAmount: "CHF 380",
  },
  {
    id: 4,
    name: "Michael R.",
    location: "Steinhausen → Rotkreuz",
    date: "August 2024",
    rating: 4,
    company: "Helvetia Transporte",
    text: "Sehr zufrieden mit dem Umzug. Das Team hat den Möbellift perfekt eingesetzt und alle schweren Möbel sicher transportiert. Nur kleine Verzögerung am Anfang.",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    highlight: "Möbellift-Experten",
    savedAmount: "CHF 290",
  },
];

export const ZugTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background via-secondary/5 to-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <Badge className="mb-4" variant="outline">
            <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
            4.8 / 5 Sterne
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Das sagen unsere Kunden in Zug
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Echte Bewertungen von verifizierten Umzügen im Kanton Zug
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-background/80 backdrop-blur-sm border-primary/10 shadow-xl">
                <CardContent className="p-6 sm:p-8 lg:p-10">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonials[activeIndex].rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-6">
                    "{testimonials[activeIndex].text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-primary/20">
                        <AvatarImage src={testimonials[activeIndex].avatar} />
                        <AvatarFallback>{testimonials[activeIndex].name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{testimonials[activeIndex].name}</span>
                          {testimonials[activeIndex].verified && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{testimonials[activeIndex].location}</span>
                          <span>·</span>
                          <Calendar className="w-3 h-3" />
                          <span>{testimonials[activeIndex].date}</span>
                        </div>
                        <p className="text-sm text-primary mt-1">
                          via {testimonials[activeIndex].company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {testimonials[activeIndex].highlight}
                      </Badge>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Gespart: </span>
                        <span className="font-bold text-green-600">{testimonials[activeIndex].savedAmount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-lg bg-background"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-lg bg-background"
              onClick={nextTestimonial}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === activeIndex ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Mini Testimonial Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveIndex(i)}
              className={`cursor-pointer transition-all ${
                i === activeIndex ? "ring-2 ring-primary" : ""
              }`}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-3 h-3 ${
                              j < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{testimonial.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 mt-10 py-6 border-t border-b border-border/50">
          {[
            { value: "2'847", label: "Bewertungen" },
            { value: "4.8", label: "Durchschnitt" },
            { value: "98%", label: "Empfehlungen" },
            { value: "CHF 380", label: "Ø Ersparnis" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

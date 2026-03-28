import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sandra M.",
    location: "Zürich",
    rating: 5,
    text: "Der Vergleich war super einfach. Innerhalb von 24 Stunden hatte ich 4 Offerten und konnte in Ruhe vergleichen. Am Ende habe ich über CHF 800 gespart!",
    avatar: "SM",
    avatarColor: "bg-primary",
  },
  {
    id: 2,
    name: "Thomas K.",
    location: "Bern",
    rating: 5,
    text: "Sehr professioneller Service. Die empfohlene Umzugsfirma war pünktlich, freundlich und hat alles sorgfältig transportiert. Klare Empfehlung!",
    avatar: "TK",
    avatarColor: "bg-blue-600",
  },
  {
    id: 3,
    name: "Maria S.",
    location: "Basel",
    rating: 5,
    text: "Als alleinerziehende Mutter war ich froh, dass ich nicht selbst recherchieren musste. Die Offerten kamen schnell und ich fühlte mich gut beraten.",
    avatar: "MS",
    avatarColor: "bg-emerald-600",
  },
  {
    id: 4,
    name: "Peter H.",
    location: "Luzern",
    rating: 4,
    text: "Unkompliziert und transparent. Ich konnte die Preise direkt vergleichen und wusste genau, was mich erwartet. Der Umzug lief problemlos.",
    avatar: "PH",
    avatarColor: "bg-amber-600",
  },
  {
    id: 5,
    name: "Lisa W.",
    location: "St. Gallen",
    rating: 5,
    text: "Fantastischer Service! Die Umzugsfirma hat sogar beim Ein- und Auspacken geholfen. Alles war perfekt organisiert.",
    avatar: "LW",
    avatarColor: "bg-purple-600",
  },
];

const OffertenTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-muted"}`}
      />
    ));
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-foreground mb-4">
            Was andere Kundinnen und Kunden sagen
          </h2>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">{renderStars(5)}</div>
            <span className="font-manrope text-xl font-bold text-foreground">4.8/5</span>
            <span className="text-muted-foreground">– basierend auf 1'250+ Bewertungen</span>
          </div>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-white font-semibold`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}, {testimonial.location}
                      </p>
                      <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonials[currentIndex].text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${testimonials[currentIndex].avatarColor} flex items-center justify-center text-white font-semibold`}>
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonials[currentIndex].name}, {testimonials[currentIndex].location}
                      </p>
                      <div className="flex mt-1">{renderStars(testimonials[currentIndex].rating)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
              aria-label="Vorheriges Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Gehe zu Testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
              aria-label="Nächstes Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffertenTestimonials;

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Sandra K.",
    location: "Zürich",
    type: "Privatumzug 3.5-Zimmer",
    rating: 5,
    text: "Innerhalb von 48 Stunden hatte ich drei faire Offerten. Der Umzug verlief reibungslos und das Team war super professionell. Absolute Empfehlung!",
    verified: true,
  },
  {
    id: 2,
    name: "Marco B.",
    location: "Basel",
    type: "Firmenumzug 15 Arbeitsplätze",
    rating: 5,
    text: "Unser Büroumzug wurde perfekt koordiniert. Die Firma war pünktlich, sorgfältig und der Preis war transparent. Sehr zufrieden!",
    verified: true,
  },
  {
    id: 3,
    name: "Lisa M.",
    location: "Bern",
    type: "Privatumzug 2.5-Zimmer",
    rating: 5,
    text: "Ich war anfangs skeptisch, aber der Service hat mich überzeugt. Schnelle Offerten, gute Beratung und ein stressfreier Umzug.",
    verified: true,
  },
  {
    id: 4,
    name: "Thomas W.",
    location: "Luzern",
    type: "Privatumzug 4.5-Zimmer",
    rating: 5,
    text: "Die AI-Analyse war erstaunlich genau. Die empfohlene Firma hat alle Erwartungen übertroffen. Nächstes Mal wieder über Umzugscheck!",
    verified: true,
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-muted-foreground text-lg">
            Echte Bewertungen von echten Kunden.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                  <TestimonialCard testimonial={testimonial} index={index} />
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-secondary" : "bg-border"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={nextSlide}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-medium transition-shadow h-full flex flex-col"
  >
    {/* Quote Icon */}
    <Quote className="w-8 h-8 text-secondary/20 mb-4" />
    
    {/* Stars */}
    <div className="flex gap-1 mb-3">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-swiss-gold text-swiss-gold" />
      ))}
    </div>
    
    {/* Text */}
    <p className="text-foreground line-clamp-4 flex-1 mb-4">
      "{testimonial.text}"
    </p>
    
    {/* Footer */}
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div>
        <p className="font-semibold text-sm">{testimonial.name}</p>
        {testimonial.verified && (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full mt-1">
            <CheckCircle className="w-3 h-3" />
            Verifiziert
          </span>
        )}
      </div>
      <div className="text-right text-xs text-muted-foreground">
        <p>{testimonial.location}</p>
        <p>{testimonial.type}</p>
      </div>
    </div>
  </motion.div>
);

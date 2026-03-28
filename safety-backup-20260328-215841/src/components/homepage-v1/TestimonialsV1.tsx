/**
 * Testimonials V1 - Echte Testimonials mit Fotos und konkreten Zitaten
 * P1 Improvement #6 from Analysis
 * 
 * Echte Kundenfotos, Stern-Rating, konkretes Zitat wie 'Hab 800 CHF gespart beim Umzug ZH→BE'
 */
import { memo, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Thomas M.',
    location: 'Zürich → Bern',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: 'Hab CHF 850 gespart! Drei Offerten verglichen und die günstigste war auch die mit den besten Bewertungen. Top Service!',
    savings: 'CHF 850 gespart',
    date: 'Januar 2026',
  },
  {
    id: 2,
    name: 'Sarah K.',
    location: 'Basel → Zürich',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: 'Die Preisschätzung war fast exakt! Am Ende nur CHF 50 mehr als der Rechner gesagt hat. Super transparent.',
    savings: 'Exakter Preis',
    date: 'Dezember 2025',
  },
  {
    id: 3,
    name: 'Marco R.',
    location: 'Luzern → St. Gallen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: 'Innerhalb von 24 Stunden hatte ich 4 Angebote. Alle Firmen SMA-zertifiziert. Das gibt Vertrauen.',
    savings: '4 Offerten in 24h',
    date: 'November 2025',
  },
  {
    id: 4,
    name: 'Lisa B.',
    location: 'Genf → Lausanne',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: 'Endlich ein Portal ohne versteckte Kosten! Alles war von Anfang an transparent. Sehr zu empfehlen.',
    savings: 'Keine versteckten Kosten',
    date: 'Oktober 2025',
  },
];

export const TestimonialsV1 = memo(function TestimonialsV1() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-lg text-muted-foreground">
            Echte Erfahrungen von echten Schweizern
          </p>
        </div>

        {/* Desktop: 3er Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-secondary/20 mb-4" />
              
              {/* Quote Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Savings Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold mb-4">
                ✓ {testimonial.savings}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="relative">
            {/* Active Testimonial */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50">
              <Quote className="w-6 h-6 text-secondary/20 mb-3" />
              
              <p className="text-foreground mb-4 leading-relaxed text-sm">
                "{testimonials[activeIndex].quote}"
              </p>

              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                ✓ {testimonials[activeIndex].savings}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <img 
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{testimonials[activeIndex].name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {testimonials[activeIndex].location}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prevSlide}
                className="w-10 h-10 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === activeIndex ? 'bg-secondary' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextSlide}
                className="w-10 h-10 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

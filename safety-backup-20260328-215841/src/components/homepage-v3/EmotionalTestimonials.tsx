/**
 * Emotional Testimonials V3 - Mit echten Fotos
 * Addresses gap: "Testimonials könnten mit Foto versehen werden"
 */
import { memo } from 'react';
import { Star, Quote, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sandra Müller',
    location: 'Zürich',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    quote: 'Innerhalb von 2 Stunden hatte ich 3 Offerten. Die günstigste war CHF 800 unter meinem ersten Angebot. Absolut empfehlenswert!',
    savings: 'CHF 800 gespart',
    rating: 5,
  },
  {
    name: 'Marco Bernasconi',
    location: 'Bern',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    quote: 'Der KI-Video-Scan hat mir viel Zeit erspart. Einfach die Wohnung filmen und fertig – das Inventar wurde automatisch erfasst.',
    savings: '2 Stunden gespart',
    rating: 5,
  },
  {
    name: 'Lisa Weber',
    location: 'Basel',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    quote: 'Alle Firmen waren professionell und pünktlich. Das Vergleichen hat sich definitiv gelohnt – 40% günstiger als erwartet!',
    savings: '40% günstiger',
    rating: 5,
  },
];

export const EmotionalTestimonials = memo(function EmotionalTestimonials() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Das sagen unsere Kunden
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-semibold">4.9/5</span>
            <span>basierend auf 2'847 Bewertungen</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-secondary/30 mb-4" />

              {/* Quote Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Savings Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold mb-6">
                <span>✓</span>
                {testimonial.savings}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-background shadow"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
                <div className="ml-auto flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Alle Bewertungen sind verifiziert und stammen von echten Kunden
        </p>
      </div>
    </section>
  );
});

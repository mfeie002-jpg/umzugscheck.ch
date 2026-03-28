/**
 * TESTIMONIALS - ARCHETYPE VERSION
 * 
 * Customer reviews with savings badges
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck, TrendingDown } from "lucide-react";
import type { Testimonial } from "@/data/archetypeConfig";

interface TestimonialsArchetypeProps {
  testimonials: Testimonial[];
  placeName: string;
  placeKind: 'canton' | 'city';
}

export const TestimonialsArchetype = memo(({ 
  testimonials, 
  placeName,
  placeKind,
}: TestimonialsArchetypeProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Das sagen unsere Kunden {locationPrefix} {placeName}
          </h2>
          <p className="text-muted-foreground">
            Echte Bewertungen von verifizierten Umzügen
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < testimonial.rating 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-200'
                    }`} 
                  />
                ))}
              </div>
              
              {/* Text */}
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold flex items-center gap-1.5">
                    {testimonial.name}
                    {testimonial.verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.place}
                  </div>
                </div>
                
                {/* Savings Badge */}
                {testimonial.savedAmount && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <TrendingDown className="w-3.5 h-3.5" />
                    CHF {testimonial.savedAmount} gespart
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

TestimonialsArchetype.displayName = 'TestimonialsArchetype';

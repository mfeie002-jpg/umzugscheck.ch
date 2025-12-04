import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Quote, MapPin, CheckCircle } from "lucide-react";

const testimonials = [
  { name: "Michael K.", location: "Zürich Kreis 1", rating: 5, text: "Perfekter Umzug in der Altstadt. Die Firma kannte sich bestens mit den engen Gassen aus.", date: "vor 2 Wochen", verified: true, company: "Zürich Umzüge AG" },
  { name: "Sandra M.", location: "Winterthur", rating: 5, text: "Schnell, professionell und faire Preise. Hat alles reibungslos geklappt!", date: "vor 3 Wochen", verified: true, company: "Limmattal Moving" },
  { name: "Thomas B.", location: "Uster", rating: 5, text: "Sehr zufrieden mit dem Service. Pünktlich und sorgfältig.", date: "vor 1 Monat", verified: true, company: "Zürisee Transporte" },
  { name: "Anna L.", location: "Dübendorf", rating: 4, text: "Gute Arbeit, nettes Team. Kleine Verspätung, aber sonst top!", date: "vor 1 Monat", verified: true, company: "Glatttal Umzüge" },
  { name: "Peter H.", location: "Kloten", rating: 5, text: "Bester Umzug, den wir je hatten. Sehr empfehlenswert!", date: "vor 2 Monaten", verified: true, company: "Unterland Umzüge" },
];

export const ZuerichTestimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Was Kunden in Zürich sagen</h2>
          <p className="text-muted-foreground">Echte Bewertungen von zufriedenen Kunden</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-primary/10">
                <CardContent className="p-8">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <p className="text-lg md:text-xl mb-6 italic">"{testimonials[current].text}"</p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{testimonials[current].name}</span>
                        {testimonials[current].verified && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {testimonials[current].location}
                        <span>•</span>
                        {testimonials[current].company}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonials[current].rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

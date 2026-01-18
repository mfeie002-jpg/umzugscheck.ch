import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartCTAButton } from "@/components/conversion/SmartCTAButton";

const stories = [
  {
    id: 1,
    name: "Familie Meier",
    location: "Zürich → Bern",
    type: "4.5-Zimmer Wohnung",
    quote: "Dank Umzugscheck.ch haben wir CHF 1'200 gespart. Der Vergleich war einfach und die Firma war super professionell!",
    savings: 1200,
    rating: 5,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
  },
  {
    id: 2,
    name: "Thomas K.",
    location: "Basel → Luzern",
    type: "3-Zimmer Wohnung",
    quote: "In nur 48 Stunden hatte ich 5 Offerten. Die Preisunterschiede waren enorm - bis zu 40%! Klare Empfehlung.",
    savings: 890,
    rating: 5,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400",
  },
  {
    id: 3,
    name: "Sandra & Marco",
    location: "Winterthur → Zürich",
    type: "5-Zimmer Haus",
    quote: "Der KI-Rechner hat uns einen realistischen Preis gezeigt. Die gebuchte Firma war pünktlich und hat alles perfekt erledigt.",
    savings: 1850,
    rating: 5,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
  },
];

export const PremiumSuccessStories = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % stories.length);
  const prev = () => setCurrent((prev) => (prev - 1 + stories.length) % stories.length);

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Erfolgsgeschichten
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Über 50'000 erfolgreiche Umzüge und zufriedene Kunden
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-3xl shadow-xl border overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative h-48 md:h-auto">
                  <img
                    src={stories[current].image}
                    alt={stories[current].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-bold text-xl">{stories[current].name}</p>
                    <div className="flex items-center gap-2 text-white/80 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{stories[current].location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Home className="w-4 h-4" />
                      <span className="text-sm">{stories[current].type}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-8 flex flex-col justify-center">
                  <Quote className="w-8 h-8 md:w-12 md:h-12 text-primary/20 mb-3 md:mb-4" />
                  <p className="text-base md:text-xl mb-4 md:mb-6 leading-relaxed">
                    "{stories[current].quote}"
                  </p>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(stories[current].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 inline-flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ersparnis</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        CHF {stories[current].savings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current ? "w-8 bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          {/* CTA after carousel */}
          <div className="mt-8 max-w-md mx-auto">
            <SmartCTAButton 
              to="/umzugsofferten" 
              location="success-stories" 
              size="lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

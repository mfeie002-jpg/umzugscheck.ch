import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Story {
  id: number;
  name: string;
  location: string;
  image: string;
  story: string;
  result: string;
  rating: number;
  moveType: string;
}

const stories: Story[] = [
  {
    id: 1,
    name: "Familie Müller",
    location: "Zürich → Bern",
    image: "👨‍👩‍👧‍👦",
    story: "Nach 15 Jahren in Zürich stand unser Umzug nach Bern an. Mit drei Kindern und einem Haushalt voller Erinnerungen war das eine riesige Herausforderung.",
    result: "Dank Umzugscheck.ch haben wir innerhalb von 2 Stunden 5 Offerten erhalten und CHF 800 gespart!",
    rating: 5,
    moveType: "Familienumzug",
  },
  {
    id: 2,
    name: "Sarah K.",
    location: "Basel → Genf",
    image: "👩‍💼",
    story: "Als Berufseinsteigerin war mein Budget begrenzt. Ich brauchte eine zuverlässige Firma zu einem fairen Preis.",
    result: "Der KI-Preisrechner hat mir sofort einen realistischen Preis gezeigt. Die Firma war pünktlich und professionell!",
    rating: 5,
    moveType: "Einzelperson",
  },
  {
    id: 3,
    name: "Thomas & Anna",
    location: "Luzern → Lugano",
    image: "👫",
    story: "Wir wollten unseren ersten gemeinsamen Haushalt gründen. Die Distanz von 150 km machte uns Sorgen.",
    result: "Alles lief reibungslos! Die Umzugsfirma hat sogar unsere Pflanzen sicher transportiert. Top Service!",
    rating: 5,
    moveType: "Paarumzug",
  },
];

export const SuccessStoriesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = stories.length - 1;
      if (newIndex >= stories.length) newIndex = 0;
      return newIndex;
    });
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Quote className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Erfolgsgeschichten unserer Kunden
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Echte Menschen, echte Umzüge, echte Zufriedenheit
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full"
            >
              <Card className="shadow-2xl border-2 border-primary/20 cursor-grab active:cursor-grabbing">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 text-6xl flex items-center justify-center bg-primary/10 rounded-2xl">
                        {stories[currentIndex].image}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground">
                              {stories[currentIndex].name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {stories[currentIndex].location}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {stories[currentIndex].moveType}
                          </span>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < stories[currentIndex].rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Story */}
                      <blockquote className="mb-4">
                        <p className="text-foreground mb-3 italic">
                          "{stories[currentIndex].story}"
                        </p>
                        <p className="text-primary font-semibold">
                          {stories[currentIndex].result}
                        </p>
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Spacer for absolute positioning */}
          <div className="h-96 md:h-80" />

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-border/70"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

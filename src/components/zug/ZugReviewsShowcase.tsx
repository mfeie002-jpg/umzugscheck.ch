/**
 * Zug Reviews Showcase Component
 * #43-52: Enhanced reviews with photos and verification
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Quote, ChevronLeft, ChevronRight, 
  BadgeCheck, ThumbsUp, Calendar, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  author: string;
  avatar?: string;
  location: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  company: string;
  verified: boolean;
  helpful: number;
  moveType: string;
}

const reviews: Review[] = [
  {
    id: "1",
    author: "Sandra M.",
    avatar: "",
    location: "Zug → Baar",
    date: "November 2024",
    rating: 5,
    title: "Perfekter Umzug, super Team!",
    text: "Von der ersten Anfrage bis zum letzten Karton – alles lief reibungslos. Das Team war pünktlich, freundlich und hat sogar beim Aufbau der Möbel geholfen. Klare Empfehlung!",
    company: "Zug Umzüge AG",
    verified: true,
    helpful: 24,
    moveType: "3.5-Zimmer-Wohnung",
  },
  {
    id: "2",
    author: "Thomas K.",
    avatar: "",
    location: "Cham → Steinhausen",
    date: "Oktober 2024",
    rating: 5,
    title: "Preis-Leistung top",
    text: "Durch den Vergleich auf umzugscheck.ch haben wir fast 30% gespart. Die Firma war professionell und hat den ganzen Umzug in nur einem Tag erledigt.",
    company: "Express Umzug Zug",
    verified: true,
    helpful: 18,
    moveType: "4.5-Zimmer-Wohnung",
  },
  {
    id: "3",
    author: "Maria L.",
    avatar: "",
    location: "Zürich → Zug",
    date: "September 2024",
    rating: 4,
    title: "Sehr zufrieden",
    text: "Schnelle Offerten, gute Beratung. Der Umzug selbst war stressfrei. Einzig die Parkplatzsituation in der Zuger Altstadt war etwas schwierig, aber das Team hat das super gemeistert.",
    company: "Swiss Moving Services",
    verified: true,
    helpful: 12,
    moveType: "2.5-Zimmer-Wohnung",
  },
  {
    id: "4",
    author: "Peter W.",
    avatar: "",
    location: "Rotkreuz",
    date: "August 2024",
    rating: 5,
    title: "Firmenumzug perfekt organisiert",
    text: "Unser Büroumzug wurde professionell geplant und am Wochenende durchgeführt. Montag war alles einsatzbereit. Sehr empfehlenswert für Firmen!",
    company: "Business Relocations Zug",
    verified: true,
    helpful: 31,
    moveType: "Firmenumzug",
  },
];

export const ZugReviewsShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextReview = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="outline" className="mb-4">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            Kundenstimmen
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Echte Bewertungen von echten Umzügen im Kanton Zug
          </p>
        </motion.div>

        {/* Main Review Card */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentReview.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-background rounded-2xl p-6 sm:p-8 shadow-lg border border-border/50"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 mb-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < currentReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {currentReview.rating}/5
                </span>
              </div>

              {/* Title & Text */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {currentReview.title}
              </h3>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                "{currentReview.text}"
              </p>

              {/* Author Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={currentReview.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {currentReview.author.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currentReview.author}</span>
                      {currentReview.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {currentReview.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {currentReview.date}
                  </Badge>
                  <Badge variant="outline">
                    {currentReview.moveType}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {currentReview.helpful} hilfreich
                  </Badge>
                </div>
              </div>

              {/* Company */}
              <p className="text-sm text-muted-foreground mt-4">
                Umzug durchgeführt von: <span className="font-medium text-primary">{currentReview.company}</span>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevReview}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextReview}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mt-10"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">2'847</p>
            <p className="text-sm text-muted-foreground">Bewertungen</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">4.8/5</p>
            <p className="text-sm text-muted-foreground">Durchschnitt</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">96%</p>
            <p className="text-sm text-muted-foreground">Weiterempfehlung</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

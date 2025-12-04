import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Lightbulb, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: string;
}

const MOVING_TIPS: Tip[] = [
  {
    id: "1",
    title: "3 Monate vorher starten",
    content: "Beginnen Sie mit der Planung mindestens 3 Monate vor dem Umzug. Erstellen Sie eine Checkliste und legen Sie ein Budget fest.",
    category: "Planung",
    readTime: "2 min",
  },
  {
    id: "2",
    title: "Entrümpeln spart Geld",
    content: "Je weniger Sie transportieren, desto günstiger wird der Umzug. Verkaufen oder spenden Sie nicht benötigte Gegenstände.",
    category: "Kosten",
    readTime: "3 min",
  },
  {
    id: "3",
    title: "Umzugskartons richtig packen",
    content: "Schwere Gegenstände unten, leichte oben. Maximal 20kg pro Karton. Beschriften Sie jeden Karton mit Inhalt und Zielraum.",
    category: "Packen",
    readTime: "4 min",
  },
  {
    id: "4",
    title: "Wertgegenstände selbst transportieren",
    content: "Wichtige Dokumente, Schmuck und elektronische Geräte sollten Sie selbst mitnehmen, nicht dem Umzugsunternehmen übergeben.",
    category: "Sicherheit",
    readTime: "2 min",
  },
  {
    id: "5",
    title: "Nebensaison nutzen",
    content: "Umzüge im Winter oder unter der Woche sind oft 20-30% günstiger als in der Hauptsaison (Mai-September).",
    category: "Kosten",
    readTime: "2 min",
  },
];

export const MovingTipsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % MOVING_TIPS.length);
  };

  const prevTip = () => {
    setCurrentIndex((prev) => (prev - 1 + MOVING_TIPS.length) % MOVING_TIPS.length);
  };

  const currentTip = MOVING_TIPS[currentIndex];

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-400" />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Umzugstipp des Tages</p>
              <p className="text-xs text-muted-foreground">
                {currentIndex + 1} von {MOVING_TIPS.length}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevTip}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextTip}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentTip.category}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {currentTip.readTime}
              </span>
            </div>
            <h3 className="font-semibold">{currentTip.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTip.content}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {MOVING_TIPS.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        <Link to="/ratgeber">
          <Button variant="ghost" className="w-full mt-4" size="sm">
            Alle Tipps im Ratgeber
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default MovingTipsCarousel;

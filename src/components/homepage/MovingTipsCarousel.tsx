import { motion } from "framer-motion";
import { Lightbulb, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const tips = [
  {
    title: "3 Monate vor dem Umzug",
    description: "Entrümpeln Sie frühzeitig und verkaufen Sie nicht benötigte Gegenstände.",
    readTime: "3 Min. Lesezeit"
  },
  {
    title: "Umzugskartons richtig packen",
    description: "Schwere Gegenstände unten, leichte oben. Maximal 20kg pro Karton.",
    readTime: "5 Min. Lesezeit"
  },
  {
    title: "Adressänderungen nicht vergessen",
    description: "Post, Bank, Versicherungen - alle wichtigen Stellen rechtzeitig informieren.",
    readTime: "4 Min. Lesezeit"
  },
  {
    title: "Umzug mit Kindern",
    description: "So gestalten Sie den Umzug kindgerecht und stressfrei für die ganze Familie.",
    readTime: "6 Min. Lesezeit"
  }
];

export const MovingTipsCarousel = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Umzugstipps & Ratgeber</h2>
            <p className="text-muted-foreground">Praktische Tipps für Ihren stressfreien Umzug</p>
          </div>
          <Link to="/ratgeber" className="hidden md:flex items-center gap-2 text-primary hover:underline">
            Alle Artikel
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {tip.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {tip.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {tip.readTime}
              </div>
            </motion.div>
          ))}
        </div>

        <Link to="/ratgeber" className="md:hidden flex items-center justify-center gap-2 text-primary mt-6">
          Alle Artikel anzeigen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlossarItem {
  term: string;
  definition: string;
}

const GLOSSAR_ITEMS: GlossarItem[] = [
  {
    term: "Halteverbot",
    definition: "Eine temporäre Parkverbotszone vor Ihrer alten und neuen Wohnung. Die Umzugsfirma kann dies für Sie beantragen, damit der Umzugswagen direkt vor der Tür parken kann. Kosten: ca. CHF 50-150 pro Zone."
  },
  {
    term: "Möbellift",
    definition: "Ein Aussenlift, der sperrige Möbel direkt durch Fenster oder Balkon transportiert. Besonders nützlich ab dem 3. Stock oder bei engen Treppenhäusern. Kosten: ca. CHF 300-500 pro Einsatz."
  },
  {
    term: "Endreinigung",
    definition: "Die professionelle Reinigung der alten Wohnung nach Abgabestandard des Vermieters. Umfasst üblicherweise Fenster, Böden, Küche, Bad und alle Räume. Eine Abnahmegarantie ist empfehlenswert."
  },
  {
    term: "Wohnungsabgabe",
    definition: "Die formelle Übergabe der Mietwohnung an den Vermieter. Beinhaltet das Erstellen eines Mängelprotokolls, die Schlüsselübergabe und ggf. die Besprechung von Nachbesserungen."
  },
  {
    term: "Umzugsvolumen",
    definition: "Das Gesamtvolumen aller zu transportierenden Gegenstände, gemessen in Kubikmetern (m³). Eine 3-Zimmer-Wohnung hat typischerweise 25-35 m³ Umzugsvolumen."
  },
  {
    term: "Transportversicherung",
    definition: "Versicherungsschutz für Ihre Möbel und Gegenstände während des Transports. Seriöse Umzugsfirmen haben eine Basis-Transportversicherung inklusive. Wertgegenstände sollten separat versichert werden."
  }
];

export const RegionGlossar = memo(() => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Umzugs-Glossar
              </h2>
              <p className="text-sm text-muted-foreground">
                Die wichtigsten Begriffe kurz erklärt
              </p>
            </div>
          </div>

          {/* Glossar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GLOSSAR_ITEMS.map((item, index) => (
              <Card 
                key={item.term}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  expandedIndex === index && "ring-2 ring-primary/20"
                )}
                onClick={() => toggleItem(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      {item.term}
                    </h3>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        expandedIndex === index && "rotate-180"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-muted-foreground mt-3 leading-relaxed"
                      >
                        {item.definition}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RegionGlossar.displayName = "RegionGlossar";

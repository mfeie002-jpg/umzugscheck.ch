import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Was kostet ein Umzug in der Schweiz?",
    answer: "Die Kosten variieren je nach Wohnungsgrösse, Distanz und Aufwand. Ein Studio-Umzug (lokal) kostet ca. CHF 400–800, eine 3-Zimmer-Wohnung CHF 1'200–2'500, und grössere Umzüge CHF 3'000–6'000+. Mit unserem kostenlosen Vergleich sparen Sie bis zu 40%."
  },
  {
    question: "Wie funktioniert der KI-Video-Kostenrechner?",
    answer: "Laden Sie einfach ein kurzes Video Ihrer Wohnung hoch. Unsere KI analysiert automatisch Möbel, Volumen und Aufwand und erstellt in Sekunden eine präzise Kostenschätzung – ohne manuelles Ausfüllen langer Formulare."
  },
  {
    question: "Ist der Vergleichsservice wirklich kostenlos?",
    answer: "Ja, für Sie als Kunde ist unser Service 100% kostenlos und unverbindlich. Wir finanzieren uns über Vermittlungsprovisionen der Partnerfirmen. Sie gehen keinerlei Verpflichtung ein."
  },
  {
    question: "Wie werden die Umzugsfirmen geprüft?",
    answer: "Alle 200+ Partnerfirmen durchlaufen einen strengen Prüfprozess: Wir verifizieren Handelsregister, Versicherungsschutz, Bewilligungen, echte Kundenbewertungen und Qualitätsstandards. Nur geprüfte Firmen werden aufgenommen."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "In der Regel erhalten Sie innerhalb von 24–48 Stunden mehrere unverbindliche Offerten von passenden Umzugsfirmen. Bei dringenden Anfragen können Sie dies im Formular angeben."
  },
  {
    question: "Welche Services sind im Umzug inbegriffen?",
    answer: "Das hängt von der gewählten Firma und dem Angebot ab. Typische Leistungen sind: Transport, Ein-/Auspacken, Möbelmontage, Verpackungsmaterial. Zusatzservices wie Reinigung, Entsorgung oder Lagerung können separat gebucht werden."
  },
  {
    question: "Was passiert bei Schäden während des Umzugs?",
    answer: "Alle unsere Partnerfirmen sind vollumfänglich haftpflichtversichert. Im seltenen Fall eines Schadens wickelt die Firma dies über ihre Versicherung ab. Dokumentieren Sie den Schaden direkt beim Umzug."
  },
  {
    question: "Kann ich auch Firmenumzüge vergleichen?",
    answer: "Ja, unser Service deckt alle Umzugsarten ab: Privatumzüge, Büro- und Firmenumzüge, internationale Umzüge sowie Spezialservices wie Reinigung, Entsorgung und Lagerung."
  },
  {
    question: "In welchen Regionen ist der Service verfügbar?",
    answer: "Unser Service ist schweizweit verfügbar. Wir haben geprüfte Partnerfirmen in allen 26 Kantonen – von Zürich über Bern bis Genf und ins Tessin."
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer: "Nein, Sie sind völlig frei in Ihrer Entscheidung. Vergleichen Sie die erhaltenen Angebote in Ruhe und wählen Sie die Firma, die am besten zu Ihren Bedürfnissen und Ihrem Budget passt."
  }
];

const FAQItemComponent = memo(function FAQItemComponent({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-base md:text-lg group-hover:text-primary transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export const EnhancedFAQ = memo(function EnhancedFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Häufige Fragen</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Noch Fragen?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Hier finden Sie Antworten auf die häufigsten Fragen
            </motion.p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            {faqItems.map((item, index) => (
              <FAQItemComponent
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

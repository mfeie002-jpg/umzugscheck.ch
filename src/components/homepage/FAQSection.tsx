import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Wie funktioniert der Vergleich genau?",
    answer: "Sie füllen unser kurzes Formular mit Ihren Umzugsdetails aus. Unser AI-System analysiert Ihre Anforderungen und findet passende, geprüfte Umzugsfirmen. Innerhalb von 24-48 Stunden erhalten Sie mehrere unverbindliche Offerten.",
  },
  {
    question: "Kostet mich der Service etwas?",
    answer: "Nein, unser Vergleichsservice ist für Sie als Kunde zu 100% kostenlos und unverbindlich. Es entstehen keinerlei Verpflichtungen.",
  },
  {
    question: "Wie werden die Umzugsfirmen ausgewählt?",
    answer: "Alle Partner durchlaufen einen strengen Prüfprozess. Wir verifizieren Versicherungen, Bewilligungen, Kundenbewertungen und Qualitätsstandards.",
  },
  {
    question: "Wie schnell erhalte ich Angebote?",
    answer: "In der Regel erhalten Sie innerhalb von 24-48 Stunden mehrere Offerten von passenden Umzugsfirmen. Bei dringenden Anfragen geht es oft noch schneller.",
  },
  {
    question: "Sind die Angebote verbindlich?",
    answer: "Die Offerten sind Richtangebote basierend auf Ihren Angaben. Nach einer Besichtigung oder Detailklärung erstellt die Firma ein verbindliches Angebot.",
  },
  {
    question: "Was passiert, wenn etwas beschädigt wird?",
    answer: "Alle unsere Partnerfirmen sind vollumfänglich versichert. Im unwahrscheinlichen Fall eines Schadens sind Sie über die Transportversicherung der Umzugsfirma geschützt.",
  },
  {
    question: "Kann ich auch Firmenumzüge vergleichen?",
    answer: "Ja, unser Service deckt sowohl Privatumzüge als auch Firmen- und Büroumzüge ab. Geben Sie einfach 'Büro / Firma' bei der Wohnungsgrösse an.",
  },
  {
    question: "In welchen Regionen ist der Service verfügbar?",
    answer: "Unser Service ist schweizweit verfügbar. Wir haben geprüfte Partner in allen 26 Kantonen.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-muted-foreground text-lg">
            Alles, was Sie über unseren Vergleichsservice wissen müssen.
          </p>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 shadow-soft"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

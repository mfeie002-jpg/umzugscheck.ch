import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Ist der Service wirklich kostenlos?",
    answer: "Ja. Für Sie als Auftraggeber ist der Service 100 % kostenlos. Wir finanzieren uns über eine Provision der teilnehmenden Umzugsfirmen.",
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "In der Regel erhalten Sie die ersten Offerten innerhalb von 24 Stunden. Bei kurzfristigen Umzügen kann es auch schneller gehen.",
  },
  {
    question: "Wie viel kann ich mit dem Vergleich sparen?",
    answer: "Je nach Umfang und Region sind Einsparungen von bis zu 40 % möglich, weil Sie mehrere Angebote direkt vergleichen.",
  },
  {
    question: "Sind alle Firmen geprüft?",
    answer: "Ja. Wir arbeiten nur mit seriösen, registrierten Umzugsfirmen zusammen und prüfen Bewertungen sowie Rückmeldungen von Kunden laufend.",
  },
  {
    question: "Bin ich verpflichtet, eine Offerte anzunehmen?",
    answer: "Nein. Sie vergleichen die Angebote in Ruhe und entscheiden selbst, ob und mit welcher Firma Sie den Auftrag vergeben.",
  },
];

const OffertenFAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-foreground mb-4">
            Häufige Fragen zu Umzugsofferten
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hier finden Sie Antworten auf die wichtigsten Fragen.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
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

export default OffertenFAQ;

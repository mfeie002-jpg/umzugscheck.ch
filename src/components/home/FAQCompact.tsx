import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Wie funktioniert umzugscheck.ch?",
    answer: "Anfrage eingeben → AI berechnet Preis → Passende Firmen erhalten → Angebote vergleichen → Beste Firma buchen."
  },
  {
    question: "Ist der Service wirklich kostenlos?",
    answer: "Ja, 100% kostenlos und unverbindlich für Privatkunden. Sie bezahlen nur die gewählte Umzugsfirma."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "Sofort nach Eingabe sehen Sie die Preisspanne. Detaillierte Offerten erhalten Sie innerhalb von 24 Stunden."
  },
  {
    question: "Sind alle Firmen geprüft?",
    answer: "Ja, alle Partner sind versichert, zertifiziert und werden regelmäßig überprüft."
  },
  {
    question: "Kann ich selbst wählen, welche Firmen mich kontaktieren?",
    answer: "Absolut. Sie wählen aus den Matches aus, welche Firmen Ihnen Offerten senden dürfen."
  }
];

export const FAQCompact = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Häufige Fragen
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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

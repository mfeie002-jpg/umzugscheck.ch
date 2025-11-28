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
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Häufig gestellte Fragen
          </h2>
          <p className="text-lg text-slate-600">
            Alles was Sie wissen müssen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border-slate-200 rounded-2xl px-6 shadow-sm">
                <AccordionTrigger className="text-left font-bold text-slate-900 hover:text-blue-600 py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-5 leading-relaxed">
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

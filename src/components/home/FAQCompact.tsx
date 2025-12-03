import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Wie funktioniert umzugscheck.ch?",
    answer: "Geben Sie Ihre Umzugsdetails ein, erhalten Sie kostenlose Offerten von bis zu 5 geprüften Umzugsfirmen, vergleichen Sie Preise und Bewertungen, und wählen Sie die beste Firma für Ihren Umzug."
  },
  {
    question: "Ist der Service wirklich kostenlos?",
    answer: "Ja, umzugscheck.ch ist für Privatkunden 100% kostenlos und unverbindlich. Sie bezahlen nur die Umzugsfirma, die Sie beauftragen."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "Nach der Eingabe Ihrer Daten erhalten Sie innerhalb von 24 Stunden bis zu 5 unverbindliche Offerten von geprüften Umzugsfirmen."
  },
  {
    question: "Sind die Umzugsfirmen geprüft?",
    answer: "Ja, alle Umzugsfirmen auf umzugscheck.ch sind versichert, zertifiziert und wurden mehrfach überprüft. Nur seriöse Schweizer Anbieter."
  },
  {
    question: "Kann ich kurzfristig umziehen?",
    answer: "Ja, viele Umzugsfirmen bieten auch kurzfristige Termine an. Geben Sie einfach Ihr gewünschtes Datum ein und Sie sehen verfügbare Anbieter."
  }
];

export const FAQCompact = () => {
  return (
    <section className="py-12 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-slate-900 heading-premium">
            Häufige Fragen
          </h2>
          <p className="text-sm md:text-xl text-slate-600 body-premium">
            Alles, was Sie über umzugscheck.ch wissen müssen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-gradient-elegant border-0 rounded-xl md:rounded-2xl px-4 md:px-6 shadow-medium hover:shadow-strong transition-shadow">
                <AccordionTrigger className="text-left font-bold text-slate-900 hover:text-blue-600 py-4 md:py-6 text-sm md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-4 md:pb-6 leading-relaxed text-sm md:text-base">
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

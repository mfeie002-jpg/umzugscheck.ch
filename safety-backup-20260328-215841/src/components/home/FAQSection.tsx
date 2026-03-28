import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqColumn1 = [
  {
    question: "Wie funktioniert umzugscheck.ch?",
    answer: "Geben Sie Ihre Umzugsdetails ein, erhalten Sie kostenlose Offerten von bis zu 5 geprüften Umzugsfirmen, vergleichen Sie Preise und Bewertungen, und wählen Sie die beste Firma für Ihren Umzug."
  },
  {
    question: "Ist der Service wirklich kostenlos?",
    answer: "Ja, umzugscheck.ch ist für Privatkunden 100% kostenlos und unverbindlich. Sie bezahlen nur die Umzugsfirma, die Sie beauftragen. Keine versteckten Kosten."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "Nach der Eingabe Ihrer Daten erhalten Sie innerhalb von 24 Stunden bis zu 5 unverbindliche Offerten von geprüften Umzugsfirmen in Ihrer Region."
  },
  {
    question: "Welche Firmen sind auf der Plattform?",
    answer: "Alle Umzugsfirmen auf umzugscheck.ch sind geprüft, versichert und verfügen über echte Kundenbewertungen. Wir arbeiten nur mit seriösen und professionellen Partnern."
  }
];

const faqColumn2 = [
  {
    question: "Muss ich alle Offerten annehmen?",
    answer: "Nein, Sie sind zu nichts verpflichtet. Vergleichen Sie in Ruhe alle Offerten und wählen Sie nur die Firma, die am besten zu Ihnen passt – oder lehnen Sie alle ab."
  },
  {
    question: "Wie spare ich mit umzugscheck.ch?",
    answer: "Durch den direkten Vergleich mehrerer Offerten sparen Sie durchschnittlich 30-40% im Vergleich zu einer direkten Buchung ohne Vergleich."
  },
  {
    question: "Welche Regionen werden abgedeckt?",
    answer: "Wir decken alle 26 Schweizer Kantone ab. Egal ob Zürich, Bern, Basel, Genf oder ländliche Regionen – bei uns finden Sie die passende Umzugsfirma."
  },
  {
    question: "Was passiert nach der Anfrage?",
    answer: "Sie erhalten 3–5 Offerten per E-Mail innerhalb von 24–48 Stunden. Danach können Sie die Offerten in Ruhe vergleichen und bei Interesse direkt mit den Firmen in Kontakt treten. Keine Werbeanrufe."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Häufige Fragen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alles was Sie über umzugscheck.ch wissen müssen
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Mobile: Single Column */}
          <div className="md:hidden">
            <Accordion type="single" collapsible className="space-y-4">
              {[...faqColumn1, ...faqColumn2].map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card rounded-xl px-6 border border-border/50 shadow-soft"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Desktop: Two Columns */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <div>
              <Accordion type="single" collapsible className="space-y-4">
                {faqColumn1.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem 
                      value={`col1-item-${index}`}
                      className="bg-card rounded-xl px-6 border border-border/50 shadow-soft"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>

            <div>
              <Accordion type="single" collapsible className="space-y-4">
                {faqColumn2.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem 
                      value={`col2-item-${index}`}
                      className="bg-card rounded-xl px-6 border border-border/50 shadow-soft"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

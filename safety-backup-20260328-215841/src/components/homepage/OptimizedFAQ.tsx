import { memo } from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

export const OptimizedFAQ = memo(function OptimizedFAQ() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-3xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            <HelpCircle className="w-8 h-8 text-secondary" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-muted-foreground text-lg">
            Alles, was Sie über unseren Vergleichsservice wissen müssen.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 shadow-soft hover:shadow-medium transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 hover:text-secondary transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 pl-10">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{faq.answer}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <p className="text-muted-foreground text-sm mb-4">
              Noch Fragen? Wir sind für Sie da!
            </p>
            <Button asChild variant="outline">
              <Link to="/kontakt" className="inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Kontaktieren Sie uns
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

/**
 * FAQSection - Frequently asked questions with accordion
 * Includes JSON-LD schema markup for SEO
 */

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Kostet mich der Service von umzugscheck.ch etwas?",
    answer: "Nein, der Service ist für Sie als Kunde zu 100 % kostenlos und unverbindlich. Sie erhalten Offerten von Umzugsfirmen, ohne dafür zu bezahlen. Wir finanzieren uns über eine kleine Provision der teilnehmenden Umzugsfirmen.",
  },
  {
    question: "Wie viele Offerten erhalte ich normalerweise?",
    answer: "In der Regel erhalten Sie zwischen 3 und 5 Offerten von passenden Umzugsfirmen in Ihrer Region. Die genaue Anzahl hängt von der Verfügbarkeit der Partner in Ihrem Gebiet und der Komplexität Ihres Umzugs ab.",
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer: "Nein, Sie sind zu nichts verpflichtet. Sie können alle erhaltenen Offerten in Ruhe vergleichen und sich für die beste entscheiden – oder auch gar keine annehmen. Es entstehen Ihnen keine Kosten und keine Verpflichtungen.",
  },
  {
    question: "Wie schnell melden sich die Umzugsfirmen?",
    answer: "Die meisten Umzugsfirmen melden sich innerhalb von 24 Stunden bei Ihnen. Bei dringenden Anfragen oder kurzfristigen Umzügen kann es auch schneller gehen. In seltenen Fällen kann es bei Spitzenzeiten etwas länger dauern.",
  },
  {
    question: "Sind meine Daten sicher?",
    answer: "Ja, Ihre Daten werden gemäss Schweizer Datenschutzgesetz (DSG) verarbeitet und nur an die ausgewählten Umzugsfirmen weitergegeben. Wir verkaufen keine Daten an Dritte und versenden keine Werbung. Nach Abschluss des Vergleichsprozesses werden Ihre Daten gelöscht.",
  },
  {
    question: "Wie genau ist die KI-Preisschätzung?",
    answer: "Unsere KI analysiert tausende reale Umzugsdaten aus der Schweiz und berücksichtigt Faktoren wie Wohnungsgrösse, Distanz, Stockwerke und gewählte Services. Die Schätzung liegt typischerweise innerhalb von ±15 % des finalen Preises. Die konkreten Offerten der Firmen können davon abweichen.",
  },
  {
    question: "Welche Umzugsfirmen sind bei umzugscheck.ch gelistet?",
    answer: "Wir arbeiten ausschliesslich mit geprüften Schweizer Umzugsfirmen zusammen. Alle Partner durchlaufen einen Qualitätscheck bezüglich Versicherung, Erfahrung und Kundenbewertungen. So stellen wir sicher, dass Sie nur seriöse Angebote erhalten.",
  },
];

export default function FAQSection() {
  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
  
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Häufige Fragen zum Offertenvergleich
          </h2>
          <p className="text-muted-foreground">
            Alles, was Sie über unseren Service wissen müssen
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-card border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  <h3 className="pr-4">{faq.question}</h3>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

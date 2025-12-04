/**
 * FAQSection - Frequently asked questions with accordion
 * Includes JSON-LD schema markup for SEO
 * 
 * OPTIMIZATIONS:
 * 33. Numbered questions with badges
 * 34. Enhanced accordion styling
 * 35. Better visual feedback on open
 * 36. Icon indicators
 */

import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
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
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4"
          >
            <HelpCircle className="w-7 h-7 text-primary" />
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Häufige Fragen zum Offertenvergleich
          </h2>
          <p className="text-muted-foreground text-lg">
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`faq-${index}`}
                  className="bg-card border-2 border-border/50 rounded-xl px-0 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5 px-6 group [&[data-state=open]>div>.chevron]:rotate-180">
                    <div className="flex items-start gap-4 w-full pr-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors">
                        {index + 1}
                      </span>
                      <h3 className="flex-1 text-left">{faq.question}</h3>
                      <ChevronDown className="chevron w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 px-6 leading-relaxed">
                    <div className="pl-12 border-l-2 border-primary/20 ml-4">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        
        {/* Help text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-sm text-muted-foreground">
            Haben Sie weitere Fragen?{" "}
            <a href="/kontakt" className="text-primary hover:underline font-medium">
              Kontaktieren Sie uns
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * FAQ ACCORDION - ARCHETYPE VERSION
 * 
 * FAQ section with Schema.org markup
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet";
import type { FAQ } from "@/data/archetypeConfig";

interface FAQAccordionArchetypeProps {
  faqs: FAQ[];
  placeName: string;
  placeKind: 'canton' | 'city';
  serviceName?: string;
}

export const FAQAccordionArchetype = memo(({ 
  faqs, 
  placeName,
  placeKind,
  serviceName,
}: FAQAccordionArchetypeProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';
  const contextText = serviceName 
    ? `${serviceName} ${locationPrefix} ${placeName}`
    : `Umzügen ${locationPrefix} ${placeName}`;

  // Schema.org FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-16 md:py-20 scroll-mt-20">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Häufige Fragen zu {contextText}
          </h2>
          <p className="text-muted-foreground">
            Antworten auf die wichtigsten Fragen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-card border border-border rounded-xl px-4 md:px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
});

FAQAccordionArchetype.displayName = 'FAQAccordionArchetype';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { memo, useMemo } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface PremiumFAQProps {
  items: FAQItem[];
}

export const PremiumFAQ = memo(({ items }: PremiumFAQProps) => {
  // Memoize FAQ Schema
  const faqSchemaScript = useMemo(() => JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": { "@type": "Answer", "text": item.answer }
    }))
  }), [items]);

  return (
    <section className="py-12 md:py-16 bg-background relative" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-primary font-semibold text-xs uppercase tracking-wider mb-3">
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              FAQ
            </span>
            <h2 id="faq-heading" className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Häufig gestellte Fragen
            </h2>
            <p className="text-sm text-muted-foreground">
              Schnelle Antworten zu Umzugscheck.ch
            </p>
          </motion.div>
          
          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-2">
              {items.map((item, idx) => (
                <AccordionItem 
                  key={idx}
                  value={`item-${idx}`}
                  className="bg-card rounded-lg border border-border/50 px-4 shadow-sm data-[state=open]:shadow-soft data-[state=open]:border-primary/20 transition-all"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-3 hover:no-underline text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="flex-shrink-0 w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground" aria-hidden="true">
                        {idx + 1}
                      </span>
                      <span>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-3 pl-8 text-sm leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
          
          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="bg-muted/50 rounded-lg p-5 border border-border/50 inline-block">
              <MessageCircle className="h-5 w-5 text-primary mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground mb-1">Noch Fragen?</p>
              <p className="text-xs text-muted-foreground mb-3">Wir helfen gerne weiter.</p>
              <Link to="/kontakt">
                <Button variant="outline" size="sm" className="text-xs h-8 group">
                  Kontakt
                  <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchemaScript }} />
    </section>
  );
});

PremiumFAQ.displayName = 'PremiumFAQ';

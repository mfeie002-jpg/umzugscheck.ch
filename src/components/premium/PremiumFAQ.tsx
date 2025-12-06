import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string;
}

interface PremiumFAQProps {
  items: FAQItem[];
}

export const PremiumFAQ = ({ items }: PremiumFAQProps) => {
  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden" aria-labelledby="faq-heading">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              Häufige Fragen
            </span>
            <h2 id="faq-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Fragen zum Umzugsvergleich
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Alles, was Sie über unseren Service wissen müssen.
            </p>
          </motion.div>
          
          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {items.map((item, idx) => (
                <AccordionItem 
                  key={idx}
                  value={`item-${idx}`}
                  className="bg-card rounded-xl border border-border/50 px-5 shadow-sm data-[state=open]:shadow-medium data-[state=open]:border-primary/20 transition-all"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4 hover:no-underline group text-sm md:text-base">
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors" aria-hidden="true">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 pl-10 leading-relaxed text-sm md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
          
          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Noch Fragen?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Unser Team hilft Ihnen gerne weiter – kostenlos und unverbindlich.
              </p>
              <Link to="/kontakt">
                <Button variant="outline" size="sm" className="group">
                  Kontakt aufnehmen
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Schema Script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
};

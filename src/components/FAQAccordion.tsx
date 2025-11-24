import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  variant?: "default" | "compact" | "card";
  defaultOpen?: string[]; // Array of question texts to keep open by default
}

export const FAQAccordion = ({
  items,
  title = "Häufig gestellte Fragen",
  subtitle,
  variant = "default",
  defaultOpen = [],
}: FAQAccordionProps) => {
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

  const content = (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <Accordion 
        type="multiple" 
        defaultValue={defaultOpen}
        className="space-y-2"
      >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={item.question}
          className="border rounded-lg px-4 bg-background hover:bg-secondary/30 transition-colors"
        >
          <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
            <span className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{item.question}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pl-8">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
      </Accordion>
    </>
  );

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {subtitle && <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>}
        {content}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            {title}
          </CardTitle>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="mb-3">{title}</h2>
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
          {content}
        </div>
      </div>
    </section>
  );
};

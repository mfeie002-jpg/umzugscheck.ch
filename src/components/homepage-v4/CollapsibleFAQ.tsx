/**
 * Collapsible FAQ V4 - Accordion style for better UX
 * Addresses gap: "Accordion für FAQ-Section"
 */
import { memo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: 'Was kostet ein Umzug in der Schweiz?',
    answer: 'Die Kosten variieren je nach Distanz, Wohnungsgrösse und Services. Im Durchschnitt kostet ein lokaler Umzug einer 3-Zimmer-Wohnung CHF 1\'200 bis CHF 2\'500. Mit unserem Vergleich sparen Sie bis zu 40%.',
  },
  {
    question: 'Wie schnell erhalte ich Offerten?',
    answer: 'In der Regel erhalten Sie innerhalb von 24 Stunden bis zu 5 Offerten von geprüften Umzugsfirmen. Oft sogar schon innerhalb weniger Stunden.',
  },
  {
    question: 'Sind alle Firmen geprüft und versichert?',
    answer: 'Ja, wir arbeiten ausschliesslich mit verifizierten Schweizer Umzugsfirmen, die alle notwendigen Versicherungen (Betriebshaftpflicht, Transportversicherung) nachweisen können.',
  },
  {
    question: 'Ist der Service wirklich kostenlos?',
    answer: '100% kostenlos und unverbindlich für Sie. Die Umzugsfirmen zahlen eine kleine Vermittlungsgebühr, wenn ein Umzug zustande kommt. Für Sie entstehen keine Kosten.',
  },
  {
    question: 'Wie funktioniert der KI-Video-Scan?',
    answer: 'Filmen Sie einfach Ihre Wohnung mit dem Smartphone. Unsere KI erkennt automatisch Möbel und Gegenstände und erstellt ein präzises Inventar. Das spart Zeit und führt zu genaueren Offerten.',
  },
  {
    question: 'Was passiert mit meinen Daten?',
    answer: 'Ihre Daten werden ausschliesslich auf Schweizer Servern gespeichert und sind DSG-konform geschützt. Wir geben keine Daten an Dritte weiter und Sie erhalten keine Werbeanrufe.',
  },
];

export const CollapsibleFAQ = memo(function CollapsibleFAQ() {
  return (
    <section 
      className="py-16 md:py-20 bg-muted/30"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-secondary mb-4">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">FAQ</span>
            </div>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-4">
              Häufig gestellte Fragen
            </h2>
            <p className="text-muted-foreground">
              Alles, was Sie über unseren Service wissen müssen
            </p>
          </div>

          {/* Accordion */}
          <Accordion 
            type="single" 
            collapsible 
            className="space-y-3"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">
              Noch Fragen? Wir helfen gerne.
            </p>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Kontakt aufnehmen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

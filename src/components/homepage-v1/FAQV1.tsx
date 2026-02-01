/**
 * FAQ V1 - Mit Schema.org Markup
 * P1 Improvement #10 from Analysis
 * 
 * 5-7 Fragen, Accordion-Style, SEO-optimiert
 */
import { memo } from 'react';
import { FAQAccordion } from '@/components/FAQAccordion';

const faqs = [
  {
    question: 'Was kostet durchschnittlich ein Umzug in der Schweiz?',
    answer: 'Ein Umzug in der Schweiz kostet durchschnittlich CHF 1\'200 bis CHF 2\'500 für eine 3-Zimmer-Wohnung innerorts. Die Kosten hängen von Faktoren wie Distanz, Stockwerk, Möbelmenge und gewähltem Service ab. Mit unserem Vergleich können Sie bis zu 40% sparen.',
  },
  {
    question: 'Wie schnell erhalte ich Offerten?',
    answer: 'In der Regel erhalten Sie innerhalb von 24 Stunden bis zu 5 Offerten von geprüften Umzugsfirmen. Oft sogar schneller – viele Firmen antworten bereits innerhalb weniger Stunden.',
  },
  {
    question: 'Sind alle Umzugsfirmen geprüft und versichert?',
    answer: 'Ja, wir arbeiten ausschliesslich mit verifizierten Schweizer Umzugsfirmen. Viele unserer Partner sind SMA-zertifiziert (Swiss Movers Association) und alle verfügen über eine Betriebshaftpflichtversicherung.',
  },
  {
    question: 'Ist der Vergleich wirklich kostenlos?',
    answer: '100% kostenlos und unverbindlich. Sie erhalten Offerten, vergleichen in Ruhe und entscheiden selbst, ob und welche Firma Sie beauftragen. Es entstehen keine versteckten Kosten.',
  },
  {
    question: 'Wie verdient umzugscheck.ch Geld?',
    answer: 'Wir setzen auf volle Transparenz: Umzugsfirmen zahlen uns eine kleine Vermittlungsgebühr, wenn Sie einen Auftrag über uns erhalten. Für Sie als Kunde ist der Service komplett gratis.',
  },
  {
    question: 'Muss ich mich für ein Angebot entscheiden?',
    answer: 'Nein, Sie sind zu nichts verpflichtet. Der Vergleich ist 100% unverbindlich. Sie können alle Offerten ablehnen, ohne dass Kosten entstehen.',
  },
];

export const FAQV1 = memo(function FAQV1() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Häufige Fragen
            </h2>
            <p className="text-lg text-muted-foreground">
              Alles, was Sie wissen müssen
            </p>
          </div>

          {/* FAQ Accordion with Schema.org markup */}
          <FAQAccordion items={faqs} variant="compact" />

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Noch Fragen? Wir helfen gerne:{' '}
              <a 
                href="mailto:info@umzugscheck.ch" 
                className="text-secondary font-semibold hover:underline"
              >
                info@umzugscheck.ch
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

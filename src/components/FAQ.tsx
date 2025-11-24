import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet";

const faqs = [
  {
    question: "Ist Umzugscheck.ch wirklich kostenlos?",
    answer: "Ja, unser Service ist für Sie als Kunde 100% kostenlos. Wir finanzieren uns über Provisionen der Umzugsfirmen, wenn eine Buchung zustande kommt. Sie zahlen niemals extra für die Nutzung unserer Plattform."
  },
  {
    question: "Wie hoch sind die typischen Umzugskosten in der Schweiz?",
    answer: "Die Kosten variieren je nach Grösse und Distanz. Eine 2-Zimmer-Wohnung kostet ca. CHF 800-1'200, eine 3-4-Zimmer-Wohnung ca. CHF 1'500-2'500, und ein Einfamilienhaus ca. CHF 3'000-5'000. Mit unserem Rechner erhalten Sie eine genaue Schätzung für Ihren spezifischen Umzug."
  },
  {
    question: "Wie viele Offerten erhalte ich?",
    answer: "Sie erhalten bis zu 5 kostenlose Offerten von geprüften Umzugsfirmen in Ihrer Region. Die genaue Anzahl hängt von der Verfügbarkeit und Ihrem Standort ab. Manchmal sind es 3-4 Offerten, bei guter Verfügbarkeit auch 5."
  },
  {
    question: "Wann sollte ich meinen Umzug buchen?",
    answer: "Idealerweise 4-6 Wochen im Voraus, besonders für Umzüge am Monatsende oder in den Sommermonaten. Kurzfristige Buchungen (1-2 Wochen vorher) sind je nach Verfügbarkeit oft möglich, können aber teurer sein."
  },
  {
    question: "Wie lange dauert es, bis ich Offerten erhalte?",
    answer: "In der Regel erhalten Sie die ersten Offerten innerhalb von 24 Stunden. Die meisten Umzugsfirmen melden sich sehr schnell – oft bereits nach wenigen Stunden. Sie können die Offerten dann in Ruhe vergleichen."
  },
  {
    question: "Was ist mit Endreinigung und Abgabegarantie?",
    answer: "Viele unserer Partner bieten professionelle Endreinigungen mit Abgabegarantie an. Das bedeutet: Die Reinigung entspricht den Anforderungen der Vermieter, oder die Firma reinigt kostenfrei nach. Sie können diesen Service direkt im Rechner hinzufügen."
  },
  {
    question: "Sind die Umzugsfirmen wirklich geprüft?",
    answer: "Ja, alle unsere Partner durchlaufen einen strengen Prüfprozess. Wir überprüfen Lizenzen, Versicherungen, Kundenbewertungen und führen persönliche Gespräche. Nur seriöse, erfahrene Firmen werden aufgenommen."
  },
  {
    question: "Was passiert bei Schäden während des Umzugs?",
    answer: "Alle unsere Partnerfirmen verfügen über eine Haftpflichtversicherung. Bei Schäden können Sie sich direkt an die Umzugsfirma wenden. Die Versicherung deckt Schäden an Möbeln, Hausrat und Gebäuden während des Transports ab."
  },
  {
    question: "Kann ich auch kurzfristig einen Umzug buchen?",
    answer: "Ja, viele unserer Partner bieten auch kurzfristige Umzüge an. Je nach Verfügbarkeit sind Buchungen bereits 1-2 Wochen im Voraus möglich. Bei dringenden Umzügen empfehlen wir, dies im Rechner anzugeben."
  },
  {
    question: "Was passiert nach dem Absenden des Rechners?",
    answer: "Nach dem Absenden werden Ihre Angaben an passende Umzugsfirmen in Ihrer Region weitergeleitet. Diese erstellen individuelle Offerten für Sie. Sie erhalten die Offerten per E-Mail und können sie direkt auf unserer Plattform vergleichen."
  },
  {
    question: "Bin ich an eine Offerte gebunden?",
    answer: "Nein, Sie sind zu nichts verpflichtet. Die Offerten sind unverbindlich und dienen nur zum Vergleich. Sie entscheiden selbst, ob und welche Firma Sie buchen möchten. Es gibt keine automatischen Verträge oder Verpflichtungen."
  },
  {
    question: "Kann ich auch internationale Umzüge vergleichen?",
    answer: "Ja, viele unserer Partner bieten auch internationale Umzüge an – innerhalb Europas und weltweit. Wählen Sie einfach im Rechner 'Internationaler Umzug' aus und geben Sie Ihr Zielland an."
  }
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

export const FAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(FAQ_SCHEMA)}
        </script>
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="mb-4">Häufig gestellte Fragen</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Alles, was Sie über Umzugscheck.ch wissen müssen.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 shadow-soft"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

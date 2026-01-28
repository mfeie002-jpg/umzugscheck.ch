import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionBadge from "./SectionBadge";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "Wie weit im Voraus sollte ich meinen Umzug buchen?",
    answer: "Wir empfehlen, mindestens 4-6 Wochen im Voraus zu buchen, besonders in der Hochsaison (März-September). Für grosse Umzüge oder internationale Transporte sollten Sie 8-12 Wochen einplanen. In dringenden Fällen finden wir aber oft auch kurzfristig eine Lösung."
  },
  {
    question: "Was kostet ein Umzug mit Feierabend Umzüge?",
    answer: "Die Kosten hängen von verschiedenen Faktoren ab: Wohnungsgrösse, Distanz, Stockwerk und gewählte Zusatzleistungen. Nach einer kostenlosen Besichtigung erhalten Sie ein verbindliches Festpreisangebot – ohne versteckte Kosten. Als Richtwert: Ein 3-Zimmer-Umzug in Zürich beginnt ab ca. CHF 1'200."
  },
  {
    question: "Sind meine Möbel während des Umzugs versichert?",
    answer: "Ja, alle Umzüge sind bis CHF 2 Mio. vollversichert. Die Grundversicherung ist im Preis enthalten. Für besonders wertvolle Gegenstände wie Kunstwerke oder Antiquitäten bieten wir optionale Zusatzversicherungen an."
  },
  {
    question: "Bieten Sie auch nur einzelne Leistungen an?",
    answer: "Absolut! Sie können aus unserem modularen Angebot wählen – ob nur Transport, Einpackservice, Möbelmontage oder Reinigung. Wir passen uns flexibel Ihren Bedürfnissen an und erstellen ein individuelles Angebot."
  },
  {
    question: "Was unterscheidet Feierabend Umzüge von anderen Firmen?",
    answer: "Wir sind ein Schweizer Familienunternehmen mit über 40 Jahren Erfahrung. Das bedeutet: persönliche Betreuung statt Call-Center, feste Ansprechpartner, geschulte Mitarbeiter in Feierabend-Uniform und ein echtes Qualitätsversprechen. Bei uns ist Ihr Umzug keine Nummer."
  }
];

export default function FAQSection({
  faqs = defaultFAQs,
  title = "Häufige Fragen",
  subtitle = "Alles, was Sie über Ihren Umzug wissen müssen",
  showViewAll = true
}: FAQSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <SectionBadge>FAQ</SectionBadge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display mt-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border rounded-xl px-6 data-[state=open]:border-alpine/30 data-[state=open]:shadow-soft transition-all"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 gap-4">
                  <span className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-alpine flex-shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 pl-8 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {showViewAll && (
            <div className="text-center mt-10 space-y-4">
              <Link to="/concierge/faq">
                <Button variant="outline" size="lg" className="border-2">
                  Alle Fragen ansehen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Noch Fragen? <a href="tel:+41765681302" className="text-alpine font-medium hover:underline">Rufen Sie uns an</a> – wir beraten Sie gerne!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FAQ {
  question: string;
  answer: string;
}

interface CompanyFAQProps {
  companyName: string;
  customFAQs?: FAQ[];
}

const defaultFAQs: FAQ[] = [
  {
    question: "Wie weit im Voraus sollte ich buchen?",
    answer: "Wir empfehlen, mindestens 2-4 Wochen im Voraus zu buchen, besonders für Umzüge am Monatsende. Für Last-Minute-Anfragen kontaktieren Sie uns direkt - wir versuchen immer eine Lösung zu finden."
  },
  {
    question: "Was ist im Umzugspreis enthalten?",
    answer: "Unser Grundpreis beinhaltet das Team (je nach Paket 2-4 Personen), den Transporter, Grundversicherung und Standardausrüstung wie Möbeldecken und Gurte. Verpackungsmaterial und Zusatzservices können optional hinzugebucht werden."
  },
  {
    question: "Sind meine Möbel während des Umzugs versichert?",
    answer: "Ja, alle Umzüge sind grundversichert. Für besonders wertvolle Gegenstände wie Antiquitäten oder Kunstwerke empfehlen wir eine zusätzliche Wertsachenversicherung, die wir gerne für Sie organisieren."
  },
  {
    question: "Was passiert bei Schäden?",
    answer: "Sollte es trotz aller Vorsicht zu Schäden kommen, dokumentieren wir diese sofort vor Ort. Die Regulierung erfolgt unkompliziert über unsere Versicherung. Bei kleineren Schäden bieten wir oft eine direkte Entschädigung an."
  },
  {
    question: "Bieten Sie auch Endreinigung an?",
    answer: "Ja, wir bieten professionelle Endreinigung mit Abnahmegarantie an. Diese kann als Einzelservice oder im Paket mit dem Umzug gebucht werden. Die Reinigung erfolgt nach Schweizer Standard."
  },
  {
    question: "Können Sie auch Klaviere oder Tresore transportieren?",
    answer: "Ja, wir verfügen über Spezialausrüstung und geschultes Personal für Schwertransporte. Für Klaviere, Tresore, Billardtische und ähnliches erstellen wir gerne ein individuelles Angebot."
  }
];

export const CompanyFAQ = ({
  companyName,
  customFAQs
}: CompanyFAQProps) => {
  const faqs = customFAQs || defaultFAQs;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Häufige Fragen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Haben Sie weitere Fragen?</p>
              <p className="text-xs text-muted-foreground">
                Kontaktieren Sie {companyName} direkt für individuelle Anfragen
              </p>
            </div>
            <Link to="/kontakt">
              <Button variant="outline" size="sm">
                Kontakt
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyFAQ;

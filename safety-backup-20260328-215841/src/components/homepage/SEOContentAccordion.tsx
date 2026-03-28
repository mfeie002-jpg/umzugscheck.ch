/**
 * SEO Content Accordion
 * 
 * Purpose: Text-heavy SEO content for authority signals
 * Design: Collapsed accordion so it doesn't ruin UX
 * 
 * Placement: Very bottom, before footer
 */

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, TrendingUp, AlertTriangle, MapPin, Calculator } from "lucide-react";

const seoContent = [
  {
    id: "kosten-vergleich",
    icon: Calculator,
    title: "Was kostet ein Umzug in der Schweiz 2025?",
    content: `
      <p>Die Kosten für einen Umzug in der Schweiz variieren stark je nach Faktoren wie Wohnungsgrösse, Distanz und gewählten Zusatzleistungen. Hier ein Überblick der durchschnittlichen Preise:</p>
      
      <h4>Richtwerte nach Zimmerzahl (innerhalb einer Stadt):</h4>
      <ul>
        <li><strong>1-Zimmer-Wohnung:</strong> CHF 400 – 800</li>
        <li><strong>2-Zimmer-Wohnung:</strong> CHF 600 – 1'200</li>
        <li><strong>3-Zimmer-Wohnung:</strong> CHF 900 – 1'800</li>
        <li><strong>4-Zimmer-Wohnung:</strong> CHF 1'200 – 2'500</li>
        <li><strong>5+ Zimmer / Haus:</strong> CHF 2'000 – 5'000+</li>
      </ul>
      
      <h4>Preisfaktoren:</h4>
      <ul>
        <li><strong>Stockwerk:</strong> Ohne Lift kann der Preis um 20-40% steigen</li>
        <li><strong>Distanz:</strong> Fernumzüge (z.B. Zürich → Genf) kosten ca. CHF 2'000 – 4'000</li>
        <li><strong>Wochentag:</strong> Wochenenden und Monatsenden sind teurer</li>
        <li><strong>Saison:</strong> Sommer (Juli–September) ist Hochsaison</li>
      </ul>
      
      <p><strong>Tipp:</strong> Mit unserem kostenlosen Vergleich sparen Sie durchschnittlich 20-40% gegenüber dem erstbesten Angebot.</p>
    `,
  },
  {
    id: "fehler",
    icon: AlertTriangle,
    title: "Die 5 häufigsten Fehler beim Umziehen",
    content: `
      <ol>
        <li>
          <strong>Zu spät Offerten einholen:</strong> 
          Wer erst 2 Wochen vor dem Umzug sucht, zahlt mehr und hat weniger Auswahl. 
          Ideal: 6-8 Wochen vorher.
        </li>
        <li>
          <strong>Nur ein Angebot einholen:</strong> 
          Ohne Vergleich fehlt die Preisreferenz. Holen Sie mindestens 3 Offerten ein.
        </li>
        <li>
          <strong>Versicherung nicht prüfen:</strong> 
          Nicht alle Umzugsfirmen sind ausreichend versichert. Fragen Sie nach der Haftpflichtversicherung.
        </li>
        <li>
          <strong>Inventar nicht angeben:</strong> 
          Unvollständige Angaben führen zu Nachzahlungen am Umzugstag.
        </li>
        <li>
          <strong>Parkverbote vergessen:</strong> 
          In Städten wie Zürich oder Bern brauchen Sie eine Bewilligung. 
          Beantragen Sie diese mindestens 2 Wochen vorher beim Tiefbauamt.
        </li>
      </ol>
    `,
  },
  {
    id: "regional",
    icon: MapPin,
    title: "Umzugskosten nach Region: Zürich vs. Bern vs. Basel",
    content: `
      <p>Die Umzugskosten unterscheiden sich je nach Region deutlich:</p>
      
      <h4>Zürich (Stadt)</h4>
      <ul>
        <li>Höchstes Preisniveau der Schweiz</li>
        <li>Parkbewilligungen schwierig und teuer (CHF 50-100)</li>
        <li>Viele enge Altstadtstrassen = Zuschläge möglich</li>
        <li>Durchschnitt 3-Zimmer: CHF 1'400 – 2'200</li>
      </ul>
      
      <h4>Bern</h4>
      <ul>
        <li>Etwas günstiger als Zürich</li>
        <li>Altstadt erfordert spezielle Logistik</li>
        <li>Durchschnitt 3-Zimmer: CHF 1'100 – 1'800</li>
      </ul>
      
      <h4>Basel</h4>
      <ul>
        <li>Grenzstadt = manche Firmen bieten DE/FR-Kombi an</li>
        <li>Durchschnitt 3-Zimmer: CHF 1'000 – 1'700</li>
      </ul>
      
      <h4>Ländliche Gebiete</h4>
      <ul>
        <li>20-30% günstiger als Städte</li>
        <li>Weniger Verkehrsstress, oft Gratisparkplätze</li>
        <li>Aber: Längere Anfahrtswege können Kosten erhöhen</li>
      </ul>
    `,
  },
  {
    id: "checkliste",
    icon: FileText,
    title: "Umzugs-Checkliste: Was Sie nicht vergessen dürfen",
    content: `
      <h4>8 Wochen vorher</h4>
      <ul>
        <li>Kündigung einreichen (beachten Sie die 3-Monats-Frist!)</li>
        <li>Umzugsfirmen vergleichen und buchen</li>
        <li>Urlaub für den Umzugstag beantragen</li>
      </ul>
      
      <h4>4 Wochen vorher</h4>
      <ul>
        <li>Adressänderung bei Post, Bank, Versicherungen</li>
        <li>Nachsendeauftrag bei der Post einrichten</li>
        <li>Parkverbotsschilder beantragen (falls nötig)</li>
        <li>Entrümpelung und Entsorgung planen</li>
      </ul>
      
      <h4>1 Woche vorher</h4>
      <ul>
        <li>Kartons packen und beschriften</li>
        <li>Zählerstand notieren (Strom, Wasser, Gas)</li>
        <li>Schlüssel organisieren</li>
      </ul>
      
      <h4>Am Umzugstag</h4>
      <ul>
        <li>Wohnungsübergabe mit Vermieter (Protokoll!)</li>
        <li>Alle Räume kontrollieren</li>
        <li>Inventar mit Umzugsfirma abgleichen</li>
      </ul>
      
      <h4>Nach dem Umzug</h4>
      <ul>
        <li>Ummeldung bei der Einwohnerkontrolle (14 Tage Frist!)</li>
        <li>eUmzugCH für Online-Meldung nutzen</li>
        <li>Depot-Rückforderung bei altem Vermieter</li>
      </ul>
    `,
  },
  {
    id: "trends",
    icon: TrendingUp,
    title: "Umzugstrends 2025: Was sich verändert hat",
    content: `
      <h4>Digitale Angebote</h4>
      <p>Immer mehr Umzugsfirmen bieten Video-Besichtigungen und KI-gestützte Preisrechner an. Das spart Zeit und ermöglicht schnellere, genauere Offerten.</p>
      
      <h4>Nachhaltigkeit</h4>
      <p>Wiederverwendbare Umzugsboxen statt Kartons werden beliebter. Einige Firmen bieten CO2-kompensierte Umzüge an.</p>
      
      <h4>Flexiblere Modelle</h4>
      <ul>
        <li><strong>Teil-Umzüge:</strong> Sie packen selbst, Firma transportiert nur</li>
        <li><strong>Beiladung:</strong> Günstigere Option bei flexiblem Datum</li>
        <li><strong>All-inclusive:</strong> Komplettservice mit Auspacken</li>
      </ul>
      
      <h4>Preise 2025</h4>
      <p>Durch steigende Treibstoffkosten und Inflation sind die Preise gegenüber 2023 um ca. 5-10% gestiegen. Umso wichtiger ist der Preisvergleich.</p>
    `,
  },
];

export const SEOContentAccordion = memo(function SEOContentAccordion() {
  return (
    <section className="py-12 md:py-16 bg-muted/20 border-t border-border/30">
      <div className="container max-w-4xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Ratgeber: Alles über Umzüge in der Schweiz
          </h2>
          <p className="text-sm text-muted-foreground">
            Expertenwissen für Ihren stressfreien Umzug
          </p>
        </motion.div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {seoContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <AccordionItem 
                value={item.id}
                className="bg-card border border-border/50 rounded-xl px-5 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-foreground text-sm md:text-base">
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none
                               prose-headings:text-foreground prose-headings:font-semibold
                               prose-h4:text-sm prose-h4:mt-4 prose-h4:mb-2
                               prose-p:text-muted-foreground prose-p:leading-relaxed
                               prose-li:text-muted-foreground prose-li:my-1
                               prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
});

export default SEOContentAccordion;

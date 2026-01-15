import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Calculator, ArrowRight, Check, Home, Building2, Truck, Package,
  Users, Clock, MapPin, Star, Sparkles, TrendingUp, Info
} from "lucide-react";

const priceTable = [
  { rooms: "1-Zimmer", selfMove: "CHF 200–400", withHelp: "CHF 400–700", fullService: "CHF 600–1'000", typical: "Student, Single" },
  { rooms: "2-Zimmer", selfMove: "CHF 300–500", withHelp: "CHF 600–1'000", fullService: "CHF 900–1'500", typical: "Paar, Starter" },
  { rooms: "3-Zimmer", selfMove: "CHF 400–700", withHelp: "CHF 800–1'400", fullService: "CHF 1'200–2'000", typical: "Familie (klein)" },
  { rooms: "4-Zimmer", selfMove: "CHF 500–900", withHelp: "CHF 1'000–1'800", fullService: "CHF 1'600–2'800", typical: "Familie" },
  { rooms: "5+ Zimmer", selfMove: "CHF 700–1'200", withHelp: "CHF 1'400–2'500", fullService: "CHF 2'200–4'000+", typical: "Grossfamilie, Haus" },
];

const costFactors = [
  { factor: "Wohnungsgrösse", impact: "hoch", icon: Home, description: "Mehr Zimmer = Mehr Volumen = Höherer Preis" },
  { factor: "Distanz", impact: "mittel", icon: MapPin, description: "Lokaler Umzug vs. Langstrecke" },
  { factor: "Stockwerk", impact: "mittel", icon: Building2, description: "Pro Etage ohne Lift ca. +CHF 50-100" },
  { factor: "Möbelmenge", impact: "hoch", icon: Package, description: "Wenig Möbel vs. Vollmöbliert" },
  { factor: "Zusatzservices", impact: "variabel", icon: Truck, description: "Packen, Montage, Reinigung" },
  { factor: "Zeitpunkt", impact: "mittel", icon: Clock, description: "Monatsende/Sommer = teurer" },
];

const savingTips = [
  { tip: "Frühzeitig buchen", saving: "10-20%", description: "Mindestens 4 Wochen im Voraus anfragen" },
  { tip: "Flexibel sein", saving: "15-30%", description: "Werktags statt Wochenende, Monatsmitte statt -ende" },
  { tip: "Selbst packen", saving: "CHF 200-500", description: "Verpackung in Eigenleistung" },
  { tip: "Entrümpeln", saving: "10-25%", description: "Weniger Volumen = Geringere Kosten" },
  { tip: "Offerten vergleichen", saving: "Bis 40%", description: "3-5 Angebote einholen und verhandeln" },
];

const faqs = [
  {
    question: "Was kostet ein Umzug in der Schweiz durchschnittlich?",
    answer: "Ein durchschnittlicher Umzug einer 3-Zimmer-Wohnung kostet in der Schweiz zwischen CHF 1'200 und CHF 2'000 (Full-Service). Bei Eigenleistung (selbst packen, nur Transport) sind CHF 800-1'400 realistisch. Die genauen Kosten hängen von Distanz, Stockwerk, Möbelmenge und gewählten Zusatzservices ab."
  },
  {
    question: "Wie setzen sich die Umzugskosten zusammen?",
    answer: "Die Hauptkomponenten sind: 1) Arbeitszeit der Umzugshelfer (CHF 35-50/Std. pro Person), 2) Fahrzeugkosten inkl. Kilometer, 3) Verpackungsmaterial (falls nicht selbst besorgt), 4) Zusatzservices wie Möbelmontage, Packservice oder Reinigung. Bei Langstrecken kommen Anfahrtskosten hinzu."
  },
  {
    question: "Lohnt sich ein Umzugsunternehmen oder selbst machen?",
    answer: "Die Entscheidung hängt von Ihrer Situation ab: Bei kleinen Umzügen (1-2 Zimmer, lokale Distanz, wenig Möbel) kann Selbstmachen günstiger sein. Bei grösseren Umzügen, wertvollen Möbeln oder wenig Zeit lohnt sich ein Profi meist. Rechnen Sie: Transportermiete (CHF 150-300/Tag) + Helfer + Zeit + Risiko vs. Festpreis mit Versicherung."
  },
  {
    question: "Welche versteckten Kosten gibt es beim Umzug?",
    answer: "Oft übersehen werden: Parkgebühren/Halteverbot (CHF 50-150), Stockwerkzuschläge, Möbellift bei engen Treppen (CHF 200-500), Entsorgung von Altmöbeln (CHF 50-200), Umzugsreinigung (CHF 500-1'500), Nachsendeauftrag Post (CHF 30-90). Fragen Sie immer nach einem Festpreis inkl. aller Nebenkosten."
  },
  {
    question: "Wann ist die beste Zeit für einen Umzug?",
    answer: "Am günstigsten sind: Werktage (Dienstag-Donnerstag), Monatsmitte (1.-20.), Nebensaison (November-Februar). Am teuersten: Monatsende, Wochenenden, Juli/August. Die Preisdifferenz kann 20-40% betragen. Buchen Sie frühzeitig für Wunschtermine."
  },
];

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Umzugskosten Schweiz 2025: Was kostet ein Umzug?",
  "description": "Kompletter Leitfaden zu Umzugskosten in der Schweiz. Preistabellen, Spartipps und Kostenrechner.",
  "author": { "@type": "Organization", "name": "Umzugscheck.ch" },
  "publisher": { "@type": "Organization", "name": "Umzugscheck.ch" },
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-15"
};

export default function UmzugskostenBerechnenPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Umzugskosten Schweiz 2025 | Was kostet ein Umzug? | Preistabelle + Rechner</title>
        <meta name="description" content="Was kostet ein Umzug in der Schweiz? ✓ Preistabelle nach Zimmerzahl ✓ Kostenfaktoren ✓ Spartipps bis 40% ✓ Kostenloser Umzugsrechner ✓ Jetzt informieren!" />
        <link rel="canonical" href="https://umzugscheck.ch/ratgeber/umzugskosten-berechnen" />
        <meta property="og:title" content="Umzugskosten Schweiz – Was kostet ein Umzug wirklich?" />
        <meta property="og:description" content="Kompletter Leitfaden zu Umzugskosten. Preise, Faktoren, Spartipps." />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-primary/10 text-primary">
                <TrendingUp className="w-3 h-3 mr-1" /> Aktualisiert Januar 2025
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-5">
                Was kostet ein <span className="text-primary">Umzug in der Schweiz</span>?
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Der komplette Leitfaden zu Umzugskosten – mit Preistabellen, Kostenfaktoren und 
                <strong> Spartipps bis 40%</strong>. Plus: Kostenloser Rechner für Ihre Situation.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/vergleich">
                    <Calculator className="w-5 h-5 mr-2" /> Kostenlos berechnen
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#preistabelle">Preistabelle ansehen</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* QUICK ANSWER */}
        <section className="py-12 bg-muted/30 border-y">
          <div className="container px-4">
            <Card className="max-w-4xl mx-auto border-primary/20 bg-primary/5">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <Info className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-bold mb-2">Kurze Antwort</h2>
                    <p className="text-muted-foreground">
                      Ein <strong>3-Zimmer-Umzug</strong> in der Schweiz kostet typischerweise 
                      <strong className="text-primary"> CHF 1'200 – 2'000</strong> (Full-Service) oder 
                      <strong className="text-primary"> CHF 800 – 1'400</strong> (nur Transport). 
                      Die genauen Kosten hängen von Distanz, Stockwerk und Zusatzservices ab.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PRICE TABLE */}
        <section id="preistabelle" className="py-16 bg-background scroll-mt-20">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Umzugskosten nach Wohnungsgrösse</h2>
              <p className="text-muted-foreground">Richtwerte für Umzüge innerhalb der Region (bis 50km)</p>
            </div>
            <div className="overflow-x-auto max-w-5xl mx-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-bold">Wohnungsgrösse</th>
                    <th className="px-4 py-3 text-left font-bold">Selbst-Umzug</th>
                    <th className="px-4 py-3 text-left font-bold">Mit Helfern</th>
                    <th className="px-4 py-3 text-left font-bold">Full-Service</th>
                    <th className="px-4 py-3 text-left font-bold hidden md:table-cell">Typisch für</th>
                  </tr>
                </thead>
                <tbody>
                  {priceTable.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                      <td className="px-4 py-3 font-medium">{row.rooms}</td>
                      <td className="px-4 py-3">{row.selfMove}</td>
                      <td className="px-4 py-3">{row.withHelp}</td>
                      <td className="px-4 py-3 font-medium text-primary">{row.fullService}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{row.typical}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              * Preise variieren je nach Region, Stockwerk und spezifischen Anforderungen
            </p>
          </div>
        </section>

        {/* COST FACTORS */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Was beeinflusst die Umzugskosten?</h2>
              <p className="text-muted-foreground">Die 6 wichtigsten Kostenfaktoren</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {costFactors.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <f.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">{f.factor}</h3>
                          <Badge variant={f.impact === 'hoch' ? 'default' : 'secondary'} className="text-xs">
                            Einfluss: {f.impact}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SAVING TIPS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">So sparen Sie beim Umzug</h2>
              <p className="text-muted-foreground">5 Tipps für bis zu 40% Ersparnis</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {savingTips.map((t, i) => (
                <Card key={i} className="border-green-200 bg-green-50/50">
                  <CardContent className="p-6">
                    <Badge className="bg-green-100 text-green-700 mb-3">
                      Sparpotenzial: {t.saving}
                    </Badge>
                    <h3 className="font-bold text-lg mb-2">{t.tip}</h3>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-white/80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Wie viel kostet Ihr Umzug genau?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Erhalten Sie kostenlos 3-5 individuelle Offerten von geprüften Umzugsfirmen. 
                Vergleichen Sie und sparen Sie bis zu 40%!
              </p>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6">
                <Link to="/vergleich">
                  <Calculator className="w-5 h-5 mr-2" /> Jetzt kostenlos berechnen
                </Link>
              </Button>
              <p className="text-sm text-white/70 mt-4">Unverbindlich • Kostenlos • In 60 Sekunden</p>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container px-4 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Häufige Fragen zu Umzugskosten</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* RELATED CONTENT */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Weiterführende Ratgeber</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link to="/ratgeber/checklisten">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-3 block">📋</span>
                    <h3 className="font-bold mb-2">Umzugscheckliste</h3>
                    <p className="text-sm text-muted-foreground">Nichts vergessen mit unserer Liste</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/ratgeber/tipps">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-3 block">💡</span>
                    <h3 className="font-bold mb-2">Umzugstipps</h3>
                    <p className="text-sm text-muted-foreground">Die besten Tipps für Ihren Umzug</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/services/reinigung">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-3 block">🧹</span>
                    <h3 className="font-bold mb-2">Umzugsreinigung</h3>
                    <p className="text-sm text-muted-foreground">Kosten & Anbieter vergleichen</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
    </div>
  );
}

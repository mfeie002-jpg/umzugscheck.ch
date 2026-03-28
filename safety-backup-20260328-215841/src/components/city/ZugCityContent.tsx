/**
 * GOLD STANDARD - Unique Content Sections für Stadt Zug
 * Anti-Duplicate: Diese Inhalte erscheinen NUR auf /umzugsfirmen/zug
 * 
 * Maximale Qualität:
 * - 6 einzigartige Content-Sektionen
 * - Lokale Quartierdetails (Altstadt, Herti, Guthirt, Lorzen, etc.)
 * - Spezifische Preisbeispiele
 * - Expat & Firmenumzug-Fokus
 * - Komplettpaket-Hervorhebung
 * - Interne Verlinkung zu Nachbarstädten & Kanton
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Building2, 
  Briefcase, 
  Globe, 
  Package, 
  Sparkles, 
  Home,
  ArrowRight,
  AlertCircle,
  Clock,
  Mountain,
  Anchor,
  Car,
  Euro,
  Check,
  Users,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ZugCityContentProps {
  onCTAClick: () => void;
}

export const ZugCityContent = memo(({ onCTAClick }: ZugCityContentProps) => {
  return (
    <>
      {/* Disclaimer Block - directly after hero */}
      <section className="py-6 bg-amber-50 border-y border-amber-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Hinweis:</strong> Umzugscheck.ch ist ein Vergleichs- & Vermittlungsservice. 
              Der Umzug wird durch geprüfte Partnerfirmen durchgeführt, nicht durch uns.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Umzug in Zug - Stadtquartiere im Detail */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Umzug in der Stadt Zug: Quartiere & Besonderheiten
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                Die Stadt Zug (ca. 32'000 Einwohner) verbindet historische Altstadt, 
                malerische Seepromenade und modernes Wirtschaftszentrum. Jedes Quartier 
                stellt eigene Anforderungen an einen Umzug:
              </p>
            </div>

            {/* Quartier-Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card className="p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Anchor className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Altstadt & Seepromenade</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Enge Gassen, Fussgängerzonen</li>
                  <li>• Halteverbotszone Pflicht (CHF 80-150)</li>
                  <li>• Zeitfenster für Anlieferung</li>
                  <li>• Möbellift für Altbauten</li>
                </ul>
              </Card>

              <Card className="p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Herti & Guthirt</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Moderne Wohnblöcke mit Lift</li>
                  <li>• Gute Parkplatzsituation</li>
                  <li>• Schnelle Zufahrt</li>
                  <li>• Oft günstiger als Zentrum</li>
                </ul>
              </Card>

              <Card className="p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Lorzen & Oberwil</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Familienquartiere, Einfamilienhäuser</li>
                  <li>• Gartengeräte & Velos einplanen</li>
                  <li>• Meist eigene Zufahrt</li>
                  <li>• Grössere Umzugsvolumen</li>
                </ul>
              </Card>

              <Card className="p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Euro className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Bahnhof & Crypto Valley</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Büros & Studios</li>
                  <li>• Hohe Fluktuation</li>
                  <li>• Express-Umzüge gefragt</li>
                  <li>• Mehrsprachige Teams</li>
                </ul>
              </Card>

              <Card className="p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Mountain className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Zugerberg</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Steile Zufahrt, enge Strassen</li>
                  <li>• Kleinere Fahrzeuge nötig</li>
                  <li>• Premium-Lagen</li>
                  <li>• Spezialtransport für Villen</li>
                </ul>
              </Card>

              <Card className="p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Letzi & Industrie</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gute Anbindung A4</li>
                  <li>• Lagerräume & Hallen</li>
                  <li>• Firmenumzüge</li>
                  <li>• Keine Parkprobleme</li>
                </ul>
              </Card>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h3 className="font-semibold mb-3">Typische Herausforderungen in Zug</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Halteverbotszonen am Seeufer rechtzeitig beantragen</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Altbauten ohne Lift: Möbellift für 3.+ Etage empfohlen</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Monatsende: Termine 3-4 Wochen im Voraus sichern</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Zugerberg: Kleinere Fahrzeuge und erfahrene Fahrer</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Preisbeispiele Stadt Zug */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Euro className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Umzugspreise in der Stadt Zug – Richtwerte 2025
              </h2>
            </div>

            <p className="text-muted-foreground mb-8">
              Die Kosten variieren je nach Quartier, Stockwerk und Zusatzservices. 
              Hier finden Sie aktuelle Richtwerte für typische Umzüge:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-semibold">Route</th>
                    <th className="text-left py-3 font-semibold">Wohnung</th>
                    <th className="text-right py-3 font-semibold">Preisspanne</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3">Altstadt → Herti</td>
                    <td className="py-3">2 Zimmer</td>
                    <td className="py-3 text-right font-medium text-foreground">CHF 690–1'100</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Guthirt → Baar</td>
                    <td className="py-3">3.5 Zimmer</td>
                    <td className="py-3 text-right font-medium text-foreground">CHF 950–1'450</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Seestrasse → Cham</td>
                    <td className="py-3">4.5 Zimmer</td>
                    <td className="py-3 text-right font-medium text-foreground">CHF 1'300–1'950</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Oberwil → Steinhausen</td>
                    <td className="py-3">5 Zimmer EFH</td>
                    <td className="py-3 text-right font-medium text-foreground">CHF 1'800–2'600</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Zürich → Zug (Expat)</td>
                    <td className="py-3">3.5 Zimmer</td>
                    <td className="py-3 text-right font-medium text-foreground">CHF 1'400–2'100</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Hinweis:</strong> Preise inkl. Team, Transport, Basis-Verpackung. 
                Zusatzkosten möglich für: Halteverbotszone (+CHF 80-150), Möbellift (+CHF 200-400), 
                Endreinigung, Möbelmontage, Einlagerung. Verbindliche Preise nur per Offerte.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" onClick={onCTAClick}>
                Jetzt unverbindliche Offerte erhalten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Expat & Firmenumzug */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Expat Moving & Firmenumzug in Zug
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Expat Relocation
                </h3>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    Zug ist Sitz des "Crypto Valley" und internationaler Konzerne. 
                    Entsprechend hoch ist die Nachfrage nach Umzügen für Expat-Familien.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>Mehrsprachige Teams (DE/EN/FR)</li>
                    <li>Internationale Umzüge (EU & Übersee)</li>
                    <li>Zollformalitäten & Einfuhrbewilligungen</li>
                    <li>Relocation-Services auf Anfrage</li>
                    <li>Diskreter Service für VIPs</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Büro- & Firmenumzug
                </h3>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    Startups, Praxen und etablierte Unternehmen verlegen ihren Sitz nach Zug.
                    Unsere Partner sind auf Business-Umzüge spezialisiert.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>Umzüge am Wochenende</li>
                    <li>Serverraum- & IT-Equipment-Transport</li>
                    <li>Praxis- und Kanzleiumzüge</li>
                    <li>Archiv- & Aktentransport</li>
                    <li>Montag-Morgen einsatzbereit</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">International Moving to Zug</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Moving to Zug from abroad? Our partner companies offer English-speaking 
                teams, customs handling, and full relocation packages. Whether you're 
                joining a crypto startup or a multinational corporation – we connect 
                you with experienced local movers.
              </p>
              <Button variant="outline" onClick={onCTAClick} className="w-full sm:w-auto">
                Get quotes for Expat Move
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Komplettpaket */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Komplettpaket: Umzug + Endreinigung + Wohnungsabgabe
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                In Zug sind Vermieter besonders anspruchsvoll bei der Wohnungsabnahme. 
                Mit einem <strong>Komplettpaket</strong> reduzieren Sie Stress und sparen Zeit – 
                unsere Partnerfirmen koordinieren alles aus einer Hand.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-5 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Umzug</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Professionelles Tragen & Transport</li>
                  <li>• Verpackungsmaterial inklusive</li>
                  <li>• Möbelmontage/-demontage</li>
                  <li>• Halteverbot-Organisation</li>
                  <li>• Möbellift bei Bedarf</li>
                </ul>
              </div>

              <div className="bg-card p-5 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Endreinigung</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Küche, Bad, alle Räume</li>
                  <li>• Fenster innen/aussen</li>
                  <li>• Backofen & Kühlschrank</li>
                  <li>• Abnahme-Garantie auf Wunsch</li>
                  <li>• Zuger Standard erfüllt</li>
                </ul>
              </div>

              <div className="bg-card p-5 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Wohnungsabgabe</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Terminkoordination</li>
                  <li>• Protokollbegleitung</li>
                  <li>• Schlüsselübergabe</li>
                  <li>• Ein Ansprechpartner</li>
                  <li>• Nachbesserung bei Mängeln</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 mb-8">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">Abnahme-Garantie</h4>
                  <p className="text-sm text-muted-foreground">
                    Viele unserer Partner bieten eine Abnahme-Garantie: Falls der Vermieter 
                    bei der Abnahme Mängel an der Reinigung feststellt, wird kostenlos 
                    nachgebessert. Das gibt Sicherheit – besonders in Zug, wo Vermieter 
                    oft sehr genau hinschauen.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" onClick={onCTAClick} className="h-14 px-8">
                Komplettpaket anfragen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                Kostenlos vergleichen. Die Durchführung erfolgt durch geprüfte Partnerfirmen.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Tipps für den Umzug in Zug */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                5 Tipps für Ihren Umzug in Zug
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Früh buchen – besonders am Monatsende</h3>
                  <p className="text-muted-foreground text-sm">
                    Zug hat einen angespannten Wohnungsmarkt. Monatsende-Termine sind extrem 
                    gefragt – buchen Sie 3-4 Wochen im Voraus. Mittwoch/Donnerstag sind oft günstiger.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Halteverbotszone rechtzeitig beantragen</h3>
                  <p className="text-muted-foreground text-sm">
                    In der Altstadt und am Seeufer ist eine Halteverbotszone Pflicht. Kosten: 
                    CHF 80-150. Unsere Partnerfirmen übernehmen die Beantragung für Sie.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Möbellift prüfen</h3>
                  <p className="text-muted-foreground text-sm">
                    Viele Zuger Altbauten haben enge Treppenhäuser. Ein Möbellift schont 
                    Möbel und Gebäude – und ist für Sofas und Schränke oft die einzige Option.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold shrink-0">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Mehrere Offerten vergleichen</h3>
                  <p className="text-muted-foreground text-sm">
                    Die Preisunterschiede in Zug können erheblich sein. Mit unserem Vergleich 
                    erhalten Sie 3-5 Offerten und sparen bis zu 40%.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold shrink-0">5</div>
                <div>
                  <h3 className="font-semibold mb-1">Komplettpaket nutzen</h3>
                  <p className="text-muted-foreground text-sm">
                    Umzug + Endreinigung + Wohnungsabgabe aus einer Hand spart Zeit und gibt 
                    Sicherheit. In Zug sind Vermieter oft sehr anspruchsvoll – mit Abnahme-Garantie 
                    sind Sie auf der sicheren Seite.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 6: Nearby Cities & Internal Links */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Umzugsfirmen in der Nähe</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { name: 'Baar', slug: 'baar', desc: 'Grösste Zuger Gemeinde' },
                { name: 'Cham', slug: 'cham', desc: 'Am Zugersee' },
                { name: 'Steinhausen', slug: 'steinhausen', desc: 'Familienfreundlich' },
                { name: 'Hünenberg', slug: 'huenenberg', desc: 'See & Natur' },
                { name: 'Risch-Rotkreuz', slug: 'risch-rotkreuz', desc: 'Verkehrsknoten' },
                { name: 'Oberägeri', slug: 'oberaegeri', desc: 'Ägerital' },
                { name: 'Unterägeri', slug: 'unteraegeri', desc: 'Ägerisee' },
              ].map((city) => (
                <Link
                  key={city.slug}
                  to={`/umzugsfirmen/${city.slug}`}
                  className="px-4 py-2 bg-card rounded-full text-sm font-medium hover:bg-card/80 transition-colors border border-border/50"
                  title={city.desc}
                >
                  {city.name}
                </Link>
              ))}
              <Link
                to="/umzugsfirmen/kanton-zug"
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                Kanton Zug (alle Gemeinden) →
              </Link>
            </div>

            <h3 className="text-lg font-semibold mb-4 mt-8">Nachbarkantone</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { name: 'Zürich', slug: 'kanton-zuerich' },
                { name: 'Luzern', slug: 'kanton-luzern' },
                { name: 'Schwyz', slug: 'kanton-schwyz' },
                { name: 'Aargau', slug: 'kanton-aargau' },
              ].map((canton) => (
                <Link
                  key={canton.slug}
                  to={`/umzugsfirmen/${canton.slug}`}
                  className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  {canton.name}
                </Link>
              ))}
            </div>

            {/* Service Links */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Weitere Services in Zug</h4>
              <div className="flex flex-wrap gap-3">
                <Link to="/services/reinigung" className="text-sm text-primary hover:underline">
                  Endreinigung Zug →
                </Link>
                <Link to="/services/moebellift" className="text-sm text-primary hover:underline">
                  Möbellift Zug →
                </Link>
                <Link to="/services/lagerung" className="text-sm text-primary hover:underline">
                  Einlagerung Zug →
                </Link>
                <Link to="/services/entsorgung" className="text-sm text-primary hover:underline">
                  Entsorgung Zug →
                </Link>
                <Link to="/firmenumzug" className="text-sm text-primary hover:underline">
                  Firmenumzug →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

ZugCityContent.displayName = "ZugCityContent";
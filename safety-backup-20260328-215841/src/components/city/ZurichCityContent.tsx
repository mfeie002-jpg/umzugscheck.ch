/**
 * Unique Content Sections für Stadt Zürich
 * Anti-Duplicate: Diese Inhalte erscheinen NUR auf /umzugsfirmen/zuerich
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
  Train,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZurichCityContentProps {
  onCTAClick: () => void;
}

export const ZurichCityContent = memo(({ onCTAClick }: ZurichCityContentProps) => {
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

      {/* Section 1: Umzug in Zürich - Stadtkreise, Limmat & Logistik */}
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
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Umzug in Zürich: Stadtkreise, Limmat & Logistik
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Zürich ist mit über 430'000 Einwohnern die grösste Stadt der Schweiz und bietet 
                12 Stadtkreise mit völlig unterschiedlichen Charakteren – vom hippen Kreis 4 über 
                das noble Seefeld bis zum familienfreundlichen Oerlikon. Jeder Kreis stellt eigene 
                Anforderungen an einen Umzug.
              </p>
              <p>
                <strong>Typische Herausforderungen bei einem Umzug in Zürich:</strong>
              </p>
              <ul className="grid md:grid-cols-2 gap-3 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Altstadt & Niederdorf: Enge Gassen, keine Einfahrt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Kreis 1-4: Halteverbotszonen oft Pflicht (CHF 80-150)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Seefeld & Riesbach: Parkdruck, Zufahrtszeiten beachten</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Altbauten ohne Lift: Möbellift für 3.+ Etage empfohlen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Monatsende: Früh buchen (4-8 Wochen Vorlauf)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Langstrasse/Kreis 4: Verkehrsdichte, Nachtruhe</span>
                </li>
              </ul>
              <p>
                Unsere Zürcher Partnerfirmen kennen jedes Quartier – von der Bahnhofstrasse bis 
                Witikon, von Schwamendingen bis Altstetten. Sie organisieren Halteverbotszonen, 
                Möbellifte und optimale Zeitfenster.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Firmenumzug & internationale Haushalte in Zürich */}
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
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Firmenumzug & internationale Haushalte in Zürich
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Als Finanz- und Wirtschaftsmetropole der Schweiz ist Zürich Sitz zahlreicher 
                  internationaler Unternehmen. Entsprechend hoch ist die Nachfrage nach 
                  professionellen Büroumzügen und Relocation-Services für Expats.
                </p>
                <p>
                  <strong>Spezialisierte Services für Zürich:</strong>
                </p>
                <ul className="space-y-2">
                  <li>Büroumzüge am Wochenende (IT-Equipment)</li>
                  <li>Praxisumzüge (Ärzte, Zahnärzte, Anwälte)</li>
                  <li>Expat-Relocation (D/E/F Service)</li>
                  <li>Internationale Umzüge (EU & Übersee)</li>
                  <li>Kunst- & Spezialtransporte</li>
                </ul>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Expat Moving Zürich</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Viele unserer Zürcher Partner bieten mehrsprachige Teams und Full-Service 
                  Pakete für internationale Haushalte – inklusive Zollformalitäten bei 
                  Umzügen aus dem Ausland.
                </p>
                <Button variant="outline" onClick={onCTAClick} className="w-full">
                  Offerte für Firmen-/Expat-Umzug
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Komplettpaket Zürich */}
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
                In Zürich sind Vermieter besonders anspruchsvoll bei der Wohnungsabnahme. 
                Mit einem Komplettpaket reduzieren Sie Stress und sparen Zeit – unsere 
                Partnerfirmen koordinieren alles aus einer Hand.
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
                  <li>• Halteverbots-Organisation</li>
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
                  <li>• Abnahme-Garantie auf Wunsch</li>
                  <li>• Zürcher Standard erfüllt</li>
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
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" onClick={onCTAClick} className="h-14 px-8">
                Komplettpaket anfragen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                Die Durchführung erfolgt durch geprüfte Partnerfirmen.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nearby Cities & Quartiere Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Umzugsfirmen in der Nähe & im Kanton Zürich</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Winterthur', slug: 'winterthur' },
                { name: 'Uster', slug: 'uster' },
                { name: 'Dübendorf', slug: 'dubendorf' },
                { name: 'Dietikon', slug: 'dietikon' },
                { name: 'Wetzikon', slug: 'wetzikon' },
                { name: 'Kloten', slug: 'kloten' },
                { name: 'Schlieren', slug: 'schlieren' },
              ].map((city) => (
                <Link
                  key={city.slug}
                  to={`/umzugsfirmen/${city.slug}`}
                  className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  {city.name}
                </Link>
              ))}
              <Link
                to="/umzugsfirmen/kanton-zuerich"
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                Kanton Zürich →
              </Link>
            </div>

            {/* Service Links */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Weitere Services</h4>
              <div className="flex flex-wrap gap-3">
                <Link to="/services/reinigung" className="text-sm text-primary hover:underline">
                  Endreinigung →
                </Link>
                <Link to="/services/moebellift" className="text-sm text-primary hover:underline">
                  Möbellift →
                </Link>
                <Link to="/services/lagerung" className="text-sm text-primary hover:underline">
                  Einlagerung →
                </Link>
                <Link to="/services/entsorgung" className="text-sm text-primary hover:underline">
                  Entsorgung →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

ZurichCityContent.displayName = "ZurichCityContent";

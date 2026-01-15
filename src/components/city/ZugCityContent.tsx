/**
 * Unique Content Sections für Stadt Zug
 * Anti-Duplicate: Diese Inhalte erscheinen NUR auf /umzugsfirmen/zug
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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

      {/* Section 1: Umzug in Zug - Altstadt, Seeufer & Logistik */}
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
                Umzug in Zug: Altstadt, Seeufer & Logistik
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Die Stadt Zug ist bekannt für ihre malerische Altstadt mit engen Gassen, die historische 
                Seepromenade und das exklusive Wohnviertel entlang des Zugersees. Diese besonderen 
                Gegebenheiten erfordern erfahrene Umzugsfirmen mit lokaler Ortskenntnis.
              </p>
              <p>
                <strong>Typische Herausforderungen bei einem Umzug in Zug:</strong>
              </p>
              <ul className="grid md:grid-cols-2 gap-3 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Enge Zufahrten in der Altstadt (Fussgängerzonen)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Halteverbotszonen am Seeufer organisieren</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Möbellift für Altbauten ohne Lift</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Zeitfenster für Anlieferung (Wochen-/Monatsende)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Tragewege von Parkplatz zur Wohnung</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Höhere Etagen in Gebäuden ohne Lift</span>
                </li>
              </ul>
              <p>
                Unsere Partnerfirmen kennen diese lokalen Besonderheiten und organisieren bei Bedarf 
                Halteverbotszonen, Möbellifte und spezielle Zeitfenster für Sie.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Firmenumzug & Expats in Zug */}
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
                Firmenumzug & Expats in Zug (DE/EN)
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Zug ist ein internationaler Wirtschaftsstandort mit vielen Expat-Familien und 
                  Unternehmen. Entsprechend hoch ist die Nachfrage nach mehrsprachigen Umzugsteams 
                  und diskreten Business-Umzügen.
                </p>
                <p>
                  <strong>Besondere Services für Expats & Firmen:</strong>
                </p>
                <ul className="space-y-2">
                  <li>Mehrsprachige Teams (Deutsch/Englisch)</li>
                  <li>Diskrete Abwicklung für Privathaushalte</li>
                  <li>Büro- & Praxisumzüge am Wochenende</li>
                  <li>Internationale Umzüge ins/aus dem Ausland</li>
                  <li>Koordination mit Relocation-Agenturen</li>
                </ul>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">International Relocation</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Für internationale Haushalte bieten viele unserer Partner umfassende Relocation-Services 
                  an – von der Wohnungssuche bis zur kompletten Umzugsabwicklung.
                </p>
                <Button variant="outline" onClick={onCTAClick} className="w-full">
                  Offerte für Expat-Umzug
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Komplettpaket Zug */}
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
                Stress reduzieren und Zeit sparen: Mit dem Komplettpaket koordinieren unsere 
                Partnerfirmen Umzug, professionelle Endreinigung und die Vorbereitung der 
                Wohnungsabgabe aus einer Hand.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-5 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Umzug</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tragen & Transport</li>
                  <li>• Verpackungsmaterial</li>
                  <li>• Möbelmontage/-demontage</li>
                  <li>• Optional: Einlagerung</li>
                </ul>
              </div>

              <div className="bg-card p-5 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Endreinigung</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Küche, Bad, Böden</li>
                  <li>• Fenster innen/aussen</li>
                  <li>• Abnahmevorbereitung</li>
                  <li>• Auf Wunsch: Garantie</li>
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

      {/* Nearby Cities Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Umzugsfirmen in der Nähe</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Baar', slug: 'baar' },
                { name: 'Cham', slug: 'cham' },
                { name: 'Steinhausen', slug: 'steinhausen' },
                { name: 'Hünenberg', slug: 'huenenberg' },
                { name: 'Risch-Rotkreuz', slug: 'risch-rotkreuz' },
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
                to="/umzugsfirmen/kanton-zug"
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                Kanton Zug →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

ZugCityContent.displayName = "ZugCityContent";

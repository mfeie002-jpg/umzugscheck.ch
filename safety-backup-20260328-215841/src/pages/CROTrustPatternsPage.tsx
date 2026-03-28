/**
 * CRO Trust Patterns Test Page
 * 
 * Dedicated landing page showcasing all 6 CRO patterns side-by-side
 * for A/B testing comparison and research validation
 * 
 * Patterns:
 * - V23 (W): Trust Floor / Der Anker
 * - V24 (X): Form Anchor / Integrierte Karte
 * - V25 (Y): Eyebrow Badge / Pre-Headline
 * - V26 (Z): Floating Cards / Visuelle Integration
 * - V27 (AA): Trust Ticker / Mobile Marquee
 * - V28 (AB): Glasmorphism Authority Bar
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FlaskConical, CheckCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";

// Import all CRO pattern variants
import { MediaLogosSectionVariantZ } from "@/components/homepage/MediaLogosSectionVariantZ";
import { MediaLogosSectionVariantAA } from "@/components/homepage/MediaLogosSectionVariantAA";
import { MediaLogosSectionVariantAB } from "@/components/homepage/MediaLogosSectionVariantAB";
import { MediaLogosSectionVariantAC } from "@/components/homepage/MediaLogosSectionVariantAC";
import { MediaLogosSectionVariantAD } from "@/components/homepage/MediaLogosSectionVariantAD";
import { MediaLogosSectionVariantAE } from "@/components/homepage/MediaLogosSectionVariantAE";

interface PatternInfo {
  id: string;
  version: string;
  title: string;
  subtitle: string;
  description: string;
  researchBasis: string;
  bestFor: string[];
  component: React.ComponentType;
}

const CRO_PATTERNS: PatternInfo[] = [
  {
    id: "W",
    version: "V23",
    title: "Trust Floor / Der Anker",
    subtitle: "Hero Footer Model",
    description: "Horizontaler Balken am unteren Rand des Hero-Bereichs. 80px Höhe, 90% Opacity. Monochrome Logos mit Farbe bei Hover.",
    researchBasis: "Die Hero-Sektion wird visuell abgeschlossen. Das Auge wandert: Headline → Formular → Trust Bar.",
    bestFor: ["Desktop", "Bildlastige Heroes", "Maximale Sichtbarkeit"],
    component: MediaLogosSectionVariantZ,
  },
  {
    id: "X",
    version: "V24",
    title: "Form Anchor / Integrierte Karte",
    subtitle: "Input Proximity Model",
    description: "Trust-Elemente als Footer der Formularkarte. Rating + Garantien direkt unter dem CTA (Point of Anxiety).",
    researchBasis: "Mikro-Proximität: Validierung am Entscheidungspunkt. Flow: Trigger → Action → Reassurance.",
    bestFor: ["Lead-Gen", "Mobile", "Formular-Conversions"],
    component: MediaLogosSectionVariantAA,
  },
  {
    id: "Y",
    version: "V25",
    title: "Eyebrow Badge",
    subtitle: "Pre-Headline Trust",
    description: "Trust-Badge ÜBER der Hauptüberschrift positioniert. Authority-First-Framing.",
    researchBasis: "Etabliert Autorität vor dem Verkaufsgespräch. Die Behauptung wird als Fakt gerahmt.",
    bestFor: ["Markenbekanntheit", "Premium-Services", "Authority-Building"],
    component: MediaLogosSectionVariantAB,
  },
  {
    id: "Z",
    version: "V26",
    title: "Floating Cards",
    subtitle: "Visuelle Integration",
    description: "UI-Karten, die über dem Hero-Bild schweben. Glasmorphism-Styling, subtile Hover-Animationen.",
    researchBasis: "Kontextueller Social Proof - Ergebnisse direkt im Bild verankert. Bricht statische Layouts auf.",
    bestFor: ["Hero-Bilder", "Premium-Look", "Interaktive Elemente"],
    component: MediaLogosSectionVariantAC,
  },
  {
    id: "AA",
    version: "V27",
    title: "Trust Ticker",
    subtitle: "Mobile Marquee",
    description: "Unendlich scrollende Laufschrift. Max 50px Höhe. Zeigt alle Logos in minimalem vertikalen Raum.",
    researchBasis: "Löst das Mobile-Platzproblem. Bewegung zieht Aufmerksamkeit an, ohne CTA zu verdrängen.",
    bestFor: ["Mobile-First", "Viele Partner", "Platzsparend"],
    component: MediaLogosSectionVariantAD,
  },
  {
    id: "AB",
    version: "V28",
    title: "Glasmorphism Authority",
    subtitle: "Premium Frosted Glass Bar",
    description: "Milchglas-Effekt mit backdrop-blur. Kombiniert Medien-Logos + Statistiken in einem Bar.",
    researchBasis: "High-End Tech-Ästhetik. Passt zum 'Smart Video Rechner'-Konzept. Links für Transparenz.",
    bestFor: ["Premium-Branding", "Tech-Plattformen", "Desktop"],
    component: MediaLogosSectionVariantAE,
  },
];

export default function CROTrustPatternsPage() {
  return (
    <>
      <Helmet>
        <title>CRO Trust Patterns - A/B Testing | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Startseite
            </Link>
            <Badge variant="outline" className="gap-1">
              <FlaskConical className="w-3 h-3" />
              Internal Testing
            </Badge>
          </div>
        </header>

        {/* Hero */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 gap-1" variant="secondary">
                <FlaskConical className="w-3 h-3" />
                CRO Research
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Trust Integration Patterns
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                6 forschungsbasierte Muster zur Integration von Vertrauenssignalen 
                in die Hero-Sektion. Basierend auf CRO-Analyse und Schweizer Marktforschung.
              </p>
              
              {/* Research Summary */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>80px max Höhe</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>90% Opacity</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Monochrome Logos</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Hover Farbe</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Patterns Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {CRO_PATTERNS.map((pattern, idx) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Pattern Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">
                        {pattern.version} ({pattern.id})
                      </Badge>
                      <h2 className="text-xl md:text-2xl font-bold">
                        {pattern.title}
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      {pattern.subtitle}
                    </p>
                  </div>

                  {/* Pattern Preview */}
                  <Card className="overflow-hidden mb-6">
                    <CardContent className="p-0">
                      <div className="bg-muted/20 border-b">
                        <pattern.component />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pattern Details */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Info className="w-4 h-4 text-primary" />
                          Beschreibung
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {pattern.description}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <FlaskConical className="w-4 h-4 text-amber-500" />
                          Forschungsbasis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {pattern.researchBasis}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Best For
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {pattern.bestFor.map((item) => (
                            <Badge key={item} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {idx < CRO_PATTERNS.length - 1 && (
                    <Separator className="mt-12" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Summary / Recommendation */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Empfehlung</CardTitle>
                <CardDescription className="text-center">
                  Basierend auf der CRO-Analyse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2">🖥️ Desktop</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Trust Floor (V23)</strong> oder <strong>Glasmorphism (V28)</strong> - 
                      Volle Breite, visuelle Stabilität, alle Logos sichtbar.
                    </p>
                  </div>
                  <div className="p-4 bg-alpine/5 rounded-lg border border-alpine/20">
                    <h3 className="font-semibold mb-2">📱 Mobile</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Trust Ticker (V27)</strong> oder <strong>Form Anchor (V24)</strong> - 
                      Platzsparend, CTA bleibt sichtbar, Mikro-Proximität.
                    </p>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    A/B-Test Hypothese: 15-20% Uplift bei Formularstarts durch reduzierte kognitive Reibung.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 border-t bg-background">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>CRO Trust Patterns Test Page • Internal Use Only</p>
            <p className="mt-1">
              Toggle variants on homepage with the Social A/B Toggle (📈 CRO Patterns category)
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

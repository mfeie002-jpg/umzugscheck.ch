/**
 * /ratgeber/wohnungsabgabe - Comprehensive Guide
 * 
 * High-value content page for apartment handover tips
 * Keywords: "Wohnungsabgabe Tipps", "Wohnungsübergabe Schweiz", "Abnahmeprotokoll"
 * Intent: Cold/Warm (informational → leads to Reinigung service)
 */

import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText,
  Sparkles,
  Camera,
  Key,
  ClipboardCheck,
  ArrowRight,
  Lightbulb,
  Shield,
  Heart,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const checklistItems = [
  {
    category: "2 Wochen vorher",
    icon: Clock,
    color: "text-blue-500",
    items: [
      "Reinigungstermin mit Putzfirma vereinbaren",
      "Alle Räume entrümpeln und persönliche Gegenstände entfernen",
      "Letzte Reparaturen planen (Dübellöcher, kleine Schäden)",
      "Zählerstand notieren (Strom, Wasser, Gas)"
    ]
  },
  {
    category: "1 Woche vorher",
    icon: ClipboardCheck,
    color: "text-orange-500",
    items: [
      "Vorabbesichtigung mit Vermieter anfragen (optional aber empfohlen)",
      "Alle Schlüssel zusammensuchen und zählen",
      "Bedienungsanleitungen für Geräte bereithalten",
      "Backup-Reinigungstermin planen (falls nötig)"
    ]
  },
  {
    category: "Am Abgabetag",
    icon: Key,
    color: "text-green-500",
    items: [
      "Professionelle Endreinigung durchführen lassen",
      "Alle Fenster putzen (innen und aussen)",
      "Küche gründlich reinigen (Backofen, Kühlschrank, Abzug)",
      "Badezimmer entkalken und desinfizieren",
      "Böden saugen/wischen, Teppiche reinigen"
    ]
  },
  {
    category: "Bei der Übergabe",
    icon: FileText,
    color: "text-purple-500",
    items: [
      "Abnahmeprotokoll gemeinsam durchgehen und unterschreiben",
      "Fotos aller Räume als Beweis machen",
      "Alle Schlüssel übergeben und quittieren lassen",
      "Kopie des Protokolls mitnehmen"
    ]
  }
];

const commonMistakes = [
  {
    mistake: "Keine professionelle Reinigung",
    consequence: "Häufigster Grund für nicht bestandene Abnahme. Kann 500-1'500 CHF Nachreinigung kosten.",
    solution: "Professionelle Reinigung mit Abnahmegarantie buchen"
  },
  {
    mistake: "Dübellöcher nicht gefüllt",
    consequence: "Vermieter kann Malerarbeiten in Rechnung stellen (oft pauschal 200-500 CHF pro Zimmer).",
    solution: "Alle Löcher mit Spachtelmasse füllen und überstreichen"
  },
  {
    mistake: "Kein eigenes Protokoll",
    consequence: "Bei Streitigkeiten fehlen Beweise für den Zustand bei Übergabe.",
    solution: "Fotos machen, Datum/Uhrzeit dokumentieren, Kopie des Protokolls behalten"
  },
  {
    mistake: "Vorabbesichtigung ablehnen",
    consequence: "Böse Überraschungen am Abgabetag, keine Zeit für Korrekturen.",
    solution: "Vorabbesichtigung 1-2 Wochen vor Abgabe durchführen"
  }
];

const faqs = [
  {
    question: "Was bedeutet 'besenrein' in der Schweiz?",
    answer: "In der Schweiz wird 'besenrein' oft strenger ausgelegt als in anderen Ländern. Es bedeutet in der Regel: professionell gereinigt, alle Flächen frei von Staub und Schmutz, Fenster geputzt (innen und aussen), Küche und Bad gründlich gereinigt, Böden gewischt/gesaugt. Viele Vermieter erwarten eine Reinigung auf 'Neuzustand'-Niveau."
  },
  {
    question: "Brauche ich eine Reinigung mit Abnahmegarantie?",
    answer: "Eine Reinigung mit Abnahmegarantie gibt Ihnen die Sicherheit, dass die Putzfirma kostenlos nachbessert, falls die Abnahme nicht bestanden wird. Bei den strengen Schweizer Standards ist dies sehr empfehlenswert – besonders bei erstmaliger Wohnungsabgabe oder anspruchsvollen Vermietern."
  },
  {
    question: "Was passiert, wenn die Abnahme nicht bestanden wird?",
    answer: "Bei nicht bestandener Abnahme haben Sie in der Regel 2-5 Tage Zeit, die Mängel zu beheben. Ist dies nicht möglich, kann der Vermieter eine Firma beauftragen und die Kosten von Ihrer Kaution abziehen. Daher ist Vorbereitung und professionelle Reinigung so wichtig."
  },
  {
    question: "Wer muss bei der Wohnungsabgabe anwesend sein?",
    answer: "Idealerweise Sie persönlich (oder eine bevollmächtigte Person) und der Vermieter oder die Verwaltung. Dokumentieren Sie alles schriftlich im Abnahmeprotokoll. Beide Parteien sollten unterschreiben."
  },
  {
    question: "Was gehört alles ins Abnahmeprotokoll?",
    answer: "Ein vollständiges Protokoll enthält: Datum und Uhrzeit, Namen aller Anwesenden, Zustand jedes Raumes, Zählerstände, Anzahl übergebener Schlüssel, erkannte Mängel mit Fotos, Unterschriften beider Parteien."
  }
];

const WohnungsabgabeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Wohnungsabgabe Schweiz: Checkliste & Tipps | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Vollständige Checkliste für die Wohnungsabgabe in der Schweiz. Tipps für die perfekte Übergabe, Reinigung mit Abnahmegarantie und häufige Fehler vermeiden." 
        />
        <meta name="keywords" content="Wohnungsabgabe, Wohnungsübergabe Schweiz, Abnahmeprotokoll, Endreinigung, besenrein" />
        <link rel="canonical" href="https://umzugscheck.ch/ratgeber/wohnungsabgabe" />
      </Helmet>

      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs items={[
            { label: "Ratgeber", href: "/ratgeber" },
            { label: "Wohnungsabgabe" }
          ]} />

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <Heart className="w-3 h-3 mr-1" />
              Stress vermeiden
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Wohnungsabgabe Schweiz:<br />
              <span className="text-primary">Der komplette Guide</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              So meistern Sie die Wohnungsübergabe stressfrei. Mit unserer Checkliste, 
              Insider-Tipps und Vermeidung der häufigsten Fehler.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { stat: "68%", label: "scheitern beim ersten Mal" },
              { stat: "1'200 CHF", label: "durchschnittliche Kosten bei Mängeln" },
              { stat: "95%", label: "Erfolg mit Profireinigung" },
              { stat: "490 CHF", label: "ab Preis Reinigung mit Garantie" }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{item.stat}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Warning Box */}
          <Card className="mb-12 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <AlertTriangle className="w-8 h-8 text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Wichtig: Schweizer Standards sind streng</h3>
                  <p className="text-muted-foreground">
                    In der Schweiz nehmen Vermieter die Wohnungsabgabe sehr ernst. Was in anderen Ländern 
                    als "sauber" gilt, reicht hier oft nicht aus. Planen Sie genug Zeit ein und ziehen Sie 
                    eine professionelle Reinigung in Betracht.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <ClipboardCheck className="w-8 h-8 text-primary" />
              Die ultimative Checkliste
            </h2>

            <div className="space-y-8">
              {checklistItems.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-3">
                        <section.icon className={`w-6 h-6 ${section.color}`} />
                        {section.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              Die 4 häufigsten Fehler (und wie Sie sie vermeiden)
            </h2>

            <div className="space-y-4">
              {commonMistakes.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">
                        ❌ {item.mistake}
                      </h3>
                      <p className="text-muted-foreground mb-3">{item.consequence}</p>
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Lightbulb className="w-4 h-4" />
                        <span className="font-medium">{item.solution}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA: Reinigung Service */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">
                  Reinigung mit Abnahmegarantie
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Kein Stress, keine Überraschungen. Unsere Partner reinigen Ihre Wohnung 
                  professionell – und bessern kostenlos nach, falls die Abnahme nicht bestanden wird.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/services/reinigung">
                      <Shield className="w-5 h-5 mr-2" />
                      Reinigung mit Garantie anfragen
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/umzugsofferten">
                      Umzug + Reinigung als Paket
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Häufige Fragen zur Wohnungsabgabe</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Photo Documentation Tip */}
          <Card className="mb-16 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Camera className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Profi-Tipp: Fotodokumentation</h3>
                  <p className="text-muted-foreground mb-3">
                    Machen Sie am Abgabetag Fotos von jedem Raum – mit sichtbarem Datum/Uhrzeit auf 
                    Ihrem Smartphone. Fotografieren Sie besonders:
                  </p>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Zählerstände
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Fenster (geputzt)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Küche (Backofen offen)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Badezimmer
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Alle übergebenen Schlüssel
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Unterschriebenes Protokoll
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Bereit für Ihren stressfreien Umzug?</h3>
            <p className="text-muted-foreground mb-6">
              Lassen Sie sich von unseren Partnern unterstützen – vom Umzug bis zur Reinigung.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/umzugsofferten">
                Jetzt kostenlose Offerten erhalten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WohnungsabgabeGuide;
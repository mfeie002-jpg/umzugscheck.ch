import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Truck, 
  Sparkles, 
  Package, 
  Building2, 
  Recycle, 
  CheckCircle2,
  Star,
  Clock,
  Shield,
  MapPin,
  Phone,
  Users,
  Award,
  Wrench,
  Home
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { initPerformanceOptimizations } from "@/lib/performance";

// Service configurations
const serviceConfigs: Record<string, {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  icon: any;
  heroImage: string;
  priceExamples: { size: string; price: string; includes: string[] }[];
  benefits: { icon: any; title: string; description: string }[];
  process: { step: number; title: string; description: string }[];
  additionalServices: { name: string; icon: any; link: string }[];
  faqs: { question: string; answer: string }[];
  testimonial: { name: string; location: string; rating: number; text: string };
  regions: string[];
}> = {
  reinigung: {
    name: "Umzugsreinigung",
    title: "Umzugsreinigung mit Abgabegarantie",
    subtitle: "Geprüfte Reinigungsfirmen mit Fixpreis-Angeboten und Abnahmegarantie",
    description: "Professionelle Endreinigung für Ihre alte Wohnung. Mit unserer Abgabegarantie sind Sie auf der sicheren Seite – falls der Vermieter Mängel findet, wird kostenlos nachgereinigt.",
    ctaText: "Reinigungs-Offerten vergleichen",
    icon: Sparkles,
    heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80",
    priceExamples: [
      { size: "1-2 Zimmer", price: "CHF 350–550", includes: ["Küche", "Bad", "Böden", "Fenster"] },
      { size: "3 Zimmer", price: "CHF 450–700", includes: ["Alle Räume", "Balkone", "Einbauschränke"] },
      { size: "4-5 Zimmer", price: "CHF 600–950", includes: ["Komplettreinigung", "Abgabegarantie", "Keller"] },
      { size: "6+ Zimmer / Haus", price: "CHF 900–1'500", includes: ["Alle Räume", "Garage", "Garten"] },
    ],
    benefits: [
      { icon: Shield, title: "Abgabegarantie", description: "Kostenlose Nachbesserung bei Mängeln" },
      { icon: Award, title: "Geprüfte Firmen", description: "Alle Anbieter sind verifiziert" },
      { icon: Clock, title: "Flexible Termine", description: "Auch kurzfristig verfügbar" },
      { icon: CheckCircle2, title: "Fixpreis", description: "Keine versteckten Kosten" },
    ],
    process: [
      { step: 1, title: "Anfrage stellen", description: "Geben Sie Ihre Wohnungsgröße und Wunschtermin an" },
      { step: 2, title: "Offerten erhalten", description: "Erhalten Sie bis zu 5 Angebote von geprüften Firmen" },
      { step: 3, title: "Anbieter wählen", description: "Vergleichen Sie Preise und Bewertungen" },
      { step: 4, title: "Reinigung durchführen", description: "Die Firma reinigt Ihre Wohnung professionell" },
      { step: 5, title: "Abnahme bestehen", description: "Mit Abgabegarantie sind Sie auf der sicheren Seite" },
    ],
    additionalServices: [
      { name: "Umzug", icon: Truck, link: "/privatumzug" },
      { name: "Entsorgung", icon: Recycle, link: "/entsorgung" },
      { name: "Montage", icon: Wrench, link: "/montage" },
      { name: "Lagerung", icon: Package, link: "/lagerung" },
    ],
    faqs: [
      { question: "Was beinhaltet eine Umzugsreinigung?", answer: "Eine professionelle Umzugsreinigung umfasst: Küche (inkl. Backofen, Kühlschrank), Bad/WC, alle Böden, Fenster, Türen, Einbauschränke, Balkone und auf Wunsch Keller/Estrich." },
      { question: "Was ist die Abgabegarantie?", answer: "Bei der Abgabegarantie übernimmt die Reinigungsfirma die Verantwortung. Falls der Vermieter Mängel findet, wird kostenlos nachgereinigt bis zur Abnahme." },
      { question: "Wie lange dauert eine Endreinigung?", answer: "Je nach Wohnungsgröße: 2-3 Zimmer ca. 4-6 Stunden, 4-5 Zimmer ca. 6-8 Stunden. Die Firmen arbeiten meist im Team." },
      { question: "Muss ich bei der Reinigung anwesend sein?", answer: "Nein, Sie können der Reinigungsfirma den Schlüssel übergeben. Bei der Abnahme sollten Sie oder ein Vertreter anwesend sein." },
      { question: "Was kostet eine Nachbesserung?", answer: "Bei Angeboten mit Abgabegarantie ist die Nachbesserung im Preis inbegriffen. Ohne Garantie können Nachbesserungen CHF 50-150 pro Stunde kosten." },
    ],
    testimonial: { name: "Sandra M.", location: "Zürich", rating: 5, text: "Die Reinigungsfirma hat einen super Job gemacht. Die Wohnung wurde beim ersten Mal abgenommen – die Abgabegarantie hat sich definitiv gelohnt!" },
    regions: ["Zürich", "Bern", "Basel", "Luzern", "St. Gallen", "Winterthur", "Genf", "Lausanne"],
  },
  entsorgung: {
    name: "Entsorgung",
    title: "Professionelle Entsorgung & Räumung",
    subtitle: "Schnelle und umweltgerechte Entsorgung von Möbeln, Sperrgut und Hausrat",
    description: "Von der Einzelmöbel-Entsorgung bis zur kompletten Haushaltsauflösung – unsere geprüften Partner entsorgen alles fachgerecht und umweltfreundlich.",
    ctaText: "Entsorgungs-Offerten vergleichen",
    icon: Recycle,
    heroImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80",
    priceExamples: [
      { size: "Einzelmöbel", price: "CHF 80–150", includes: ["Abholung", "Entsorgung", "Kurze Wege"] },
      { size: "Sperrgut (5-10 Stk)", price: "CHF 200–400", includes: ["Abholung", "Transport", "Recycling"] },
      { size: "Zimmerräumung", price: "CHF 400–800", includes: ["Kompletträumung", "Sortierung", "Entsorgung"] },
      { size: "Haushaltsauflösung", price: "CHF 1'200–3'000", includes: ["Alles inklusive", "Wertanrechnung", "Besenrein"] },
    ],
    benefits: [
      { icon: Recycle, title: "Umweltgerecht", description: "Fachgerechte Trennung und Recycling" },
      { icon: Clock, title: "Schnell & flexibel", description: "Oft innerhalb von 48 Stunden" },
      { icon: Award, title: "Faire Preise", description: "Transparente Pauschalpreise" },
      { icon: Shield, title: "Versichert", description: "Alle Arbeiten sind versichert" },
    ],
    process: [
      { step: 1, title: "Anfrage stellen", description: "Beschreiben Sie, was entsorgt werden soll" },
      { step: 2, title: "Offerten erhalten", description: "Erhalten Sie Festpreisangebote" },
      { step: 3, title: "Termin vereinbaren", description: "Wählen Sie einen passenden Termin" },
      { step: 4, title: "Abholung", description: "Die Firma holt alles ab" },
      { step: 5, title: "Entsorgung", description: "Fachgerechte Trennung und Recycling" },
    ],
    additionalServices: [
      { name: "Umzug", icon: Truck, link: "/privatumzug" },
      { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
      { name: "Lagerung", icon: Package, link: "/lagerung" },
      { name: "Montage", icon: Wrench, link: "/montage" },
    ],
    faqs: [
      { question: "Was kann entsorgt werden?", answer: "Praktisch alles: Möbel, Elektrogeräte, Matratzen, Teppiche, Bücher, Kleider, Hausrat, Gartenabfälle. Sondermüll (Farben, Chemikalien) wird separat behandelt." },
      { question: "Wie werden die Kosten berechnet?", answer: "Die Kosten richten sich nach Menge, Art der Gegenstände und Aufwand. Viele Firmen bieten Pauschalpreise nach Besichtigung oder Fotobewertung." },
      { question: "Was passiert mit noch brauchbaren Sachen?", answer: "Viele Anbieter prüfen, ob Gegenstände gespendet oder weiterverkauft werden können. Dies wird oft auf die Kosten angerechnet." },
      { question: "Wie schnell kann eine Entsorgung erfolgen?", answer: "Bei Standardentsorgungen oft innerhalb von 48-72 Stunden. Für größere Räumungen wird ein Termin nach Aufwand vereinbart." },
    ],
    testimonial: { name: "Peter K.", location: "Basel", rating: 5, text: "Musste nach einem Todesfall einen kompletten Haushalt auflösen. Die Firma war sehr einfühlsam und hat alles schnell und professionell erledigt." },
    regions: ["Zürich", "Bern", "Basel", "Luzern", "Aargau", "Solothurn", "Zug", "Thurgau"],
  },
  montage: {
    name: "Möbelmontage",
    title: "Professionelle Möbelmontage",
    subtitle: "Auf- und Abbau von Möbeln durch erfahrene Monteure",
    description: "Ob IKEA-Schrank, Einbauküche oder komplettes Büro – unsere Montage-Profis bauen Ihre Möbel fachgerecht auf und ab.",
    ctaText: "Montage-Offerten vergleichen",
    icon: Wrench,
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    priceExamples: [
      { size: "Einfache Möbel", price: "CHF 50–100", includes: ["Schrank", "Regal", "Tisch"] },
      { size: "Komplexe Möbel", price: "CHF 100–200", includes: ["PAX-Schrank", "Bett mit Lattenrost"] },
      { size: "Küchenmontage", price: "CHF 300–800", includes: ["Einbauküche", "Anschlüsse", "Justierung"] },
      { size: "Büromontage", price: "CHF 500–1'500", includes: ["Arbeitsplätze", "Schreibtische", "Regale"] },
    ],
    benefits: [
      { icon: Wrench, title: "Erfahrene Monteure", description: "Jahrelange Erfahrung mit allen Marken" },
      { icon: Clock, title: "Schnell & effizient", description: "Profis sind deutlich schneller" },
      { icon: Shield, title: "Garantie", description: "Gewährleistung auf alle Arbeiten" },
      { icon: Award, title: "Werkzeug inklusive", description: "Alles Nötige wird mitgebracht" },
    ],
    process: [
      { step: 1, title: "Möbel angeben", description: "Beschreiben Sie, was montiert werden soll" },
      { step: 2, title: "Offerten erhalten", description: "Erhalten Sie Festpreisangebote" },
      { step: 3, title: "Termin wählen", description: "Flexibel auch am Wochenende" },
      { step: 4, title: "Montage", description: "Professioneller Auf- oder Abbau" },
      { step: 5, title: "Kontrolle", description: "Gemeinsame Abnahme der Arbeit" },
    ],
    additionalServices: [
      { name: "Umzug", icon: Truck, link: "/privatumzug" },
      { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
      { name: "Entsorgung", icon: Recycle, link: "/entsorgung" },
      { name: "Lagerung", icon: Package, link: "/lagerung" },
    ],
    faqs: [
      { question: "Welche Möbel werden montiert?", answer: "Alle Arten: IKEA, Pax-Systeme, Küchen, Schlafzimmermöbel, Büromöbel, Kinderzimmer, Gartenmöbel und mehr." },
      { question: "Brauche ich eine Anleitung?", answer: "Idealerweise ja, aber erfahrene Monteure kennen die meisten gängigen Systeme auch ohne Anleitung." },
      { question: "Ist das Werkzeug dabei?", answer: "Ja, professionelle Monteure bringen ihr komplettes Werkzeug mit." },
      { question: "Was kostet die Demontage?", answer: "Abbau kostet in der Regel gleich viel wie Aufbau, manchmal etwas weniger." },
    ],
    testimonial: { name: "Lisa W.", location: "Zürich", rating: 5, text: "Der Monteur hat unsere komplette PAX-Schrankwand in 3 Stunden aufgebaut. Alleine hätten wir ein ganzes Wochenende gebraucht!" },
    regions: ["Zürich", "Bern", "Basel", "Luzern", "Winterthur", "St. Gallen", "Zug", "Aargau"],
  },
  lagerung: {
    name: "Lagerung",
    title: "Selfstorage & Möbellagerung",
    subtitle: "Sichere und flexible Lagerlösungen für jeden Bedarf",
    description: "Zwischenlagerung beim Umzug, Langzeitlagerung oder Selfstorage – finden Sie die passende Lagerlösung in Ihrer Nähe.",
    ctaText: "Lager-Offerten vergleichen",
    icon: Package,
    heroImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80",
    priceExamples: [
      { size: "2-4 m³", price: "ab CHF 60/Monat", includes: ["Kartons", "Kleinmöbel", "24h Zugang"] },
      { size: "5-8 m³", price: "ab CHF 90/Monat", includes: ["1-2 Zimmer Inhalt", "Versicherung"] },
      { size: "10-15 m³", price: "ab CHF 150/Monat", includes: ["3-4 Zimmer Inhalt", "Klimatisiert"] },
      { size: "20+ m³", price: "ab CHF 250/Monat", includes: ["Ganzer Haushalt", "Abholservice"] },
    ],
    benefits: [
      { icon: Shield, title: "Sicher", description: "Alarmgesichert und videoüberwacht" },
      { icon: Clock, title: "Flexibel", description: "Jederzeit kündbar, 24h Zugang" },
      { icon: Award, title: "Versichert", description: "Grundversicherung inklusive" },
      { icon: Home, title: "Trocken", description: "Klimatisierte Räume verfügbar" },
    ],
    process: [
      { step: 1, title: "Bedarf ermitteln", description: "Wie viel Platz benötigen Sie?" },
      { step: 2, title: "Offerten erhalten", description: "Vergleichen Sie Preise und Standorte" },
      { step: 3, title: "Lager mieten", description: "Flexibel und ohne lange Bindung" },
      { step: 4, title: "Einlagern", description: "Selbst oder mit Umzugshelfer" },
      { step: 5, title: "Zugang 24/7", description: "Jederzeit an Ihre Sachen" },
    ],
    additionalServices: [
      { name: "Umzug", icon: Truck, link: "/privatumzug" },
      { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
      { name: "Entsorgung", icon: Recycle, link: "/entsorgung" },
      { name: "Montage", icon: Wrench, link: "/montage" },
    ],
    faqs: [
      { question: "Wie groß sollte mein Lagerraum sein?", answer: "Faustregel: Pro Zimmer ca. 3-5 m³. Ein 3-Zimmer-Haushalt braucht etwa 10-15 m³." },
      { question: "Sind meine Sachen versichert?", answer: "Ja, eine Grundversicherung ist meist inklusive. Für wertvolle Gegenstände empfehlen wir eine Zusatzversicherung." },
      { question: "Kann ich jederzeit an meine Sachen?", answer: "Bei den meisten Anbietern haben Sie 24/7 Zugang per PIN-Code oder Schlüsselkarte." },
      { question: "Wie lange ist die Mindestmietdauer?", answer: "Viele Anbieter vermieten bereits ab 1 Monat, ohne lange Kündigungsfristen." },
    ],
    testimonial: { name: "Marco S.", location: "Bern", rating: 5, text: "Perfekt für unseren Umzug. Die Möbel waren 2 Monate sicher eingelagert. Alles war in einwandfreiem Zustand." },
    regions: ["Zürich", "Bern", "Basel", "Luzern", "Genf", "Lausanne", "Winterthur", "St. Gallen"],
  },
};

export default function ServiceTemplate() {
  const { service: serviceSlug } = useParams<{ service: string }>();
  const serviceKey = serviceSlug?.toLowerCase() || 'reinigung';
  const config = serviceConfigs[serviceKey] || serviceConfigs.reinigung;
  const ServiceIcon = config.icon;

  useEffect(() => {
    initPerformanceOptimizations();
    window.scrollTo(0, 0);
  }, [serviceKey]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="service"
        service={serviceKey}
        url={`https://umzugscheck.ch/${serviceKey}/`}
        faqs={config.faqs}
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary/90 to-primary-dark overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${config.heroImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
                <ServiceIcon className="h-10 w-10" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {config.title}
              </h1>

              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                {config.subtitle}
              </p>

              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl hover:scale-105 transition-transform"
                >
                  {config.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Kostenlos
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Unverbindlich
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Geprüfte Anbieter
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Price Examples */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Preisbeispiele für {config.name}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparente Richtpreise – genaue Offerten erhalten Sie kostenlos
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {config.priceExamples.map((example, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-4">{example.size}</Badge>
                    <div className="text-3xl font-bold text-primary mb-4">{example.price}</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {example.includes.map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ihre Vorteile
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {config.benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full text-center p-6 border-0 shadow-md">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                So funktioniert's
              </h2>
              <p className="text-lg text-muted-foreground">
                In 5 einfachen Schritten zur perfekten {config.name}
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            {config.process.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 mb-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-6 h-6 ${i <= config.testimonial.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl italic text-foreground mb-6">
              "{config.testimonial.text}"
            </blockquote>
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">{config.testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{config.testimonial.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Weitere Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Kombinieren Sie Ihren Umzug mit weiteren Leistungen
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {config.additionalServices.map((service, idx) => (
              <Link key={idx} to={service.link}>
                <Card className="h-full p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer">
                  <service.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="font-medium">{service.name}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {config.name} in Ihrer Region
              </h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {config.regions.map((region, idx) => (
              <Link key={idx} to={`/umzugsfirmen/${region.toLowerCase()}`}>
                <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <MapPin className="w-3 h-3 mr-1" />
                  {region}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Häufige Fragen zu {config.name}
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={config.faqs} variant="default" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für Ihre {config.name}?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-xl mx-auto">
            Vergleichen Sie jetzt kostenlos Angebote von geprüften Schweizer Anbietern
          </p>
          <Link to="/umzugsofferten">
            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {config.ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <StickyMobileCTA />
    </div>
  );
}
import { useState } from "react";
import { EnhancedFooter } from "@/components/home/EnhancedFooter";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import zugHero from "@/assets/zug-hero.jpg";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Star, Shield, TrendingUp, Users, Clock, CheckCircle2,
  Home, Building2, Trash2, Package, Truck, Wrench, ArrowRight,
  ChevronDown
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Zug = () => {
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [roomSize, setRoomSize] = useState("");

  const locations = [
    "Zug", "Baar", "Cham", "Steinhausen", "Hünenberg", 
    "Risch/Rotkreuz", "Walchwil", "Menzingen", "Neuheim", 
    "Oberägeri", "Unterägeri"
  ];

  const companies = [
    {
      name: "Zuger Umzüge",
      tagline: "Regionaler Spezialist für den Kanton Zug",
      regions: ["Zug", "Baar", "Cham", "Steinhausen"],
      services: ["Privatumzug", "Firmenumzug", "Reinigung", "Entsorgung"],
      priceLevel: "Mittel",
      rating: 4.7,
    },
    {
      name: "Happy Moving GmbH",
      tagline: "Strukturierte Abläufe für komplexe Umzugsprojekte",
      regions: ["Zug", "Baar", "Cham", "Hünenberg", "Rotkreuz", "Schweizweit"],
      services: ["Privatumzug", "Firmenumzug", "Einlagerung", "Räumung", "Reinigung"],
      priceLevel: "Mittel–Premium",
      rating: 4.8,
    },
    {
      name: "Helvetia Transporte & Umzüge",
      tagline: "Starke Planung für anspruchsvolle Umzüge",
      regions: ["Zug", "Baar", "Cham", "Walchwil", "Hünenberg"],
      services: ["Privatumzug", "Firmenumzug", "Möbellift"],
      priceLevel: "Mittel",
      rating: 4.6,
    },
    {
      name: "Kehrli + Oeler",
      tagline: "Traditionsunternehmen mit Fokus auf Qualität",
      regions: ["Schweizweit inkl. Zug"],
      services: ["Privatumzug", "Firmenumzug"],
      priceLevel: "Premium",
      rating: 4.9,
    },
    {
      name: "Umzugsfuchs",
      tagline: "Preisorientierte Angebote mit Kostentransparenz",
      regions: ["Schweizweit inkl. Zug"],
      services: ["Privatumzug"],
      priceLevel: "Günstig",
      rating: 4.5,
    },
    {
      name: "Umzugprofis",
      tagline: "Full-Service inkl. Räumung und Reinigung",
      regions: ["Zug & Schweizweit"],
      services: ["Privatumzug", "Entsorgung", "Reinigung"],
      priceLevel: "Mittel",
      rating: 4.7,
    },
    {
      name: "Slavi Umzüge",
      tagline: "Persönliche Betreuung und langjährige Erfahrung",
      regions: ["Kanton Zug & Region"],
      services: ["Privatumzug", "Firmenumzug"],
      priceLevel: "Mittel",
      rating: 4.6,
    },
    {
      name: "Arnold Umzüge",
      tagline: "Umzug, Lager und Räumung kombiniert",
      regions: ["Kanton Zug"],
      services: ["Privatumzug", "Einlagerung", "Entsorgung"],
      priceLevel: "Mittel",
      rating: 4.5,
    },
    {
      name: "Martinas Umzugsservice",
      tagline: "Umzug + Reinigung mit Abgabegarantie",
      regions: ["Kanton Zug & Umgebung"],
      services: ["Privatumzug", "Reinigung", "Einlagerung", "Räumung", "Firmenumzug"],
      priceLevel: "Mittel–Premium",
      rating: 4.8,
    },
    {
      name: "Fachmann Umzug",
      tagline: "Budgetfreundlich für mehrere Kantone",
      regions: ["Zürich, Aargau, Luzern & Zug"],
      services: ["Privatumzug", "Reinigung", "Entsorgung", "Einlagerung"],
      priceLevel: "Günstig",
      rating: 4.4,
    },
  ];

  const priceExamples = [
    {
      title: "2.5-Zimmer Wohnung: Umzug innerhalb der Stadt Zug",
      description: "Umzug einer 2.5-Zimmer-Wohnung innerhalb von Zug, inkl. Transport, Tragen und einfacher Möbelmontage.",
      info: "2–3 Umzugshelfer · 1 LKW · ca. 4–6 Stunden",
      priceRange: "CHF 800 – CHF 1'400",
      icon: Home,
    },
    {
      title: "3.5-Zimmer Wohnung: Zug → Baar oder Cham",
      description: "Umzug von Zug nach Baar oder Cham mit Tragen, Transport und einfachem Auf- und Abbau.",
      info: "3 Umzugshelfer · 1 LKW · ca. 6–8 Stunden",
      priceRange: "CHF 1'200 – CHF 2'200",
      icon: Building2,
    },
    {
      title: "4.5-Zimmer Haus: Umzug + Reinigung mit Abgabegarantie",
      description: "Komplettumzug innerhalb des Kantons Zug inklusive Endreinigung mit Abgabegarantie gegenüber der Verwaltung.",
      info: "Umzugsteam + Reinigungsteam",
      priceRange: "CHF 2'500 – CHF 4'500",
      icon: Home,
    },
  ];

  const services = [
    {
      title: "Umzug + Reinigung mit Abgabegarantie in Zug",
      description: "Kombiniertes Angebot für einen stressfreien Wohnungswechsel mit garantierter Abnahme durch die Verwaltung.",
      link: "/zug/umzug-mit-reinigung",
      icon: Home,
    },
    {
      title: "Firmenumzug in Zug, Baar & Cham",
      description: "Professionelle Geschäftsumzüge mit minimaler Ausfallzeit und spezialisiertem Equipment.",
      link: "/zug/firmenumzug",
      icon: Building2,
    },
    {
      title: "Umzug mit Möbellift im Kanton Zug",
      description: "Ideal für enge Zufahrten, obere Etagen und schwere Möbelstücke ohne Treppenhaus-Transport.",
      link: "/zug/moebellift",
      icon: Truck,
    },
    {
      title: "Entsorgung & Räumung in Zug",
      description: "Professionelle Entrümpelung von Kellern, Estrich, Wohnungen und Häusern.",
      link: "/zug/entsorgung-raeumung",
      icon: Trash2,
    },
    {
      title: "Möbellager & Zwischenlagerung",
      description: "Sichere, trockene Lagermöglichkeiten für kurz- oder langfristige Möbelaufbewahrung.",
      link: "/zug/moebellager",
      icon: Package,
    },
    {
      title: "Kleintransporte & Teilumzüge",
      description: "Flexible Lösungen für WG-Umzüge, einzelne Möbel oder kleine Transportaufträge.",
      link: "/zug/kleinumzug",
      icon: Truck,
    },
  ];

  const usps = [
    {
      title: "Geprüfte Umzugsfirmen",
      description: "Wir arbeiten mit ausgewählten Umzugsfirmen, die regelmässig Umzüge in Zug, Baar, Cham und Umgebung durchführen.",
      icon: Shield,
    },
    {
      title: "Zeit & Geld sparen",
      description: "Statt 10 Firmen einzeln anzurufen, reicht eine Anfrage – du erhältst mehrere Offerten und kannst in Ruhe vergleichen.",
      icon: Clock,
    },
    {
      title: "Zusatzservices im Vergleich",
      description: "Reinigung, Entsorgung, Einlagerung oder Firmenumzug: du siehst auf einen Blick, wer welche Leistungen anbietet.",
      icon: CheckCircle2,
    },
    {
      title: "Lokale Expertise",
      description: "Wir bündeln Informationen zu Umzug, Verwaltung, Parkbewilligungen und typischen Umzugssituationen im Kanton Zug.",
      icon: MapPin,
    },
    {
      title: "Transparenz & Übersicht",
      description: "Strukturierte Firmenprofile, klare Beschreibungen und seriöse Kommunikation ohne versteckte Kosten.",
      icon: TrendingUp,
    },
  ];

  const faqs = [
    {
      question: "Was kostet ein Umzug in Zug ungefähr?",
      answer: "Die Kosten hängen von mehreren Faktoren ab: Anzahl Zimmer, Etage, Distanz, Zugang und Zusatzleistungen. Ein 2.5-Zimmer-Umzug innerhalb von Zug kostet typischerweise CHF 800–1'400, ein 3.5-Zimmer-Umzug zwischen CHF 1'200–2'200. Für einen genauen Preis empfehlen wir, über unser Formular konkrete Offerten einzuholen.",
    },
    {
      question: "Wie früh sollte ich eine Umzugsfirma in Zug buchen?",
      answer: "Idealerweise 4–8 Wochen im Voraus. Bei Umzügen am Monatsende oder in der Hochsaison (April–September) empfehlen wir eine noch frühere Buchung von 8–12 Wochen, da die Kapazitäten schnell ausgebucht sind.",
    },
    {
      question: "Bietet ihr auch Umzug + Reinigung mit Abgabegarantie an?",
      answer: "Ja, mehrere unserer Partnerfirmen im Kanton Zug bieten kombinierte Umzugs- und Reinigungspakete mit Abgabegarantie an. Dies ist besonders praktisch, wenn du sicherstellen möchtest, dass die alte Wohnung von der Verwaltung problemlos abgenommen wird.",
    },
    {
      question: "Könnt ihr Firmenumzüge in Zug, Baar und Cham organisieren?",
      answer: "Ja, Firmenumzüge sind ein wichtiger Schwerpunkt. Unsere Partnerfirmen verfügen über spezialisiertes Equipment und Erfahrung mit Geschäftsumzügen, um Ausfallzeiten zu minimieren und sensible Geräte professionell zu transportieren.",
    },
    {
      question: "Brauche ich eine spezielle Parkbewilligung für den Umzug?",
      answer: "Das hängt vom Standort ab. In der Altstadt von Zug oder bei engen Quartieren kann eine kurzfristige Parkbewilligung oder ein Halteverbot sinnvoll oder erforderlich sein. Wir empfehlen, dies frühzeitig mit der Gemeinde, dem Vermieter oder der Hausverwaltung abzuklären. Viele Umzugsfirmen unterstützen dich auch bei der Organisation.",
    },
    {
      question: "Erhalte ich Fixpreise oder Stundenansätze?",
      answer: "Beides ist möglich. Einige Umzugsfirmen arbeiten mit Fixpreisen basierend auf einer Vorabbesichtigung oder detaillierten Angaben. Andere rechnen nach Stunden ab. In den Offerten, die du über umzugscheck.ch erhältst, siehst du klar, welches Modell angeboten wird.",
    },
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Schweiz",
            "item": "https://umzugscheck.ch"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Kanton Zug",
            "item": "https://umzugscheck.ch/zug"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Umzug",
          }
        ]
      },
      {
        "@type": "Service",
        "name": "Umzugsvergleich im Kanton Zug",
        "provider": {
          "@type": "Organization",
          "name": "umzugscheck.ch"
        },
        "areaServed": {
          "@type": "Place",
          "name": "Kanton Zug, Schweiz"
        },
        "description": "Vergleiche Umzugsfirmen im Kanton Zug, prüfe Bewertungen und erhalte gratis Offerten für Privat- und Firmenumzüge."
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Umzug Zug: Umzugsfirmen vergleichen & Offerten erhalten"
        description="Vergleiche Umzugsfirmen im Kanton Zug, prüfe Bewertungen und erhalte gratis Offerten. Privat- und Firmenumzüge, Reinigung, Entsorgung und mehr – alles auf einen Blick."
        canonicalUrl="https://umzugscheck.ch/zug"
        keywords="Umzug Zug, Umzugsfirma Zug, Umzugsunternehmen Kanton Zug, Umzug Baar, Umzug Cham, Umzug Steinhausen, Umzug Rotkreuz"
        schemaMarkup={schemaMarkup}
      />

      <main id="main-content" role="main">
        {/* Breadcrumbs for SEO */}
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: "Schweiz", href: "/" },
              { label: "Kantone", href: "/regionen" },
              { label: "Kanton Zug" }
            ]}
          />
        </div>

      {/* Hero Section */}
      <section id="hero-form" className="relative bg-gradient-to-br from-background via-secondary/5 to-background py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Left: Text + Form */}
            <ScrollReveal direction="right">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                  Umzug in Zug vergleichen – Offerten von geprüften Umzugsfirmen
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Du planst einen Umzug in Zug, Baar oder Cham? Über umzugscheck.ch vergleichst du geprüfte Umzugsfirmen im Kanton Zug, sparst Zeit, Nerven und oft mehrere hundert Franken.
                </p>

                {/* Mini Form Stepper */}
                <Card className="shadow-strong border-primary/10">
                  <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Von</label>
                        <select 
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          value={selectedFrom}
                          onChange={(e) => setSelectedFrom(e.target.value)}
                        >
                          <option value="">Ort wählen</option>
                          {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nach</label>
                        <select 
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          value={selectedTo}
                          onChange={(e) => setSelectedTo(e.target.value)}
                        >
                          <option value="">Ort wählen</option>
                          {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Wohnungsgrösse</label>
                      <select 
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        value={roomSize}
                        onChange={(e) => setRoomSize(e.target.value)}
                      >
                        <option value="">Grösse wählen</option>
                        <option value="1-1.5">1–1.5 Zimmer</option>
                        <option value="2-2.5">2–2.5 Zimmer</option>
                        <option value="3-3.5">3–3.5 Zimmer</option>
                        <option value="4-4.5">4–4.5 Zimmer</option>
                        <option value="5+">5+ Zimmer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Zusatzservices</label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">Reinigung</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">Entsorgung</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">Möbellift</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">Einlagerung</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                      <Button size="lg" className="flex-1 text-sm sm:text-base h-11 sm:h-12">
                        Gratis Offerten anfordern
                      </Button>
                      <Button size="lg" variant="outline" className="flex-1 text-sm sm:text-base h-11 sm:h-12">
                        Preise ansehen
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">Ø 4.8 / 5</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="font-medium">15'000+ Umzüge</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="font-medium">Geprüfte Firmen</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Hero Image */}
            <ScrollReveal direction="left" delay={200}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-strong">
                <img 
                  src={zugHero}
                  alt="Kanton Zug mit Zugersee und Bergpanorama"
                  className="w-full h-[280px] sm:h-[350px] md:h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Company Comparison Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Top Umzugsfirmen im Kanton Zug
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Vergleiche geprüfte Umzugsfirmen und finde den perfekten Partner für deinen Umzug
              </p>
            </div>
          </ScrollReveal>

          {/* Filter Bar */}
          <ScrollReveal delay={0.1}>
            <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4 max-w-6xl mx-auto">
              <div>
                <p className="text-xs sm:text-sm font-medium mb-2">Orte filtern:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs sm:text-sm">Alle</Badge>
                  {locations.map(loc => (
                    <Badge key={loc} variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">{loc}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium mb-2">Leistungen:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Privatumzug</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Firmenumzug</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Umzug + Reinigung</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Entsorgung/Räumung</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Einlagerung</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Möbellift</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium mb-2">Preisniveau:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Günstig</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Mittel</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors text-xs sm:text-sm">Premium</Badge>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Company Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
            {companies.map((company, index) => (
              <ScrollReveal key={company.name} delay={0.1 * (index % 4)}>
                <Card className="h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-1 relative">
                  <CardContent className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                    {/* Ranking Number and Promoted Badge */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">#{index + 1}</span>
                        </div>
                        {index < 2 && (
                          <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                            Gesponsert
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{company.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{company.tagline}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {company.services.map(service => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{company.priceLevel}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Aktiv in: {company.regions.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>Ø {company.rating} / 5 (Demo-Wert)</span>
                      </div>
                    </div>

                    <Button className="w-full text-sm sm:text-base" size="lg">
                      Offerte anfragen
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Price Examples Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-secondary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Was kostet ein Umzug in Zug?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Typische Preisbeispiele für deinen Umzug im Kanton Zug
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
            {priceExamples.map((example, index) => (
              <ScrollReveal key={example.title} delay={0.1 * index}>
                <Card className="h-full hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                      <example.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{example.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{example.description}</p>
                    <p className="text-xs text-muted-foreground">{example.info}</p>
                    <div className="pt-3 sm:pt-4 border-t">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Typischer Kostenbereich:</p>
                      <p className="text-lg sm:text-xl font-bold text-primary">{example.priceRange}</p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <p className="text-sm text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
              * Die effektiven Kosten hängen von Distanz, Etage, Zugang, Möbeldichte und Zusatzleistungen ab. 
              Über umzugscheck.ch erhältst du konkrete Offerten für deinen Umzug in Zug.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Beliebte Services im Kanton Zug
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Entdecke spezialisierte Umzugs- und Zusatzservices
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={0.1 * (index % 3)}>
                <Card className="h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <CardContent className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <service.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{service.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{service.description}</p>
                    <div className="flex items-center gap-2 text-primary font-medium text-xs sm:text-sm pt-2">
                      Mehr erfahren
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Warum umzugscheck.ch für deinen Umzug in Zug?
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 max-w-6xl mx-auto">
            {usps.map((usp, index) => (
              <ScrollReveal key={usp.title} delay={0.1 * (index % 3)}>
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <usp.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">{usp.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{usp.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                So funktioniert umzugscheck.ch in Zug
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                In nur 3 Schritten zur passenden Umzugsfirma
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-7 md:gap-8 max-w-5xl mx-auto mb-8 sm:mb-10 md:mb-12">
            {[
              {
                step: "1",
                title: "Anfrage ausfüllen",
                description: "Beantworte ein paar Fragen zu Start- und Zielort, Wohnungsgrösse und gewünschtem Umzugstermin.",
              },
              {
                step: "2",
                title: "Offerten erhalten",
                description: "Du erhältst Offerten von passenden Umzugsfirmen, die im Kanton Zug aktiv sind.",
              },
              {
                step: "3",
                title: "Anbieter wählen & Umzug fixieren",
                description: "Vergleiche Preise und Leistungen, wähle deinen Favoriten und bestätige den Umzugstermin.",
              },
            ].map((step, index) => (
              <ScrollReveal key={step.step} delay={0.1 * index}>
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl sm:text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <Card className="max-w-2xl mx-auto bg-gradient-cta text-white shadow-strong">
              <CardContent className="p-5 sm:p-6 md:p-8 text-center space-y-3 sm:space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold">Bereit für deinen Umzug in Zug?</h3>
                <p className="text-sm sm:text-base text-white/90">Die Anfrage ist kostenlos und unverbindlich</p>
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12">
                  Jetzt Offerten anfordern
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Local Info Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-secondary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                Umziehen im Kanton Zug: Das musst du wissen
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">An- und Abmeldung beim Einwohneramt</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Bei einem Umzug innerhalb der Schweiz – also auch im Kanton Zug – musst du dich beim Einwohneramt deiner bisherigen Gemeinde abmelden und beim Einwohneramt der neuen Gemeinde anmelden. Dies sollte in der Regel innerhalb von 14 Tagen nach dem Umzug erfolgen. Die genauen Fristen und Prozesse können je nach Gemeinde leicht variieren.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3 sm:mt-4">
                    Im Kanton Zug gibt es elf Gemeinden: Zug, Baar, Cham, Steinhausen, Hünenberg, Risch/Rotkreuz, Walchwil, Menzingen, Neuheim, Oberägeri und Unterägeri. Jede Gemeinde hat ihre eigene Einwohnerkontrolle mit teilweise unterschiedlichen Öffnungszeiten und Online-Services. Wir empfehlen, dich rechtzeitig auf der Website deiner neuen Wohngemeinde zu informieren, welche Dokumente du mitbringen musst (üblicherweise Ausweis, Wohnungsbestätigung, allenfalls Familienausweis).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">Parkieren und Zufahrt für den Umzug</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Gerade in der Altstadt von Zug oder in dicht bebauten Quartieren kann das Parkieren des Umzugslastwagens eine Herausforderung sein. In vielen Fällen ist es sinnvoll oder sogar notwendig, ein kurzfristiges Halteverbot oder eine spezielle Parkbewilligung zu organisieren, damit der LKW direkt vor dem Haus stehen kann.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3 sm:mt-4">
                    Wir empfehlen, dies rechtzeitig – idealerweise 2–4 Wochen vor dem Umzug – mit der Gemeinde, der Hausverwaltung oder dem Vermieter abzuklären. Viele professionelle Umzugsfirmen im Kanton Zug unterstützen dich auch bei der Organisation der nötigen Bewilligungen. So stellst du sicher, dass der Umzugstag reibungslos abläuft und keine unnötigen Tragewege entstehen.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">Typische Umzugssituationen im Kanton Zug</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Der Kanton Zug ist vielfältig: Von modernen Stadtwohnungen in Zug und Baar über Einfamilienhäuser in Hünenberg, Menzingen oder Walchwil bis hin zu Neubauquartieren in Steinhausen und Risch/Rotkreuz. Jede Wohnsituation hat ihre eigenen Anforderungen an den Umzug.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3 sm:mt-4">
                    Professionelle Umzugsfirmen kennen diese unterschiedlichen Gegebenheiten: enge Zufahrten in der Altstadt, mehrgeschossige Häuser ohne Lift, Seezugang oder hügelige Lagen. In solchen Fällen kommen oft Möbellifte zum Einsatz, um schwere Möbel sicher und effizient über das Fenster zu transportieren. Auch bei langen Tragewegen – etwa vom Parkplatz bis zur Wohnung – wissen erfahrene Teams, wie sie Zeit und Kraft optimal einsetzen.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3 sm:mt-4">
                    Falls du spezielle Anforderungen hast (z.B. Klaviertransport, empfindliche Kunstwerke oder besonders enge Treppenhäuser), lohnt es sich, dies bereits in der Offertanfrage zu erwähnen. So können die Umzugsfirmen dir massgeschneiderte Lösungen und realistische Preise anbieten.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                  Häufige Fragen zum Umzug in Zug
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Antworten auf die wichtigsten Fragen
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border rounded-lg px-4 sm:px-5 md:px-6 bg-card hover:shadow-medium transition-shadow"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-5">
                      <span className="font-semibold text-foreground text-sm sm:text-base">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 leading-relaxed text-xs sm:text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </div>
        </div>
      </section>

      </main>

      <EnhancedFooter />
      <StickyMobileCTA text="Gratis Offerten" link="#hero-form" />
      <ScrollToTop />
    </div>
  );
};

export default Zug;

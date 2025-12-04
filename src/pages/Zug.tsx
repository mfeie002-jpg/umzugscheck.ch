import { useState } from "react";
import { Helmet } from "react-helmet";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import zugHero from "@/assets/zug-hero.jpg";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MapPin, Star, Shield, TrendingUp, Users, Clock, CheckCircle2,
  Home, Building2, Trash2, Package, Truck, ArrowRight,
  Phone, Mail, MessageCircle, ChevronUp, Layers
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const Zug = () => {
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(["Zuger Umzüge", "Happy Moving GmbH", "Helvetia Transporte & Umzüge"]);

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
      highlight: "Ideal für Umzüge in Zug & Baar",
    },
    {
      name: "Happy Moving GmbH",
      tagline: "Strukturierte Abläufe für komplexe Umzugsprojekte",
      regions: ["Zug", "Baar", "Cham", "Hünenberg", "Rotkreuz", "Schweizweit"],
      services: ["Privatumzug", "Firmenumzug", "Einlagerung", "Räumung", "Reinigung"],
      priceLevel: "Mittel–Premium",
      rating: 4.8,
      highlight: "Full-Service inkl. Reinigung",
    },
    {
      name: "Helvetia Transporte & Umzüge",
      tagline: "Starke Planung für anspruchsvolle Umzüge",
      regions: ["Zug", "Baar", "Cham", "Walchwil", "Hünenberg"],
      services: ["Privatumzug", "Firmenumzug", "Möbellift"],
      priceLevel: "Mittel",
      rating: 4.6,
      highlight: "Spezialist für Möbellift-Einsätze",
    },
    {
      name: "Kehrli + Oeler",
      tagline: "Traditionsunternehmen mit Fokus auf Qualität",
      regions: ["Schweizweit inkl. Zug"],
      services: ["Privatumzug", "Firmenumzug"],
      priceLevel: "Premium",
      rating: 4.9,
      highlight: "Höchste Qualitätsstandards",
    },
    {
      name: "Umzugsfuchs",
      tagline: "Preisorientierte Angebote mit Kostentransparenz",
      regions: ["Schweizweit inkl. Zug"],
      services: ["Privatumzug"],
      priceLevel: "Günstig",
      rating: 4.5,
      highlight: "Beste Preise für Privatumzüge",
    },
    {
      name: "Umzugprofis",
      tagline: "Full-Service inkl. Räumung und Reinigung",
      regions: ["Zug & Schweizweit"],
      services: ["Privatumzug", "Entsorgung", "Reinigung"],
      priceLevel: "Mittel",
      rating: 4.7,
      highlight: "Komplettpaket möglich",
    },
    {
      name: "Slavi Umzüge",
      tagline: "Persönliche Betreuung und langjährige Erfahrung",
      regions: ["Kanton Zug & Region"],
      services: ["Privatumzug", "Firmenumzug"],
      priceLevel: "Mittel",
      rating: 4.6,
      highlight: "Familienbetrieb mit Herz",
    },
    {
      name: "Arnold Umzüge",
      tagline: "Umzug, Lager und Räumung kombiniert",
      regions: ["Kanton Zug"],
      services: ["Privatumzug", "Einlagerung", "Entsorgung"],
      priceLevel: "Mittel",
      rating: 4.5,
      highlight: "Lagerlösungen verfügbar",
    },
    {
      name: "Martinas Umzugsservice",
      tagline: "Umzug + Reinigung mit Abgabegarantie",
      regions: ["Kanton Zug & Umgebung"],
      services: ["Privatumzug", "Reinigung", "Einlagerung", "Räumung", "Firmenumzug"],
      priceLevel: "Mittel–Premium",
      rating: 4.8,
      highlight: "Abgabegarantie inklusive",
    },
    {
      name: "Fachmann Umzug",
      tagline: "Budgetfreundlich für mehrere Kantone",
      regions: ["Zürich, Aargau, Luzern & Zug"],
      services: ["Privatumzug", "Reinigung", "Entsorgung", "Einlagerung"],
      priceLevel: "Günstig",
      rating: 4.4,
      highlight: "Kantonsübergreifend günstig",
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
    {
      title: "Direkter Firmenvergleich",
      description: "Vergleiche mehrere Umzugsfirmen im Kanton Zug direkt nebeneinander und sieh sofort, wer am besten zu deinem Umzug passt.",
      icon: Layers,
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

  const toggleCompanySelection = (companyName: string) => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyName)) {
        return prev.filter(name => name !== companyName);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, companyName];
    });
  };

  const selectedCompanyData = companies.filter(c => selectedCompanies.includes(c.name));

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
            "name": "Umzug"
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
      },
      {
        "@type": "Organization",
        "name": "Umzugscheck.ch",
        "url": "https://umzugscheck.ch",
        "logo": "https://umzugscheck.ch/assets/umzugscheck-logo.png",
        "description": "Die führende Vergleichsplattform für Umzüge in der Schweiz. Kostenlos, transparent und einfach.",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+41-44-567-89-00",
          "email": "info@umzugscheck.ch",
          "contactType": "customer service",
          "areaServed": "CH",
          "availableLanguage": ["German", "French", "Italian"]
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Bahnhofstrasse 100",
          "addressLocality": "Zürich",
          "postalCode": "8001",
          "addressCountry": "CH"
        },
        "sameAs": [
          "https://www.facebook.com/umzugscheck",
          "https://www.linkedin.com/company/umzugscheck",
          "https://www.instagram.com/umzugscheck",
          "https://twitter.com/umzugscheck"
        ]
      }
    ]
  };

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case "Günstig": return "bg-green-100 text-green-800 border-green-200";
      case "Mittel": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Mittel–Premium": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Premium": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzug Zug: Umzugsfirmen vergleichen &amp; Offerten erhalten | umzugscheck.ch</title>
        <meta name="title" content="Umzug Zug: Umzugsfirmen vergleichen & Offerten erhalten | umzugscheck.ch" />
        <meta name="description" content="Vergleiche Umzugsfirmen im Kanton Zug, prüfe Bewertungen und erhalte gratis Offerten. Privat- und Firmenumzüge, Reinigung, Entsorgung und mehr – alles auf einen Blick." />
        <meta name="keywords" content="Umzug Zug, Umzugsfirma Zug, Umzugsunternehmen Kanton Zug, Umzug Baar, Umzug Cham, Umzug Steinhausen, Umzug Rotkreuz" />
        <link rel="canonical" href="https://umzugscheck.ch/zug" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/zug" />
        <meta property="og:title" content="Umzug Zug: Umzugsfirmen vergleichen & Offerten erhalten | umzugscheck.ch" />
        <meta property="og:description" content="Vergleiche Umzugsfirmen im Kanton Zug, prüfe Bewertungen und erhalte gratis Offerten. Privat- und Firmenumzüge, Reinigung, Entsorgung und mehr – alles auf einen Blick." />
        <meta property="og:image" content="https://umzugscheck.ch/og-image.jpg" />
        <meta property="og:site_name" content="umzugscheck.ch" />
        <meta property="og:locale" content="de_CH" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://umzugscheck.ch/zug" />
        <meta name="twitter:title" content="Umzug Zug: Umzugsfirmen vergleichen & Offerten erhalten | umzugscheck.ch" />
        <meta name="twitter:description" content="Vergleiche Umzugsfirmen im Kanton Zug, prüfe Bewertungen und erhalte gratis Offerten. Privat- und Firmenumzüge, Reinigung, Entsorgung und mehr – alles auf einen Blick." />
        <meta name="twitter:image" content="https://umzugscheck.ch/og-image.jpg" />
        
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <main id="main-content" role="main">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs
            items={[
              { label: "Schweiz", href: "/" },
              { label: "Kantone", href: "/regionen" },
              { label: "Kanton Zug" }
            ]}
          />
        </div>

        {/* Hero Section */}
        <section id="hero-form" className="relative bg-gradient-to-br from-background via-primary/5 to-background py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              {/* Left: Text + Form */}
              <ScrollReveal direction="right">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Umzug in Zug vergleichen – Offerten von geprüften Umzugsfirmen
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Du planst einen Umzug in Zug, Baar oder Cham? Über umzugscheck.ch vergleichst du geprüfte Umzugsfirmen im Kanton Zug, sparst Zeit, Nerven und oft mehrere hundert Franken.
                  </p>

                  {/* Mini Form */}
                  <Card className="shadow-lg border-primary/10">
                    <CardContent className="p-4 sm:p-6 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Von</label>
                          <select 
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                          <input 
                            type="text"
                            placeholder="PLZ oder Ort eingeben"
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            value={selectedTo}
                            onChange={(e) => setSelectedTo(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Wohnungsgrösse</label>
                        <select 
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                        <label className="block text-sm font-medium mb-3">Zusatzservices</label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Reinigung", "Entsorgung", "Möbellift", "Einlagerung"].map(service => (
                            <label key={service} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                              <Checkbox id={service} className="h-5 w-5" />
                              <span className="text-sm font-medium">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button size="lg" className="flex-1">
                          Gratis Offerten anfordern
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1">
                          Preise ansehen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">Ø 4.8 / 5</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-medium">15'000+ Umzüge</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-medium">Geprüfte Firmen</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right: Hero Image */}
              <ScrollReveal direction="left" delay={200}>
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={zugHero}
                    alt="Kanton Zug mit Zugersee und Bergpanorama"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Company Comparison Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Top Umzugsfirmen im Kanton Zug
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Vergleiche geprüfte Umzugsfirmen und finde den perfekten Partner für deinen Umzug
                </p>
              </div>
            </ScrollReveal>

            {/* Filter Bar */}
            <ScrollReveal delay={0.1}>
              <div className="mb-8 space-y-4 max-w-6xl mx-auto">
                <div>
                  <p className="text-sm font-medium mb-2">Orte filtern:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Alle</Badge>
                    {locations.map(loc => (
                      <Badge key={loc} variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">{loc}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Leistungen:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Privatumzug", "Firmenumzug", "Umzug + Reinigung", "Entsorgung/Räumung", "Einlagerung", "Möbellift"].map(service => (
                      <Badge key={service} variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">{service}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Preisniveau:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Günstig", "Mittel", "Premium"].map(level => (
                      <Badge key={level} variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">{level}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Selection Info */}
            <div className="max-w-6xl mx-auto mb-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">
                    {selectedCompanies.length}/3 Firmen für Vergleich ausgewählt
                  </span>
                </div>
                {selectedCompanies.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedCompanies([])}>
                    Auswahl löschen
                  </Button>
                )}
              </div>
            </div>

            {/* Company Cards */}
            <div className="grid sm:grid-cols-2 gap-5 max-w-6xl mx-auto">
              {companies.map((company, index) => (
                <ScrollReveal key={company.name} delay={0.05 * (index % 4)}>
                  <Card className={`h-full transition-all duration-300 hover:-translate-y-1 relative ${selectedCompanies.includes(company.name) ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-lg'}`}>
                    <CardContent className="p-5 space-y-4">
                      {/* Header with Ranking, Sponsored Badge, and Checkbox */}
                      <div className="flex items-start justify-between">
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
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-xs text-muted-foreground">Vergleichen</span>
                          <Checkbox 
                            checked={selectedCompanies.includes(company.name)}
                            onCheckedChange={() => toggleCompanySelection(company.name)}
                            disabled={!selectedCompanies.includes(company.name) && selectedCompanies.length >= 3}
                          />
                        </label>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.tagline}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {company.services.map(service => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getPriceLevelColor(company.priceLevel)}>
                            {company.priceLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">Aktiv in: {company.regions.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>Ø {company.rating} / 5 (Demo-Wert)</span>
                        </div>
                      </div>

                      <Button className="w-full" size="lg">
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

        {/* Comparison Table Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Umzugsfirmen in Zug direkt vergleichen
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Wähle bis zu drei Anbieter und vergleiche Leistungen, Bewertungen und Preisniveau auf einen Blick.
                </p>
              </div>
            </ScrollReveal>

            {selectedCompanyData.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8 text-center">
                  <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Wähle bis zu drei Umzugsfirmen oben aus, um sie hier direkt zu vergleichen.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {selectedCompanyData.map((company, index) => (
                  <ScrollReveal key={company.name} delay={0.1 * index}>
                    <Card className="h-full bg-background">
                      <CardContent className="p-5 space-y-4">
                        <div className="text-center pb-4 border-b">
                          <h3 className="text-lg font-bold text-foreground">{company.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{company.tagline}</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Standort / Einzugsgebiet</p>
                            <p className="text-sm">{company.regions.join(", ")}</p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Leistungen</p>
                            <div className="flex flex-wrap gap-1.5">
                              {company.services.map(service => (
                                <Badge key={service} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Preisniveau</p>
                            <Badge variant="outline" className={getPriceLevelColor(company.priceLevel)}>
                              {company.priceLevel}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Bewertung</p>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">Ø {company.rating} / 5 (Demo-Wert)</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Besonderheiten</p>
                            <p className="text-sm text-primary">{company.highlight}</p>
                          </div>
                        </div>

                        <Button className="w-full mt-4" size="lg">
                          Offerte anfragen
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Price Examples Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-secondary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Was kostet ein Umzug in Zug?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Typische Preisbeispiele für deinen Umzug im Kanton Zug
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {priceExamples.map((example, index) => (
                <ScrollReveal key={example.title} delay={0.1 * index}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-5 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <example.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{example.title}</h3>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                      <p className="text-xs text-muted-foreground">{example.info}</p>
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Typischer Kostenbereich:</p>
                        <p className="text-xl font-bold text-primary">{example.priceRange}</p>
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
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Beliebte Services im Kanton Zug
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Entdecke spezialisierte Umzugs- und Zusatzservices
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <ScrollReveal key={service.title} delay={0.05 * (index % 3)}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                    <CardContent className="p-5 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <service.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="flex items-center gap-2 text-primary font-medium text-sm pt-2">
                        Mehr erfahren
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* USPs Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Warum umzugscheck.ch für deinen Umzug in Zug?
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {usps.map((usp, index) => (
                <ScrollReveal key={usp.title} delay={0.05 * (index % 3)}>
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <usp.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{usp.title}</h3>
                    <p className="text-sm text-muted-foreground">{usp.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  So funktioniert umzugscheck.ch in Zug
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  In nur 3 Schritten zur passenden Umzugsfirma
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
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
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground shadow-lg">
                <CardContent className="p-6 sm:p-8 text-center space-y-4">
                  <h3 className="text-2xl font-bold">Bereit für deinen Umzug in Zug?</h3>
                  <p className="text-primary-foreground/90">Die Anfrage ist kostenlos und unverbindlich</p>
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    Jetzt Offerten anfordern
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* Local Info Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-secondary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8">
                  Umziehen im Kanton Zug: Das musst du wissen
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="prose prose-sm sm:prose-base max-w-none space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">An- und Abmeldung beim Einwohneramt</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Bei einem Umzug innerhalb der Schweiz – also auch im Kanton Zug – musst du dich beim Einwohneramt deiner bisherigen Gemeinde abmelden und beim Einwohneramt der neuen Gemeinde anmelden. Dies sollte in der Regel innerhalb von 14 Tagen nach dem Umzug erfolgen. Die genauen Fristen und Prozesse können je nach Gemeinde leicht variieren.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">Parkbewilligungen & Halteverbote</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      In der Altstadt von Zug, in engen Quartieren oder bei viel befahrenen Strassen kann eine kurzfristige Parkbewilligung oder ein Halteverbot notwendig sein, um den Umzugswagen optimal zu positionieren. Erkundige dich frühzeitig bei der Gemeinde oder deinem Vermieter, ob eine solche Bewilligung nötig ist. Viele Umzugsfirmen können dich auch bei der Organisation unterstützen.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">Besonderheiten im Kanton Zug</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Der Kanton Zug ist einer der wirtschaftsstärksten Kantone der Schweiz mit einer hohen Dichte an Unternehmen und einer entsprechend dynamischen Wohnsituation. Besonders in der Stadt Zug sowie in den Gemeinden Baar und Cham herrscht hohe Nachfrage nach Wohnraum. Die Umzugsbranche im Kanton Zug ist gut aufgestellt: Lokale Anbieter kennen die örtlichen Gegebenheiten, und grössere Unternehmen decken auch überregionale Umzüge ab.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Häufige Fragen zu Umzügen im Kanton Zug
                </h2>
              </div>
            </ScrollReveal>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <ScrollReveal key={index} delay={0.05 * index}>
                    <AccordionItem value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </ScrollReveal>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-20 sm:bottom-8 z-40 flex flex-col gap-3">
        <a 
          href="tel:+41445678900" 
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Anrufen"
        >
          <Phone className="w-5 h-5" />
        </a>
        <a 
          href="mailto:info@umzugscheck.ch" 
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="E-Mail senden"
        >
          <Mail className="w-5 h-5" />
        </a>
        <a 
          href="https://wa.me/41445678900" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      
      <StickyMobileCTA />
      <ScrollToTop />
    </div>
  );
};

export default Zug;

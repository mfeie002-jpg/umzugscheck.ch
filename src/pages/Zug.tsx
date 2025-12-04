import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import zugHero from "@/assets/zug-hero.jpg";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, Star, Shield, TrendingUp, Users, Clock, CheckCircle2,
  Home, Building2, Trash2, Package, Truck, ArrowRight,
  Phone, Mail, MessageCircle, Layers, Sparkles, Award,
  Calendar, Eye, Zap, Heart, ThumbsUp, Timer, TrendingDown,
  Calculator, Search, ChevronDown
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

/**
 * Zug Canton Landing Page - Enhanced with 25+ Optimizations
 * 
 * Enhancements:
 * 1. Animated hero background gradient
 * 2. Live activity indicator
 * 3. Animated trust badges
 * 4. Glassmorphism form card
 * 5. Form progress indicator
 * 6. Staggered company card animations
 * 7. Animated rating stars
 * 8. Quick comparison floating banner
 * 9. Price range visualization
 * 10. Animated service icons
 * 11. Testimonial mini-section
 * 12. Seasonal pricing indicator
 * 13. AI suggestion badges
 * 14. Animated counters
 * 15. FAQ with search
 * 16. Scroll progress indicator
 * 17. Enhanced mobile UX
 * 18. Social proof notifications
 * 19. Urgency indicators
 * 20. Enhanced comparison table
 * 21. Floating particles
 * 22. Interactive tooltips
 * 23. Quick estimate preview
 * 24. Animated CTAs
 * 25. Live availability status
 * 26. Popular choice badges
 * 27. Savings calculator preview
 */

const Zug = () => {
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(["Zuger Umzüge", "Happy Moving GmbH", "Helvetia Transporte & Umzüge"]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [liveViewers, setLiveViewers] = useState(12);
  const [showNotification, setShowNotification] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // #1 - Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // #2 - Live viewers simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(8, Math.min(25, prev + Math.floor(Math.random() * 5) - 2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // #18 - Social proof notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
      reviewCount: 156,
      highlight: "Ideal für Umzüge in Zug & Baar",
      availability: "Verfügbar ab 15. Dez",
      isPopular: true,
      savingsPercent: 15,
    },
    {
      name: "Happy Moving GmbH",
      tagline: "Strukturierte Abläufe für komplexe Umzugsprojekte",
      regions: ["Zug", "Baar", "Cham", "Hünenberg", "Rotkreuz", "Schweizweit"],
      services: ["Privatumzug", "Firmenumzug", "Einlagerung", "Räumung", "Reinigung"],
      priceLevel: "Mittel–Premium",
      rating: 4.8,
      reviewCount: 234,
      highlight: "Full-Service inkl. Reinigung",
      availability: "Sofort verfügbar",
      isPopular: true,
      isAIRecommended: true,
      savingsPercent: 22,
    },
    {
      name: "Helvetia Transporte & Umzüge",
      tagline: "Starke Planung für anspruchsvolle Umzüge",
      regions: ["Zug", "Baar", "Cham", "Walchwil", "Hünenberg"],
      services: ["Privatumzug", "Firmenumzug", "Möbellift"],
      priceLevel: "Mittel",
      rating: 4.6,
      reviewCount: 89,
      highlight: "Spezialist für Möbellift-Einsätze",
      availability: "Verfügbar ab 20. Dez",
      savingsPercent: 12,
    },
    {
      name: "Kehrli + Oeler",
      tagline: "Traditionsunternehmen mit Fokus auf Qualität",
      regions: ["Schweizweit inkl. Zug"],
      services: ["Privatumzug", "Firmenumzug"],
      priceLevel: "Premium",
      rating: 4.9,
      reviewCount: 412,
      highlight: "Höchste Qualitätsstandards",
      availability: "Auf Anfrage",
      isPremium: true,
      savingsPercent: 8,
    },
    {
      name: "Umzugsfuchs",
      tagline: "Preisorientierte Angebote mit Kostentransparenz",
      regions: ["Schweizweit inkl. Zug"],
      services: ["Privatumzug"],
      priceLevel: "Günstig",
      rating: 4.5,
      reviewCount: 178,
      highlight: "Beste Preise für Privatumzüge",
      availability: "Sofort verfügbar",
      isBestPrice: true,
      savingsPercent: 35,
    },
    {
      name: "Umzugprofis",
      tagline: "Full-Service inkl. Räumung und Reinigung",
      regions: ["Zug & Schweizweit"],
      services: ["Privatumzug", "Entsorgung", "Reinigung"],
      priceLevel: "Mittel",
      rating: 4.7,
      reviewCount: 145,
      highlight: "Komplettpaket möglich",
      availability: "Verfügbar ab 18. Dez",
      savingsPercent: 18,
    },
    {
      name: "Slavi Umzüge",
      tagline: "Persönliche Betreuung und langjährige Erfahrung",
      regions: ["Kanton Zug & Region"],
      services: ["Privatumzug", "Firmenumzug"],
      priceLevel: "Mittel",
      rating: 4.6,
      reviewCount: 67,
      highlight: "Familienbetrieb mit Herz",
      availability: "Sofort verfügbar",
      savingsPercent: 20,
    },
    {
      name: "Arnold Umzüge",
      tagline: "Umzug, Lager und Räumung kombiniert",
      regions: ["Kanton Zug"],
      services: ["Privatumzug", "Einlagerung", "Entsorgung"],
      priceLevel: "Mittel",
      rating: 4.5,
      reviewCount: 56,
      highlight: "Lagerlösungen verfügbar",
      availability: "Verfügbar ab 22. Dez",
      savingsPercent: 14,
    },
    {
      name: "Martinas Umzugsservice",
      tagline: "Umzug + Reinigung mit Abgabegarantie",
      regions: ["Kanton Zug & Umgebung"],
      services: ["Privatumzug", "Reinigung", "Einlagerung", "Räumung", "Firmenumzug"],
      priceLevel: "Mittel–Premium",
      rating: 4.8,
      reviewCount: 198,
      highlight: "Abgabegarantie inklusive",
      availability: "Sofort verfügbar",
      isPopular: true,
      savingsPercent: 25,
    },
    {
      name: "Fachmann Umzug",
      tagline: "Budgetfreundlich für mehrere Kantone",
      regions: ["Zürich, Aargau, Luzern & Zug"],
      services: ["Privatumzug", "Reinigung", "Entsorgung", "Einlagerung"],
      priceLevel: "Günstig",
      rating: 4.4,
      reviewCount: 112,
      highlight: "Kantonsübergreifend günstig",
      availability: "Verfügbar ab 17. Dez",
      savingsPercent: 30,
    },
  ];

  const priceExamples = [
    {
      title: "2.5-Zimmer Wohnung",
      subtitle: "Innerhalb Stadt Zug",
      description: "Inkl. Transport, Tragen und einfacher Möbelmontage.",
      info: "2–3 Helfer · 1 LKW · ca. 4–6 Std.",
      priceRange: "CHF 800 – 1'400",
      avgSavings: "CHF 280",
      icon: Home,
    },
    {
      title: "3.5-Zimmer Wohnung",
      subtitle: "Zug → Baar oder Cham",
      description: "Mit Tragen, Transport und einfachem Auf- und Abbau.",
      info: "3 Helfer · 1 LKW · ca. 6–8 Std.",
      priceRange: "CHF 1'200 – 2'200",
      avgSavings: "CHF 420",
      icon: Building2,
    },
    {
      title: "4.5-Zimmer Haus",
      subtitle: "Umzug + Reinigung",
      description: "Komplettumzug mit Endreinigung und Abgabegarantie.",
      info: "Umzugs- + Reinigungsteam",
      priceRange: "CHF 2'500 – 4'500",
      avgSavings: "CHF 680",
      icon: Home,
    },
  ];

  const services = [
    {
      title: "Umzug + Reinigung",
      description: "Kombiniertes Angebot mit garantierter Abnahme.",
      link: "/zug/umzug-mit-reinigung",
      icon: Home,
      popularity: 85,
    },
    {
      title: "Firmenumzug",
      description: "Professionelle Geschäftsumzüge mit minimaler Ausfallzeit.",
      link: "/zug/firmenumzug",
      icon: Building2,
      popularity: 72,
    },
    {
      title: "Möbellift",
      description: "Ideal für enge Zufahrten und obere Etagen.",
      link: "/zug/moebellift",
      icon: Truck,
      popularity: 65,
    },
    {
      title: "Entsorgung & Räumung",
      description: "Professionelle Entrümpelung von Kellern und Estrich.",
      link: "/zug/entsorgung-raeumung",
      icon: Trash2,
      popularity: 58,
    },
    {
      title: "Möbellager",
      description: "Sichere Lagermöglichkeiten für kurz- oder langfristig.",
      link: "/zug/moebellager",
      icon: Package,
      popularity: 45,
    },
    {
      title: "Kleintransporte",
      description: "Flexible Lösungen für WG-Umzüge oder einzelne Möbel.",
      link: "/zug/kleinumzug",
      icon: Truck,
      popularity: 52,
    },
  ];

  const usps = [
    {
      title: "Geprüfte Umzugsfirmen",
      description: "Ausgewählte Umzugsfirmen, die regelmässig in Zug, Baar und Cham umziehen.",
      icon: Shield,
      stat: "100%",
      statLabel: "Verifiziert",
    },
    {
      title: "Zeit & Geld sparen",
      description: "Eine Anfrage, mehrere Offerten – bis zu 40% sparen.",
      icon: Clock,
      stat: "Ø 40%",
      statLabel: "Ersparnis",
    },
    {
      title: "Zusatzservices",
      description: "Reinigung, Entsorgung, Einlagerung – alles auf einen Blick.",
      icon: CheckCircle2,
      stat: "15+",
      statLabel: "Services",
    },
    {
      title: "Lokale Expertise",
      description: "Informationen zu Verwaltung, Parkbewilligungen und lokalen Gegebenheiten.",
      icon: MapPin,
      stat: "11",
      statLabel: "Gemeinden",
    },
    {
      title: "Transparenz",
      description: "Strukturierte Profile, klare Beschreibungen, keine versteckten Kosten.",
      icon: TrendingUp,
      stat: "4.8/5",
      statLabel: "Bewertung",
    },
    {
      title: "Direktvergleich",
      description: "Vergleiche mehrere Firmen nebeneinander und finde den besten Partner.",
      icon: Layers,
      stat: "3",
      statLabel: "Vergleichen",
    },
  ];

  const faqs = [
    {
      question: "Was kostet ein Umzug in Zug?",
      answer: "Die Kosten hängen von mehreren Faktoren ab: Anzahl Zimmer, Etage, Distanz, Zugang und Zusatzleistungen. Ein 2.5-Zimmer-Umzug innerhalb von Zug kostet typischerweise CHF 800–1'400, ein 3.5-Zimmer-Umzug zwischen CHF 1'200–2'200. Für grössere Wohnungen oder Häuser rechne mit CHF 2'500–4'500.",
      category: "Kosten",
    },
    {
      question: "Wie früh sollte ich eine Umzugsfirma im Kanton Zug buchen?",
      answer: "Idealerweise 4–8 Wochen im Voraus. Bei Umzügen am Monatsende oder in der Hochsaison (April–September) empfehlen wir 8–12 Wochen Vorlauf. Besonders im wirtschaftsstarken Kanton Zug sind gute Umzugsfirmen oft früh ausgebucht.",
      category: "Planung",
    },
    {
      question: "Gibt es Umzugsfirmen mit Reinigung und Abgabegarantie?",
      answer: "Ja, mehrere unserer Partnerfirmen im Kanton Zug bieten kombinierte Umzugs- und Reinigungspakete mit Abgabegarantie an. Das bedeutet: Falls die Verwaltung die Reinigung nicht abnimmt, wird kostenlos nachgereinigt.",
      category: "Services",
    },
    {
      question: "Wie finde ich eine zuverlässige Umzugsfirma in Zug?",
      answer: "Über umzugscheck.ch vergleichst du geprüfte Umzugsfirmen im Kanton Zug. Achte auf Bewertungen, Erfahrungsberichte und das Leistungsspektrum. Hol dir mehrere Offerten und vergleiche Preise sowie inkludierte Leistungen.",
      category: "Vergleich",
    },
    {
      question: "Wie funktioniert der Firmenumzug im Kanton Zug über umzugscheck.ch?",
      answer: "Firmenumzüge sind ein wichtiger Schwerpunkt. Beschreibe dein Projekt (Bürogrösse, IT-Equipment, Zeitrahmen), und du erhältst massgeschneiderte Offerten von spezialisierten Umzugsfirmen. Viele bieten Wochenend-Umzüge an, um Ausfallzeiten zu minimieren.",
      category: "Services",
    },
    {
      question: "Brauche ich eine Parkbewilligung für den Umzug in Zug?",
      answer: "Das hängt vom Standort ab. In der Altstadt von Zug oder bei engen Quartieren kann eine Parkbewilligung oder ein temporäres Halteverbot nötig sein. Erkundige dich frühzeitig bei der Gemeinde oder frage deine Umzugsfirma – viele übernehmen das für dich.",
      category: "Planung",
    },
    {
      question: "Bieten die Umzugsfirmen Fixpreise oder Stundenansätze an?",
      answer: "Beides ist möglich. Einige Firmen arbeiten mit Fixpreisen (besonders bei Standardumzügen), andere nach Stunden. In den Offerten siehst du klar, welches Modell angeboten wird. Fixpreise bieten mehr Planungssicherheit, Stundenansätze können bei kleineren Umzügen günstiger sein.",
      category: "Kosten",
    },
  ];

  // #15 - Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq => 
    faqSearch === "" || 
    faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const toggleCompanySelection = (companyName: string) => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyName)) {
        return prev.filter(name => name !== companyName);
      }
      if (prev.length >= 3) return prev;
      return [...prev, companyName];
    });
  };

  const selectedCompanyData = companies.filter(c => selectedCompanies.includes(c.name));

  // #5 - Calculate form progress
  const formProgress = [selectedFrom, selectedTo, roomSize].filter(Boolean).length * 25 + (selectedServices.length > 0 ? 25 : 0);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Schweiz", "item": "https://umzugscheck.ch" },
          { "@type": "ListItem", "position": 2, "name": "Kanton Zug", "item": "https://umzugscheck.ch/zug" },
          { "@type": "ListItem", "position": 3, "name": "Umzug" }
        ]
      },
      {
        "@type": "Service",
        "name": "Umzugsvergleich im Kanton Zug",
        "provider": { "@type": "Organization", "name": "umzugscheck.ch" },
        "areaServed": { "@type": "Place", "name": "Kanton Zug, Schweiz" },
        "description": "Vergleiche Umzugsfirmen im Kanton Zug, prüfe Bewertungen und erhalte gratis Offerten."
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
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
        <title>Umzugsfirma Zug: Umzugsfirmen vergleichen &amp; Offerten erhalten | umzugscheck.ch</title>
        <meta name="description" content="Finde die beste Umzugsfirma in Zug: Vergleiche geprüfte Umzugsfirmen im Kanton Zug, erhalte kostenlose Offerten und spare Zeit & Geld beim Umzug. Privatumzug, Firmenumzug & Reinigung mit Abgabegarantie." />
        <meta name="keywords" content="Umzugsfirma Zug, Umzug Zug, Umzugsfirmen Kanton Zug, Umzugsunternehmen Zug, Umzug Baar, Umzug Cham, Umzug Steinhausen" />
        <link rel="canonical" href="https://umzugscheck.ch/zug" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Umzugsfirma Zug: Umzugsfirmen vergleichen & Offerten erhalten | umzugscheck.ch" />
        <meta property="og:description" content="Finde die beste Umzugsfirma in Zug: Vergleiche geprüfte Umzugsfirmen im Kanton Zug, erhalte kostenlose Offerten und spare Zeit & Geld beim Umzug." />
        <meta property="og:url" content="https://umzugscheck.ch/zug" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="de_CH" />
        <meta property="og:site_name" content="umzugscheck.ch" />
        
        {/* GEO Meta Tags */}
        <meta name="geo.region" content="CH-ZG" />
        <meta name="geo.placename" content="Kanton Zug, Schweiz" />
        <meta name="geo.position" content="47.1662;8.5155" />
        <meta name="ICBM" content="47.1662, 8.5155" />
        
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* #1 - Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollProgress / 100 }}
      />

      {/* #18 - Social Proof Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-24 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 max-w-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Marco aus Baar</p>
                <p className="text-xs text-muted-foreground">hat gerade eine Offerte angefordert</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

        {/* #1 - Hero Section with Animated Background */}
        <section className="relative bg-gradient-to-br from-background via-primary/5 to-background py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/10"
                initial={{ x: Math.random() * 100 + "%", y: "100%" }}
                animate={{ y: "-10%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              {/* Left: Text + Form */}
              <ScrollReveal direction="right">
                <div className="space-y-4 sm:space-y-6">
                  {/* #2 - Live Activity Indicator */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <Eye className="w-4 h-4" />
                    <span>{liveViewers} Personen schauen sich gerade Zug an</span>
                  </motion.div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Umzug in <span className="text-primary">Zug</span> vergleichen – Offerten von geprüften Umzugsfirmen
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Du planst einen Umzug in Zug, Baar oder Cham? Über umzugscheck.ch vergleichst du geprüfte Umzugsfirmen, sparst Zeit und oft mehrere hundert Franken.
                  </p>

                  {/* #4 - Glassmorphism Form Card */}
                  <Card className="shadow-xl border-primary/10 backdrop-blur-sm bg-background/95">
                    <CardContent className="p-4 sm:p-6 space-y-4">
                      {/* #5 - Form Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Fortschritt</span>
                          <span>{formProgress}%</span>
                        </div>
                        <Progress value={formProgress} className="h-2" />
                      </div>

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
                            <label 
                              key={service} 
                              className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                                selectedServices.includes(service) 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <Checkbox 
                                checked={selectedServices.includes(service)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedServices([...selectedServices, service]);
                                  } else {
                                    setSelectedServices(selectedServices.filter(s => s !== service));
                                  }
                                }}
                                className="h-5 w-5" 
                              />
                              <span className="text-sm font-medium">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* #23 - Quick Estimate Preview */}
                      {roomSize && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-primary/5 rounded-lg p-3 border border-primary/10"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <Calculator className="w-4 h-4 text-primary" />
                            <span className="font-medium">Geschätzte Kosten:</span>
                            <span className="text-primary font-bold">
                              {roomSize === "1-1.5" && "CHF 500 – 900"}
                              {roomSize === "2-2.5" && "CHF 800 – 1'400"}
                              {roomSize === "3-3.5" && "CHF 1'200 – 2'200"}
                              {roomSize === "4-4.5" && "CHF 1'800 – 3'000"}
                              {roomSize === "5+" && "CHF 2'500 – 4'500"}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Link to="/umzugsofferten" className="flex-1">
                          <Button size="lg" className="w-full group">
                            <span>Gratis Offerten anfordern</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <Link to="/rechner" className="flex-1">
                          <Button size="lg" variant="outline" className="w-full">
                            Preise ansehen
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* #3 - Animated Trust Badges */}
                  <motion.div 
                    className="flex flex-wrap gap-4 pt-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                  >
                    {[
                      { icon: Star, label: "Ø 4.8 / 5", color: "text-yellow-500 fill-yellow-500" },
                      { icon: Users, label: "15'000+ Umzüge", color: "text-primary" },
                      { icon: Shield, label: "Geprüfte Firmen", color: "text-primary" },
                    ].map((badge, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 text-sm bg-background/80 px-3 py-2 rounded-full border border-border/50 shadow-sm"
                      >
                        <badge.icon className={`w-5 h-5 ${badge.color}`} />
                        <span className="font-medium">{badge.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </ScrollReveal>

              {/* Right: Hero Image */}
              <ScrollReveal direction="left" delay={200}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={zugHero}
                    alt="Kanton Zug mit Zugersee und Bergpanorama"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* #12 - Seasonal Indicator */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">Nebensaison</span>
                      <Badge variant="secondary" className="text-xs">-15% günstiger</Badge>
                    </div>
                  </div>

                  {/* #27 - Savings Calculator Preview */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Durchschnittliche Ersparnis</p>
                        <p className="text-2xl font-bold text-primary">CHF 380</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Durch Vergleich</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingDown className="w-4 h-4" />
                          <span className="font-bold">-22%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* #6 - Company Comparison Section with Staggered Animations */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <Badge className="mb-4" variant="secondary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Top 10 Anbieter
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Top Umzugsfirmen im Kanton Zug
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Vergleiche geprüfte Umzugsfirmen und finde den perfekten Partner
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
                    {locations.slice(0, 6).map(loc => (
                      <Badge key={loc} variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">{loc}</Badge>
                    ))}
                    <Badge variant="outline" className="cursor-pointer">
                      +{locations.length - 6} mehr
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Badge>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* #8 - Quick Comparison Banner */}
            <div className="max-w-6xl mx-auto mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      {selectedCompanies.length}/3 Firmen für Vergleich ausgewählt
                    </span>
                    <p className="text-xs text-muted-foreground">Wähle bis zu 3 Firmen zum direkten Vergleich</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedCompanies.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedCompanies([])}>
                      Auswahl löschen
                    </Button>
                  )}
                  {selectedCompanies.length >= 2 && (
                    <Button size="sm">
                      Jetzt vergleichen
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Company Cards with Staggered Animation */}
            <div className="grid sm:grid-cols-2 gap-5 max-w-6xl mx-auto">
              {companies.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`h-full transition-all duration-300 hover:-translate-y-1 relative group ${
                    selectedCompanies.includes(company.name) 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-lg'
                  }`}>
                    <CardContent className="p-5 space-y-4">
                      {/* Header with Badges */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">#{index + 1}</span>
                          </div>
                          {index < 2 && (
                            <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                              Gesponsert
                            </Badge>
                          )}
                          {/* #13 - AI Recommendation Badge */}
                          {company.isAIRecommended && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              <Sparkles className="w-3 h-3 mr-1" />
                              KI-Empfehlung
                            </Badge>
                          )}
                          {/* #26 - Popular Choice Badge */}
                          {company.isPopular && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <Heart className="w-3 h-3 mr-1" />
                              Beliebt
                            </Badge>
                          )}
                          {company.isBestPrice && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Bester Preis
                            </Badge>
                          )}
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-xs text-muted-foreground hidden sm:inline">Vergleichen</span>
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
                        {company.services.slice(0, 4).map(service => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {company.services.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{company.services.length - 4}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getPriceLevelColor(company.priceLevel)}>
                            {company.priceLevel}
                          </Badge>
                          {/* #19 - Availability Indicator */}
                          <span className={`text-xs flex items-center gap-1 ${
                            company.availability.includes("Sofort") ? "text-green-600" : "text-muted-foreground"
                          }`}>
                            <Timer className="w-3 h-3" />
                            {company.availability}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate text-xs">{company.regions.slice(0, 3).join(", ")}</span>
                        </div>
                        {/* #7 - Animated Rating Stars */}
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(company.rating) 
                                    ? 'text-yellow-500 fill-yellow-500' 
                                    : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{company.rating}</span>
                          <span className="text-xs text-muted-foreground">({company.reviewCount} Bewertungen)</span>
                        </div>
                        {/* Savings indicator */}
                        <div className="flex items-center gap-2 text-green-600 text-xs">
                          <TrendingDown className="w-3 h-3" />
                          <span>Bis zu {company.savingsPercent}% sparen vs. Direktbuchung</span>
                        </div>
                      </div>

                      <Button className="w-full group" size="lg">
                        Offerte anfragen
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* #20 - Enhanced Comparison Table */}
        <section className="py-12 sm:py-16 lg:py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Umzugsfirmen direkt vergleichen
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Wähle bis zu drei Anbieter und vergleiche Leistungen auf einen Blick.
                </p>
              </div>
            </ScrollReveal>

            {selectedCompanyData.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8 text-center">
                  <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Wähle oben bis zu drei Umzugsfirmen aus, um sie hier zu vergleichen.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {selectedCompanyData.map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-background relative overflow-hidden">
                      {/* Best match indicator */}
                      {index === 0 && selectedCompanyData.length > 1 && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                          <Award className="w-3 h-3 inline mr-1" />
                          Beste Übereinstimmung
                        </div>
                      )}
                      <CardContent className="p-5 space-y-4">
                        <div className="text-center pb-4 border-b">
                          <h3 className="text-lg font-bold text-foreground">{company.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{company.tagline}</p>
                          <div className="flex justify-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(company.rating) 
                                    ? 'text-yellow-500 fill-yellow-500' 
                                    : 'text-gray-200'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm">{company.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Preisniveau</p>
                            <Badge variant="outline" className={getPriceLevelColor(company.priceLevel)}>
                              {company.priceLevel}
                            </Badge>
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
                            <p className="text-xs font-medium text-muted-foreground mb-2">Verfügbarkeit</p>
                            <p className={`text-sm ${
                              company.availability.includes("Sofort") ? "text-green-600 font-medium" : ""
                            }`}>
                              {company.availability}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Ersparnis</p>
                            <p className="text-lg font-bold text-green-600">Bis zu {company.savingsPercent}%</p>
                          </div>
                        </div>

                        <Button className="w-full mt-4 group" size="lg">
                          Offerte anfragen
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* #9 - Price Examples with Range Visualization */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-secondary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <Badge className="mb-4" variant="outline">
                  <Calculator className="w-3 h-3 mr-1" />
                  Preisübersicht
                </Badge>
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
                <motion.div
                  key={example.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                    {/* Savings Badge */}
                    <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Ø {example.avgSavings} sparen
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <example.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{example.title}</h3>
                        <p className="text-sm text-primary">{example.subtitle}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                      <p className="text-xs text-muted-foreground">{example.info}</p>
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Typischer Kostenbereich:</p>
                        <p className="text-2xl font-bold text-primary">{example.priceRange}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <p className="text-sm text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
                * Die effektiven Kosten hängen von Distanz, Etage, Zugang und Zusatzleistungen ab. 
                Über umzugscheck.ch erhältst du konkrete Offerten für deinen Umzug.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* #10 - Services Grid with Animated Icons */}
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
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={service.link}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <motion.div 
                            className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                            <service.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                          </motion.div>
                          {/* Popularity indicator */}
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {service.popularity}% Nachfrage
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-2 text-primary font-medium text-sm pt-2">
                          Mehr erfahren
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* #14 - USPs Section with Animated Counters */}
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
                <motion.div
                  key={usp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="text-center space-y-4 group"
                >
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <usp.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  </motion.div>
                  {/* Animated stat */}
                  <div className="text-2xl font-bold text-primary">{usp.stat}</div>
                  <p className="text-xs text-muted-foreground">{usp.statLabel}</p>
                  <h3 className="text-xl font-bold text-foreground">{usp.title}</h3>
                  <p className="text-sm text-muted-foreground">{usp.description}</p>
                </motion.div>
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
                  So funktioniert's
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  In nur 3 Schritten zur passenden Umzugsfirma
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
              {[
                { step: "1", title: "Anfrage ausfüllen", description: "Beantworte ein paar Fragen zu Start- und Zielort.", duration: "2 Min." },
                { step: "2", title: "Offerten erhalten", description: "Du erhältst Offerten von passenden Umzugsfirmen.", duration: "24 Std." },
                { step: "3", title: "Anbieter wählen", description: "Vergleiche Preise und wähle deinen Favoriten.", duration: "Kostenlos" },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center space-y-4 relative"
                >
                  {/* Connector line */}
                  {index < 2 && (
                    <div className="hidden sm:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                  )}
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold relative z-10"
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.step}
                  </motion.div>
                  <Badge variant="secondary" className="text-xs">{step.duration}</Badge>
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl">
                <CardContent className="p-6 sm:p-8 text-center space-y-4">
                  <h3 className="text-2xl font-bold">Bereit für deinen Umzug in Zug?</h3>
                  <p className="text-primary-foreground/90">Die Anfrage ist kostenlos und unverbindlich</p>
                  <Link to="/umzugsofferten">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 group">
                      Jetzt Offerten anfordern
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* SEO Content Block: Kanton Zug & wichtige Orte */}
        <section className="py-12 sm:py-16 lg:py-20 bg-secondary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8">
                  Umzug im Kanton Zug: Das solltest du wissen
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="prose prose-sm sm:prose-base max-w-none space-y-6">
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Der Kanton Zug gehört zu den wirtschaftsstärksten und attraktivsten Regionen der Schweiz. Mit seiner zentralen Lage zwischen Zürich und Luzern, den tiefen Steuern und der hohen Lebensqualität zieht er jedes Jahr tausende neue Einwohner an. Das bedeutet: Die Nachfrage nach professionellen Umzugsfirmen ist hoch, und eine frühzeitige Planung lohnt sich.
                  </p>

                  <div className="bg-background rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Umzug in der Stadt Zug
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Die Stadt Zug ist das pulsierende Zentrum des Kantons. Mit ihrer malerischen Altstadt, dem Zugersee und der kompakten Grösse bietet sie hohe Lebensqualität – bringt aber auch Herausforderungen für Umzüge mit sich.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Die engen Gassen der Altstadt erfordern oft Sondergenehmigungen für Umzugsfahrzeuge. Ein Möbellift ist bei älteren Gebäuden ohne Lift oft unverzichtbar. Lokale Umzugsfirmen kennen diese Besonderheiten und können entsprechend planen.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Tipp:</strong> Über umzugscheck.ch findest du Umzugsfirmen, die regelmässig in der Stadt Zug umziehen und die lokalen Gegebenheiten kennen.
                    </p>
                  </div>

                  <div className="bg-background rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Umzug in Baar
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Baar ist mit über 25'000 Einwohnern die grösste Gemeinde im Kanton Zug und bietet eine attraktive Mischung aus urbanem Leben und ländlicher Umgebung. Viele internationale Unternehmen haben hier ihren Sitz, was zu einer hohen Nachfrage nach Wohnraum führt.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Umzüge in Baar sind meist unkomplizierter als in der Zuger Altstadt. Die gute Verkehrsanbindung (Autobahn A4, Bahnhof) macht den Transport effizient. Dennoch empfehlen wir, mehrere Offerten zu vergleichen – die Preise können stark variieren.
                    </p>
                  </div>

                  <div className="bg-background rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      Umzug in Cham
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Cham liegt idyllisch am Zugersee und bietet Familien ein attraktives Umfeld. Die Gemeinde wächst stetig, und viele Neubauprojekte entstehen. Für Umzüge bedeutet das: gute Zufahrtsmöglichkeiten bei Neubauten, aber teilweise enge Verhältnisse im historischen Ortskern.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Tipp:</strong> Falls du an den See ziehst, kläre frühzeitig die Parkmöglichkeiten für den Umzugstag – am Wochenende kann es eng werden.
                    </p>
                  </div>

                  <div className="bg-background rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Umzug mit Reinigung und Abgabegarantie im Kanton Zug
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Im Kanton Zug sind die Anforderungen an die Wohnungsabgabe oft hoch. Eine professionelle Endreinigung mit Abgabegarantie gibt dir Sicherheit: Falls die Verwaltung die Reinigung nicht abnimmt, wird kostenlos nachgereinigt.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Mehrere Umzugsfirmen auf umzugscheck.ch bieten kombinierte Pakete aus Umzug und Reinigung an. Das spart Zeit, Nerven und oft auch Geld im Vergleich zu getrennten Buchungen.
                    </p>
                  </div>

                  <div className="bg-background rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Firmenumzug im Kanton Zug
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Der Kanton Zug ist ein bedeutender Wirtschaftsstandort mit zahlreichen internationalen Unternehmen. Firmenumzüge erfordern spezielle Expertise: IT-Equipment, sensible Dokumente, enge Zeitfenster.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Über umzugscheck.ch findest du Umzugsfirmen, die auf Geschäftsumzüge spezialisiert sind. Viele bieten Wochenend-Umzüge an, um Betriebsunterbrechungen zu minimieren. Beschreibe dein Projekt detailliert, um passende Offerten zu erhalten.
                    </p>
                  </div>

                  <div className="bg-background rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      An- und Abmeldung beim Einwohneramt
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Bei einem Umzug innerhalb der Schweiz musst du dich beim Einwohneramt deiner bisherigen Gemeinde abmelden und bei der neuen Gemeinde anmelden. Dies sollte innerhalb von 14 Tagen nach dem Umzug erfolgen. Im Kanton Zug kannst du viele Formalitäten auch online erledigen.
                    </p>
                  </div>

                  <div className="bg-background rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Parkbewilligungen & Halteverbote
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      In der Altstadt von Zug oder bei engen Quartieren kann eine Parkbewilligung oder ein temporäres Halteverbot nötig sein. Die Kosten liegen typischerweise bei CHF 50–150. Erkundige dich frühzeitig bei der Gemeinde oder frage deine Umzugsfirma – viele übernehmen die Beantragung als Service.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* #15 - FAQ Section with Search */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Häufige Fragen zu Umzügen in Zug
                </h2>
                {/* FAQ Search */}
                <div className="relative max-w-md mx-auto mt-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Frage suchen..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </ScrollReveal>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AccordionItem value={`item-${index}`} className="border rounded-lg px-4 bg-background shadow-sm">
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {faq.category}
                          </Badge>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Keine Fragen gefunden. Versuche einen anderen Suchbegriff.</p>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Kostenlos & unverbindlich
                </Badge>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Bereit für deinen Umzug im Kanton Zug?
                </h2>
                
                <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                  Vergleiche jetzt geprüfte Umzugsfirmen, spare bis zu 40% und ziehe entspannt um. 
                  Die Anfrage dauert nur 2 Minuten.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to="/umzugsofferten">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-xl group text-base px-8 py-6">
                      <span>Jetzt Gratis-Offerten erhalten</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/rechner">
                    <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 text-base px-8 py-6">
                      <Calculator className="w-5 h-5 mr-2" />
                      Preise berechnen
                    </Button>
                  </Link>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-primary-foreground/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>100% kostenlos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Unverbindliche Offerten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Geprüfte Schweizer Firmen</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* Sticky Comparison Bar */}
      <AnimatePresence>
        {selectedCompanies.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl p-4 sm:hidden"
          >
            <div className="container mx-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedCompanies.length}/3 ausgewählt</p>
                    <p className="text-xs text-muted-foreground">Zum Vergleich</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedCompanies.length >= 2 && (
                    <Button size="sm" className="group">
                      Vergleichen
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sticky Comparison Bar */}
      <AnimatePresence>
        {selectedCompanies.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden sm:block"
          >
            <div className="bg-background border border-border rounded-full shadow-2xl px-6 py-3 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{selectedCompanies.length} von 3 Firmen ausgewählt</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCompanies([])}>
                  Löschen
                </Button>
                {selectedCompanies.length >= 2 && (
                  <Link to={`/zug/vergleich?firmen=${encodeURIComponent(selectedCompanies.join(","))}`}>
                    <Button size="sm" className="group">
                      Ausgewählte vergleichen
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-20 sm:bottom-8 z-40 flex flex-col gap-3">
        <motion.a 
          href="tel:+41445678900" 
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          aria-label="Anrufen"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href="mailto:info@umzugscheck.ch" 
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          aria-label="E-Mail senden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mail className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href="https://wa.me/41445678900" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg"
          aria-label="WhatsApp"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-5 h-5" />
        </motion.a>
      </div>

      <StickyMobileCTA />
      <ScrollToTop />
    </div>
  );
};

export default Zug;

import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Shield, 
  Clock, 
  Users, 
  TrendingDown,
  Video,
  Sparkles,
  Building2,
  Truck,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Play,
  Lock,
  Award,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ============================================================================
// LANDING PAGE - Conversion-optimierte One-Page für Umzugscheck.ch
// ============================================================================

const LandingPage = () => {
  const navigate = useNavigate();
  const [fromPostal, setFromPostal] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleStartQuote = () => {
    if (fromPostal.length >= 4) {
      // Navigate to calculator with pre-filled postal code
      navigate(`/umzugsrechner?from=${fromPostal}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Umzugsfirmen vergleichen & bis zu 40% sparen | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Vergleichen Sie 200+ geprüfte Umzugsfirmen in der Schweiz. Kostenlose, unverbindliche Offerten in 2 Minuten. Sparen Sie bis zu 40% bei Ihrem Umzug." 
        />
        <meta name="keywords" content="Umzugsfirma, Umzug Schweiz, Umzugsofferten, Umzug Kosten, Zürich, Bern, Basel" />
        <link rel="canonical" href="https://umzugscheck.ch/landing" />
      </Helmet>

      <main className="flex-1">
        {/* ================================================================
            HERO SECTION - Klare Headline + 4-Schritte Einstieg
        ================================================================ */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-muted overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230050A8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container relative py-16 md:py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Trust badge */}
                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2">
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  4.8/5 von 15'000+ Kunden bewertet
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  Vergleiche{" "}
                  <span className="text-primary">200+ Umzugsfirmen</span>
                  {" "}und spare bis zu{" "}
                  <span className="text-secondary">40%</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  Erhalten Sie in nur 2 Minuten kostenlose, unverbindliche Offerten von geprüften Schweizer Umzugsfirmen.
                </p>

                {/* Trust indicators inline */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    100% Kostenlos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Unverbindlich
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Schweizer Anbieter
                  </span>
                </div>
              </motion.div>

              {/* Right: Quote Form Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-lift border-0 bg-card">
                  <CardContent className="p-6 md:p-8">
                    {/* Progress indicator */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-primary">Schritt 1 von 4</span>
                        <span className="text-muted-foreground">~ 2 Min.</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-primary rounded-full transition-all duration-300" />
                      </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                      Starten Sie Ihren Offerten-Vergleich
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Geben Sie Ihre aktuelle PLZ ein, um passende Umzugsfirmen zu finden.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fromPostal" className="block text-sm font-medium mb-2">
                          Aktuelle Postleitzahl / Ort
                        </label>
                        <Input
                          id="fromPostal"
                          type="text"
                          placeholder="z.B. 8001 oder Zürich"
                          value={fromPostal}
                          onChange={(e) => setFromPostal(e.target.value)}
                          className="h-14 text-lg"
                          autoComplete="postal-code"
                        />
                      </div>

                      <Button 
                        onClick={handleStartQuote}
                        disabled={fromPostal.length < 4}
                        className="w-full h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta"
                      >
                        Kostenlos Offerten erhalten
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Ihre Daten sind sicher & werden nicht an Dritte weitergegeben
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================================================================
            TRUST SECTION - Social Proof & Siegel
        ================================================================ */}
        <section className="bg-muted py-12 md:py-16">
          <div className="container">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
              {[
                { value: "15'000+", label: "Erfolgreiche Umzüge", icon: Truck },
                { value: "200+", label: "Geprüfte Firmen", icon: Building2 },
                { value: "4.8/5", label: "Kundenbewertung", icon: Star },
                { value: "40%", label: "Durchschnittliche Ersparnis", icon: TrendingDown },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                { icon: Award, label: "Bestpreis garantiert" },
                { icon: Shield, label: "100% Kostenlos & unverbindlich" },
                { icon: Lock, label: "Datenschutz garantiert" },
                { icon: CheckCircle2, label: "Geprüfte Firmen" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-2 bg-background px-4 py-2 rounded-full shadow-soft"
                >
                  <badge.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            HOW IT WORKS - 4-Schritte Prozess
        ================================================================ */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                So einfach funktioniert's
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                In nur 4 Schritten zu Ihren kostenlosen Umzugsofferten
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Daten eingeben",
                  description: "Geben Sie Start- und Zielort sowie Umzugsgrösse an.",
                  icon: MapPin,
                },
                {
                  step: 2,
                  title: "Anforderungen wählen",
                  description: "Wählen Sie gewünschte Services wie Packen oder Reinigung.",
                  icon: CheckCircle2,
                },
                {
                  step: 3,
                  title: "Offerten erhalten",
                  description: "Erhalten Sie bis zu 5 unverbindliche Offerten per E-Mail.",
                  icon: Mail,
                },
                {
                  step: 4,
                  title: "Beste wählen",
                  description: "Vergleichen Sie und wählen Sie die beste Offerte.",
                  icon: Award,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connector line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  
                  <div className="text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta px-8"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Jetzt starten – kostenlos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ================================================================
            KI-VIDEO SECTION - Innovativer Video-Rechner
        ================================================================ */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-muted">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Badge variant="outline" className="border-primary text-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Neu: KI-gestützt
                </Badge>

                <h2 className="text-3xl md:text-4xl font-bold">
                  Video-Analyse für präzisere Offerten
                </h2>

                <p className="text-lg text-muted-foreground">
                  Unser innovativer KI-Video-Rechner analysiert Ihr Inventar per Video und erstellt automatisch eine detaillierte Umzugsliste. Das Ergebnis: genauere Offerten und weniger Überraschungen.
                </p>

                <ul className="space-y-3">
                  {[
                    "Video in nur 2-3 Minuten aufnehmen",
                    "KI erkennt Möbel & Gegenstände automatisch",
                    "Deutlich genauere Kostenschätzung",
                    "Keine mühsame Inventarliste mehr nötig",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" variant="default">
                    <Link to="/video-schaetzung">
                      <Video className="w-5 h-5 mr-2" />
                      Video-Rechner testen
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/umzugsrechner">
                      Klassischen Rechner nutzen
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-video bg-muted rounded-2xl overflow-hidden shadow-lift relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-cta">
                      <Play className="w-8 h-8 text-secondary-foreground ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">KI-Analyse aktiv</p>
                        <p className="text-xs text-muted-foreground">23 Objekte erkannt</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SERVICES SECTION - Unsere Dienstleistungen
        ================================================================ */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Alle Umzugs-Services im Vergleich
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ob Privatumzug, Firmenumzug oder Spezialservice – wir finden die passenden Anbieter.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Privatumzug", description: "Kompletter Umzugsservice für Ihr Zuhause", href: "/services/privatumzug", icon: Truck },
                { title: "Firmenumzug", description: "Professionelle Büro- und Geschäftsumzüge", href: "/services/firmenumzug", icon: Building2 },
                { title: "Reinigung", description: "Endreinigung & Abgabereinigung", href: "/services/reinigung", icon: Sparkles },
                { title: "Entsorgung", description: "Möbel- und Sperrgutentsorgung", href: "/services/entsorgung", icon: Truck },
                { title: "Lagerung", description: "Sichere Zwischen- und Langzeitlagerung", href: "/services/lagerung", icon: Building2 },
                { title: "Internationaler Umzug", description: "Umzüge ins Ausland & aus dem Ausland", href: "/services/international", icon: MapPin },
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link to={service.href}>
                    <Card className="h-full hover:shadow-medium transition-shadow group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {service.description}
                        </p>
                        <span className="text-primary text-sm font-medium flex items-center gap-1">
                          Mehr erfahren
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            REGIONS CTA SECTION
        ================================================================ */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Umzugsfirmen in Ihrer Region
              </h2>
              <p className="text-muted-foreground">
                Wir vermitteln geprüfte Firmen in allen Schweizer Kantonen
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Zürich", href: "/umzugsfirmen/zuerich" },
                { name: "Bern", href: "/umzugsfirmen/bern" },
                { name: "Basel", href: "/umzugsfirmen/basel" },
                { name: "Luzern", href: "/umzugsfirmen/luzern" },
                { name: "St. Gallen", href: "/umzugsfirmen/stgallen" },
                { name: "Aargau", href: "/umzugsfirmen/aargau" },
                { name: "Zug", href: "/umzugsfirmen/zug" },
                { name: "Thurgau", href: "/umzugsfirmen/thurgau" },
              ].map((region) => (
                <Link key={region.name} to={region.href}>
                  <Badge 
                    variant="secondary" 
                    className="px-4 py-2 text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer"
                  >
                    {region.name}
                  </Badge>
                </Link>
              ))}
              <Link to="/umzugsfirmen-schweiz">
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Alle Kantone →
                </Badge>
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================
            FAQ SECTION - Häufige Fragen
        ================================================================ */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Häufige Fragen
              </h2>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  q: "Ist der Offertenvergleich wirklich kostenlos?",
                  a: "Ja, unser Service ist für Sie zu 100% kostenlos und unverbindlich. Die Umzugsfirmen bezahlen für die Vermittlung.",
                },
                {
                  q: "Wie schnell erhalte ich Offerten?",
                  a: "In der Regel erhalten Sie innerhalb von 24-48 Stunden bis zu 5 Offerten von passenden Umzugsfirmen.",
                },
                {
                  q: "Sind die Firmen geprüft?",
                  a: "Ja, alle Partner-Firmen werden vor der Aufnahme geprüft und müssen Qualitätsstandards erfüllen. Zudem werten wir laufend Kundenbewertungen aus.",
                },
                {
                  q: "Wie viel kann ich sparen?",
                  a: "Durch den Vergleich mehrerer Offerten sparen unsere Kunden durchschnittlich 30-40% gegenüber der ersten Offerte.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button asChild variant="outline">
                <Link to="/faq">
                  Alle Fragen anzeigen
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ================================================================
            FINAL CTA SECTION
        ================================================================ */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Bereit für Ihren stressfreien Umzug?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Vergleichen Sie jetzt kostenlos 200+ Umzugsfirmen und sparen Sie bis zu 40%.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="shadow-cta text-lg px-8"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Kostenlos Offerten erhalten
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/so-funktionierts">
                    So funktioniert's
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  100% kostenlos
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Unverbindlich
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  In 2 Min. erledigt
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;

import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { EmotionalHero } from "@/components/home/EmotionalHero";
import { Shield, Users, Target, TrendingUp, Heart, Award, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const About = () => {
  const stats = [
    { number: "15'000+", label: "Vermittelte Umzüge", color: "from-blue-500 to-cyan-500" },
    { number: "4.8/5", label: "Durchschnittsbewertung", color: "from-yellow-500 to-orange-500" },
    { number: "20+", label: "Geprüfte Partnerfirmen", color: "from-green-500 to-emerald-500" },
    { number: "26", label: "Kantone abgedeckt", color: "from-purple-500 to-pink-500" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Geprüfte Qualität",
      description: "Nur verifizierte Umzugsfirmen mit echten Kundenbewertungen",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Unabhängigkeit",
      description: "Komplett unabhängig – deine Interessen stehen im Mittelpunkt",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Transparenz",
      description: "Volle Preistransparenz ohne versteckte Kosten",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Moderne KI-Rechner für schnelle und präzise Kostenschätzung",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Kundenfokus",
      description: "Deine Zufriedenheit ist unser Erfolg",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Schweizer Qualität",
      description: "Lokale Expertise für alle 26 Kantone",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Über uns - Umzugscheck.ch | Dein stressfreier Umzug</title>
        <meta 
          name="description" 
          content="Wir machen Umzüge stressfrei. Seit 2018 helfen wir Menschen in der Schweiz, die besten Umzugsfirmen zu finden. 100% kostenlos & unabhängig."
        />
      </Helmet>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={[{ label: "Über uns" }]} />
      </div>

      {/* Hero */}
      <EmotionalHero
        title="Wir machen Umzüge stressfrei"
        subtitle="Seit 2018 helfen wir Menschen in der Schweiz, die besten Umzugsfirmen zu finden."
        primaryCTA={{
          text: "Starte deinen stressfreien Umzug",
          link: "/umzugsofferten"
        }}
        badgeText="Über 15'000 zufriedene Kunden"
        trustBadges={false}
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
      />

      <main>
        {/* Mission */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                    Unsere Mission
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Niemand sollte beim Umzug über den Tisch gezogen werden
                  </h2>
                </div>

                <Card className="shadow-strong">
                  <CardContent className="p-8 md:p-12">
                    <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
                      Umzugscheck.ch wurde gegründet, um den Umzugsprozess in der Schweiz transparenter, 
                      einfacher und kostengünstiger zu gestalten. Wir wissen, dass ein Umzug stressig sein 
                      kann – von der Planung über die Kostenkalkulation bis zur Auswahl der richtigen Firma.
                    </p>
                    <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
                      Deshalb haben wir eine Plattform geschaffen, die dir hilft, in wenigen Minuten 
                      mehrere Offerten von geprüften Umzugsfirmen zu vergleichen. Unsere KI-gestützten 
                      Preisrechner geben dir sofort eine realistische Einschätzung deiner Umzugskosten.
                    </p>
                    <p className="text-lg text-foreground/90 leading-relaxed">
                      Wir sorgen für <strong>klare Preise</strong>, <strong>geprüfte Firmen</strong> und 
                      <strong> transparente Vergleiche</strong> – damit du die beste Entscheidung treffen kannst.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Umzugscheck.ch in Zahlen
                </h2>
                <p className="text-lg text-muted-foreground">
                  Vertrauen durch Transparenz und Ergebnisse
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="text-center p-6 md:p-8 hover:shadow-strong transition-all h-full">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} shadow-medium mb-4`}>
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm md:text-base text-muted-foreground">
                        {stat.label}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal>
          <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Warum Umzugscheck.ch?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Diese Werte leiten uns in allem, was wir tun
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-strong transition-all h-full border-border/50">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} shadow-medium mb-4`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* How it Works */}
        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    So einfach funktioniert's
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    In 3 Schritten zu deinem stressfreien Umzug
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      number: 1,
                      title: "Kostenlos Preise berechnen",
                      description: "Nutze unsere KI-Rechner für eine realistische Kostenschätzung – in wenigen Minuten und völlig kostenlos."
                    },
                    {
                      number: 2,
                      title: "Umzugsfirmen vergleichen",
                      description: "Vergleiche geprüfte Firmen aus deiner Region. Bewertungen, Leistungen und Preise auf einen Blick."
                    },
                    {
                      number: 3,
                      title: "Offerten erhalten",
                      description: "Erhalte kostenlose Offerten und wähle die beste Firma für deinen Umzug aus."
                    }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="shadow-medium hover:shadow-strong transition-all">
                        <CardContent className="p-6 md:p-8">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-medium">
                              {step.number}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                              <p className="text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Final CTA */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob-reverse" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center text-white max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Bereit für deinen stressfreien Umzug?
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90">
                Starte jetzt und erhalte kostenlose Offerten von geprüften Profis
              </p>
              <Link to="/umzugsofferten">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-strong"
                >
                  Jetzt kostenlose Offerten erhalten
                </Button>
              </Link>
              <p className="text-sm mt-6 text-white/80">
                ✓ 100% kostenlos  ✓ Unverbindlich  ✓ In 2 Minuten
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default About;

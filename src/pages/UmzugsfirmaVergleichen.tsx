/**
 * /umzugsfirma-vergleichen - Trust Builder Page
 * 
 * Mid-funnel page explaining WHY to use Umzugscheck
 * Keywords: "Umzugsfirmen vergleichen", "beste Umzugsfirma finden"
 * Intent: Warm (decision phase)
 */

import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Shield, 
  Clock, 
  PiggyBank, 
  Users, 
  Star,
  ArrowRight,
  BadgeCheck,
  TrendingUp,
  Heart,
  Zap,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const benefits = [
  {
    icon: Shield,
    title: "200+ geprüfte Firmen",
    description: "Jede Umzugsfirma wird sorgfältig überprüft. Nur seriöse Anbieter mit nachgewiesener Qualität schaffen es auf unsere Plattform.",
    stat: "200+",
    statLabel: "verifizierte Partner"
  },
  {
    icon: PiggyBank,
    title: "Bis 40% sparen",
    description: "Durch den direkten Vergleich mehrerer Offerten finden Sie garantiert das beste Preis-Leistungs-Verhältnis für Ihren Umzug.",
    stat: "40%",
    statLabel: "durchschnittliche Ersparnis"
  },
  {
    icon: Clock,
    title: "In 2 Minuten erledigt",
    description: "Keine langen Telefonate, kein Warten. Füllen Sie einmal das Formular aus und erhalten Sie bis zu 5 Offerten.",
    stat: "2 Min",
    statLabel: "für Ihre Anfrage"
  },
  {
    icon: BadgeCheck,
    title: "KI-gestützte Preisprüfung",
    description: "Unsere intelligente Technologie analysiert jeden Preis und warnt Sie vor überhöhten Angeboten.",
    stat: "100%",
    statLabel: "Preistransparenz"
  }
];

const steps = [
  {
    number: "1",
    title: "Umzugsdaten eingeben",
    description: "Von wo nach wo? Wie viele Zimmer? Wann soll es losgehen? Nur die wichtigsten Infos.",
    emoji: "📝"
  },
  {
    number: "2",
    title: "Offerten erhalten",
    description: "Innerhalb von 24-48 Stunden melden sich bis zu 5 passende Umzugsfirmen bei Ihnen.",
    emoji: "📨"
  },
  {
    number: "3",
    title: "Vergleichen & entscheiden",
    description: "Prüfen Sie Preise, Leistungen und Bewertungen. Wählen Sie die beste Firma für Ihren Umzug.",
    emoji: "✨"
  }
];

const testimonials = [
  {
    quote: "Dank Umzugscheck haben wir 800 CHF gespart! Die Offerten kamen schnell und der Vergleich war super einfach.",
    author: "Familie Müller",
    location: "Zürich → Bern",
    rating: 5,
    avatar: "👨‍👩‍👧"
  },
  {
    quote: "Endlich ein Service, der hält was er verspricht. Alle Firmen waren professionell und pünktlich.",
    author: "Thomas K.",
    location: "Basel → Luzern",
    rating: 5,
    avatar: "👨"
  },
  {
    quote: "Als Seniorin war ich unsicher beim Online-Vergleich. Das Team hat mir am Telefon geholfen – sehr nett!",
    author: "Margrit S.",
    location: "Winterthur → Zürich",
    rating: 5,
    avatar: "👵"
  }
];

const UmzugsfirmaVergleichen = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsfirmen vergleichen | Kostenlos & unverbindlich | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Vergleichen Sie 200+ geprüfte Schweizer Umzugsfirmen. Bis zu 40% sparen durch kostenlosen Offerten-Vergleich. In 2 Minuten erledigt!" 
        />
        <meta name="keywords" content="Umzugsfirmen vergleichen, beste Umzugsfirma, Umzug Offerten, Umzugsvergleich Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirma-vergleichen" />
      </Helmet>

      <Navigation />

      {/* Hero Section - Emotional & Trust-Building */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Von über 50'000 Schweizern genutzt</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Warum Sie Umzugsfirmen{" "}
              <span className="text-primary">vergleichen</span> sollten
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Der Unterschied zwischen Umzugsfirmen kann mehrere hundert Franken ausmachen. 
              Mit unserem kostenlosen Vergleich finden Sie die <strong>beste Firma zum besten Preis</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-xl">
                <Link to="/umzugsofferten">
                  <Zap className="w-5 h-5 mr-2" />
                  Jetzt kostenlos vergleichen
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/umzugsfirmen">
                  Alle Firmen ansehen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                100% kostenlos
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Unverbindlich
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Schweizer Datenschutz
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ihre Vorteile auf einen Blick</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Wir machen den Umzugsvergleich einfach, transparent und stressfrei.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">{benefit.stat}</div>
                    <div className="text-xs text-muted-foreground mb-3">{benefit.statLabel}</div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">So funktioniert's</h2>
            <p className="text-muted-foreground">In 3 einfachen Schritten zu Ihrem perfekten Umzug</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  <div className="text-5xl mb-4">{step.emoji}</div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 right-0 transform translate-x-1/2">
                      <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <span className="font-medium">Das sagen unsere Kunden</span>
            </div>
            <h2 className="text-3xl font-bold">Echte Erfahrungen, echte Zufriedenheit</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-medium">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-10 text-primary-foreground"
          >
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              Bereit für Ihren stressfreien Umzug?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Über 50'000 Schweizer haben bereits mit uns verglichen. 
              Starten Sie jetzt und sparen Sie Zeit und Geld.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-6 shadow-xl">
              <Link to="/umzugsofferten">
                <Zap className="w-5 h-5 mr-2" />
                Kostenlose Offerten erhalten
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UmzugsfirmaVergleichen;
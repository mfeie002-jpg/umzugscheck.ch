import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart, Zap, CheckCircle, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';
import { FAQAccordion } from '@/components/FAQAccordion';
import { LiveSignals } from '@/components/home/LiveSignals';
import { MiniCalculator } from '@/components/home/MiniCalculator';
import { USPCard } from '@/components/home/USPCard';
import { AirbnbCompanyCard } from '@/components/home/AirbnbCompanyCard';
import { motion } from 'framer-motion';

const NewIndex = () => {
  const navigate = useNavigate();

  const topCompanies = [
    {
      id: '1',
      name: 'Zürich Umzüge AG',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
      rating: 4.9,
      reviewCount: 342,
      priceFrom: 'CHF 890',
      location: 'Zürich',
      badges: ['Top bewertet', 'Versichert'],
    },
    {
      id: '2',
      name: 'Swiss Move Profis',
      image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&h=600&fit=crop',
      rating: 4.8,
      reviewCount: 287,
      priceFrom: 'CHF 750',
      location: 'Bern',
      badges: ['Günstig', 'Express'],
    },
    {
      id: '3',
      name: 'Basel Transport GmbH',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
      rating: 4.7,
      reviewCount: 198,
      priceFrom: 'CHF 820',
      location: 'Basel',
      badges: ['Lokal', 'Versichert'],
    },
  ];

  const faqItems = [
    {
      question: 'Wie funktioniert Umzugscheck.ch?',
      answer: 'Geben Sie Ihre Umzugsdetails ein, erhalten Sie kostenlose Offerten von bis zu 5 Umzugsfirmen, vergleichen Sie Preise und Bewertungen, und wählen Sie die beste Firma für Ihren Umzug.',
    },
    {
      question: 'Ist der Service wirklich kostenlos?',
      answer: 'Ja, Umzugscheck.ch ist für Privatkunden 100% kostenlos. Sie bezahlen nur die Umzugsfirma, die Sie beauftragen.',
    },
    {
      question: 'Wie schnell erhalte ich Offerten?',
      answer: 'Nach der Eingabe Ihrer Daten erhalten Sie innerhalb von 24 Stunden bis zu 5 unverbindliche Offerten von geprüften Umzugsfirmen.',
    },
    {
      question: 'Sind die Umzugsfirmen geprüft?',
      answer: 'Ja, alle Umzugsfirmen auf unserer Plattform sind verifiziert und verfügen über die notwendigen Versicherungen und Zertifikate.',
    },
    {
      question: 'Wie viel kann ich durch den Vergleich sparen?',
      answer: 'Unsere Kunden sparen durchschnittlich 30-40% durch den Vergleich mehrerer Offerten. Die Ersparnis hängt von der Umzugsgröße und Region ab.',
    },
  ];

  const howItWorksSteps = [
    {
      icon: CheckCircle,
      title: 'Anfrage stellen',
      description: 'Beschreiben Sie Ihren Umzug in 2 Minuten',
    },
    {
      icon: Star,
      title: 'Angebote vergleichen',
      description: 'Erhalten Sie Offerten von geprüften Firmen',
    },
    {
      icon: Heart,
      title: 'Beste Offerte wählen',
      description: 'Sparen Sie bis zu 40% bei gleicher Qualität',
    },
  ];

  const reviews = [
    {
      name: 'Sarah M.',
      location: 'Zürich',
      rating: 5,
      text: 'Innerhalb von 2 Stunden hatte ich 4 Offerten. Super einfach und transparent!',
    },
    {
      name: 'Michael K.',
      location: 'Bern',
      rating: 5,
      text: 'Habe 850 CHF gespart durch den Vergleich. Absolut empfehlenswert!',
    },
    {
      name: 'Anna L.',
      location: 'Basel',
      rating: 5,
      text: 'Die Firma war pünktlich, professionell und der Preis genau wie vereinbart.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Umzugsofferten vergleichen & bis zu 40% sparen | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Vergleiche geprüfte Schweizer Umzugsfirmen kostenlos und erhalte unverbindliche Offerten in 2 Minuten. 15'000+ vermittelte Umzüge." 
        />
      </Helmet>

      <div className="min-h-screen gradient-soft">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop"
              alt="Professional movers"
              className="w-full h-full object-cover opacity-15"
            />
          </div>

          <div className="container relative z-10 px-4 py-16 md:py-24">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Dein stressfreier Umzug<br />beginnt hier
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Vergleiche geprüfte Schweizer Umzugsfirmen und erhalte kostenlose Offerten in 2 Minuten.
                </p>
              </motion.div>

              {/* Trust Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-semibold">4.8 / 5</span>
                  <span className="text-muted-foreground hidden sm:inline">basierend auf echten Kundenbewertungen</span>
                </div>
                <div className="text-muted-foreground hidden sm:inline">•</div>
                <div className="font-semibold">15'000+ vermittelte Umzüge</div>
                <div className="text-muted-foreground hidden sm:inline">•</div>
                <div className="font-semibold text-success">100% kostenlos & unverbindlich</div>
              </motion.div>

              {/* Main CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate('/umzugsofferten')}
                  className="h-14 px-8 text-base md:text-lg font-bold gradient-primary text-primary-foreground shadow-strong hover:shadow-hover transition-all"
                >
                  JETZT GRATIS OFFERTEN VERGLEICHEN
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Live Signals + Calculator */}
        <section className="container px-4 -mt-12 relative z-20 mb-16">
          <LiveSignals />
          <MiniCalculator />
        </section>

        {/* Why Us Section */}
        <section className="container px-4 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Warum Umzugscheck.ch?
              </h2>
              <p className="text-muted-foreground text-lg">
                Die transparente Vergleichsplattform für Ihren Umzug
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <USPCard
                icon={Shield}
                title="Geprüfte Qualität"
                description="Alle Umzugsfirmen sind verifiziert und verfügen über notwendige Versicherungen"
              />
              <USPCard
                icon={Heart}
                title="100% kostenlos"
                description="Vergleichen und sparen Sie – völlig unverbindlich und ohne versteckte Kosten"
              />
              <USPCard
                icon={Zap}
                title="Schnell & unkompliziert"
                description="In nur 2 Minuten Offerten erhalten und bis zu 40% Kosten sparen"
              />
            </div>
          </div>
        </section>

        {/* Top Companies */}
        <section className="container px-4 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Top bewertete Umzugsfirmen
              </h2>
              <p className="text-muted-foreground text-lg">
                Von unseren Kunden empfohlen
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {topCompanies.map((company, index) => (
                <AirbnbCompanyCard
                  key={company.id}
                  id={company.id}
                  name={company.name}
                  image={company.image}
                  rating={company.rating}
                  reviewCount={company.reviewCount}
                  priceFrom={company.priceFrom}
                  badges={company.badges}
                  delay={index * 0.1}
                />
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/firmen')}
                className="border-2"
              >
                Alle Umzugsfirmen anzeigen
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container px-4 py-16 md:py-20 bg-muted/30 rounded-3xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                So einfach funktioniert's
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary">{index + 1}</div>
                  <h3 className="font-semibold text-xl">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="container px-4 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Das sagen unsere Kunden
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <div key={index} className="bg-card p-6 rounded-xl shadow-soft border hover:shadow-medium transition-all">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/20 mb-2" />
                  <p className="text-foreground mb-4 leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{review.name}</span>
                    <span>•</span>
                    <span>{review.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Block */}
        <section className="container px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto gradient-primary rounded-3xl p-8 md:p-12 text-center text-white shadow-strong">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Bereit für Ihren stressfreien Umzug?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Vergleichen Sie jetzt Offerten und sparen Sie bis zu 40%
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/umzugsofferten')}
              className="h-14 px-8 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              Kostenlose Offerten starten
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="container px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Häufig gestellte Fragen
              </h2>
            </div>
            <FAQAccordion items={faqItems} variant="compact" />
          </div>
        </section>

        <StickyMobileCTA />
      </div>
    </>
  );
};

export default NewIndex;

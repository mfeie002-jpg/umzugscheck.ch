import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart, Zap, CheckCircle, Star, Quote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';
import { FAQAccordion } from '@/components/FAQAccordion';
import { SimplifiedFooter } from '@/components/home/SimplifiedFooter';
import { NewHero } from '@/components/home/NewHero';
import { USPCard } from '@/components/home/USPCard';
import { AirbnbCompanyCard } from '@/components/home/AirbnbCompanyCard';
import { generatePageSchemas, generateSchemaScript } from '@/lib/schema-markup';
import { generateMetaData, generateOGTags } from '@/lib/seo-meta';
import { getKeywordsForPage } from '@/lib/seo-keywords';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';

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
  
  // Generate SEO meta data
  const metaData = generateMetaData({ type: 'main-page', pageName: 'home' });
  const currentUrl = 'https://www.umzugscheck.ch/';
  const ogTags = generateOGTags(metaData, currentUrl);
  
  // Generate keywords
  const keywords = getKeywordsForPage('home');
  
  // Generate Schema.org structured data
  const schemas = generatePageSchemas({ type: 'home', url: currentUrl }, faqItems);
  const schemaScript = generateSchemaScript(schemas);

  const howItWorksSteps = [
    {
      icon: CheckCircle,
      number: 1,
      title: 'Anfrage stellen',
      description: 'Beschreiben Sie Ihren Umzug in 2 Minuten',
    },
    {
      icon: Star,
      number: 2,
      title: 'Angebote vergleichen',
      description: 'Erhalten Sie Offerten von geprüften Firmen',
    },
    {
      icon: Heart,
      number: 3,
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
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="canonical" href={currentUrl} />
        
        {/* Keywords */}
        {keywords && keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content={ogTags['og:title']} />
        <meta property="og:description" content={ogTags['og:description']} />
        <meta property="og:type" content={ogTags['og:type']} />
        <meta property="og:url" content={ogTags['og:url']} />
        <meta property="og:image" content={ogTags['og:image']} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={ogTags['twitter:card']} />
        <meta name="twitter:title" content={ogTags['twitter:title']} />
        <meta name="twitter:description" content={ogTags['twitter:description']} />
        <meta name="twitter:image" content={ogTags['twitter:image']} />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">{schemaScript}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section with Integrated Calculator */}
        <NewHero />

        {/* Why Umzugscheck Section */}
        <ScrollReveal>
          <section className="container px-4 py-16 md:py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Warum Umzugscheck.ch?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Die transparente Vergleichsplattform für Ihren Umzug
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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
        </ScrollReveal>

        {/* Top Companies */}
        <ScrollReveal>
          <section className="container px-4 py-16 md:py-20 bg-secondary/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Top bewertete Umzugsfirmen
                </h2>
                <p className="text-lg text-muted-foreground">
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
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Alle Umzugsfirmen anzeigen
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* How It Works */}
        <ScrollReveal>
          <section className="container px-4 py-16 md:py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  So einfach funktioniert's
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ihr Weg zur besten Umzugsofferte
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {howItWorksSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="text-center space-y-4"
                  >
                    <div className="bg-gradient-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-accent">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-xl">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Social Proof / Reviews */}
        <ScrollReveal>
          <section className="container px-4 py-16 md:py-20 bg-secondary/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Das sagen unsere Kunden
                </h2>
                <p className="text-lg text-muted-foreground">
                  Echte Bewertungen von echten Kunden
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all h-full border border-border/50">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Quote className="h-8 w-8 text-primary/20 mb-3" />
                      <p className="text-foreground mb-4 leading-relaxed">{review.text}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{review.name}</span>
                        <span>•</span>
                        <span>{review.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Review Platform Logos */}
              <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
                <span className="text-sm text-muted-foreground font-medium">Bewertet auf:</span>
                <span className="text-sm font-semibold">Google Reviews</span>
                <span className="text-sm font-semibold">ProvenExpert</span>
                <span className="text-sm font-semibold">Trustpilot</span>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA Block with Gradient */}
        <ScrollReveal>
          <section className="container px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto gradient-cta rounded-3xl p-8 md:p-12 text-center text-white shadow-strong">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Bereit für Ihren stressfreien Umzug?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/95">
                Vergleichen Sie jetzt Offerten und sparen Sie bis zu 40%
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/umzugsofferten')}
                className="h-14 px-10 text-lg font-bold bg-white text-accent hover:bg-white/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Kostenlose Offerten starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <section className="container px-4 py-16 md:py-20">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Häufig gestellte Fragen
                </h2>
                <p className="text-lg text-muted-foreground">
                  Alles, was Sie wissen müssen
                </p>
              </div>
              <FAQAccordion items={faqItems} variant="compact" />
            </div>
          </section>
        </ScrollReveal>

        {/* Footer */}
        <SimplifiedFooter />
        
        {/* Sticky Mobile CTA */}
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default NewIndex;

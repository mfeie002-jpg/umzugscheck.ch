import { memo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Star, Shield, Clock, CheckCircle, ArrowRight, Users, Truck, Heart, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "./Header";
import { Footer } from "./Footer";
import EnhancedSEO from "./EnhancedSEO";
import BreadcrumbSchema from "./BreadcrumbSchema";
import AnimatedSection from "./AnimatedSection";
import InternalLinkingSection from "./InternalLinkingSection";
import FAQSection from "./FAQSection";
import { CTASection } from "./CTASection";
import { ExpressQuoteForm } from "@/components/ExpressQuoteForm";

interface CityLandingTemplateProps {
  city: string;
  canton?: string;
  region: string;
  description: string;
  heroImage?: string;
  stats: {
    moves: string;
    rating: string;
    years: string;
  };
  districts?: string[];
  highlights?: string[];
  testimonials?: Array<{
    name: string;
    text: string;
    rating: number;
    district?: string;
  }>;
  testimonial?: {
    text: string;
    author: string;
    location: string;
  };
  nearbyRoutes?: Array<{
    from: string;
    to: string;
    distance?: string;
  }>;
  nearbyAreas?: string[];
  localContent?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

const CityLandingTemplate = memo(({
  city,
  canton,
  region,
  description,
  heroImage,
  stats,
  districts = [],
  highlights = [],
  testimonials = [],
  testimonial,
  nearbyRoutes = [],
  nearbyAreas = [],
  localContent,
  faqs = []
}: CityLandingTemplateProps) => {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-').replace(/ü/g, 'u').replace(/ä/g, 'a').replace(/ö/g, 'o');
  
  const defaultFaqs = [
    {
      question: `Was kostet ein Umzug in ${city}?`,
      answer: `Die Kosten für einen Umzug in ${city} hängen von der Wohnungsgrösse, Distanz und gewünschten Zusatzleistungen ab. Eine 2-Zimmer-Wohnung kostet typischerweise zwischen CHF 800-1'500. Fordern Sie jetzt eine kostenlose Offerte an!`
    },
    {
      question: `Wie lange dauert ein Umzug in ${city}?`,
      answer: `Ein durchschnittlicher Wohnungsumzug in ${city} dauert 4-8 Stunden. Bei grösseren Wohnungen oder mit Zusatzleistungen wie Verpackung kann es länger dauern. Wir planen Ihren Umzug effizient.`
    },
    {
      question: `Bieten Sie auch Wochenend-Umzüge in ${city} an?`,
      answer: `Ja, wir bieten flexible Umzugstermine in ${city} an, auch am Samstag. Sonntags-Umzüge sind auf Anfrage möglich. Für Wochenend-Termine empfehlen wir frühzeitige Buchung.`
    },
    {
      question: `Sind Sie in allen Stadtteilen von ${city} tätig?`,
      answer: `Ja, wir bedienen alle Stadtteile und Quartiere von ${city} sowie die umliegenden Gemeinden. Egal ob Altstadt oder Aussenquartiere – wir sind für Sie da.`
    }
  ];

  const activeFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Regionen', url: '/map' },
    { name: city, url: `/area/${citySlug}` }
  ];

  return (
    <div className="min-h-screen">
      <EnhancedSEO
        title={`Umzugsfirma ${city} - Ihr lokaler Umzugspartner | Feierabend Umzüge`}
        description={`Professionelle Umzugsfirma in ${city}. ✓ Lokale Expertise ✓ ${stats.moves}+ Umzüge ✓ ${stats.rating} Sterne Bewertung ✓ Faire Festpreise. Jetzt kostenlose Offerte!`}
        canonical={`/area/${citySlug}`}
        city={city}
        keywords={`umzugsfirma ${city.toLowerCase()}, umzug ${city.toLowerCase()}, umzugsunternehmen ${city.toLowerCase()}, zügeln ${city.toLowerCase()}, möbeltransport ${city.toLowerCase()}, privatumzug ${city.toLowerCase()}`}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 bg-gradient-to-br from-sky-500 to-alpine overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt={`Umzug in ${city}`}
              className="w-full h-full object-cover opacity-20"
              loading="eager"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection animation="slide-up">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-6">
                <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link to="/map" className="hover:text-primary-foreground transition-colors">Regionen</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-primary-foreground">{city}</span>
              </nav>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-alpine" />
                <span className="text-primary-foreground/80 text-sm">{canton ? `${canton} • ` : ''}{region}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
                Ihre Umzugsfirma in {city}
              </h1>
              
              <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed">
                {description}
              </p>
              
              {/* Trust Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-warm fill-warm" />
                  <span className="text-primary-foreground font-semibold">{stats.rating} Sterne</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-alpine" />
                  <span className="text-primary-foreground font-semibold">{stats.moves}+ Umzüge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-warm fill-warm" />
                  <span className="text-primary-foreground font-semibold">{stats.years} Jahre Erfahrung</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto min-h-[52px] text-base">
                    Kostenlose Offerte für {city}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="tel:+41765681302">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px] text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <Phone className="mr-2 h-5 w-5" />
                    Jetzt anrufen
                  </Button>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 bg-muted border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-alpine" />
              <span>Vollversichert</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-forest" />
              <span>Faire Festpreise</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warm" />
              <span>Pünktlich & Zuverlässig</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-alpine" />
              <span>Schweizer Qualität</span>
            </div>
          </div>
        </div>
      </section>

      {/* Express Offer Form */}
      <section className="py-12 bg-background" id="offer-form">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
                Express-Offerte fuer {city}
              </h2>
              <p className="text-muted-foreground">
                Von PLZ, Nach PLZ, Telefon - wir rufen Sie in 5-10 Minuten zurueck.
              </p>
            </div>
          </AnimatedSection>
          <ExpressQuoteForm formId="offer-form" />
        </div>
      </section>

      {/* Services for City */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                Umzugsservices in {city}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Von der kleinen Wohnung bis zum grossen Büroumzug – wir sind Ihr lokaler Partner in {city}.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Privatumzüge", desc: `Stressfreier Wohnungswechsel in ${city}`, href: "/plan/private", icon: Users },
              { title: "Büroumzüge", desc: "Minimale Ausfallzeit garantiert", href: "/plan/office", icon: Truck },
              { title: "Seniorenumzüge", desc: "Mit besonderer Fürsorge", href: "/plan/senior", icon: Heart },
              { title: "VIP Service", desc: "Premium Rundum-Service", href: "/plan/vip", icon: Award },
            ].map((service, index) => (
              <AnimatedSection key={service.title} animation="slide-up" delay={index * 100}>
                <Link to={service.href}>
                  <Card className="h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-1 group">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-alpine/10 flex items-center justify-center mb-4 group-hover:bg-alpine/20 transition-colors">
                        <service.icon className="h-6 w-6 text-alpine" />
                      </div>
                      <h3 className="font-display font-bold text-lg mb-2 group-hover:text-alpine transition-colors">{service.title}</h3>
                      <p className="text-muted-foreground text-sm">{service.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Districts or Highlights */}
      {(districts.length > 0 || highlights.length > 0) && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-in">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6 text-center">
                {districts.length > 0 ? `Wir sind in allen Quartieren von ${city} für Sie da` : `Unsere Vorteile in ${city}`}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {(districts.length > 0 ? districts : highlights).map((item) => (
                  <span 
                    key={item}
                    className="px-4 py-2 bg-background rounded-full text-sm border border-border hover:border-alpine hover:text-alpine transition-colors cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Local Content */}
      {localContent && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-in">
              <div className="prose prose-lg max-w-4xl mx-auto">
                <h2 className="font-display">Umziehen in {city}</h2>
                <p className="text-muted-foreground leading-relaxed">{localContent}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {(testimonials.length > 0 || testimonial) && (
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-in">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8 text-center">
                Was unsere Kunden in {city} sagen
              </h2>
            </AnimatedSection>
            {testimonials.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.slice(0, 3).map((t, index) => (
                  <AnimatedSection key={index} animation="slide-up" delay={index * 100}>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex mb-3">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-warm fill-warm" />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">"{t.text}"</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-alpine/10 flex items-center justify-center">
                            <span className="text-alpine font-semibold text-sm">{t.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{t.name}</p>
                            {t.district && (
                              <p className="text-xs text-muted-foreground">{t.district}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            ) : testimonial && (
              <AnimatedSection animation="slide-up">
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-warm fill-warm" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-alpine/10 flex items-center justify-center">
                        <span className="text-alpine font-semibold">{testimonial.author.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </div>
        </section>
      )}

      {/* Popular Routes */}
      {nearbyRoutes.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-in">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6">
                Beliebte Umzugsrouten ab {city}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyRoutes.map((route, index) => (
                  <Link 
                    key={index}
                    to="/contact"
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-alpine/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-alpine" />
                      <span className="text-sm">{route.from} → {route.to}</span>
                    </div>
                    {route.distance && (
                      <span className="text-xs text-muted-foreground">{route.distance}</span>
                    )}
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection 
        faqs={activeFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))}
        showViewAll={true}
      />

      {/* Nearby Areas */}
      {nearbyAreas.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-display font-bold text-foreground mb-4 text-center">
              Auch in der Nähe tätig
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyAreas.map((area) => (
                <span key={area} className="px-4 py-2 bg-background rounded-full text-sm border border-border">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Internal Linking */}
      <InternalLinkingSection currentCity={city} showServices={true} />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
});

CityLandingTemplate.displayName = "CityLandingTemplate";

export default CityLandingTemplate;

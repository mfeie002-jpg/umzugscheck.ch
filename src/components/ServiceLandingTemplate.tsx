import { memo } from "react";
import { Link } from "react-router-dom";
import { Phone, Star, Shield, Clock, CheckCircle, ArrowRight, Award, ChevronRight, Truck, Users, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "./Header";
import Footer from "./Footer";
import SEOHead from "./SEOHead";
import AnimatedSection from "./AnimatedSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import ServiceCrossSelling from "./ServiceCrossSelling";

interface ServiceLandingTemplateProps {
  service: string;
  serviceSlug: string;
  heroImage?: string;
  description: string;
  longDescription?: string;
  benefits: string[];
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  pricing?: {
    from: string;
    unit: string;
  };
  testimonial?: {
    text: string;
    author: string;
    location: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedServices: Array<{
    title: string;
    href: string;
    description: string;
  }>;
  keywords: string;
  metaDescription: string;
}

const ServiceLandingTemplate = memo(({
  service,
  serviceSlug,
  heroImage,
  description,
  longDescription,
  benefits,
  process,
  pricing,
  testimonial,
  faqs,
  relatedServices,
  keywords,
  metaDescription
}: ServiceLandingTemplateProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://feierabend-umzuege.ch/" },
      { "@type": "ListItem", "position": 2, "name": "Leistungen", "item": "https://feierabend-umzuege.ch/plan" },
      { "@type": "ListItem", "position": 3, "name": service, "item": `https://feierabend-umzuege.ch/plan/${serviceSlug}` }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service,
    "description": metaDescription,
    "provider": {
      "@type": "MovingCompany",
      "name": "Feierabend Umzüge",
      "url": "https://feierabend-umzuege.ch",
      "telephone": "+41 76 568 13 02",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Zürich",
        "addressCountry": "CH"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "Schweiz"
    },
    ...(pricing && {
      "offers": {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "CHF",
          "price": pricing.from.replace(/[^0-9]/g, '')
        }
      }
    }),
    ...(testimonial && {
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": testimonial.author
        },
        "reviewBody": testimonial.text
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127",
        "bestRating": "5"
      }
    })
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const structuredData = [breadcrumbSchema, serviceSchema, faqSchema];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${service} - Professioneller Service | Feierabend Umzüge`}
        description={metaDescription}
        canonical={`/plan/${serviceSlug}`}
        keywords={keywords}
        structuredData={structuredData}
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 bg-gradient-to-br from-sky-500 to-alpine overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt={service}
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
                <Link to="/plan" className="hover:text-primary-foreground transition-colors">Leistungen</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-primary-foreground">{service}</span>
              </nav>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
                {service}
              </h1>
              
              <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed">
                {description}
              </p>
              
              {pricing && (
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                  <span className="text-primary-foreground/80 text-sm">Ab</span>
                  <span className="text-2xl font-bold text-primary-foreground">{pricing.from}</span>
                  <span className="text-primary-foreground/80 text-sm">{pricing.unit}</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto min-h-[52px] text-base">
                    Kostenlose Offerte anfordern
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="tel:+41765681302">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px] text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <Phone className="mr-2 h-5 w-5" />
                    +41 76 568 13 02
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

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                Ihre Vorteile
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Warum Sie sich für unseren {service} entscheiden sollten
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit} animation="slide-up" delay={index * 100}>
                <div className="flex items-start gap-4 p-6 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-alpine/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-alpine" />
                  </div>
                  <p className="text-foreground font-medium">{benefit}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Long Description */}
      {longDescription && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-in">
              <div className="prose prose-lg max-w-4xl mx-auto">
                <p className="text-muted-foreground leading-relaxed">{longDescription}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                So funktioniert's
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                In wenigen Schritten zu Ihrem stressfreien Umzug
              </p>
            </div>
          </AnimatedSection>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <AnimatedSection key={step.step} animation="slide-up" delay={index * 100}>
                <div className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-alpine text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < process.length - 1 && (
                      <div className="w-0.5 h-full bg-alpine/20 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-display font-bold text-xl mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {testimonial && (
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-in">
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
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection 
        faqs={faqs}
        showViewAll={true}
      />

      {/* Cross-Selling Section */}
      <ServiceCrossSelling currentService={serviceSlug} />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
});

ServiceLandingTemplate.displayName = "ServiceLandingTemplate";

export default ServiceLandingTemplate;

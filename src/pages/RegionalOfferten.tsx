/**
 * /umzugsofferten/:region - Regional moving quote landing page
 * 
 * Dynamic page for canton-specific lead generation with localized content.
 * Pre-selects the region for the lead form and shows local statistics.
 */

import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import {
  HowItWorksSection,
  WhyUsSection,
  FAQSection,
} from "@/components/offerten-v2";
import { 
  MapPin, Star, Shield, Building2, CheckCircle2, 
  Users, Clock, TrendingUp, ArrowRight, Sparkles,
  Calculator
} from "lucide-react";
import { isValidCanton, getCantonDisplayName, getOffertenSEOData, SWISS_CANTONS } from "@/lib/canton-utils";

export default function RegionalOfferten() {
  const { region } = useParams<{ region: string }>();
  const navigate = useNavigate();

  // Validate region parameter
  useEffect(() => {
    if (region && !isValidCanton(region)) {
      // Redirect to main offerten page if invalid region
      navigate('/umzugsofferten', { replace: true });
    }
  }, [region, navigate]);

  if (!region || !isValidCanton(region)) {
    return null;
  }

  const displayName = getCantonDisplayName(region);
  const seoData = getOffertenSEOData(region);

  // Regional statistics (would come from database)
  const regionalStats = {
    companiesCount: Math.floor(Math.random() * 20) + 15,
    avgRating: 4.7,
    avgSavings: 35,
    requestsThisMonth: Math.floor(Math.random() * 200) + 100,
  };

  // Schema markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://umzugscheck.ch" },
          { "@type": "ListItem", "position": 2, "name": "Umzugsofferten", "item": "https://umzugscheck.ch/umzugsofferten" },
          { "@type": "ListItem", "position": 3, "name": displayName, "item": seoData.canonical },
        ]
      },
      {
        "@type": "Service",
        "name": `Umzugsofferten ${displayName}`,
        "description": seoData.description,
        "provider": {
          "@type": "Organization",
          "name": "umzugscheck.ch",
        },
        "areaServed": {
          "@type": "Place",
          "name": `Kanton ${displayName}, Schweiz`,
        },
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Hero Section with Regional Focus */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-6 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/" },
              { label: "Umzugsofferten", href: "/umzugsofferten" },
              { label: displayName },
            ]} 
          />
          
          <div className="max-w-4xl mx-auto text-center mt-8">
            <Badge variant="outline" className="mb-4 text-primary border-primary">
              <MapPin className="w-3 h-3 mr-1" />
              Kanton {displayName}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Umzugsofferten in <span className="text-primary">{displayName}</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Erhalten Sie kostenlose Offerten von {regionalStats.companiesCount}+ geprüften 
              Umzugsfirmen im Kanton {displayName}. Sparen Sie bis zu {regionalStats.avgSavings}%.
            </p>

            {/* Regional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
              <Card className="p-4 text-center bg-card/50 backdrop-blur">
                <Building2 className="w-6 h-6 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">{regionalStats.companiesCount}+</div>
                <div className="text-sm text-muted-foreground">Firmen</div>
              </Card>
              <Card className="p-4 text-center bg-card/50 backdrop-blur">
                <Star className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                <div className="text-2xl font-bold">{regionalStats.avgRating}</div>
                <div className="text-sm text-muted-foreground">Ø Bewertung</div>
              </Card>
              <Card className="p-4 text-center bg-card/50 backdrop-blur">
                <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold">{regionalStats.avgSavings}%</div>
                <div className="text-sm text-muted-foreground">Ersparnis</div>
              </Card>
              <Card className="p-4 text-center bg-card/50 backdrop-blur">
                <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{regionalStats.requestsThisMonth}</div>
                <div className="text-sm text-muted-foreground">Anfragen/Monat</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  KI-gestützte Analyse
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Jetzt Offerten für {displayName} erhalten
                </h2>
                <p className="text-muted-foreground">
                  Beschreiben Sie Ihren Umzug und erhalten Sie passende Angebote von lokalen Firmen.
                </p>
              </div>
              
              {/* Calculator CTA Card */}
              <Card className="p-6 md:p-8 shadow-lg border-2 text-center">
                <Calculator className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Umzugskosten berechnen</h3>
                <p className="text-muted-foreground mb-6">
                  Nutzen Sie unseren kostenlosen Rechner für Ihren Umzug in {displayName}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to={`/rechner?region=${region}`}>
                      <Calculator className="w-5 h-5 mr-2" />
                      Zum Umzugsrechner
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to={`/umzugsfirmen/${region}`}>
                      Firmen vergleichen
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Local Advantages */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Vorteile von lokalen Umzugsfirmen in {displayName}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 text-center">
                <Clock className="w-10 h-10 mx-auto text-primary mb-4" />
                <h3 className="font-semibold mb-2">Schnelle Verfügbarkeit</h3>
                <p className="text-sm text-muted-foreground">
                  Lokale Firmen in {displayName} können oft kurzfristig Termine anbieten.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <MapPin className="w-10 h-10 mx-auto text-primary mb-4" />
                <h3 className="font-semibold mb-2">Regionale Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Kenntnis lokaler Gegebenheiten, Parkbewilligungen und Zufahrten.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Shield className="w-10 h-10 mx-auto text-primary mb-4" />
                <h3 className="font-semibold mb-2">Geprüfte Qualität</h3>
                <p className="text-sm text-muted-foreground">
                  Alle Firmen sind verifiziert und versichert.
                </p>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Why Us */}
      <WhyUsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Related Regions */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Umzugsofferten in anderen Kantonen
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {SWISS_CANTONS.filter(c => c !== region).slice(0, 8).map(c => (
              <Button key={c} variant="outline" size="sm" asChild>
                <Link to={`/umzugsofferten/${c}`}>
                  {getCantonDisplayName(c)}
                </Link>
              </Button>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="link" asChild>
              <Link to="/umzugsofferten">
                Alle Regionen anzeigen
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Starten Sie jetzt Ihren Umzug in {displayName}
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Kostenlos und unverbindlich. Erhalten Sie bis zu 5 Offerten von geprüften Umzugsfirmen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to={`/umzugsfirmen/${region}`}>
                Firmen in {displayName} vergleichen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link to={`/beste-umzugsfirma/${region}`}>
                Beste Firmen ansehen
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <StickyMobileCTA />
    </div>
  );
}

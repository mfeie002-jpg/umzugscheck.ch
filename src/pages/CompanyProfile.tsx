import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navigation } from "@/components/Navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Star, MapPin, Phone, Award, TrendingUp, Clock, 
  CheckCircle, Mail, Globe, Shield, Percent, ChevronRight 
} from "lucide-react";
import { ENHANCED_COMPANIES } from "@/data/enhanced-companies";
import { ReviewList } from "@/components/reviews/ReviewList";
import { trackPageView } from "@/lib/tracking";

export default function CompanyProfile() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">("overview");
  
  const company = ENHANCED_COMPANIES.find(c => c.slug === slug);
  
  if (!company) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Firma nicht gefunden</h1>
            <Link to="/firmen">
              <Button>Zurück zur Übersicht</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Track page view
  trackPageView({ page: `/umzugsfirmen/${slug}`, companyId: company.id });

  const priceLevelColor = {
    günstig: "text-green-600 dark:text-green-400",
    fair: "text-blue-600 dark:text-blue-400",
    premium: "text-purple-600 dark:text-purple-400"
  }[company.price_level];

  return (
    <>
      <OptimizedSEO
        title={`${company.name} - Professionelle Umzugsfirma`}
        description={company.short_description || company.long_description || `${company.name} - Geprüfte Umzugsfirma mit ${company.rating} Sternen und ${company.review_count} Bewertungen.`}
        keywords={`${company.name}, umzugsfirma, ${company.service_areas.join(', ')}`}
        canonicalUrl={`https://umzugscheck.ch/umzugsfirmen/${slug}`}
      />

      <div className="min-h-screen flex flex-col bg-background">
        
        <main className="flex-1">
          {/* Hero Section - Mobile Optimized */}
          <section className="gradient-light py-6 sm:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                  {company.is_featured && (
                    <Badge className="mb-3 sm:mb-4 bg-primary text-primary-foreground">
                      Empfohlener Partner
                    </Badge>
                  )}
                  
                  <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Mobile: Logo and Name stacked */}
                    <div className="flex items-center gap-4 sm:hidden">
                      <div className="w-16 h-16 bg-white dark:bg-muted rounded-lg shadow-md flex items-center justify-center text-3xl flex-shrink-0">
                        {company.logo_url || "🏢"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold mb-1 break-words">{company.name}</h1>
                      </div>
                    </div>

                    {/* Desktop: Logo and full info side by side */}
                    <div className="hidden sm:flex items-start gap-6">
                      <div className="w-24 h-24 bg-white dark:bg-muted rounded-lg shadow-md flex items-center justify-center text-4xl flex-shrink-0">
                        {company.logo_url || "🏢"}
                      </div>
                      
                      <div className="flex-1">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{company.name}</h1>
                      </div>
                    </div>

                    {/* Info Section - Same for both */}
                    <div className="space-y-3 sm:space-y-4 sm:ml-[120px]">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-bold text-lg">{company.rating.toFixed(1)}</span>
                          <span className="ml-2 text-sm sm:text-base text-muted-foreground">
                            ({company.review_count} Bewertungen)
                          </span>
                        </div>
                        
                        <Badge variant="outline" className={`${priceLevelColor} border-current`}>
                          {company.price_level === "günstig" ? "Günstig" : 
                           company.price_level === "fair" ? "Fair" : "Premium"}
                        </Badge>
                        
                        {company.success_rate && (
                          <div className="flex items-center text-xs sm:text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            <span>{company.success_rate}% Erfolgsrate</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-2 text-sm sm:text-base text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{company.service_areas.join(" • ")}</span>
                      </div>

                      {company.short_description && (
                        <p className="text-base sm:text-lg leading-relaxed">{company.short_description}</p>
                      )}

                      {company.certifications && company.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {company.certifications.map((cert, idx) => (
                            <Badge key={idx} variant="secondary" className="gap-1 text-xs">
                              <Shield className="w-3 h-3" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Buttons - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
                    <Link to="/rechner" className="w-full sm:flex-1">
                      <Button size="lg" className="w-full h-12 sm:h-auto text-base">
                        Offerte von dieser Firma erhalten
                      </Button>
                    </Link>
                    {company.phone_tracking_number && (
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full sm:flex-1 gap-2 h-12 sm:h-auto text-base"
                        onClick={() => {
                          window.location.href = `tel:${company.phone_tracking_number}`;
                        }}
                      >
                        <Phone className="w-5 h-5" />
                        Firma anrufen
                      </Button>
                    )}
                  </div>

                  {company.discount_offer && (
                    <div className="mt-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-green-700 dark:text-green-300 font-semibold flex items-center gap-2">
                        <Percent className="w-5 h-5" />
                        {company.discount_offer}
                      </p>
                    </div>
                  )}
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto flex gap-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-2 border-b-2 transition-colors ${
                    activeTab === "overview"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Übersicht
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 px-2 border-b-2 transition-colors ${
                    activeTab === "reviews"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Bewertungen
                </button>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                {activeTab === "overview" ? (
                  <ScrollReveal>
                    <div className="space-y-8">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {company.response_time_avg_hours && (
                          <Card variant="elevated" className="p-4 text-center">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="font-bold text-xl">{company.response_time_avg_hours}h</div>
                            <div className="text-sm text-muted-foreground">Antwortzeit</div>
                          </Card>
                        )}
                        {company.avg_completion_time_hours && (
                          <Card variant="elevated" className="p-4 text-center">
                            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="font-bold text-xl">{company.avg_completion_time_hours}h</div>
                            <div className="text-sm text-muted-foreground">Durchführungszeit</div>
                          </Card>
                        )}
                        {company.success_rate && (
                          <Card variant="elevated" className="p-4 text-center">
                            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                            <div className="font-bold text-xl">{company.success_rate}%</div>
                            <div className="text-sm text-muted-foreground">Erfolgsrate</div>
                          </Card>
                        )}
                        <Card variant="elevated" className="p-4 text-center">
                          <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <div className="font-bold text-xl">{company.review_count}</div>
                          <div className="text-sm text-muted-foreground">Bewertungen</div>
                        </Card>
                      </div>

                      {/* About */}
                      {company.long_description && (
                        <Card variant="elevated" className="p-6">
                          <h2 className="text-2xl font-bold mb-4">Über uns</h2>
                          <p className="text-muted-foreground leading-relaxed">
                            {company.long_description}
                          </p>
                        </Card>
                      )}

                      {/* Services */}
                      <Card variant="elevated" className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Unsere Dienstleistungen</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {company.services_offered.map((service, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm">{service}</span>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Regions */}
                      <Card variant="elevated" className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Serviceregionen</h2>
                        <div className="flex flex-wrap gap-2">
                          {company.service_areas.map((area, idx) => (
                            <Badge key={idx} variant="secondary" className="text-sm">
                              <MapPin className="w-3 h-3 mr-1" />
                              {area}
                            </Badge>
                          ))}
                        </div>
                        {company.cities_served && company.cities_served.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-semibold mb-2">Städte:</h3>
                            <p className="text-sm text-muted-foreground">
                              {company.cities_served.join(", ")}
                            </p>
                          </div>
                        )}
                      </Card>

                      {/* CTA */}
                      <Card variant="elevated" className="p-6 gradient-light border-primary/20">
                        <h2 className="text-2xl font-bold mb-2">Bereit für Ihren Umzug?</h2>
                        <p className="text-muted-foreground mb-4">
                          Fordern Sie jetzt ein kostenloses Angebot an und vergleichen Sie Preise.
                        </p>
                        <Link to="/rechner">
                          <Button size="lg" className="gap-2">
                            Offerte anfordern
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </Card>
                    </div>
                  </ScrollReveal>
                ) : (
                  <ScrollReveal>
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Kundenbewertungen</h2>
                      <ReviewList companyId={company.id} />
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </section>
        </main>

        
      </div>
    </>
  );
}
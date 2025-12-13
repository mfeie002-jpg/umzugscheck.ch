import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, MapPin, Phone, Award, TrendingUp, Clock, 
  CheckCircle, Mail, Globe, Shield, Percent, ChevronRight,
  Users, Truck, MessageSquare, HelpCircle, Building2
} from "lucide-react";
import { ENHANCED_COMPANIES } from "@/data/enhanced-companies";
import { ReviewList } from "@/components/reviews/ReviewList";
import { trackPageView } from "@/lib/tracking";

// Import new company components
import CompanyQuickActions from "@/components/CompanyQuickActions";
import CompanyAvailabilityCalendar from "@/components/CompanyAvailabilityCalendar";
import CompanyServicePricing from "@/components/CompanyServicePricing";
import CompanyTeamShowcase from "@/components/CompanyTeamShowcase";
import CompanyFleetInfo from "@/components/CompanyFleetInfo";
import CompanyReviewSummary from "@/components/CompanyReviewSummary";
import CompanyInsuranceInfo from "@/components/CompanyInsuranceInfo";
import CompanyContactForm from "@/components/CompanyContactForm";
import CompanySimilar from "@/components/CompanySimilar";
import CompanyFAQ from "@/components/CompanyFAQ";
import CompanyRatingsBreakdown from "@/components/CompanyRatingsBreakdown";
import CompanyCertifications from "@/components/CompanyCertifications";
import CompanyVideoShowcase from "@/components/CompanyVideoShowcase";
import PriceGuaranteeWidget from "@/components/PriceGuaranteeWidget";
import CompanyAwardsSection from "@/components/CompanyAwardsSection";

export default function CompanyProfile() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
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
          {/* Hero Section */}
          <section className="gradient-light py-6 sm:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <ScrollReveal>
                  {company.is_featured && (
                    <Badge className="mb-3 sm:mb-4 bg-primary text-primary-foreground">
                      Empfohlener Partner
                    </Badge>
                  )}
                  
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Column - Company Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-white dark:bg-muted rounded-lg shadow-md flex items-center justify-center text-4xl flex-shrink-0">
                          {company.logo_url || "🏢"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{company.name}</h1>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 font-bold text-lg">{company.rating.toFixed(1)}</span>
                              <span className="ml-2 text-sm text-muted-foreground">
                                ({company.review_count} Bewertungen)
                              </span>
                            </div>
                            <Badge variant="outline" className={`${priceLevelColor} border-current`}>
                              {company.price_level === "günstig" ? "Günstig" : 
                               company.price_level === "fair" ? "Fair" : "Premium"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{company.service_areas.join(" • ")}</span>
                      </div>

                      {company.short_description && (
                        <p className="text-base leading-relaxed mb-4">{company.short_description}</p>
                      )}

                      {/* Certifications */}
                      <CompanyCertifications 
                        companyId={company.id}
                        certifications={company.certifications}
                        isVerified={true}
                        yearsInBusiness={company.avg_completion_time_hours ? Math.floor(company.avg_completion_time_hours / 100) + 10 : 15}
                      />

                      {/* Quick Actions */}
                      <div className="mt-4">
                        <CompanyQuickActions
                          companyId={company.id}
                          companyName={company.name}
                          phone={company.phone_tracking_number}
                        />
                      </div>

                      {company.discount_offer && (
                        <div className="mt-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <p className="text-green-700 dark:text-green-300 font-semibold flex items-center gap-2">
                            <Percent className="w-5 h-5" />
                            {company.discount_offer}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="lg:w-[400px]">
                      <CompanyContactForm
                        companyId={company.id}
                        companyName={company.name}
                        responseTime={company.response_time_avg_hours ? `< ${company.response_time_avg_hours}h` : "< 2 Stunden"}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Tabs Navigation */}
          <section className="border-b sticky top-0 bg-background z-10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="h-auto p-0 bg-transparent border-none gap-0">
                    <TabsTrigger 
                      value="overview" 
                      className="py-4 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Übersicht
                    </TabsTrigger>
                    <TabsTrigger 
                      value="services" 
                      className="py-4 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Services & Preise
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews" 
                      className="py-4 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Bewertungen
                    </TabsTrigger>
                    <TabsTrigger 
                      value="info" 
                      className="py-4 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Info & FAQ
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0">
                    <ScrollReveal>
                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {company.response_time_avg_hours && (
                              <Card className="p-4 text-center">
                                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <div className="font-bold text-xl">{company.response_time_avg_hours}h</div>
                                <div className="text-sm text-muted-foreground">Antwortzeit</div>
                              </Card>
                            )}
                            {company.avg_completion_time_hours && (
                              <Card className="p-4 text-center">
                                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <div className="font-bold text-xl">{company.avg_completion_time_hours}h</div>
                                <div className="text-sm text-muted-foreground">Durchführung</div>
                              </Card>
                            )}
                            {company.success_rate && (
                              <Card className="p-4 text-center">
                                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                                <div className="font-bold text-xl">{company.success_rate}%</div>
                                <div className="text-sm text-muted-foreground">Erfolgsrate</div>
                              </Card>
                            )}
                            <Card className="p-4 text-center">
                              <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                              <div className="font-bold text-xl">{company.review_count}</div>
                              <div className="text-sm text-muted-foreground">Bewertungen</div>
                            </Card>
                          </div>

                          {/* About */}
                          {company.long_description && (
                            <Card className="p-6">
                              <h2 className="text-2xl font-bold mb-4">Über uns</h2>
                              <p className="text-muted-foreground leading-relaxed">
                                {company.long_description}
                              </p>
                            </Card>
                          )}

                          {/* Team Showcase */}
                          <CompanyTeamShowcase
                            companyName={company.name}
                            teamSize={15}
                            foundedYear={2010}
                          />

                          {/* Fleet Info */}
                          <CompanyFleetInfo
                            companyName={company.name}
                            fleetSize={8}
                          />

                          {/* Video Showcase */}
                          <CompanyVideoShowcase companyName={company.name} />

                          {/* Awards Section */}
                          <CompanyAwardsSection companyName={company.name} />

                          {/* Price Guarantee Widget */}
                          <PriceGuaranteeWidget companyName={company.name} />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                          {/* Availability Calendar */}
                          <CompanyAvailabilityCalendar
                            companyId={company.id}
                            companyName={company.name}
                          />

                          {/* Review Summary */}
                          <CompanyRatingsBreakdown
                            companyName={company.name}
                            overallRating={company.rating}
                            totalReviews={company.review_count}
                          />

                          {/* Similar Companies */}
                          <CompanySimilar
                            currentCompanyId={company.id}
                            currentServiceAreas={company.service_areas}
                            currentServices={company.services_offered}
                          />
                        </div>
                      </div>
                    </ScrollReveal>
                  </TabsContent>

                  {/* Services Tab */}
                  <TabsContent value="services" className="mt-0">
                    <ScrollReveal>
                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                          {/* Service Pricing */}
                          <CompanyServicePricing
                            companyName={company.name}
                            priceLevel={company.price_level as 'günstig' | 'fair' | 'premium'}
                          />

                          {/* Services List */}
                          <Card className="p-6">
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
                          <Card className="p-6">
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
                        </div>

                        <div className="space-y-6">
                          {/* Insurance Info */}
                          <CompanyInsuranceInfo
                            companyName={company.name}
                            isVerified={true}
                          />
                        </div>
                      </div>
                    </ScrollReveal>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="mt-0">
                    <ScrollReveal>
                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <h2 className="text-2xl font-bold mb-6">Kundenbewertungen</h2>
                          <ReviewList companyId={company.id} />
                        </div>

                        <div className="space-y-6">
                          <CompanyReviewSummary
                            companyName={company.name}
                            rating={company.rating}
                            reviewCount={company.review_count}
                          />
                        </div>
                      </div>
                    </ScrollReveal>
                  </TabsContent>

                  {/* Info Tab */}
                  <TabsContent value="info" className="mt-0">
                    <ScrollReveal>
                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                          {/* FAQ */}
                          <CompanyFAQ companyName={company.name} />

                          {/* CTA */}
                          <Card className="p-6 gradient-light border-primary/20">
                            <h2 className="text-2xl font-bold mb-2">Bereit für Ihren Umzug?</h2>
                            <p className="text-muted-foreground mb-4">
                              Fordern Sie jetzt ein kostenloses Angebot an und vergleichen Sie Preise.
                            </p>
                            <Link to="/umzugsofferten">
                              <Button size="lg" className="gap-2">
                                Offerte anfordern
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          </Card>
                        </div>

                        <div className="space-y-6">
                          {/* Insurance */}
                          <CompanyInsuranceInfo
                            companyName={company.name}
                            isVerified={true}
                          />
                        </div>
                      </div>
                    </ScrollReveal>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

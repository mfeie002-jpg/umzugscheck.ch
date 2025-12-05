import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { useCompanyById, useCompanyReviews } from "@/hooks/useCompanies";
import { Star, MapPin, Phone, Mail, Globe, Shield, Clock, CheckCircle, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CompanyContactForm } from "@/components/company/CompanyContactForm";
import { CompanyGallery } from "@/components/company/CompanyGallery";
import { CompanyReviews } from "@/components/company/CompanyReviews";

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading } = useCompanyById(id || "");
  const { data: reviews } = useCompanyReviews(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Firma nicht gefunden</h1>
          <Link to="/umzugsfirmen">
            <Button>Zurück zur Übersicht</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{company.name} - Umzugsfirma | Umzugscheck.ch</title>
        <meta name="description" content={`${company.name} - ${company.description?.slice(0, 150) || "Geprüfte Umzugsfirma in der Schweiz"}`} />
      </Helmet>

      <Header />

      <main className="pb-20">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Startseite</Link>
              <span>/</span>
              <Link to="/umzugsfirmen" className="hover:text-primary">Umzugsfirmen</Link>
              <span>/</span>
              <span className="text-foreground">{company.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="container mx-auto px-4">
            <Link to="/umzugsfirmen" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4" />
              Alle Firmen
            </Link>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-start gap-6">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-24 h-24 rounded-xl object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-primary" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                      {company.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verifiziert
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.round(company.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                          />
                        ))}
                        <span className="ml-2 font-bold">{company.rating?.toFixed(1) || "N/A"}</span>
                        <span className="text-muted-foreground">({company.review_count || 0} Bewertungen)</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{company.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {company.services?.map((service) => (
                        <span key={service} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full md:w-80 bg-card rounded-2xl border border-border p-6 shadow-lg"
              >
                <h3 className="font-bold text-lg mb-4">Kontakt aufnehmen</h3>
                
                <div className="space-y-3 mb-6">
                  {company.phone && (
                    <a href={`tel:${company.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                      <Phone className="h-4 w-4" />
                      {company.phone}
                    </a>
                  )}
                  {company.email && (
                    <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                      <Mail className="h-4 w-4" />
                      {company.email}
                    </a>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                      <Globe className="h-4 w-4" />
                      Website besuchen
                    </a>
                  )}
                </div>

                <Link to={`/umzugsofferten?company=${company.id}`}>
                  <Button className="w-full">Offerte anfragen</Button>
                </Link>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Versichert & geprüft</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Antwort in &lt; 24h</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
                <TabsTrigger value="reviews">Bewertungen ({reviews?.length || 0})</TabsTrigger>
                <TabsTrigger value="contact">Kontakt</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Über uns</h2>
                    <p className="text-muted-foreground">{company.description || "Keine Beschreibung verfügbar."}</p>
                    
                    <h3 className="text-lg font-bold mt-8 mb-4">Servicegebiete</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.service_areas?.map((area) => (
                        <span key={area} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold mb-4">Preislevel</h2>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      company.price_level === "günstig" ? "bg-green-100 text-green-700" :
                      company.price_level === "premium" ? "bg-purple-100 text-purple-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {company.price_level || "Nicht angegeben"}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gallery">
                <CompanyGallery images={company.gallery_images || []} companyName={company.name} />
              </TabsContent>

              <TabsContent value="reviews">
                <CompanyReviews reviews={reviews || []} companyId={company.id} companyName={company.name} />
              </TabsContent>

              <TabsContent value="contact">
                <CompanyContactForm company={company} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
    </div>
  );
};

export default CompanyDetail;

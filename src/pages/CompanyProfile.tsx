import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  services: string[];
  price_level: string;
  rating: number;
  review_count: number;
  service_areas: string[];
  verified: boolean;
  phone: string;
  email: string;
  website: string;
  gallery_images?: string[];
}

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompany(id);
    }
  }, [id]);

  const fetchCompany = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) throw error;
      setCompany(data);
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Firma nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">Diese Firma existiert nicht oder wurde entfernt.</p>
            <Link to="/firmen">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Zurück zur Übersicht
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <section className="py-12 md:py-16 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Link to="/firmen">
                <Button
                  variant="outline"
                  className="mb-6 border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Zurück zur Übersicht
                </Button>
              </Link>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-5xl">
                  {company.logo}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{company.name}</h1>
                    {company.verified && (
                      <Badge className="bg-success/20 text-success border-success/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Geprüft
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(company.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-white/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-lg">{company.rating}</span>
                      <span className="text-white/80">({company.review_count} Bewertungen)</span>
                    </div>
                  </div>

                  <p className="text-lg text-white/90">{company.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Services */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Unsere Dienstleistungen</h2>
                      <div className="grid md:grid-cols-2 gap-3">
                        {company.services.map((service, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Areas */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Servicegebiete</h2>
                      <div className="flex flex-wrap gap-2">
                        {company.service_areas.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* About */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Über uns</h2>
                      <div className="prose max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                          {company.description}
                        </p>
                        <Separator className="my-4" />
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold">Preisniveau:</span>
                            <span className="ml-2 text-primary font-medium">{company.price_level}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Bewertung:</span>
                            <span className="ml-2">{company.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* CTA Card */}
                  <Card className="shadow-strong sticky top-24">
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg mb-2">Offerte anfragen</h3>
                        <p className="text-sm text-muted-foreground">
                          Kostenlos & unverbindlich
                        </p>
                      </div>

                      <Separator />

                      <Link to="/rechner">
                        <Button className="w-full bg-accent hover:bg-accent/90 shadow-accent group" size="lg">
                          Jetzt Offerte erhalten
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>

                      <div className="space-y-3 text-sm">
                        {company.phone && (
                          <a
                            href={`tel:${company.phone}`}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>{company.phone}</span>
                          </a>
                        )}

                        {company.email && (
                          <a
                            href={`mailto:${company.email}`}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            <span>{company.email}</span>
                          </a>
                        )}

                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Website besuchen</span>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Signals */}
                  <Card className="bg-secondary/30 border-none">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Versichert & zertifiziert</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Schnelle Reaktionszeit</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Faire Preisgestaltung</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyProfile;

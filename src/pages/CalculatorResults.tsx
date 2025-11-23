import { useLocation, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, TrendingDown, Star, Shield, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const CalculatorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [estimatedPrice, setEstimatedPrice] = useState({ min: 0, max: 0 });

  useEffect(() => {
    if (!location.state) {
      navigate("/rechner");
      return;
    }

    // Calculate estimated price based on calculator data
    const { calculatorData, type } = location.state;
    
    // Simple price estimation logic (in real app, this would be more sophisticated)
    let basePrice = 800;
    const roomMultiplier: any = {
      "1": 1,
      "2": 1.3,
      "3": 1.6,
      "4": 2,
      "5": 2.4,
      "6+": 2.8,
      "house": 3.5
    };

    const rooms = calculatorData.rooms || "3";
    basePrice *= roomMultiplier[rooms] || 1.5;

    // Add service costs if advanced calculator
    if (type === "advanced") {
      if (calculatorData.packing) basePrice += 300;
      if (calculatorData.mounting) basePrice += 200;
      if (calculatorData.cleaning) basePrice += 250;
      if (calculatorData.disposal) basePrice += 150;
      if (calculatorData.storage) basePrice += 400;
      if (calculatorData.piano) basePrice += 500;
    }

    setEstimatedPrice({
      min: Math.round(basePrice * 0.85),
      max: Math.round(basePrice * 1.15)
    });
  }, [location, navigate]);

  const mockCompanies = [
    {
      id: 1,
      name: "Züri Umzüge AG",
      rating: 4.8,
      reviews: 127,
      price: estimatedPrice.min,
      verified: true,
      responseTime: "< 2 Std.",
      services: ["Packservice", "Montage", "Versicherung"]
    },
    {
      id: 2,
      name: "Swiss Move Solutions",
      rating: 4.9,
      reviews: 203,
      price: Math.round((estimatedPrice.min + estimatedPrice.max) / 2),
      verified: true,
      responseTime: "< 1 Std.",
      services: ["Alle Services", "24/7 Support"]
    },
    {
      id: 3,
      name: "Express Umzugsfirma",
      rating: 4.7,
      reviews: 89,
      price: estimatedPrice.max,
      verified: true,
      responseTime: "< 4 Std.",
      services: ["Packservice", "Endreinigung"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-gradient-light">
        {/* Header */}
        <section className="py-12 md:py-16 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link to="/rechner">
                <Button variant="outline" className="mb-6 border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Zurück zum Rechner
                </Button>
              </Link>
              <h1 className="mb-4">Ihre Umzugs-Offerten</h1>
              <p className="text-lg md:text-xl text-white/90">
                Basierend auf Ihren Angaben haben wir passende Angebote für Sie gefunden.
              </p>
            </div>
          </div>
        </section>

        {/* Price Estimate */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-strong border-primary/20 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-success" />
                    Geschätzte Kosten
                  </CardTitle>
                  <CardDescription>
                    Basierend auf Ihren Angaben – finale Preise können variieren
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      CHF {estimatedPrice.min.toLocaleString()}
                    </span>
                    <span className="text-2xl text-muted-foreground">-</span>
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {estimatedPrice.max.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-4">
                    Durchschnittliche Ersparnis durch Vergleich: <span className="font-semibold text-success">CHF {Math.round(estimatedPrice.max * 0.3).toLocaleString()}</span>
                  </p>
                </CardContent>
              </Card>

              {/* Companies */}
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Verfügbare Umzugsfirmen</h2>
                  <Badge variant="outline" className="bg-success-light text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {mockCompanies.length} Angebote
                  </Badge>
                </div>

                {mockCompanies.map((company) => (
                  <Card key={company.id} className="shadow-medium hover:shadow-strong transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Company Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold">{company.name}</h3>
                                {company.verified && (
                                  <Badge variant="outline" className="bg-primary-light text-primary border-primary/20">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Geprüft
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold">{company.rating}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  ({company.reviews} Bewertungen)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {company.services.map((service, idx) => (
                              <Badge key={idx} variant="secondary">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            <span>Antwortzeit: {company.responseTime}</span>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex flex-col items-end justify-between md:w-64 space-y-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-1">ab</div>
                            <div className="text-3xl font-bold text-primary">
                              CHF {company.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              inkl. MwSt.
                            </div>
                          </div>

                          <Button className="w-full bg-accent hover:bg-accent/90 shadow-accent group">
                            Offerte anfordern
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Trust Section */}
              <Card className="mt-8 bg-secondary/30 border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">100% kostenlos & unverbindlich</h3>
                      <p className="text-muted-foreground text-sm">
                        Fordern Sie Offerten an, vergleichen Sie in Ruhe und entscheiden Sie selbst. 
                        Keine versteckten Kosten, keine Verpflichtungen.
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                        <div className="text-sm font-semibold">Geprüfte Firmen</div>
                      </div>
                      <div className="text-center">
                        <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                        <div className="text-sm font-semibold">Faire Preise</div>
                      </div>
                      <div className="text-center">
                        <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                        <div className="text-sm font-semibold">Schnelle Antwort</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorResults;

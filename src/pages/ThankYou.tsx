import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Loader2, CheckCircle, MapPin, Package, Clock, ArrowRight, FileText, Home } from "lucide-react";
import { formatCurrency } from "@/lib/pricing";

interface Lead {
  id: string;
  name: string;
  email: string;
  from_city: string;
  to_city: string;
  calculator_output: any;
  selected_company_ids: string[];
  companies?: Array<{
    id: string;
    name: string;
    logo: string | null;
  }>;
}

export default function ThankYou() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (leadError) throw leadError;

      // Fetch selected companies
      let companies = [];
      if (leadData.selected_company_ids && leadData.selected_company_ids.length > 0) {
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('id, name, logo')
          .in('id', leadData.selected_company_ids);

        if (!companiesError && companiesData) {
          companies = companiesData;
        }
      }

      setLead({ ...leadData, companies });
    } catch (error: any) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Anfrage nicht gefunden</h1>
            <Button asChild>
              <Link to="/">Zur Startseite</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const estimate = lead.calculator_output;

  return (
    <>
      <OptimizedSEO
        title="Vielen Dank für Ihre Anfrage"
        description="Ihre Umzugsanfrage wurde erfolgreich versendet. Die ausgewählten Firmen werden sich innerhalb von 24 Stunden bei Ihnen melden."
        canonicalUrl="https://umzugscheck.ch/danke"
      />
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Success Header */}
            <ScrollReveal>
              <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Vielen Dank, {lead.name}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Ihre Anfrage wurde erfolgreich an die ausgewählten Firmen gesendet
              </p>
            </div>
            </ScrollReveal>

            {/* Companies Contacted */}
            <ScrollReveal delay={100}>
              <Card variant="elevated">
            <CardHeader>
              <CardTitle>Kontaktierte Firmen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lead.companies && lead.companies.length > 0 ? (
                  lead.companies.map((company) => (
                    <div key={company.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                      )}
                      <span className="font-medium">{company.name}</span>
                      <Badge variant="secondary" className="ml-auto">Kontaktiert</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Keine Firmen ausgewählt</p>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">Was passiert jetzt?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Die Firmen erhalten Ihre Anfrage innerhalb der nächsten Minuten</li>
                  <li>✓ Sie werden innerhalb von 24 Stunden kontaktiert</li>
                  <li>✓ Sie erhalten unverbindliche Offerten per E-Mail oder Telefon</li>
                  <li>✓ Vergleichen Sie die Angebote und wählen Sie das beste aus</li>
                </ul>
              </div>
              </CardContent>
            </Card>
            </ScrollReveal>

            {/* Move Summary */}
            <ScrollReveal delay={200}>
              <Card variant="elevated">
            <CardHeader>
              <CardTitle>Zusammenfassung Ihres Umzugs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground">Route</div>
                    <div className="font-medium">{lead.from_city} → {lead.to_city}</div>
                  </div>
                </div>

                {estimate && (
                  <>
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <div className="text-sm text-muted-foreground">Volumen</div>
                        <div className="font-medium">{estimate.volumeM3} m³</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <div className="text-sm text-muted-foreground">Geschätzte Dauer</div>
                        <div className="font-medium">{estimate.estimatedHours} Stunden</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 text-primary mt-1 font-bold">CHF</div>
                      <div>
                        <div className="text-sm text-muted-foreground">Preisspanne</div>
                        <div className="font-medium">
                          {formatCurrency(estimate.priceMin)} - {formatCurrency(estimate.priceMax)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              </CardContent>
            </Card>
            </ScrollReveal>

            {/* Next Steps */}
            <ScrollReveal delay={300}>
              <Card variant="elevated">
            <CardHeader>
              <CardTitle>Weitere hilfreiche Ressourcen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link to="/blog">
                  <FileText className="h-4 w-4" />
                  Umzugs-Ratgeber lesen
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link to="/rechner">
                  <Package className="h-4 w-4" />
                  Andere Rechner ausprobieren
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Zur Startseite
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>
              </CardContent>
            </Card>
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal delay={400}>
              <div className="text-center text-sm text-muted-foreground">
                <p>Bestätigungsmail gesendet an: <strong>{lead.email}</strong></p>
                <p className="mt-2">
                  Fragen? Kontaktieren Sie uns unter{" "}
                  <a href="mailto:info@umzugscheck.ch" className="text-primary hover:underline">
                    info@umzugscheck.ch
                  </a>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

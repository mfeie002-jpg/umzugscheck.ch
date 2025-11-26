import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Clock, TrendingUp, Star, ArrowRight, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, getMoveSize } from "@/lib/pricing";

interface Company {
  id: string;
  name: string;
  logo: string | null;
  rating: number;
  review_count: number;
  price_level: string | null;
  services: string[];
  verified: boolean;
}

interface EstimateSession {
  id: string;
  move_details: any;
  estimate: any;
  companies: Company[];
}

const getCalculatorTypeDetails = (moveDetails: any) => {
  const type = moveDetails.calculatorType || 'quick';
  
  switch (type) {
    case 'cleaning':
      return {
        title: 'Reinigungsservice',
        icon: '🧹',
        details: moveDetails.cleaningDetails,
        items: [
          { label: 'Reinigungsart', value: moveDetails.cleaningDetails?.cleaningType === 'end-of-lease' ? 'Endreinigung' : 'Grundreinigung' },
          { label: 'Fläche', value: `${moveDetails.cleaningDetails?.squareMeters} m²` },
          { label: 'Zimmer', value: moveDetails.cleaningDetails?.rooms },
          { label: 'Badezimmer', value: moveDetails.cleaningDetails?.bathrooms },
        ],
        features: [
          moveDetails.cleaningDetails?.hasWindows && 'Fensterreinigung',
          moveDetails.cleaningDetails?.hasOven && 'Ofenreinigung',
          moveDetails.cleaningDetails?.hasBalcony && 'Balkonreinigung',
          moveDetails.cleaningDetails?.hasCarpets && 'Teppichreinigung',
        ].filter(Boolean),
      };
    case 'disposal':
      return {
        title: 'Entsorgungsservice',
        icon: '♻️',
        details: moveDetails.disposalDetails,
        items: [
          { label: 'Volumen', value: `${moveDetails.disposalDetails?.volumeM3} m³` },
          { label: 'Entfernung', value: `${moveDetails.disposalDetails?.distance} km` },
        ],
        features: [
          moveDetails.disposalDetails?.hasHazardous && 'Sondermüll',
          moveDetails.disposalDetails?.hasElectronics && 'Elektronik',
          moveDetails.disposalDetails?.hasFurniture && 'Möbel',
        ].filter(Boolean),
      };
    case 'storage':
      return {
        title: 'Lagerservice',
        icon: '📦',
        details: moveDetails.storageDetails,
        items: [
          { label: 'Volumen', value: `${moveDetails.storageDetails?.volumeM3} m³` },
          { label: 'Dauer', value: `${moveDetails.storageDetails?.duration} Monate` },
          { label: 'Zugriff', value: moveDetails.storageDetails?.accessFrequency === 'rare' ? 'Selten' : moveDetails.storageDetails?.accessFrequency === 'monthly' ? 'Monatlich' : 'Wöchentlich' },
        ],
        features: [
          moveDetails.storageDetails?.climateControlled && 'Klimatisiert',
          moveDetails.storageDetails?.insurance && 'Versicherung',
        ].filter(Boolean),
      };
    case 'packing':
      return {
        title: 'Packservice',
        icon: '📦',
        details: moveDetails.packingDetails,
        items: [
          { label: 'Zimmer', value: moveDetails.packingDetails?.rooms },
          { label: 'Service-Level', value: moveDetails.packingDetails?.packingLevel === 'full' ? 'Vollservice' : 'Teilservice' },
        ],
        features: [
          moveDetails.packingDetails?.hasFragileItems && 'Fragile Gegenstände',
          moveDetails.packingDetails?.hasArtwork && 'Kunstwerke',
        ].filter(Boolean),
      };
    case 'assembly':
      return {
        title: 'Montageservice',
        icon: '🔧',
        details: moveDetails.assemblyDetails,
        items: [
          { label: 'Betten', value: moveDetails.assemblyDetails?.furnitureItems?.beds || 0 },
          { label: 'Schränke', value: moveDetails.assemblyDetails?.furnitureItems?.wardrobes || 0 },
          { label: 'Regale', value: moveDetails.assemblyDetails?.furnitureItems?.shelves || 0 },
          { label: 'Küche', value: moveDetails.assemblyDetails?.furnitureItems?.kitchen || 0 },
        ].filter(item => item.value > 0),
        features: [
          moveDetails.assemblyDetails?.hasComplexItems && 'Komplexe Möbel',
        ].filter(Boolean),
      };
    case 'video':
      return {
        title: 'Video-Analyse',
        icon: '🎥',
        details: moveDetails,
        items: [
          { label: 'Video-ID', value: moveDetails.videoId?.substring(0, 8) + '...' },
        ],
        features: ['KI-gestützte Volumenberechnung'],
      };
    default:
      return null;
  }
};

export default function EstimateResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<EstimateSession | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      fetchEstimateSession();
    }
  }, [id]);

  const fetchEstimateSession = async () => {
    try {
      setLoading(true);
      
      // Get the function URL and append query parameter
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/get-estimate-session?id=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed to fetch estimate');
      }

      const data = await response.json();

      if (data?.success && data?.data) {
        setSession(data.data);
        
        // Pre-select top 2-3 companies
        const topCompanies = data.data.companies.slice(0, Math.min(3, data.data.companies.length));
        setSelectedCompanies(new Set(topCompanies.map((c: Company) => c.id)));
      } else {
        throw new Error(data?.error?.message || 'Failed to load estimate');
      }
    } catch (error: any) {
      console.error('Error fetching estimate session:', error);
      toast.error(error.message || 'Fehler beim Laden der Kostenschätzung');
      navigate('/rechner');
    } finally {
      setLoading(false);
    }
  };

  const toggleCompany = (companyId: string) => {
    setSelectedCompanies(prev => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (selectedCompanies.size === 0) {
      toast.error('Bitte wählen Sie mindestens eine Firma aus');
      return;
    }
    navigate(`/offerte-anfordern/${id}?companies=${Array.from(selectedCompanies).join(',')}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { estimate, move_details, companies } = session;
  const typeDetails = getCalculatorTypeDetails(move_details);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Ihre Kostenschätzung
            </h1>
            <p className="text-muted-foreground">
              {move_details.fromCity && move_details.toCity 
                ? `Basierend auf Ihren Angaben: ${move_details.fromCity} → ${move_details.toCity}`
                : `Basierend auf Ihren Angaben`
              }
            </p>
          </div>

          {/* Calculator Type Details */}
          {typeDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{typeDetails.icon}</span>
                  {typeDetails.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {typeDetails.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-semibold mt-1">{item.value}</div>
                    </div>
                  ))}
                </div>
                
                {typeDetails.features.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Zusätzliche Services:</div>
                    <div className="flex flex-wrap gap-2">
                      {typeDetails.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Price Estimate */}
          <Card>
            <CardHeader>
              <CardTitle>Geschätzter Umzugspreis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6 border-b">
                <div className="text-4xl font-bold text-primary">
                  {formatCurrency(estimate.priceMin)} - {formatCurrency(estimate.priceMax)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Basierend auf {move_details.rooms} Zimmer und {estimate.distance} km Entfernung
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Package className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">{estimate.volumeM3} m³</div>
                    <div className="text-sm text-muted-foreground">Volumen</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getMoveSize(estimate.volumeM3)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">{estimate.estimatedHours} Stunden</div>
                    <div className="text-sm text-muted-foreground">Geschätzte Dauer</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">{estimate.distance} km</div>
                    <div className="text-sm text-muted-foreground">Entfernung</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matching Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Passende Umzugsfirmen für Sie</CardTitle>
              <p className="text-sm text-muted-foreground">
                Wählen Sie die Firmen aus, von denen Sie Offerten erhalten möchten
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {companies.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Keine passenden Firmen gefunden. Bitte kontaktieren Sie uns direkt.
                </p>
              ) : (
                companies.map((company) => (
                  <div
                    key={company.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCompanies.has(company.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleCompany(company.id)}
                  >
                    <Checkbox
                      checked={selectedCompanies.has(company.id)}
                      onCheckedChange={() => toggleCompany(company.id)}
                      className="mt-1"
                    />
                    
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {company.name}
                            {company.verified && (
                              <Badge variant="secondary" className="text-xs">Verifiziert</Badge>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{company.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({company.review_count} Bewertungen)
                            </span>
                          </div>
                        </div>
                        
                        {company.price_level && (
                          <Badge variant="outline">{company.price_level}</Badge>
                        )}
                      </div>
                      
                      {company.services && company.services.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {company.services.slice(0, 3).map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={selectedCompanies.size === 0}
              className="gap-2 flex-1"
            >
              Offerten von {selectedCompanies.size} {selectedCompanies.size === 1 ? 'Firma' : 'Firmen'} erhalten
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const sessionIds = [id];
                navigate(`/bundle?sessions=${sessionIds.join(',')}`);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Weitere Services hinzufügen
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

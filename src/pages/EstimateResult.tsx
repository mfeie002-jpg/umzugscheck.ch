import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, Package, Clock, TrendingUp, Star, ArrowRight, MapPin, Plus, 
  CheckCircle2, Shield, Award, Zap, ThumbsUp, Phone, MessageCircle,
  Users, Truck, Sparkles, Crown, BadgeCheck, Timer, Percent, Gift,
  ChevronDown, ChevronUp, Trophy, Target, Heart, TrendingDown
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, getMoveSize } from "@/lib/pricing";
import { motion, AnimatePresence } from "framer-motion";

interface Company {
  id: string;
  name: string;
  logo: string | null;
  rating: number;
  review_count: number;
  price_level: string | null;
  services: string[];
  verified: boolean;
  response_time?: number;
  success_rate?: number;
  fleet_size?: number;
  employees_count?: number;
  certifications?: string[];
  discount_offer?: string;
  quality_score?: number;
}

interface EstimateSession {
  id: string;
  move_details: any;
  estimate: any;
  companies: Company[];
}

// Calculate match score for a company
const calculateMatchScore = (company: Company, estimate: any): number => {
  let score = 60; // Base score
  
  // Rating bonus (max +20)
  score += Math.min(20, (company.rating - 3) * 10);
  
  // Reviews bonus (max +10)
  score += Math.min(10, Math.log10(company.review_count + 1) * 3);
  
  // Verified bonus
  if (company.verified) score += 5;
  
  // Success rate bonus
  if (company.success_rate) score += (company.success_rate / 100) * 5;
  
  return Math.min(99, Math.round(score));
};

// Get price estimate for company
const getCompanyPriceEstimate = (company: Company, baseMin: number, baseMax: number): { min: number; max: number } => {
  const priceMultiplier = company.price_level === 'günstig' ? 0.85 : 
                          company.price_level === 'premium' ? 1.25 : 1;
  return {
    min: Math.round(baseMin * priceMultiplier),
    max: Math.round(baseMax * priceMultiplier)
  };
};

// Get savings percentage
const getSavingsPercentage = (company: Company): number => {
  if (company.price_level === 'günstig') return Math.floor(Math.random() * 15) + 20;
  if (company.price_level === 'fair') return Math.floor(Math.random() * 10) + 10;
  return Math.floor(Math.random() * 5) + 5;
};

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
    default:
      return null;
  }
};

// Company Card Component
const CompanyRankingCard = ({ 
  company, 
  rank, 
  isSelected, 
  onToggle, 
  estimate,
  isRecommended,
  isBestPrice,
  isBestRated
}: { 
  company: Company; 
  rank: number;
  isSelected: boolean; 
  onToggle: () => void;
  estimate: any;
  isRecommended: boolean;
  isBestPrice: boolean;
  isBestRated: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const matchScore = calculateMatchScore(company, estimate);
  const priceEstimate = getCompanyPriceEstimate(company, estimate.priceMin, estimate.priceMax);
  const savings = getSavingsPercentage(company);
  
  const getRankBadge = () => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: '#1 Empfehlung' };
    if (rank === 2) return { icon: Award, color: 'text-gray-400', bg: 'bg-gray-400/10', label: '#2' };
    if (rank === 3) return { icon: Award, color: 'text-amber-600', bg: 'bg-amber-600/10', label: '#3' };
    return { icon: Target, color: 'text-muted-foreground', bg: 'bg-muted', label: `#${rank}` };
  };
  
  const rankBadge = getRankBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
          : 'border-border hover:border-primary/50 bg-card'
      } ${rank === 1 ? 'ring-2 ring-yellow-500/20' : ''}`}
    >
      {/* Top Badges */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-2 z-10">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${rankBadge.bg}`}>
          <rankBadge.icon className={`h-4 w-4 ${rankBadge.color}`} />
          <span className={`text-xs font-bold ${rankBadge.color}`}>{rankBadge.label}</span>
        </div>
        
        <div className="flex gap-1.5">
          {isRecommended && (
            <Badge className="bg-green-500 text-white text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Top-Match
            </Badge>
          )}
          {isBestPrice && (
            <Badge className="bg-blue-500 text-white text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              Bester Preis
            </Badge>
          )}
          {isBestRated && (
            <Badge className="bg-purple-500 text-white text-xs">
              <Star className="h-3 w-3 mr-1" />
              Top-Bewertung
            </Badge>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div 
        className="p-4 pt-12 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="pt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggle}
              className="h-5 w-5"
            />
          </div>
          
          {/* Logo */}
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
            ) : (
              <Truck className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  {company.name}
                  {company.verified && (
                    <BadgeCheck className="h-5 w-5 text-blue-500" />
                  )}
                </h3>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(company.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{company.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({company.review_count} Bewertungen)
                  </span>
                </div>
              </div>
              
              {/* Price Estimate */}
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(priceEstimate.min)}
                </div>
                <div className="text-xs text-muted-foreground">
                  bis {formatCurrency(priceEstimate.max)}
                </div>
                {company.discount_offer && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    <Gift className="h-3 w-3 mr-1" />
                    {company.discount_offer}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Match Score Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Match-Score</span>
                <span className="font-semibold text-green-600">{matchScore}%</span>
              </div>
              <Progress value={matchScore} className="h-2" />
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mt-3">
              {company.response_time && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4 text-green-500" />
                  <span>Antwortet in {company.response_time}h</span>
                </div>
              )}
              {company.success_rate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4 text-blue-500" />
                  <span>{company.success_rate}% Erfolgsrate</span>
                </div>
              )}
              {savings > 15 && (
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <Percent className="h-4 w-4" />
                  <span>Bis zu {savings}% sparen</span>
                </div>
              )}
            </div>
            
            {/* Services */}
            {company.services && company.services.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {company.services.slice(0, 4).map((service, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {company.services.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{company.services.length - 4} mehr
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? (
            <>Details ausblenden <ChevronUp className="h-4 w-4 ml-1" /></>
          ) : (
            <>Mehr Details <ChevronDown className="h-4 w-4 ml-1" /></>
          )}
        </Button>
      </div>
      
      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Separator />
            <div className="p-4 bg-muted/30 space-y-4">
              {/* Company Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-background rounded-lg text-center">
                  <Users className="h-5 w-5 mx-auto text-primary mb-1" />
                  <div className="font-bold">{company.employees_count || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">Mitarbeiter</div>
                </div>
                <div className="p-3 bg-background rounded-lg text-center">
                  <Truck className="h-5 w-5 mx-auto text-primary mb-1" />
                  <div className="font-bold">{company.fleet_size || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">Fahrzeuge</div>
                </div>
                <div className="p-3 bg-background rounded-lg text-center">
                  <Shield className="h-5 w-5 mx-auto text-green-500 mb-1" />
                  <div className="font-bold">CHF 2M</div>
                  <div className="text-xs text-muted-foreground">Versicherung</div>
                </div>
                <div className="p-3 bg-background rounded-lg text-center">
                  <Zap className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
                  <div className="font-bold">{company.response_time || 2}h</div>
                  <div className="text-xs text-muted-foreground">Antwortzeit</div>
                </div>
              </div>
              
              {/* Certifications */}
              {company.certifications && company.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Zertifizierungen</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Why This Company */}
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Warum diese Firma?
                </h4>
                <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    {matchScore}% Match mit Ihren Anforderungen
                  </li>
                  {company.verified && (
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3" />
                      Geprüft & verifiziert von Umzugscheck.ch
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    {company.review_count}+ zufriedene Kunden
                  </li>
                </ul>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Phone className="h-4 w-4" />
                  Anrufen
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Nachricht
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
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
        // Enhance companies with mock data for demo
        const enhancedCompanies = data.data.companies.map((c: Company) => ({
          ...c,
          response_time: c.response_time || Math.floor(Math.random() * 4) + 1,
          success_rate: c.success_rate || Math.floor(Math.random() * 15) + 85,
          fleet_size: c.fleet_size || Math.floor(Math.random() * 10) + 3,
          employees_count: c.employees_count || Math.floor(Math.random() * 20) + 5,
          certifications: c.certifications || ['ISO 9001', 'Umzugsprofi-Zertifikat'],
          quality_score: c.quality_score || Math.floor(Math.random() * 20) + 80,
        }));
        
        setSession({ ...data.data, companies: enhancedCompanies });
        
        // Pre-select top 3 companies
        const topCompanies = enhancedCompanies.slice(0, Math.min(3, enhancedCompanies.length));
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 h-12 w-12 animate-ping opacity-20 bg-primary rounded-full" />
        </div>
        <p className="text-muted-foreground animate-pulse">Analysiere passende Firmen...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { estimate, move_details, companies } = session;
  const typeDetails = getCalculatorTypeDetails(move_details);
  
  // Find best price and best rated
  const bestPriceCompany = [...companies].sort((a, b) => {
    const priceA = a.price_level === 'günstig' ? 0 : a.price_level === 'fair' ? 1 : 2;
    const priceB = b.price_level === 'günstig' ? 0 : b.price_level === 'fair' ? 1 : 2;
    return priceA - priceB;
  })[0];
  
  const bestRatedCompany = [...companies].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Success Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Ihre persönliche Auswertung
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {move_details.fromCity && move_details.toCity 
                ? `Wir haben ${companies.length} passende Umzugsfirmen für Ihren Umzug von ${move_details.fromCity} nach ${move_details.toCity} gefunden.`
                : `Wir haben ${companies.length} passende Firmen für Sie gefunden.`
              }
            </p>
          </motion.div>

          {/* Price Summary Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Price Section */}
                  <div className="text-center md:text-left space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
                      <Sparkles className="h-4 w-4" />
                      KI-Preisanalyse
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Geschätzter Preis</div>
                      <div className="text-4xl md:text-5xl font-bold text-primary">
                        {formatCurrency(estimate.priceMin)} - {formatCurrency(estimate.priceMax)}
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-green-600">
                      <TrendingDown className="h-5 w-5" />
                      <span className="font-semibold">Bis zu 40% unter Marktpreis möglich</span>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background rounded-xl border">
                      <Package className="h-6 w-6 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{estimate.volumeM3}</div>
                      <div className="text-xs text-muted-foreground">m³ Volumen</div>
                    </div>
                    <div className="text-center p-4 bg-background rounded-xl border">
                      <Clock className="h-6 w-6 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{estimate.estimatedHours}</div>
                      <div className="text-xs text-muted-foreground">Stunden</div>
                    </div>
                    <div className="text-center p-4 bg-background rounded-xl border">
                      <MapPin className="h-6 w-6 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{estimate.distance}</div>
                      <div className="text-xs text-muted-foreground">km Distanz</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ranking Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Ihr persönliches Ranking
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Sortiert nach Match-Score für Ihre Anforderungen
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {companies.length} Firmen gefunden
            </Badge>
          </div>

          {/* Company Rankings */}
          <div className="space-y-4">
            {companies.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Keine passenden Firmen gefunden. Bitte kontaktieren Sie uns direkt.
                </p>
              </Card>
            ) : (
              companies.map((company, index) => (
                <CompanyRankingCard
                  key={company.id}
                  company={company}
                  rank={index + 1}
                  isSelected={selectedCompanies.has(company.id)}
                  onToggle={() => toggleCompany(company.id)}
                  estimate={estimate}
                  isRecommended={index === 0}
                  isBestPrice={company.id === bestPriceCompany?.id && index !== 0}
                  isBestRated={company.id === bestRatedCompany?.id && index !== 0}
                />
              ))
            )}
          </div>

          {/* Sticky CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-4 z-50"
          >
            <Card className="border-2 border-primary shadow-xl bg-background/95 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[...selectedCompanies].slice(0, 3).map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {selectedCompanies.size} {selectedCompanies.size === 1 ? 'Firma' : 'Firmen'} ausgewählt
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Kostenlose Offerten in 24h
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate(`/bundle?sessions=${id}`);
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Mehr Services
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      disabled={selectedCompanies.size === 0}
                      className="gap-2 flex-1 sm:flex-initial bg-primary hover:bg-primary/90"
                    >
                      Offerten anfordern
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trust Footer */}
          <div className="flex flex-wrap justify-center gap-6 py-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>100% kostenlos & unverbindlich</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              <span>Geprüfte Schweizer Firmen</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Offerten in 24 Stunden</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

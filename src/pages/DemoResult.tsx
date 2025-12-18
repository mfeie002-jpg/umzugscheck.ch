import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Package, Clock, TrendingUp, Star, ArrowRight, MapPin,
  CheckCircle2, Shield, Award, Zap, ThumbsUp, Phone, MessageCircle,
  Users, Truck, Sparkles, Crown, BadgeCheck, Timer, Percent, Gift,
  ChevronDown, ChevronUp, Heart, TrendingDown, Calendar, Home, ArrowUpDown
} from "lucide-react";
import { formatCurrency } from "@/lib/pricing";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { Link } from "react-router-dom";

// Demo data for Zug
const demoMoveDetails = {
  fromCity: "Zug",
  fromPostal: "6300",
  fromAddress: "Baarerstrasse 45",
  fromFloor: 3,
  fromHasElevator: true,
  toCity: "Cham",
  toPostal: "6330",
  toAddress: "Zugerstrasse 18",
  toFloor: 2,
  toHasElevator: false,
  rooms: "3.5",
  moveDate: "2025-02-15",
  volumeM3: 35,
  distance: 8,
};

const demoEstimate = {
  priceMin: 1850,
  priceMax: 2650,
  volumeM3: 35,
  estimatedHours: 6,
};

const demoCompanies = [
  {
    id: "1",
    name: "Zug Umzüge AG",
    logo: null,
    rating: 4.9,
    review_count: 187,
    price_level: "fair",
    services: ["Privatumzug", "Packservice", "Montage", "Versicherung"],
    verified: true,
    response_time: 1,
    success_rate: 98,
    fleet_size: 8,
    employees_count: 24,
    certifications: ["ISO 9001", "Schweizer Qualität"],
    discount_offer: "10% Neukunden-Rabatt",
    quality_score: 95,
  },
  {
    id: "2",
    name: "Innerschweiz Express",
    logo: null,
    rating: 4.8,
    review_count: 143,
    price_level: "günstig",
    services: ["Privatumzug", "Firmenumzug", "Lagerung"],
    verified: true,
    response_time: 2,
    success_rate: 96,
    fleet_size: 12,
    employees_count: 35,
    certifications: ["TÜV geprüft"],
    quality_score: 88,
  },
  {
    id: "3",
    name: "Premium Move Schweiz",
    logo: null,
    rating: 5.0,
    review_count: 89,
    price_level: "premium",
    services: ["Privatumzug", "Kunst & Antiquitäten", "Klaviertransport", "Full-Service"],
    verified: true,
    response_time: 1,
    success_rate: 99,
    fleet_size: 6,
    employees_count: 18,
    certifications: ["ISO 9001", "FIDI FAIM"],
    discount_offer: null,
    quality_score: 98,
  },
  {
    id: "4",
    name: "Zuger Umzugsprofis",
    logo: null,
    rating: 4.7,
    review_count: 256,
    price_level: "günstig",
    services: ["Privatumzug", "Entsorgung", "Reinigung"],
    verified: true,
    response_time: 3,
    success_rate: 94,
    fleet_size: 15,
    employees_count: 42,
    certifications: [],
    quality_score: 82,
  },
];

const CompanyCard = ({ 
  company, 
  rank, 
  isSelected, 
  onToggle,
  isRecommended,
  isBestPrice,
  isBestRated
}: { 
  company: typeof demoCompanies[0];
  rank: number;
  isSelected: boolean;
  onToggle: () => void;
  isRecommended: boolean;
  isBestPrice: boolean;
  isBestRated: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const priceMultiplier = company.price_level === 'günstig' ? 0.85 : 
                          company.price_level === 'premium' ? 1.25 : 1;
  const priceMin = Math.round(demoEstimate.priceMin * priceMultiplier);
  const priceMax = Math.round(demoEstimate.priceMax * priceMultiplier);
  
  const matchScore = Math.min(99, 60 + Math.round((company.rating - 3) * 10) + Math.round(Math.log10(company.review_count + 1) * 3) + (company.verified ? 5 : 0));
  
  const getRankBadge = () => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: '#1 Empfehlung' };
    if (rank === 2) return { icon: Award, color: 'text-gray-400', bg: 'bg-gray-400/10', label: '#2' };
    if (rank === 3) return { icon: Award, color: 'text-amber-600', bg: 'bg-amber-600/10', label: '#3' };
    return { icon: Award, color: 'text-muted-foreground', bg: 'bg-muted', label: `#${rank}` };
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
      <div className="absolute top-0 left-0 right-0 flex flex-wrap justify-between items-start p-2 z-10 gap-1">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${rankBadge.bg}`}>
          <rankBadge.icon className={`h-4 w-4 ${rankBadge.color}`} />
          <span className={`text-xs font-bold ${rankBadge.color}`}>{rankBadge.label}</span>
        </div>
        
        <div className="flex gap-1.5 flex-wrap justify-end">
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
        className="p-4 pt-14 cursor-pointer"
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
            <Truck className="h-8 w-8 text-muted-foreground" />
          </div>
          
          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  {company.name}
                  {company.verified && (
                    <BadgeCheck className="h-5 w-5 text-blue-500" />
                  )}
                </h3>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
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
              <div className="text-left sm:text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(priceMin)}
                </div>
                <div className="text-xs text-muted-foreground">
                  bis {formatCurrency(priceMax)}
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
            </div>
            
            {/* Services */}
            {company.services && company.services.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {company.services.slice(0, 3).map((service, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {company.services.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{company.services.length - 3} mehr
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
                  <div className="font-bold">{company.employees_count}</div>
                  <div className="text-xs text-muted-foreground">Mitarbeiter</div>
                </div>
                <div className="p-3 bg-background rounded-lg text-center">
                  <Truck className="h-5 w-5 mx-auto text-primary mb-1" />
                  <div className="font-bold">{company.fleet_size}</div>
                  <div className="text-xs text-muted-foreground">Fahrzeuge</div>
                </div>
                <div className="p-3 bg-background rounded-lg text-center">
                  <Shield className="h-5 w-5 mx-auto text-green-500 mb-1" />
                  <div className="font-bold">CHF 2M</div>
                  <div className="text-xs text-muted-foreground">Versicherung</div>
                </div>
                <div className="p-3 bg-background rounded-lg text-center">
                  <Zap className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
                  <div className="font-bold">{company.response_time}h</div>
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

export default function DemoResult() {
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set(["1"]));

  const toggleCompany = (id: string) => {
    setSelectedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else if (newSet.size < 5) {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Header */}
        <section className="relative py-12 md:py-16 gradient-hero text-white overflow-hidden">
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Demo Banner */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Demo-Ansicht – So sieht Ihr Ergebnis aus
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Ihre Umzugs-Offerten für Zug
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-6">
                Wir haben 4 passende Umzugsfirmen für Ihren Umzug gefunden.
              </p>
              
              {/* Move Summary Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
                      <Home className="h-4 w-4" />
                      Von
                    </div>
                    <div className="font-semibold">{demoMoveDetails.fromPostal} {demoMoveDetails.fromCity}</div>
                    <div className="text-sm text-primary-foreground/70">{demoMoveDetails.fromFloor}. Stock {demoMoveDetails.fromHasElevator ? '(mit Lift)' : '(ohne Lift)'}</div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
                      <MapPin className="h-4 w-4" />
                      Nach
                    </div>
                    <div className="font-semibold">{demoMoveDetails.toPostal} {demoMoveDetails.toCity}</div>
                    <div className="text-sm text-primary-foreground/70">{demoMoveDetails.toFloor}. Stock {demoMoveDetails.toHasElevator ? '(mit Lift)' : '(ohne Lift)'}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
                      <Calendar className="h-4 w-4" />
                      Umzugsdatum
                    </div>
                    <div className="font-semibold">15. Februar 2025</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
                      <Package className="h-4 w-4" />
                      Wohnung
                    </div>
                    <div className="font-semibold">{demoMoveDetails.rooms} Zimmer</div>
                    <div className="text-sm text-primary-foreground/70">~{demoMoveDetails.volumeM3} m³</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Estimate Banner */}
        <section className="py-6 bg-card border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Geschätzte Kosten</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {formatCurrency(demoEstimate.priceMin)}
                    </span>
                    <span className="text-xl text-muted-foreground">–</span>
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {formatCurrency(demoEstimate.priceMax)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="text-center">
                    <Package className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold">{demoEstimate.volumeM3} m³</div>
                    <div className="text-xs text-muted-foreground">Volumen</div>
                  </div>
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold">{demoEstimate.estimatedHours}h</div>
                    <div className="text-xs text-muted-foreground">Dauer</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold">{demoMoveDetails.distance} km</div>
                    <div className="text-xs text-muted-foreground">Distanz</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Passende Umzugsfirmen
                  </h2>
                  <p className="text-muted-foreground">
                    Wählen Sie bis zu 5 Firmen für Ihre Offerten-Anfrage
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {selectedCompanies.size} ausgewählt
                  </Badge>
                </div>
              </div>
              
              {/* Company Cards */}
              <div className="space-y-4">
                {demoCompanies.map((company, index) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    rank={index + 1}
                    isSelected={selectedCompanies.has(company.id)}
                    onToggle={() => toggleCompany(company.id)}
                    isRecommended={index === 0}
                    isBestPrice={company.price_level === 'günstig'}
                    isBestRated={company.rating === 5.0}
                  />
                ))}
              </div>
              
              {/* CTA Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl border">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      Bereit für Ihre Offerten?
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedCompanies.size > 0 
                        ? `${selectedCompanies.size} Firma(en) ausgewählt – Offerten kostenlos anfordern`
                        : 'Wählen Sie mindestens eine Firma aus'
                      }
                    </p>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto gap-2"
                    disabled={selectedCompanies.size === 0}
                  >
                    Offerten anfordern
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl border">
                  <Shield className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-semibold text-sm">100% kostenlos</div>
                    <div className="text-xs text-muted-foreground">Keine versteckten Kosten</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl border">
                  <CheckCircle2 className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-semibold text-sm">Geprüfte Firmen</div>
                    <div className="text-xs text-muted-foreground">Qualität garantiert</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl border">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-semibold text-sm">Schnelle Antwort</div>
                    <div className="text-xs text-muted-foreground">Innert 24 Stunden</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl border">
                  <Percent className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Bis 40% sparen</div>
                    <div className="text-xs text-muted-foreground">Durch Vergleichen</div>
                  </div>
                </div>
              </div>
              
              {/* Back to Home */}
              <div className="mt-8 text-center">
                <Link to="/">
                  <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Zurück zur Startseite
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <SimplifiedFooter />
    </div>
  );
}
/**
 * Comparison Best Practices Test Page
 * 
 * Dedicated testing page implementing research findings from Grok analysis:
 * - Limit comparisons to 3-5 items (3 for mobile, 5 for desktop)
 * - Early trust signals integration (media logos in hero)
 * - Clear visual hierarchy and side-by-side layouts
 * - Sticky headers for comparison tables
 * - Mobile optimization with tabs/cards instead of tables
 * - Scannability through icons, color coding, short text
 * - Strong CTAs at strategic points
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Shield, Check, X, Star, ArrowRight, ChevronDown, 
  Clock, TrendingDown, Users, Award, Sparkles, 
  Filter, Newspaper, BarChart3, CheckCircle2,
  Building2, Truck, Package
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ColoredMediaLogo } from "@/components/trust/media-logos";
import { useFlowPath } from "@/hooks/useUnifiedAB";

// ===========================================
// CORE DATA - Limited to 3-5 items per research
// ===========================================

interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  priceFrom: number;
  popular?: boolean;
  features: {
    transport: boolean;
    packing: boolean | "partial";
    furniture: boolean;
    cleaning: boolean;
    storage: boolean;
    insurance: "basic" | "extended" | "premium";
  };
  benefits: string[];
}

const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Für Preisbewusste",
    priceFrom: 490,
    features: {
      transport: true,
      packing: false,
      furniture: false,
      cleaning: false,
      storage: false,
      insurance: "basic"
    },
    benefits: ["Transport inklusive", "Basis-Versicherung", "Schnelle Verfügbarkeit"]
  },
  {
    id: "comfort",
    name: "Komfort",
    tagline: "Unser Bestseller",
    priceFrom: 890,
    popular: true,
    features: {
      transport: true,
      packing: "partial",
      furniture: true,
      cleaning: false,
      storage: false,
      insurance: "extended"
    },
    benefits: ["Möbelmontage inklusive", "Teilweises Einpacken", "Erweiterte Versicherung"]
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Rundum-Sorglos",
    priceFrom: 1490,
    features: {
      transport: true,
      packing: true,
      furniture: true,
      cleaning: true,
      storage: true,
      insurance: "premium"
    },
    benefits: ["Alles inklusive", "Endreinigung", "Vollkasko-Versicherung"]
  }
];

const FEATURE_LABELS: Record<string, { label: string; icon: typeof Check }> = {
  transport: { label: "Transport", icon: Truck },
  packing: { label: "Ein- & Auspacken", icon: Package },
  furniture: { label: "Möbelmontage", icon: Building2 },
  cleaning: { label: "Endreinigung", icon: Sparkles },
  storage: { label: "Zwischenlagerung", icon: Package },
  insurance: { label: "Versicherung", icon: Shield }
};

const MEDIA_LOGOS = ["SRF", "NZZ", "Blick", "20 Minuten"];

// ===========================================
// HERO SECTION - With integrated trust signals
// ===========================================

const HeroSection = () => {
  const flowPath = useFlowPath();
  
  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Comparison Best Practices Demo</span>
          </motion.div>

          {/* Headline - Benefit-oriented per research */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Umzugsfirmen vergleichen:
            <span className="text-primary block mt-2">Bis zu 40% sparen</span>
          </motion.h1>

          {/* Subheadline - Addresses pain points */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Kein Stress, keine versteckten Kosten. Vergleichen Sie 3 passende Angebote 
            und wählen Sie das beste für Ihren Umzug.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to={flowPath}>
              <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg">
                Jetzt Angebote vergleichen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust signals - Integrated in hero per research */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 pt-6 border-t border-border/50"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Newspaper className="w-4 h-4 text-primary" />
                <span className="font-medium">Bekannt aus:</span>
              </div>
              {MEDIA_LOGOS.map((name) => (
                <div 
                  key={name}
                  className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200"
                >
                  <ColoredMediaLogo name={name} size="sm" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ===========================================
// FEATURE VALUE RENDERER - Scannability focused
// ===========================================

const FeatureValue = ({ value, compact = false }: { value: boolean | "partial" | string; compact?: boolean }) => {
  if (value === true) {
    return (
      <div className={cn(
        "flex items-center justify-center",
        compact ? "gap-1" : "gap-2"
      )}>
        <Check className={cn(
          "text-success",
          compact ? "w-4 h-4" : "w-5 h-5"
        )} />
        {!compact && <span className="text-sm text-success font-medium">Inklusive</span>}
      </div>
    );
  }
  
  if (value === false) {
    return (
      <div className="flex items-center justify-center">
        <X className={cn(
          "text-muted-foreground/40",
          compact ? "w-4 h-4" : "w-5 h-5"
        )} />
      </div>
    );
  }
  
  if (value === "partial") {
    return (
      <div className="flex items-center justify-center gap-1">
        <Check className="w-4 h-4 text-warning" />
        {!compact && <span className="text-sm text-warning font-medium">Teilweise</span>}
      </div>
    );
  }
  
  // Insurance type
  const insuranceLabels: Record<string, { text: string; color: string }> = {
    basic: { text: "Basis", color: "text-muted-foreground" },
    extended: { text: "Erweitert", color: "text-primary" },
    premium: { text: "Vollkasko", color: "text-success" }
  };
  
  const label = insuranceLabels[value as string] || { text: value, color: "text-foreground" };
  return (
    <span className={cn("text-sm font-medium", label.color)}>
      {label.text}
    </span>
  );
};

// ===========================================
// DESKTOP COMPARISON TABLE - Sticky headers, max 5 items
// ===========================================

const DesktopComparisonTable = () => {
  const flowPath = useFlowPath();
  const featureKeys = Object.keys(FEATURE_LABELS) as Array<keyof typeof FEATURE_LABELS>;
  
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Sticky header per research */}
        <thead className="sticky top-0 bg-background z-10">
          <tr>
            <th className="p-4 text-left font-medium text-muted-foreground border-b-2 border-border">
              Leistung
            </th>
            {SERVICE_PACKAGES.map((pkg) => (
              <th key={pkg.id} className="p-4 text-center min-w-[180px] border-b-2 border-border">
                <div className={cn(
                  "p-4 rounded-xl",
                  pkg.popular 
                    ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary" 
                    : "bg-muted/50"
                )}>
                  {pkg.popular && (
                    <Badge className="bg-white/20 text-white mb-2">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Beliebt
                    </Badge>
                  )}
                  <div className="font-bold text-xl">{pkg.name}</div>
                  <div className={cn(
                    "text-sm",
                    pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {pkg.tagline}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {/* Price row - Visual hierarchy per research */}
          <tr className="bg-primary/5">
            <td className="p-4 font-semibold border-b border-border">Preis ab</td>
            {SERVICE_PACKAGES.map((pkg) => (
              <td key={pkg.id} className="p-4 text-center border-b border-border">
                <div className="text-2xl font-bold text-primary">
                  CHF {pkg.priceFrom.toLocaleString('de-CH')}
                </div>
              </td>
            ))}
          </tr>
          
          {/* Feature rows - Color coding per research */}
          {featureKeys.map((key, index) => {
            const { label, icon: Icon } = FEATURE_LABELS[key];
            return (
              <tr key={key} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                <td className="p-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{label}</span>
                  </div>
                </td>
                {SERVICE_PACKAGES.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center border-b border-border/50">
                    <FeatureValue value={pkg.features[key as keyof typeof pkg.features]} />
                  </td>
                ))}
              </tr>
            );
          })}
          
          {/* CTA row */}
          <tr>
            <td className="p-4"></td>
            {SERVICE_PACKAGES.map((pkg) => (
              <td key={pkg.id} className="p-4 text-center">
                <Link to={flowPath}>
                  <Button 
                    variant={pkg.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    Angebot anfragen
                  </Button>
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ===========================================
// MOBILE COMPARISON - Tabs/Cards per research
// ===========================================

const MobileComparisonCards = () => {
  const flowPath = useFlowPath();
  const [selectedPackage, setSelectedPackage] = useState<string>("comfort");
  
  return (
    <div className="md:hidden space-y-4">
      {/* Tab navigation - Max 3 items on mobile */}
      <Tabs value={selectedPackage} onValueChange={setSelectedPackage} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-12">
          {SERVICE_PACKAGES.map((pkg) => (
            <TabsTrigger
              key={pkg.id}
              value={pkg.id}
              className={cn(
                "relative",
                pkg.popular && "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              )}
            >
              {pkg.name}
              {pkg.popular && (
                <Star className="w-3 h-3 absolute -top-1 -right-1 fill-warning text-warning" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {SERVICE_PACKAGES.map((pkg) => (
          <TabsContent key={pkg.id} value={pkg.id} className="mt-4">
            <Card className={cn(
              "overflow-hidden",
              pkg.popular && "ring-2 ring-primary"
            )}>
              {pkg.popular && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-1 fill-current" />
                  Beliebteste Wahl
                </div>
              )}
              
              <CardContent className="p-5 space-y-4">
                {/* Price - Large and bold per research */}
                <div className="text-center pb-4 border-b border-border">
                  <div className="text-sm text-muted-foreground">{pkg.tagline}</div>
                  <div className="text-3xl font-bold text-primary mt-1">
                    ab CHF {pkg.priceFrom.toLocaleString('de-CH')}
                  </div>
                </div>
                
                {/* Features - Icons for scannability */}
                <div className="space-y-3">
                  {Object.entries(pkg.features).map(([key, value]) => {
                    const { label, icon: Icon } = FEATURE_LABELS[key as keyof typeof FEATURE_LABELS];
                    return (
                      <div key={key} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{label}</span>
                        </div>
                        <FeatureValue value={value} compact />
                      </div>
                    );
                  })}
                </div>
                
                {/* Benefits */}
                <div className="pt-4 border-t border-border space-y-2">
                  {pkg.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA */}
                <Link to={flowPath}>
                  <Button 
                    className="w-full h-12 text-base font-bold mt-4"
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    Angebot anfragen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// ===========================================
// WHY COMPARE SECTION - Addresses pain points
// ===========================================

const WhyCompareSection = () => {
  const reasons = [
    {
      icon: TrendingDown,
      title: "Bis zu 40% sparen",
      description: "Vergleich mehrerer Angebote garantiert bessere Preise"
    },
    {
      icon: Shield,
      title: "Geprüfte Qualität",
      description: "Nur verifizierte Firmen mit echten Kundenbewertungen"
    },
    {
      icon: Clock,
      title: "Schnelle Angebote",
      description: "Offerten in Minuten statt Tagen erhalten"
    }
  ];
  
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Warum vergleichen?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ein Vergleich spart Zeit, Geld und Nerven
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ===========================================
// TESTIMONIALS - Social proof per research
// ===========================================

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Zürich",
      text: "Dank dem Vergleich habe ich CHF 800 gespart! Super einfach.",
      rating: 5
    },
    {
      name: "Marco B.",
      location: "Bern", 
      text: "Die Offerten kamen innerhalb von 24 Stunden. Sehr empfehlenswert.",
      rating: 5
    },
    {
      name: "Julia K.",
      location: "Basel",
      text: "Transparent und kostenlos. Genau so sollte ein Vergleich sein!",
      rating: 5
    }
  ];
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Was unsere Nutzer sagen</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===========================================
// MAIN PAGE COMPONENT
// ===========================================

export default function ComparisonBestPractices() {
  const flowPath = useFlowPath();
  
  return (
    <>
      <Helmet>
        <title>Vergleich Best Practices Demo | UmzugsCheck.ch</title>
        <meta 
          name="description" 
          content="Test-Seite für Comparison Website Best Practices basierend auf Research-Findings." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Research badge */}
        <div className="bg-warning/10 border-b border-warning/30 py-2">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-foreground">
              <BarChart3 className="w-4 h-4 inline mr-1" />
              <strong>Test Page:</strong> Comparison Best Practices basierend auf Grok Research Report
            </p>
          </div>
        </div>
        
        {/* Hero with integrated trust signals */}
        <HeroSection />
        
        {/* Main comparison section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Service-Pakete vergleichen</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Wählen Sie das passende Paket für Ihren Umzug – transparent und einfach
              </p>
            </div>
            
            {/* Desktop table with sticky headers */}
            <DesktopComparisonTable />
            
            {/* Mobile tabs/cards */}
            <MobileComparisonCards />
          </div>
        </section>
        
        {/* Why compare - addresses pain points */}
        <WhyCompareSection />
        
        {/* Testimonials - social proof */}
        <TestimonialsSection />
        
        {/* Final CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Bereit zum Vergleichen?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Starten Sie jetzt Ihren kostenlosen Vergleich und sparen Sie bis zu 40%.
            </p>
            <Link to={flowPath}>
              <Button size="lg" className="h-14 px-8 text-lg font-bold">
                Gratis Vergleich starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

/**
 * Canton Company Comparison View
 * Side-by-side comparison of selected moving companies
 */

import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  Star, Shield, MapPin, CheckCircle2, XCircle, ArrowLeft, 
  Phone, Mail, Clock, Truck, Home, Building2, Package,
  Trash2, Sparkles, Award, TrendingDown, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { zugConfig, getCantonConfig, getPriceLevelColor, CantonCompany } from "@/config/cantonConfig";

const serviceIcons: Record<string, React.ReactNode> = {
  "Privatumzug": <Home className="w-4 h-4" />,
  "Firmenumzug": <Building2 className="w-4 h-4" />,
  "Reinigung": <Sparkles className="w-4 h-4" />,
  "Entsorgung": <Trash2 className="w-4 h-4" />,
  "Einlagerung": <Package className="w-4 h-4" />,
  "Räumung": <Trash2 className="w-4 h-4" />,
  "Möbellift": <Truck className="w-4 h-4" />,
};

const comparisonFeatures = [
  { key: "priceLevel", label: "Preisstufe", type: "badge" },
  { key: "rating", label: "Bewertung", type: "rating" },
  { key: "reviewCount", label: "Anzahl Bewertungen", type: "number" },
  { key: "availability", label: "Verfügbarkeit", type: "text" },
  { key: "regions", label: "Regionen", type: "list" },
  { key: "services", label: "Leistungen", type: "services" },
  { key: "savingsPercent", label: "Potenzielle Ersparnis", type: "savings" },
];

const CantonComparison = () => {
  const { canton } = useParams<{ canton: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const cantonSlug = canton || "zug";
  const config = getCantonConfig(cantonSlug) || zugConfig;
  
  // Get selected companies from URL params
  const selectedNames = searchParams.get("firmen")?.split(",") || [];
  const selectedCompanies = config.companies.filter(c => selectedNames.includes(c.name));
  
  // If no companies selected, show all top 3
  const companiesToShow = selectedCompanies.length > 0 
    ? selectedCompanies 
    : config.companies.slice(0, 3);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Umzugsfirmen Vergleich - ${config.name}`,
    "description": `Vergleiche ausgewählte Umzugsfirmen im ${config.name} nebeneinander.`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Schweiz", "item": "https://umzugscheck.ch" },
        { "@type": "ListItem", "position": 2, "name": config.name, "item": `https://umzugscheck.ch/${cantonSlug}` },
        { "@type": "ListItem", "position": 3, "name": "Vergleich" }
      ]
    }
  };

  const renderFeatureValue = (company: CantonCompany, feature: typeof comparisonFeatures[0]) => {
    const value = company[feature.key as keyof CantonCompany];
    
    switch (feature.type) {
      case "badge":
        return (
          <Badge className={`${getPriceLevelColor(value as string)} border`}>
            {value as string}
          </Badge>
        );
      
      case "rating":
        return (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(value as number)
                      ? "text-yellow-400 fill-yellow-400"
                      : star - 0.5 <= (value as number)
                      ? "text-yellow-400 fill-yellow-400/50"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{value}</span>
          </div>
        );
      
      case "number":
        return <span className="font-medium">{value} Bewertungen</span>;
      
      case "text":
        return (
          <span className={`font-medium ${
            (value as string).includes("Sofort") ? "text-green-600" : ""
          }`}>
            {value as string}
          </span>
        );
      
      case "list":
        const regions = value as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {regions.slice(0, 3).map((region, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {region}
              </Badge>
            ))}
            {regions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{regions.length - 3}
              </Badge>
            )}
          </div>
        );
      
      case "services":
        const services = value as string[];
        return (
          <div className="space-y-1">
            {services.map((service, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        );
      
      case "savings":
        return (
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-500" />
            <span className="font-bold text-green-600">bis zu {value}%</span>
          </div>
        );
      
      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsfirmen Vergleich - {config.name} | umzugscheck.ch</title>
        <meta 
          name="description" 
          content={`Vergleiche ${companiesToShow.length} ausgewählte Umzugsfirmen im ${config.name} nebeneinander. Preise, Bewertungen, Leistungen.`} 
        />
        <link rel="canonical" href={`https://umzugscheck.ch/${cantonSlug}/vergleich`} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <main id="main-content" role="main" className="pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-background via-primary/5 to-background py-8">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[
                { label: "Schweiz", href: "/" },
                { label: config.name, href: `/${cantonSlug}` },
                { label: "Vergleich" }
              ]}
            />
            
            <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <Link 
                  to={`/${cantonSlug}`}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Zurück zur Übersicht
                </Link>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {companiesToShow.length} Umzugsfirmen im Vergleich
                </h1>
                <p className="text-muted-foreground mt-2">
                  Detaillierter Vergleich für deinen Umzug im {config.name}
                </p>
              </div>
              
              <Link to={`/${cantonSlug}`}>
                <Button variant="outline">
                  Auswahl ändern
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="container mx-auto px-4 py-8">
          <ScrollReveal>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left bg-muted/50 rounded-tl-lg w-48">Merkmal</th>
                    {companiesToShow.map((company, i) => (
                      <th 
                        key={company.name} 
                        className={`p-4 text-left bg-muted/50 min-w-[280px] ${
                          i === companiesToShow.length - 1 ? "rounded-tr-lg" : ""
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{company.name}</span>
                            {company.isAIRecommended && (
                              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                                <Sparkles className="w-3 h-3 mr-1" />
                                KI-Empfehlung
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-normal">
                            {company.tagline}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, rowIndex) => (
                    <tr key={feature.key} className={rowIndex % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="p-4 font-medium border-t border-border">
                        {feature.label}
                      </td>
                      {companiesToShow.map((company) => (
                        <td key={company.name} className="p-4 border-t border-border">
                          {renderFeatureValue(company, feature)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* CTA Row */}
                  <tr className="bg-primary/5">
                    <td className="p-4 font-medium border-t border-border rounded-bl-lg">
                      Aktion
                    </td>
                    {companiesToShow.map((company, i) => (
                      <td 
                        key={company.name} 
                        className={`p-4 border-t border-border ${
                          i === companiesToShow.length - 1 ? "rounded-br-lg" : ""
                        }`}
                      >
                        <Link to="/umzugsofferten">
                          <Button className="w-full group">
                            Offerte anfordern
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comparison Cards - Mobile */}
            <div className="lg:hidden space-y-6">
              {companiesToShow.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{company.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {company.tagline}
                          </p>
                        </div>
                        {company.isAIRecommended && (
                          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                            <Sparkles className="w-3 h-3 mr-1" />
                            KI
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      {comparisonFeatures.map((feature) => (
                        <div key={feature.key} className="flex justify-between items-start gap-4">
                          <span className="text-sm text-muted-foreground shrink-0">
                            {feature.label}
                          </span>
                          <div className="text-right">
                            {renderFeatureValue(company, feature)}
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t">
                        <Link to="/umzugsofferten">
                          <Button className="w-full">
                            Offerte anfordern
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Summary Section */}
        <div className="container mx-auto px-4 py-8">
          <ScrollReveal>
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">
                    Bereit für deinen Umzug im {config.name}?
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Erhalte jetzt kostenlose Offerten von den verglichenen Umzugsfirmen. 
                    Unverbindlich und kostenlos – in nur 2 Minuten.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link to="/umzugsofferten">
                      <Button size="lg" className="min-w-[200px]">
                        Gratis Offerten erhalten
                      </Button>
                    </Link>
                    <Link to="/umzugsofferten">
                      <Button size="lg" variant="outline" className="min-w-[200px]">
                        Preise berechnen
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-wrap justify-center gap-4 pt-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>100% kostenlos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>In 2 Minuten</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>Unverbindlich</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </main>

      {/* Sticky Bottom CTA - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 lg:hidden z-40">
        <div className="flex gap-3">
          <Link to="/umzugsofferten" className="flex-1">
            <Button className="w-full">
              Offerten anfordern ({companiesToShow.length})
            </Button>
          </Link>
          <Link to={`/${cantonSlug}`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CantonComparison;

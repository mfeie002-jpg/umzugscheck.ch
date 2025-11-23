import { useLocation, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, TrendingDown, Star, Shield, ArrowRight, Package, Clock, TrendingUp, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency, getMoveSize } from "@/lib/pricing";
import type { MovingCalculation } from "@/lib/pricing";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { PieChart as RechartsPC, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

const CalculatorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [calculation, setCalculation] = useState<MovingCalculation | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [calculatorData, setCalculatorData] = useState<any>(null);

  useEffect(() => {
    if (!location.state || !location.state.calculation) {
      navigate("/rechner");
      return;
    }

    setCalculation(location.state.calculation);
    setDistance(location.state.distance || 0);
    setCalculatorData(location.state.calculatorData);
  }, [location, navigate]);

  if (!calculation) {
    return null;
  }

  // Custom tooltip component for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / calculation.breakdown.total) * 100).toFixed(1);
      
      const explanations: Record<string, string> = {
        "Basispreis": "Grundpreis für Transport und Arbeitskräfte basierend auf Volumen",
        "Distanzgebühr": "Zusätzliche Kosten für die Transportdistanz zwischen den Standorten",
        "Stockwerkgebühr": "Gebühr für den Transport über mehrere Stockwerke ohne Lift",
        "Lift-Rabatt": "Rabatt für vorhandene Liftanlagen an beiden Standorten",
        "Zusatzleistungen": "Kosten für zusätzliche Services wie Packservice, Reinigung, etc."
      };

      return (
        <div className="bg-background border border-border rounded-lg p-4 shadow-strong max-w-xs">
          <p className="font-bold text-foreground mb-2">{data.name}</p>
          <p className="text-sm text-muted-foreground mb-2">{explanations[data.name]}</p>
          <div className="space-y-1">
            <p className="text-lg font-bold text-primary">{formatCurrency(data.value)}</p>
            <p className="text-sm text-muted-foreground">{percentage}% vom Gesamtpreis</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom active shape for hover effect
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            transition: 'all 0.3s ease-out'
          }}
        />
      </g>
    );
  };

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  // Scroll animations
  const priceCardAnim = useScrollAnimation(0.2);
  const breakdownAnim = useScrollAnimation(0.2);
  const leadFormAnim = useScrollAnimation(0.2);
  const companiesAnim = useScrollAnimation(0.1);
  const trustSectionAnim = useScrollAnimation(0.2);

  const mockCompanies = [
    {
      id: 1,
      name: "Züri Umzüge AG",
      rating: 4.8,
      reviews: 127,
      price: calculation.priceMin,
      verified: true,
      responseTime: "< 2 Std.",
      services: ["Packservice", "Montage", "Versicherung"]
    },
    {
      id: 2,
      name: "Swiss Move Solutions",
      rating: 4.9,
      reviews: 203,
      price: Math.round((calculation.priceMin + calculation.priceMax) / 2),
      verified: true,
      responseTime: "< 1 Std.",
      services: ["Alle Services", "24/7 Support"]
    },
    {
      id: 3,
      name: "Express Umzugsfirma",
      rating: 4.7,
      reviews: 89,
      price: calculation.priceMax,
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

        {/* Price Estimate & Details */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Main Price Card */}
              <div 
                ref={priceCardAnim.ref}
                className={cn(
                  "transition-all duration-700 ease-out",
                  priceCardAnim.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                )}
              >
                <Card className="shadow-strong border-primary/20 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-success" />
                    Geschätzte Umzugskosten
                  </CardTitle>
                  <CardDescription>
                    Basierend auf Ihren Angaben – finale Preise können variieren
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {formatCurrency(calculation.priceMin)}
                    </span>
                    <span className="text-2xl text-muted-foreground">-</span>
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {formatCurrency(calculation.priceMax)}
                    </span>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{calculation.volumeM3} m³</div>
                      <div className="text-sm text-muted-foreground">Volumen</div>
                    </div>
                    <div className="text-center">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{calculation.estimatedHours}h</div>
                      <div className="text-sm text-muted-foreground">Geschätzte Dauer</div>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{distance} km</div>
                      <div className="text-sm text-muted-foreground">Distanz</div>
                    </div>
                  </div>

                  {/* Move Size */}
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="font-semibold mb-1">Umzugsgrösse</div>
                    <div className="text-sm text-muted-foreground">{getMoveSize(calculation.volumeM3)}</div>
                  </div>

                  {/* Cost Breakdown Chart */}
                  <div 
                    ref={breakdownAnim.ref}
                    className={cn(
                      "border-t pt-6 transition-all duration-700 ease-out delay-200",
                      breakdownAnim.isVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-8"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <PieChart className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">Kostenaufschlüsselung</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      {/* Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPC>
                            <Pie
                              data={[
                                { name: "Basispreis", value: calculation.breakdown.basePrice, color: "hsl(var(--primary))" },
                                ...(calculation.breakdown.distanceFee > 0 ? [{ name: "Distanzgebühr", value: calculation.breakdown.distanceFee, color: "hsl(var(--accent))" }] : []),
                                ...(calculation.breakdown.floorFee > 0 ? [{ name: "Stockwerkgebühr", value: calculation.breakdown.floorFee, color: "hsl(var(--secondary))" }] : []),
                                ...(calculation.breakdown.elevatorDiscount < 0 ? [{ name: "Lift-Rabatt", value: Math.abs(calculation.breakdown.elevatorDiscount), color: "hsl(var(--success))" }] : []),
                                ...((calculation.breakdown.total - calculation.breakdown.basePrice - calculation.breakdown.distanceFee - calculation.breakdown.floorFee - calculation.breakdown.elevatorDiscount) > 0 ? 
                                  [{ name: "Zusatzleistungen", value: calculation.breakdown.total - calculation.breakdown.basePrice - calculation.breakdown.distanceFee - calculation.breakdown.floorFee - calculation.breakdown.elevatorDiscount, color: "hsl(var(--muted))" }] : [])
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => {
                                const percentage = ((value / calculation.breakdown.total) * 100).toFixed(0);
                                return `${percentage}%`;
                              }}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              activeIndex={activeIndex}
                              activeShape={renderActiveShape}
                              onMouseEnter={onPieEnter}
                              onMouseLeave={onPieLeave}
                              style={{ cursor: 'pointer' }}
                            >
                              {[
                                { name: "Basispreis", value: calculation.breakdown.basePrice, color: "hsl(var(--primary))" },
                                ...(calculation.breakdown.distanceFee > 0 ? [{ name: "Distanzgebühr", value: calculation.breakdown.distanceFee, color: "hsl(var(--accent))" }] : []),
                                ...(calculation.breakdown.floorFee > 0 ? [{ name: "Stockwerkgebühr", value: calculation.breakdown.floorFee, color: "hsl(var(--secondary))" }] : []),
                                ...(calculation.breakdown.elevatorDiscount < 0 ? [{ name: "Lift-Rabatt", value: Math.abs(calculation.breakdown.elevatorDiscount), color: "hsl(var(--success))" }] : []),
                                ...((calculation.breakdown.total - calculation.breakdown.basePrice - calculation.breakdown.distanceFee - calculation.breakdown.floorFee - calculation.breakdown.elevatorDiscount) > 0 ? 
                                  [{ name: "Zusatzleistungen", value: calculation.breakdown.total - calculation.breakdown.basePrice - calculation.breakdown.distanceFee - calculation.breakdown.floorFee - calculation.breakdown.elevatorDiscount, color: "hsl(var(--muted))" }] : [])
                              ].map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.color}
                                  style={{
                                    transition: 'all 0.3s ease-out'
                                  }}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </RechartsPC>
                        </ResponsiveContainer>
                      </div>

                      {/* Breakdown List */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                          <span className="font-medium">Basispreis</span>
                          <span className="font-bold text-primary">{formatCurrency(calculation.breakdown.basePrice)}</span>
                        </div>
                        {calculation.breakdown.distanceFee > 0 && (
                          <div className="flex justify-between items-center p-3 rounded-lg bg-accent/5">
                            <span className="font-medium">Distanzgebühr</span>
                            <span className="font-bold text-accent">{formatCurrency(calculation.breakdown.distanceFee)}</span>
                          </div>
                        )}
                        {calculation.breakdown.floorFee > 0 && (
                          <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/20">
                            <span className="font-medium">Stockwerkgebühr</span>
                            <span className="font-bold">{formatCurrency(calculation.breakdown.floorFee)}</span>
                          </div>
                        )}
                        {calculation.breakdown.elevatorDiscount < 0 && (
                          <div className="flex justify-between items-center p-3 rounded-lg bg-success/5">
                            <span className="font-medium">Lift-Rabatt</span>
                            <span className="font-bold text-success">{formatCurrency(calculation.breakdown.elevatorDiscount)}</span>
                          </div>
                        )}
                        {(calculation.breakdown.total - calculation.breakdown.basePrice - calculation.breakdown.distanceFee - calculation.breakdown.floorFee - calculation.breakdown.elevatorDiscount) > 0 && (
                          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                            <span className="font-medium">Zusatzleistungen</span>
                            <span className="font-bold">{formatCurrency(calculation.breakdown.total - calculation.breakdown.basePrice - calculation.breakdown.distanceFee - calculation.breakdown.floorFee - calculation.breakdown.elevatorDiscount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border-t-2 border-primary mt-4">
                          <span className="font-bold text-lg">Total</span>
                          <span className="font-bold text-lg text-primary">{formatCurrency(calculation.breakdown.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm">
                    Durchschnittliche Ersparnis durch Vergleich: <span className="font-semibold text-success">{formatCurrency(Math.round(calculation.priceMax * 0.3))}</span>
                  </p>
                </CardContent>
              </Card>
              </div>

              {/* Lead Capture Form */}
              <div 
                ref={leadFormAnim.ref}
                className={cn(
                  "transition-all duration-700 ease-out delay-300",
                  leadFormAnim.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                )}
              >
                <LeadCaptureForm
                calculatorData={calculatorData}
                calculation={calculation}
                distance={distance}
                  calculatorType={location.state.type}
                />
              </div>

              {/* Companies */}
              <div 
                ref={companiesAnim.ref}
                className={cn(
                  "mt-8 space-y-6 transition-all duration-700 ease-out delay-500",
                  companiesAnim.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                )}
              >
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
              <div 
                ref={trustSectionAnim.ref}
                className={cn(
                  "mt-8 transition-all duration-700 ease-out delay-700",
                  trustSectionAnim.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                )}
              >
                <Card className="bg-secondary/30 border-none">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorResults;

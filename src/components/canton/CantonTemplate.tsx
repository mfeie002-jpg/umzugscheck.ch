import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Link } from "react-router-dom";
import { Star, Shield, Clock, TrendingUp, CheckCircle, ArrowRight, MapPin, Users, Truck, Zap, ChevronRight, Building2, Home, Package, LucideIcon } from "lucide-react";

export interface CantonCompany {
  name: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  sponsored: boolean;
  available: boolean;
  badge: string | null;
}

export interface CantonPriceExample {
  size: string;
  range: string;
  avg: string;
}

export interface CantonService {
  name: string;
  icon: LucideIcon;
  link: string;
}

export interface CantonUSP {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface CantonFAQ {
  question: string;
  answer: string;
}

export interface CantonConfig {
  name: string;
  slug: string;
  tagline: string;
  icon: LucideIcon;
  iconColor: string;
  cities: string[];
  companies: CantonCompany[];
  priceExamples: CantonPriceExample[];
  services: CantonService[];
  usps: CantonUSP[];
  faqs: CantonFAQ[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  localInfo: {
    title: string;
    paragraphs: { title?: string; text: string }[];
  };
  notificationCity: string;
  activeUsersBase: number;
}

interface CantonTemplateProps {
  config: CantonConfig;
  children?: ReactNode;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  sidebarWidgets?: ReactNode[];
}

export const CantonTemplate = ({ config, children, headerComponent, footerComponent, sidebarWidgets }: CantonTemplateProps) => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState(config.activeUsersBase);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setActiveUsers(p => Math.max(config.activeUsersBase - 4, p + Math.floor(Math.random() * 3) - 1)), 5000);
    return () => clearInterval(i);
  }, [config.activeUsersBase]);

  useEffect(() => {
    const t = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleServiceToggle = (s: string) => setSelectedServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO 
        title={config.seo.title} 
        description={config.seo.description} 
        canonicalUrl={`https://umzugscheck.ch/${config.slug}`} 
        keywords={config.seo.keywords} 
      />

      {headerComponent}

      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 100 }} 
            className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Neue Buchung in {config.notificationCity}</p>
                <p className="text-xs text-muted-foreground">vor {Math.floor(Math.random() * 10) + 1} Minuten</p>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className={`mb-4 bg-accent/10 text-accent border-accent/30`}>
                <Icon className="h-3 w-3 mr-1" />{config.tagline}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Umzugsfirmen in <span className="text-primary">{config.name}</span> vergleichen
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Finden Sie die besten Umzugsfirmen in {config.name} und Umgebung. Kostenlose Offerten von geprüften Partnern.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { icon: Star, text: "4.8/5", color: "text-yellow-500" },
                  { icon: Users, text: `${activeUsers} aktiv`, color: "text-primary" },
                  { icon: Shield, text: "Gratis", color: "text-success" }
                ].map((b, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.2 + i * 0.1 }} 
                    className="flex items-center gap-2 bg-card/80 px-3 py-1.5 rounded-full border border-border/50"
                  >
                    <b.icon className={`h-4 w-4 ${b.color}`} />
                    <span className="text-sm font-medium">{b.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>{activeUsers} Personen vergleichen gerade in {config.name}</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-2 border-primary/20 shadow-2xl bg-card/95">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Schnelle Offerte</h3>
                      <p className="text-xs text-muted-foreground">In 2 Minuten</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Von</Label>
                        <select 
                          value={fromCity} 
                          onChange={e => setFromCity(e.target.value)} 
                          className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        >
                          <option value="">Wählen</option>
                          {config.cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">Nach</Label>
                        <select 
                          value={toCity} 
                          onChange={e => setToCity(e.target.value)} 
                          className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        >
                          <option value="">Wählen</option>
                          {config.cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Grösse</Label>
                      <select 
                        value={rooms} 
                        onChange={e => setRooms(e.target.value)} 
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      >
                        {[1, 2, 3, 4, 5].map(r => (
                          <option key={r} value={r}>{r === 5 ? '5+' : r} Zimmer</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Services</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Reinigung", "Entsorgung", "Packen", "Montage"].map(s => (
                          <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox 
                              checked={selectedServices.includes(s)} 
                              onCheckedChange={() => handleServiceToggle(s)} 
                            />
                            {s}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Link to={`/umzug-offerte?from=${fromCity}&to=${toCity}&rooms=${rooms}&region=${config.slug}`}>
                      <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">
                        Offerten erhalten
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">✓ Kostenlos ✓ Unverbindlich</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {children}

      {/* Companies Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Top 10 Umzugsfirmen in {config.name}
          </h2>
          <div className="space-y-3">
            {config.companies.map((c, i) => (
              <Card key={c.name} className={`hover:shadow-lg transition-all ${c.sponsored ? 'border-primary/30 bg-primary/5' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{c.name}</h3>
                        {c.sponsored && <Badge variant="outline" className="text-xs bg-primary/10">Gesponsert</Badge>}
                        {c.badge && <Badge variant="secondary" className="text-xs">{c.badge}</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {c.rating} ({c.reviews} Bewertungen)
                        <Badge variant="outline" className="text-xs">{c.priceLevel}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.available ? (
                        <Badge className="bg-success/10 text-success">Verfügbar</Badge>
                      ) : (
                        <Badge variant="outline">Ausgebucht</Badge>
                      )}
                      <Button size="sm" className="bg-primary">Offerte</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to={`/firmen?region=${config.slug}`}>
              <Button variant="outline" size="lg">
                Alle Umzugsfirmen
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Price Examples */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Umzugspreise in {config.name}</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {config.priceExamples.map(p => (
              <Card key={p.size} className="text-center hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <Home className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{p.size}</h3>
                  <p className="text-2xl font-bold text-primary">{p.avg}</p>
                  <p className="text-sm text-muted-foreground">{p.range}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {config.services.map(s => {
              const ServiceIcon = s.icon;
              return (
                <Link key={s.name} to={s.link}>
                  <Card className="hover:shadow-lg hover:border-primary/30 transition-all h-full">
                    <CardContent className="p-4 text-center">
                      <ServiceIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{s.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {config.usps.map(u => {
              const USPIcon = u.icon;
              return (
                <Card key={u.title} className="h-full hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <USPIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{u.title}</h3>
                    <p className="text-sm text-muted-foreground">{u.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sidebar Widgets */}
      {sidebarWidgets && sidebarWidgets.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {sidebarWidgets}
            </div>
          </div>
        </section>
      )}

      {/* Local Info */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">{config.localInfo.title}</h2>
          <div className="prose prose-gray max-w-none text-muted-foreground">
            {config.localInfo.paragraphs.map((p, i) => (
              <div key={i}>
                {p.title && <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">{p.title}</h3>}
                <p className="mb-4">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen</h2>
          <FAQAccordion items={config.faqs} />
        </div>
      </section>

      {footerComponent}

      {/* CTA */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Bereit für Ihren Umzug in {config.name}?</h2>
          <p className="mb-6 opacity-90">Vergleichen Sie jetzt kostenlos die besten Umzugsfirmen</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/umzug-offerte">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Jetzt vergleichen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/${config.slug}/vergleich`}>
              <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Kantone vergleichen
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

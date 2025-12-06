import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Star, Shield, Award, ArrowRight, Sparkles, Users, TrendingDown, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample companies for demo
const sampleCompanies = [
  { name: "Swiss Move AG", rating: 4.9, reviews: 234, price: "Ab CHF 590", badges: ["Top bewertet", "Versichert"], logo: "🏠" },
  { name: "Züri Umzüge", rating: 4.7, reviews: 189, price: "Ab CHF 520", badges: ["Günstig", "Express"], logo: "📦" },
  { name: "Alpen Transport", rating: 4.8, reviews: 156, price: "Ab CHF 650", badges: ["Premium", "Geprüft"], logo: "🏔️" },
  { name: "City Movers", rating: 4.6, reviews: 98, price: "Ab CHF 480", badges: ["Neu", "Flexibel"], logo: "🚚" },
];

// Option 1: Classic Comparison Table
const TableComparison = () => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left p-4 font-semibold text-foreground">Firma</th>
          <th className="text-center p-4 font-semibold text-foreground">Bewertung</th>
          <th className="text-center p-4 font-semibold text-foreground">Preis</th>
          <th className="text-center p-4 font-semibold text-foreground">Versichert</th>
          <th className="text-center p-4 font-semibold text-foreground">Express</th>
          <th className="text-center p-4 font-semibold text-foreground">Reinigung</th>
          <th className="p-4"></th>
        </tr>
      </thead>
      <tbody>
        {sampleCompanies.slice(0, 3).map((company, i) => (
          <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{company.logo}</span>
                <span className="font-medium text-foreground">{company.name}</span>
              </div>
            </td>
            <td className="text-center p-4">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{company.rating}</span>
                <span className="text-muted-foreground text-sm">({company.reviews})</span>
              </div>
            </td>
            <td className="text-center p-4 font-semibold text-primary">{company.price}</td>
            <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
            <td className="text-center p-4">{i < 2 ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
            <td className="text-center p-4">{i === 0 ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
            <td className="p-4">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Offerte</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Option 2: Interactive Cards
const CardComparison = () => (
  <div className="grid md:grid-cols-3 gap-6">
    {sampleCompanies.slice(0, 3).map((company, i) => (
      <motion.div
        key={i}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 h-full">
          {i === 0 && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary/80 text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
              Empfohlen
            </div>
          )}
          <CardContent className="p-6">
            <div className="text-4xl mb-4">{company.logo}</div>
            <h3 className="font-bold text-lg text-foreground mb-2">{company.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < Math.floor(company.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({company.reviews})</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {company.badges.map((badge, j) => (
                <Badge key={j} variant="secondary" className="text-xs">{badge}</Badge>
              ))}
            </div>
            <div className="text-2xl font-bold text-primary mb-4">{company.price}</div>
            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Offerte anfragen
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

// Option 3: Split-Screen Preview
const SplitComparison = () => (
  <div className="grid md:grid-cols-2 gap-8 items-center">
    <div className="space-y-4">
      {sampleCompanies.slice(0, 2).map((company, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
          className={`p-6 rounded-2xl border-2 ${i === 0 ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{company.logo}</span>
              <div>
                <h3 className="font-bold text-lg text-foreground">{company.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{company.rating}</span>
                  <span className="text-muted-foreground text-sm">• {company.reviews} Bewertungen</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{company.price}</div>
              <div className="flex gap-1 mt-2">
                {company.badges.map((badge, j) => (
                  <Badge key={j} variant={i === 0 ? "default" : "secondary"} className="text-xs">{badge}</Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 text-center">
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
        <TrendingDown className="h-5 w-5" />
        <span className="font-semibold">Bis zu 40% sparen</span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-4">Vergleichen lohnt sich!</h3>
      <p className="text-muted-foreground mb-6">Finden Sie die beste Firma zum besten Preis in Ihrer Region.</p>
      <Button size="lg" className="bg-primary hover:bg-primary/90 h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base">
        Vergleichen
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  </div>
);

// Option 4: Premium Showcase (Best Option)
const PremiumComparison = () => (
  <div className="relative">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl" />
    
    <div className="relative grid lg:grid-cols-5 gap-8 items-center">
      {/* Left: Feature highlights */}
      <div className="lg:col-span-2 space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold text-sm">Intelligenter Vergleich</span>
        </div>
        <h3 className="text-3xl font-bold text-foreground">
          Die besten Umzugsfirmen auf einen Blick
        </h3>
        <p className="text-muted-foreground text-lg">
          Vergleichen Sie Preise, Bewertungen und Services von geprüften Schweizer Umzugsfirmen – transparent und unabhängig.
        </p>
        <div className="space-y-3">
          {[
            { icon: BadgeCheck, text: "Nur geprüfte & versicherte Firmen" },
            { icon: Star, text: "Echte Kundenbewertungen" },
            { icon: TrendingDown, text: "Bis zu 40% günstiger" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-foreground font-medium">{item.text}</span>
            </div>
          ))}
        </div>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 mt-4 h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base">
          <Link to="/firmen">
            <span className="hidden sm:inline">Alle Firmen vergleichen</span>
            <span className="sm:hidden">Firmen ansehen</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </Button>
      </div>
      
      {/* Right: Company preview cards */}
      <div className="lg:col-span-3 relative">
        <div className="grid sm:grid-cols-2 gap-4">
          {sampleCompanies.map((company, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="group"
            >
              <Card className={`relative overflow-hidden transition-all duration-300 ${i === 0 ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
                {i === 0 && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 text-xs font-semibold text-center">
                    🏆 Top Empfehlung
                  </div>
                )}
                <CardContent className={`p-5 ${i === 0 ? 'pt-10' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                      {company.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{company.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{company.rating}</span>
                        <span className="text-xs text-muted-foreground">({company.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {company.badges.map((badge, j) => (
                      <Badge key={j} variant="secondary" className="text-xs py-0.5">{badge}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{company.price}</span>
                    <Button size="sm" variant={i === 0 ? "default" : "outline"} className="text-xs">
                      Offerte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface ComparisonShowcaseProps {
  variant?: 'table' | 'cards' | 'split' | 'premium' | 'all';
}

export const ComparisonShowcase = ({ variant = 'premium' }: ComparisonShowcaseProps) => {
  if (variant === 'all') {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 space-y-24">
          {/* Option 1: Table */}
          <div>
            <div className="text-center mb-8">
              <Badge className="mb-4">Option 1</Badge>
              <h2 className="text-2xl font-bold text-foreground">Vergleichstabelle</h2>
              <p className="text-muted-foreground">Klassische Tabelle mit Features</p>
            </div>
            <Card className="p-6">
              <TableComparison />
            </Card>
          </div>

          {/* Option 2: Cards */}
          <div>
            <div className="text-center mb-8">
              <Badge className="mb-4">Option 2</Badge>
              <h2 className="text-2xl font-bold text-foreground">Interaktive Karten</h2>
              <p className="text-muted-foreground">Side-by-side mit Hover-Effekten</p>
            </div>
            <CardComparison />
          </div>

          {/* Option 3: Split */}
          <div>
            <div className="text-center mb-8">
              <Badge className="mb-4">Option 3</Badge>
              <h2 className="text-2xl font-bold text-foreground">Split-Screen Preview</h2>
              <p className="text-muted-foreground">Modernes 2-spaltiges Layout</p>
            </div>
            <SplitComparison />
          </div>

          {/* Option 4: Premium (Best) */}
          <div>
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-primary">Option 4 - Empfohlen</Badge>
              <h2 className="text-2xl font-bold text-foreground">Premium Showcase</h2>
              <p className="text-muted-foreground">Beste Kombination aus Info & Conversion</p>
            </div>
            <PremiumComparison />
          </div>
        </div>
      </section>
    );
  }

  const renderVariant = () => {
    switch (variant) {
      case 'table': return <TableComparison />;
      case 'cards': return <CardComparison />;
      case 'split': return <SplitComparison />;
      case 'premium': return <PremiumComparison />;
      default: return <PremiumComparison />;
    }
  };

  return (
    <section className="py-16 md:py-20 bg-background" aria-labelledby="comparison-heading">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-3 bg-primary/10 text-primary border-0">Firmen vergleichen</Badge>
          <h2 id="comparison-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Umzugsfirmen transparent vergleichen
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Finden Sie die perfekte Umzugsfirma – mit echten Bewertungen und transparenten Preisen.
          </p>
        </motion.div>
        {renderVariant()}
      </div>
    </section>
  );
};

export default ComparisonShowcase;

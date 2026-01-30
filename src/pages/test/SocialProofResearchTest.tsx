/**
 * Social Proof A/B Test Page - Research-Based Variants
 * 
 * Based on research findings:
 * - Scannability: Short text, icons, color coding
 * - Trust signals early: Media logos, reviews prominent
 * - Visual hierarchy: Clear distinction, side-by-side layouts
 * - Mobile optimization: Simplified views, max 2-3 items
 * - Limit information: 3-5 comparisons to avoid overwhelm
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Star, TrendingDown, Users, Shield, CheckCircle2, ArrowRight,
  Clock, Sparkles, Quote, Building2, BadgeCheck, ThumbsUp
} from "lucide-react";
import { TRUST } from "@/content/trust";
import { ColoredMediaLogo } from "@/components/trust/media-logos";
import { Link } from "react-router-dom";

// ============================================
// VARIANT R: Scannable Trust Grid (Research-based)
// Focus: Scannability with icons, color coding, short text
// ============================================
const VariantR_ScannableGrid = memo(function VariantR_ScannableGrid() {
  const trustMetrics = [
    { 
      icon: Users, 
      value: "15'000+", 
      label: "Umzüge", 
      color: "bg-primary/10 text-primary",
      borderColor: "border-primary/20"
    },
    { 
      icon: Building2, 
      value: "200+", 
      label: "Firmen", 
      color: "bg-secondary/10 text-secondary",
      borderColor: "border-secondary/20"
    },
    { 
      icon: Star, 
      value: "4.8/5", 
      label: "Bewertung", 
      color: "bg-amber-500/10 text-amber-600",
      borderColor: "border-amber-500/20"
    },
    { 
      icon: TrendingDown, 
      value: "40%", 
      label: "Ersparnis", 
      color: "bg-emerald-500/10 text-emerald-600",
      borderColor: "border-emerald-500/20"
    },
  ];

  return (
    <section className="py-4 bg-muted/30 border-y border-border/40">
      <div className="container max-w-4xl px-4">
        {/* Scannable 4-grid - color-coded cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {trustMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`flex flex-col items-center p-3 rounded-xl border ${metric.borderColor} ${metric.color.split(' ')[0]} hover:shadow-sm transition-all`}
            >
              <metric.icon className={`w-5 h-5 mb-1 ${metric.color.split(' ')[1]}`} />
              <span className="text-lg md:text-xl font-bold text-foreground">{metric.value}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground">{metric.label}</span>
            </motion.div>
          ))}
        </div>
        
        {/* Media logos row - compact */}
        <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/30">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Bekannt aus:</span>
          <div className="flex items-center gap-2">
            {["SRF", "NZZ", "Blick"].map((name) => (
              <div key={name} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                <ColoredMediaLogo name={name} size="sm" />
              </div>
            ))}
            <span className="text-xs font-semibold text-muted-foreground">+3</span>
          </div>
        </div>
      </div>
    </section>
  );
});

// ============================================
// VARIANT S: Visual Hierarchy Strip
// Focus: Clear hierarchy with featured testimonial + stats
// ============================================
const VariantS_HierarchyStrip = memo(function VariantS_HierarchyStrip() {
  return (
    <section className="py-4 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 border-y border-border/30">
      <div className="container max-w-5xl px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Left: Featured micro-testimonial */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-3"
          >
            <Quote className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium italic">
                "Endlich ein transparenter Vergleich – wir haben CHF 720 gespart!"
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">– M. Brunner, Zürich</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right: Key stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 md:gap-6"
          >
            <div className="text-center">
              <span className="text-xl font-bold text-primary">{TRUST.movesCount}</span>
              <p className="text-[10px] text-muted-foreground">Umzüge</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <span className="text-xl font-bold text-foreground">{TRUST.ratingValue}/5</span>
              <p className="text-[10px] text-muted-foreground">Bewertung</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <span className="text-xl font-bold text-secondary">{TRUST.savingsPercent}</span>
              <p className="text-[10px] text-muted-foreground">Ersparnis</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

// ============================================
// VARIANT T: Side-by-Side Comparison Preview
// Focus: Show comparison benefit visually
// ============================================
const VariantT_ComparisonPreview = memo(function VariantT_ComparisonPreview() {
  const comparisonExample = [
    { name: "Günstigstes Angebot", price: "CHF 1'280", badge: "Empfohlen", highlight: true },
    { name: "Mittleres Angebot", price: "CHF 1'650", badge: null, highlight: false },
    { name: "Teuerstes Angebot", price: "CHF 2'100", badge: null, highlight: false },
  ];

  return (
    <section className="py-5 bg-card border-y border-border/40">
      <div className="container max-w-4xl px-4">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            So viel können Sie sparen
          </h3>
        </div>
        
        {/* Mini comparison table */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-lg mx-auto">
          {comparisonExample.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-3 rounded-lg border text-center ${
                item.highlight 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-border/50 bg-muted/30'
              }`}
            >
              {item.badge && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-[10px]">
                  {item.badge}
                </Badge>
              )}
              <p className={`text-lg md:text-xl font-bold ${item.highlight ? 'text-primary' : 'text-muted-foreground line-through'}`}>
                {item.price}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{item.name}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Savings highlight */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mt-4"
        >
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-600">
            Ø CHF 620 gespart durch Vergleich
          </span>
        </motion.div>
      </div>
    </section>
  );
});

// ============================================
// VARIANT U: Mobile-First Tabs
// Focus: Tabbed interface for mobile, prevents overload
// ============================================
const VariantU_MobileTabs = memo(function VariantU_MobileTabs() {
  return (
    <section className="py-4 bg-muted/20 border-y border-border/30">
      <div className="container max-w-4xl px-4">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="stats" className="text-xs">Zahlen</TabsTrigger>
            <TabsTrigger value="media" className="text-xs">Bekannt aus</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">Bewertungen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="mt-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-card rounded-lg border border-border/50">
                <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span className="text-lg font-bold">{TRUST.movesCount}</span>
                <p className="text-[10px] text-muted-foreground">Umzüge</p>
              </div>
              <div className="p-3 bg-card rounded-lg border border-border/50">
                <Building2 className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span className="text-lg font-bold">{TRUST.companiesCount}</span>
                <p className="text-[10px] text-muted-foreground">Firmen</p>
              </div>
              <div className="p-3 bg-card rounded-lg border border-border/50">
                <Star className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <span className="text-lg font-bold">{TRUST.ratingValue}</span>
                <p className="text-[10px] text-muted-foreground">Bewertung</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="mt-3">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {["SRF", "NZZ", "Blick", "20 Minuten", "Watson", "newhome"].map((name) => (
                <div key={name} className="grayscale hover:grayscale-0 transition-all">
                  <ColoredMediaLogo name={name} size="md" />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-3">
            <div className="bg-card rounded-lg border border-border/50 p-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm font-semibold ml-2">4.8/5</span>
              </div>
              <p className="text-sm italic text-muted-foreground">
                "Super Service, schnelle Antworten und wirklich das beste Angebot gefunden!"
              </p>
              <p className="text-xs text-muted-foreground mt-2">– K. Meier, Basel</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
});

// ============================================
// VARIANT V: Trust + Pain Point Combo
// Focus: Address pain points while showing trust
// ============================================
const VariantV_TrustPainCombo = memo(function VariantV_TrustPainCombo() {
  const painSolutions = [
    { pain: "Versteckte Kosten?", solution: "Festpreis-Garantie", icon: Shield },
    { pain: "Unzuverlässig?", solution: "Geprüfte Partner", icon: BadgeCheck },
    { pain: "Stress?", solution: "Alles in 2 Min.", icon: Clock },
  ];

  return (
    <section className="py-4 bg-gradient-to-b from-background to-muted/30 border-y border-border/30">
      <div className="container max-w-4xl px-4">
        {/* Pain → Solution row */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
          {painSolutions.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-3 rounded-lg bg-card border border-border/50"
            >
              <p className="text-xs text-muted-foreground line-through mb-1">{item.pain}</p>
              <item.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs font-semibold text-foreground">{item.solution}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Trust footer */}
        <div className="flex items-center justify-center gap-4 pt-3 border-t border-border/30">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">{TRUST.movesCount} zufrieden</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{TRUST.ratingValue}/5 Sterne</span>
          </div>
        </div>
      </div>
    </section>
  );
});

// ============================================
// Main Test Page Component
// ============================================
export default function SocialProofResearchTest() {
  const [activeVariant, setActiveVariant] = useState<string>("R");

  const variants = [
    { id: "R", name: "Scannable Grid", description: "4-card grid with color coding" },
    { id: "S", name: "Hierarchy Strip", description: "Testimonial + stats side-by-side" },
    { id: "T", name: "Comparison Preview", description: "Visual savings comparison" },
    { id: "U", name: "Mobile Tabs", description: "Tabbed interface, prevents overload" },
    { id: "V", name: "Trust + Pain", description: "Address pain points with trust" },
  ];

  const renderVariant = () => {
    switch (activeVariant) {
      case "R": return <VariantR_ScannableGrid />;
      case "S": return <VariantS_HierarchyStrip />;
      case "T": return <VariantT_ComparisonPreview />;
      case "U": return <VariantU_MobileTabs />;
      case "V": return <VariantV_TrustPainCombo />;
      default: return <VariantR_ScannableGrid />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Social Proof A/B Test – Research-Based Variants | UmzugsCheck</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero Section - Simplified */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            A/B Test Page
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Social Proof Variants
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Testet verschiedene Varianten für die Trust-Section basierend auf Forschungsergebnissen 
            zu Scannability, visueller Hierarchie und Mobile-Optimierung.
          </p>
          
          {/* Variant Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {variants.map((v) => (
              <Button
                key={v.id}
                variant={activeVariant === v.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveVariant(v.id)}
                className="min-w-[120px]"
              >
                <span className="font-mono mr-1">V{v.id}</span>
                {v.name}
              </Button>
            ))}
          </div>
          
          {/* Current variant info */}
          <div className="bg-card border border-border rounded-lg p-4 max-w-md mx-auto mb-8">
            <p className="text-sm font-semibold text-foreground">
              Aktiv: Variant {activeVariant} – {variants.find(v => v.id === activeVariant)?.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {variants.find(v => v.id === activeVariant)?.description}
            </p>
          </div>
        </div>
      </section>

      {/* Active Variant Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVariant}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderVariant()}
        </motion.div>
      </AnimatePresence>

      {/* Research Principles Reference */}
      <section className="py-12 bg-muted/20">
        <div className="container max-w-4xl px-4">
          <h2 className="text-xl font-bold mb-6 text-center">Research Principles Applied</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Scannability
              </h3>
              <p className="text-xs text-muted-foreground">
                Short text, icons, color coding – users can quickly scan and understand key metrics.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Visual Hierarchy
              </h3>
              <p className="text-xs text-muted-foreground">
                Clear distinction between elements, emphasizing most important info first.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Limited Items (3-5)
              </h3>
              <p className="text-xs text-muted-foreground">
                Avoiding cognitive overload by limiting comparisons and trust signals to digestible chunks.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Mobile Optimization
              </h3>
              <p className="text-xs text-muted-foreground">
                Tabs, stacked layouts, and simplified views for smaller screens.
              </p>
            </div>
          </div>
          
          {/* Back to homepage */}
          <div className="text-center mt-8">
            <Link to="/">
              <Button variant="outline">
                <ArrowRight className="w-4 h-4 mr-2" />
                Zurück zur Homepage
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

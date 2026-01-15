import { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Star, Check, ArrowRight, ShoppingCart, Package, Truck, 
  Shield, Heart, Sparkles, Plus, Minus, Gift, Percent
} from "lucide-react";

const products = [
  {
    id: "starter-set",
    name: "Starter-Set",
    description: "Perfekt für 1-Zimmer oder Studentenzimmer",
    price: 49,
    originalPrice: 69,
    items: ["10x Umzugskartons (Standard)", "1x Klebeband", "1x Beschriftungsset"],
    popular: false,
    emoji: "📦",
    savings: "CHF 20 sparen"
  },
  {
    id: "classic-set",
    name: "Classic-Set",
    description: "Ideal für 2-3 Zimmer Wohnung",
    price: 129,
    originalPrice: 179,
    items: ["30x Umzugskartons (Standard)", "5x Bücherkartons", "3x Klebeband", "Beschriftungsset", "5x Packpapier-Bogen"],
    popular: true,
    emoji: "🏠",
    savings: "Bestseller"
  },
  {
    id: "premium-set",
    name: "Premium-Set",
    description: "Komplett für 4-5 Zimmer",
    price: 229,
    originalPrice: 299,
    items: ["50x Umzugskartons (Standard)", "10x Bücherkartons", "5x Kleiderboxen", "6x Klebeband", "Beschriftungsset", "Packpapier", "Luftpolsterfolie"],
    popular: false,
    emoji: "🏡",
    savings: "CHF 70 sparen"
  },
  {
    id: "luxus-set",
    name: "Luxus-Set",
    description: "All-inclusive für grosse Umzüge",
    price: 399,
    originalPrice: 499,
    items: ["80x Umzugskartons (Standard)", "20x Bücherkartons", "10x Kleiderboxen", "2x Geschirrkartons", "10x Klebeband", "Komplettes Verpackungsmaterial", "Möbeldecken (2x)", "Spanngurte"],
    popular: false,
    emoji: "🏰",
    savings: "CHF 100 sparen"
  }
];

const singleItems = [
  { id: "karton-standard", name: "Umzugskarton Standard", price: 3.50, unit: "Stück", minQty: 10 },
  { id: "karton-buecher", name: "Bücherkarton", price: 4.50, unit: "Stück", minQty: 5 },
  { id: "karton-kleider", name: "Kleiderbox", price: 8.90, unit: "Stück", minQty: 2 },
  { id: "klebeband", name: "Klebeband (50m)", price: 4.90, unit: "Rolle", minQty: 1 },
  { id: "packpapier", name: "Packpapier (5kg)", price: 12.90, unit: "Paket", minQty: 1 },
  { id: "luftpolster", name: "Luftpolsterfolie (10m)", price: 14.90, unit: "Rolle", minQty: 1 },
  { id: "moebeldecke", name: "Möbeldecke", price: 19.90, unit: "Stück", minQty: 1 },
];

const benefits = [
  { icon: Truck, title: "Gratis Lieferung", description: "Ab CHF 100 Bestellwert" },
  { icon: Package, title: "Qualitäts-Kartons", description: "Stabil & wiederverwendbar" },
  { icon: Shield, title: "Zufriedenheitsgarantie", description: "Einfache Rückgabe" },
  { icon: Gift, title: "Kombi-Rabatte", description: "Sparen Sie mit Sets" },
];

const testimonials = [
  { name: "Anna K.", text: "Super Qualität! Die Kartons haben sogar den 2. Umzug überstanden.", rating: 5 },
  { name: "Marco S.", text: "Schnelle Lieferung, genau wie beschrieben. Perfekt!", rating: 5 },
  { name: "Familie Weber", text: "Das Premium-Set war genau richtig für unsere 4-Zimmer-Wohnung.", rating: 5 },
];

export default function ShopPage() {
  const [cart, setCart] = useState<Record<string, number>>({});

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const product = products.find(p => p.id === id);
    if (product) return total + product.price * qty;
    const item = singleItems.find(i => i.id === id);
    if (item) return total + item.price * qty;
    return total;
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Umzugscheck Shop",
    "description": "Umzugskartons und Verpackungsmaterial für Ihren Umzug in der Schweiz",
    "url": "https://umzugscheck.ch/shop",
    "priceRange": "CHF 3.50 - CHF 499"
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Umzugskartons & Verpackungsmaterial | Shop | Umzugscheck.ch</title>
        <meta name="description" content="Umzugskartons, Verpackungsmaterial & Sets für Ihren Umzug ✓ Gratis Lieferung ab CHF 100 ✓ Top Qualität ✓ Faire Preise ✓ Schnelle Lieferung in der Schweiz!" />
        <link rel="canonical" href="https://umzugscheck.ch/shop" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
          <div className="container px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-green-100 text-green-700">
                <Percent className="w-3 h-3 mr-1" /> Bis zu 30% Rabatt auf Sets
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
                Alles für Ihren <span className="text-primary">stressfreien Umzug</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Hochwertige Umzugskartons und Verpackungsmaterial – direkt zu Ihnen geliefert. 
                <strong> Gratis Versand ab CHF 100!</strong>
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <b.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{b.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* SETS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Unsere Umzugs-Sets</h2>
              <p className="text-muted-foreground">Alles was Sie brauchen – in einem praktischen Paket</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`h-full relative ${p.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-white">
                          <Sparkles className="w-3 h-3 mr-1" /> Bestseller
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <span className="text-5xl">{p.emoji}</span>
                      </div>
                      <h3 className="font-bold text-xl text-center mb-1">{p.name}</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">{p.description}</p>
                      
                      <div className="text-center mb-4">
                        <span className="text-3xl font-bold text-primary">CHF {p.price}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">CHF {p.originalPrice}</span>
                      </div>
                      
                      <Badge variant="secondary" className="w-full justify-center mb-4 bg-green-100 text-green-700">
                        {p.savings}
                      </Badge>

                      <ul className="space-y-2 mb-6">
                        {p.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2">
                        {cart[p.id] ? (
                          <>
                            <Button variant="outline" size="icon" onClick={() => removeFromCart(p.id)}>
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold w-8 text-center">{cart[p.id]}</span>
                            <Button variant="outline" size="icon" onClick={() => addToCart(p.id)}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button className="w-full" onClick={() => addToCart(p.id)}>
                            <ShoppingCart className="w-4 h-4 mr-2" /> In den Warenkorb
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SINGLE ITEMS */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Einzelprodukte</h2>
              <p className="text-muted-foreground">Genau das, was Sie noch brauchen</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {singleItems.map((item, i) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-primary font-bold">CHF {item.price.toFixed(2)}/{item.unit}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => addToCart(item.id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Das sagen unsere Kunden</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {testimonials.map((t, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-3">"{t.text}"</p>
                    <p className="font-medium">{t.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Brauchen Sie auch Hilfe beim Umzug?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Vergleichen Sie kostenlos Offerten von geprüften Umzugsfirmen in Ihrer Region!
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/umzugsofferten">
                Umzugsofferten erhalten <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* FLOATING CART */}
      {cartCount > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="shadow-xl border-primary">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warenkorb</p>
                <p className="font-bold text-primary">CHF {cartTotal.toFixed(2)}</p>
              </div>
              <Button size="sm" className="ml-2">
                Zur Kasse
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <SimplifiedFooter />
    </div>
  );
}

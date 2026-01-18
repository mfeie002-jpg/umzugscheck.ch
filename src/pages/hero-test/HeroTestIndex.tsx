/**
 * Hero Test Index - Übersicht aller Hero-Varianten
 */

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { NavigationV17 } from "@/components/navigation-v17";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layout, Image, Layers, ExternalLink } from "lucide-react";

const variants = [
  {
    id: "a",
    name: "Variante A: Homepage-Stil",
    path: "/hero-test/variante-a",
    description: "Grosser Hero mit Tab-Wechsel (Umzug/Reinigung/Entsorgung), Multi-Step Calculator, Premium Animationen",
    pros: [
      "Maximale visuelle Wirkung",
      "Alle Services in einem Hero",
      "Premium-Eindruck"
    ],
    cons: [
      "Kann überladen wirken",
      "Längere Ladezeit",
      "Mehr Ablenkung"
    ],
    icon: Layout,
    color: "primary"
  },
  {
    id: "b",
    name: "Variante B: Landingpage-Stil",
    path: "/hero-test/variante-b",
    description: "Kompakter Hero mit Hintergrundbild, schnelle PLZ-Eingabe, fokussiert auf Lead-Generierung",
    pros: [
      "Schnelle Conversion",
      "Visuell ansprechend",
      "Klarer Fokus"
    ],
    cons: [
      "Weniger Feature-Vielfalt",
      "Kein Service-Wechsel",
      "Weniger Premium"
    ],
    icon: Image,
    color: "secondary"
  },
  {
    id: "c",
    name: "Variante C: Hybrid-Lösung",
    path: "/hero-test/variante-c",
    description: "Kompakter Hero mit Premium-Elementen. Tabs für Form/Video, konsistentes Design",
    pros: [
      "Best of Both Worlds",
      "Video-Option integriert",
      "Konsistent mit Homepage"
    ],
    cons: [
      "Kompromiss",
      "Mittlere Komplexität"
    ],
    icon: Layers,
    color: "green"
  }
];

export default function HeroTestIndex() {
  return (
    <>
      <Helmet>
        <title>Hero-Varianten Test | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <NavigationV17 />
      
      <main className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 border-b">
          <div className="container">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                Interner Test
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Hero-Varianten Vergleich
              </h1>
              <p className="text-lg text-muted-foreground">
                Vergleiche 3 verschiedene Hero-Stile für Umzugscheck.ch Landingpages. 
                Ziel: Einheitliches Design für Homepage, Regionen, Kantone und Services.
              </p>
            </div>
          </div>
        </section>

        {/* Variants Grid */}
        <section className="py-12">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-6">
              {variants.map((variant) => {
                const IconComponent = variant.icon;
                const colorClasses = {
                  primary: "bg-primary/10 text-primary border-primary/20",
                  secondary: "bg-secondary/10 text-secondary border-secondary/20",
                  green: "bg-green-500/10 text-green-600 border-green-500/20"
                }[variant.color];
                
                return (
                  <div 
                    key={variant.id}
                    className="bg-card rounded-xl border border-border overflow-hidden flex flex-col"
                  >
                    {/* Header */}
                    <div className={`p-4 border-b ${colorClasses}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold">{variant.name}</h2>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4">
                        {variant.description}
                      </p>
                      
                      {/* Pros */}
                      <div className="mb-3">
                        <h3 className="text-xs font-semibold text-green-600 uppercase mb-2">Vorteile</h3>
                        <ul className="space-y-1">
                          {variant.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">✓</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Cons */}
                      <div className="mb-4">
                        <h3 className="text-xs font-semibold text-amber-600 uppercase mb-2">Nachteile</h3>
                        <ul className="space-y-1">
                          {variant.cons.map((con, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">–</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* CTA */}
                      <div className="mt-auto pt-4">
                        <Link to={variant.path}>
                          <Button className="w-full" variant={variant.id === "a" ? "default" : "outline"}>
                            Variante {variant.id.toUpperCase()} ansehen
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 border-t bg-card">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">Schnellzugriff:</span>
              <Link to="/hero-test/variante-a" className="text-sm text-primary hover:underline">
                Variante A
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/hero-test/variante-b" className="text-sm text-secondary hover:underline">
                Variante B
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/hero-test/variante-c" className="text-sm text-green-600 hover:underline">
                Variante C
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/umzugsfirmen/kanton-zuerich" className="text-sm text-muted-foreground hover:underline">
                Aktuelle Kanton-Seite
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

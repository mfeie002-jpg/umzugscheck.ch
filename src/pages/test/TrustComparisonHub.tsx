/**
 * TrustComparisonHub - Alle 4 Varianten nebeneinander vergleichen
 */

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Building2, Award, Shield, Zap, ExternalLink, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface VariantInfo {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  philosophy: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  keyFeatures: string[];
  trustEntities: string[];
  ctaText: string;
}

const VARIANTS: VariantInfo[] = [
  {
    id: "v1",
    path: "/test/trust-v1",
    title: "Behörden-Fokus",
    subtitle: "Staatliche Autorität",
    philosophy: "Wenn der Staat sagt, wir sind echt, dann sind wir echt.",
    icon: Building2,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    keyFeatures: ["Zefix-Verifikationslink", "UID prominent", "Formal & clean", "Keine Testimonials"],
    trustEntities: ["Zefix/UID-Register", "eUmzugCH", "Die Post", "Kantone"],
    ctaText: "Jetzt anfragen",
  },
  {
    id: "v2",
    path: "/test/trust-v2",
    title: "Branchen-Fokus",
    subtitle: "Verbands-Legitimität",
    philosophy: "Branchenverband = Qualitätsstandard",
    icon: Award,
    color: "text-primary",
    bgColor: "bg-primary/5",
    keyFeatures: ["SMA-Badge prominent", "Zertifizierungs-Karten", "Business-Stil", "Video-Testimonial"],
    trustEntities: ["SMA", "ASTAG", "SPEDLOGSWISS", "FIDI"],
    ctaText: "Partner finden",
  },
  {
    id: "v3",
    path: "/test/trust-v3",
    title: "Konsumenten-Fokus",
    subtitle: "Käuferschutz",
    philosophy: "Du bist geschützt - emotional sicher.",
    icon: Shield,
    color: "text-success",
    bgColor: "bg-success/5",
    keyFeatures: ["Geld-zurück-Badge", "Pain Section", "Testimonials mit Fotos", "Garantie-Karten"],
    trustEntities: ["Konsumentenbund", "SKS", "Trusted Shops", "Die Mobiliar"],
    ctaText: "Sicher vergleichen",
  },
  {
    id: "v4",
    path: "/test/trust-v4",
    title: "Best-Of Synthese",
    subtitle: "Psychologisch optimiert",
    philosophy: "Das Beste aus allen Welten.",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    keyFeatures: ["Trust-Pills (klickbar)", "Trust-Drawer", "3-Tab Hub", "Sticky Mobile Bar"],
    trustEntities: ["Zefix", "SMA", "Konsumentenbund", "Media-Logos"],
    ctaText: "Offerten erhalten",
  },
];

export default function TrustComparisonHub() {
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");

  return (
    <>
      <Helmet>
        <title>Trust-Varianten Vergleich | A/B Test Hub | umzugscheck.ch</title>
        <meta name="description" content="Vergleichen Sie 4 verschiedene Trust-Strategien für maximale Conversion." />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 bg-muted/30 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Trust-Varianten Vergleich
              </h1>
              <p className="text-muted-foreground mb-6">
                4 unterschiedliche Trust-Strategien zum Vergleichen und Testen.
                Jede Variante fokussiert auf einen anderen psychologischen Hebel.
              </p>
              
              {/* Preview Mode Toggle */}
              <div className="inline-flex items-center gap-2 bg-card border rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    previewMode === "desktop" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    previewMode === "mobile" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Variants Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {VARIANTS.map((variant) => (
                <div
                  key={variant.id}
                  className={`${variant.bgColor} rounded-2xl p-6 border border-border/50 hover:border-border transition-colors`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${variant.color} bg-background rounded-xl flex items-center justify-center shadow-sm`}>
                        <variant.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{variant.title}</h3>
                        <p className="text-sm text-muted-foreground">{variant.subtitle}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${variant.color} bg-background`}>
                      {variant.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Philosophy */}
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "{variant.philosophy}"
                  </p>

                  {/* Key Features */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {variant.keyFeatures.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-background px-2 py-1 rounded border">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trust Entities */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Trust-Entities</h4>
                    <div className="flex flex-wrap gap-2">
                      {variant.trustEntities.map((entity, idx) => (
                        <span key={idx} className={`text-xs ${variant.color} font-medium`}>
                          {entity}{idx < variant.trustEntities.length - 1 ? " •" : ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Preview */}
                  <div className="mb-4 p-3 bg-background rounded-lg border text-center">
                    <span className="text-xs text-muted-foreground">CTA-Text:</span>
                    <div className="font-semibold text-foreground">{variant.ctaText}</div>
                  </div>

                  {/* Action */}
                  <Link to={variant.path} target="_blank">
                    <Button className="w-full" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      In neuem Tab öffnen
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Comparison Table */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Schnellvergleich</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto bg-card rounded-xl border">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-semibold">Aspekt</th>
                    <th className="p-4 text-center font-semibold text-red-600">V1</th>
                    <th className="p-4 text-center font-semibold text-primary">V2</th>
                    <th className="p-4 text-center font-semibold text-success">V3</th>
                    <th className="p-4 text-center font-semibold text-amber-600">V4</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-4 font-medium">Primärfarbe</td>
                    <td className="p-4 text-center">Rot (Schweiz)</td>
                    <td className="p-4 text-center">Blau (Corporate)</td>
                    <td className="p-4 text-center">Grün (Sicherheit)</td>
                    <td className="p-4 text-center">Blau+Gold</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Testimonials</td>
                    <td className="p-4 text-center">Keine</td>
                    <td className="p-4 text-center">1 Video</td>
                    <td className="p-4 text-center">3+ mit Fotos</td>
                    <td className="p-4 text-center">Interaktiv</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Trust-Position</td>
                    <td className="p-4 text-center">Unter H1</td>
                    <td className="p-4 text-center">Badge-Strip</td>
                    <td className="p-4 text-center">Über+Unter CTA</td>
                    <td className="p-4 text-center">Pills→Drawer</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Mobile Spezial</td>
                    <td className="p-4 text-center">Minimal</td>
                    <td className="p-4 text-center">Cards</td>
                    <td className="p-4 text-center">Carousel</td>
                    <td className="p-4 text-center">Bottom Sheet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Notes Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">A/B Test Notizen</h2>
            <div className="bg-card rounded-xl border p-6">
              <textarea
                className="w-full h-40 bg-muted/50 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Hier können Sie Notizen zu Ihren Beobachtungen machen..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Notizen werden lokal gespeichert und nicht an Server übertragen.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

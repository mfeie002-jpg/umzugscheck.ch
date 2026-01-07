import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Layers } from "lucide-react";

const FLOW_FAMILIES: Array<{ id: string; label: string; description: string; badge?: string }> = [
  { id: "gemini-top", label: "Gemini Top 🏆⭐", description: "Die besten 3 Flows nach Analyse.", badge: "Top" },
  { id: "swiss-premium", label: "Swiss Premium ⚡💎", description: "Premium-Flow-Komponenten (Swiss-first).", badge: "Premium" },
  { id: "chatgpt", label: "ChatGPT Optimized ⭐⭐", description: "3 optimierte Varianten für Conversion.", badge: "Premium" },
  { id: "v1", label: "V1 – Control", description: "Baseline / Referenz-Flow." },
  { id: "v2", label: "V2 – Premium", description: "Mehr Guidance & Optionen." },
  { id: "v3", label: "V3 – Mobile", description: "Mobile-first Eingabe." },
  { id: "v4", label: "V4 – Video-First", description: "Video/AI-first UX." },
  { id: "v5", label: "V5 – Marketplace", description: "Marktplatz & Anbieterlogik." },
  { id: "v6", label: "V6 – Ultimate", description: "6-Tier Kombi-Flow." },
  { id: "v7", label: "V7 – SwissMove", description: "Speed-optimiert (90s)." },
  { id: "v8", label: "V8 – Decision-Free", description: "Minimale Entscheidungen." },
  { id: "v9", label: "V9 – Zero Friction", description: "Frictionless Design." },
];

export default function FlowsIndex() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-6xl">
      <Helmet>
        <title>Flows Übersicht | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Übersicht aller Flow-Familien und Varianten." />
      </Helmet>

      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Flows</h1>
            <p className="text-muted-foreground">Wähle eine Flow-Familie, um alle Varianten zu sehen.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FLOW_FAMILIES.map((f) => (
          <Card key={f.id} className="hover:border-primary/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-3">
                <span className="truncate">{f.label}</span>
                {f.badge ? (
                  <Badge variant="secondary" className="shrink-0">
                    {f.badge}
                  </Badge>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground">{f.description}</p>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link to={`/flows/${f.id}`}>
                  Varianten öffnen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

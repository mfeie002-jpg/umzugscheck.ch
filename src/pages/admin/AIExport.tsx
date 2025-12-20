import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ExternalLink,
  BookOpen,
  Download,
  Zap,
  Search,
  Code,
  ArrowRight,
} from "lucide-react";
import { ChatGPTPromptCopier } from "@/components/admin/ChatGPTPromptCopier";

const AIExport = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              KI-Analyse & Export
            </h1>
            <p className="text-muted-foreground">
              Exportieren Sie Ihre Daten für ChatGPT, Claude und andere LLMs
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/kunden-onboarding">
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Onboarding-Anleitung
              </Button>
            </Link>
            <Link to="/admin/tools">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Ultimate Package
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Prompt Copier */}
        <ChatGPTPromptCopier />

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Schnelle UX/Conversion-Analyse für sofortige Insights. 
                Ideal für tägliche Checks.
              </p>
              <ul className="text-sm space-y-1">
                <li>• TOP 3 Conversion-Killer</li>
                <li>• Quick Wins diese Woche</li>
                <li>• Mobile UX Check</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Deep Audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Vollständige Funnel + SEO + Performance Analyse. 
                Für strategische Planung.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Conversion Funnel Analyse</li>
                <li>• SEO & Content Audit</li>
                <li>• Wettbewerbs-Vergleich</li>
                <li>• 90-Tage Roadmap</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-5 w-5 text-green-500" />
                Code Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Technische Code-Qualität Analyse. 
                Für Entwickler und technische Optimierung.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Performance Optimierung</li>
                <li>• TypeScript Best Practices</li>
                <li>• Security Audit</li>
                <li>• Code Refactoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Workflow */}
        <Card>
          <CardHeader>
            <CardTitle>Empfohlener Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { step: 1, title: "Package generieren", desc: "Ultimate Package im Tools-Tab erstellen", link: "/admin/tools" },
                { step: 2, title: "Prompt wählen", desc: "Quick, Deep oder Code Analyse" },
                { step: 3, title: "In LLM einfügen", desc: "ChatGPT, Claude oder Gemini öffnen" },
                { step: 4, title: "Ergebnisse umsetzen", desc: "Action Items priorisieren und implementieren" },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  {index < 3 && (
                    <ArrowRight className="absolute -right-2 top-6 w-4 h-4 text-muted-foreground hidden md:block" />
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-3">
                      {item.step}
                    </div>
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                    {item.link && (
                      <Link to={item.link}>
                        <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                          Öffnen →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Badge variant="secondary">Pro-Tipps</Badge>
              <ul className="text-sm space-y-2">
                <li>• Nutzen Sie <strong>GPT-4</strong> oder <strong>Claude</strong> für beste Ergebnisse</li>
                <li>• Kombinieren Sie die Public URL mit dem Prompt für vollständige Analyse</li>
                <li>• Führen Sie wöchentlich eine Quick Analysis durch, um Trends zu erkennen</li>
                <li>• Deep Audits alle 2-4 Wochen für strategische Planung</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AIExport;

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
  FileText,
  Camera,
  GitCompare,
  Eye,
  Shield,
} from "lucide-react";
import { ChatGPTPromptCopier } from "@/components/admin/ChatGPTPromptCopier";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";

const AIExport = () => {
  const { toast } = useToast();

  const downloadAnleitung = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>KI-Analyse Anleitung - Umzugscheck.ch</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; }
    h3 { color: #3b82f6; }
    .scenario { background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .step { background: #fff; border: 1px solid #e2e8f0; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .step-number { display: inline-block; width: 28px; height: 28px; background: #2563eb; color: white; border-radius: 50%; text-align: center; line-height: 28px; margin-right: 10px; font-weight: bold; }
    .output { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-top: 15px; }
    .tip { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .access-point { background: #f0f9ff; padding: 10px 15px; border-radius: 6px; margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
    th { background: #f1f5f9; }
    footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <h1>🤖 KI-Analyse Anleitung</h1>
  <p><strong>Umzugscheck.ch</strong> - Vollständige Step-by-Step Anleitung für alle 3 Analyse-Szenarien</p>
  
  <h2>📋 Übersicht der Analyse-Szenarien</h2>
  <table>
    <tr>
      <th>Szenario</th>
      <th>Dauer</th>
      <th>Zweck</th>
      <th>Ideal für</th>
    </tr>
    <tr>
      <td>🚀 Quick Analysis</td>
      <td>~2 Min</td>
      <td>Schnelle UX/Conversion-Checks</td>
      <td>Tägliche/Wöchentliche Checks</td>
    </tr>
    <tr>
      <td>🔍 Deep Audit</td>
      <td>~10 Min</td>
      <td>Vollständige Analyse</td>
      <td>Strategische Planung</td>
    </tr>
    <tr>
      <td>💻 Code Review</td>
      <td>~5 Min</td>
      <td>Code-Qualität</td>
      <td>Tech-Optimierung</td>
    </tr>
    <tr>
      <td>📸 Screenshot Analyse</td>
      <td>~3 Min</td>
      <td>Visuelles Review</td>
      <td>Design-Feedback</td>
    </tr>
    <tr>
      <td>🔄 Regression Report</td>
      <td>~3 Min</td>
      <td>Änderungs-Analyse</td>
      <td>Nach Updates</td>
    </tr>
    <tr>
      <td>🔎 SEO Deep Dive</td>
      <td>~8 Min</td>
      <td>Suchmaschinen-Optimierung</td>
      <td>SEO-Strategie</td>
    </tr>
    <tr>
      <td>♿ Accessibility Audit</td>
      <td>~5 Min</td>
      <td>WCAG-Konformität</td>
      <td>Barrierefreiheit</td>
    </tr>
  </table>

  <hr>

  <div class="scenario">
    <h2>🚀 Szenario 1: Quick Analysis (~2 Minuten)</h2>
    <p><strong>Ziel:</strong> Schnelle UX/Conversion-Probleme identifizieren</p>
    
    <div class="step"><span class="step-number">1</span> Gehe zu <strong>/admin/ai-export</strong> oder Admin Dashboard → "KI-Analyse & Export"</div>
    <div class="step"><span class="step-number">2</span> Wähle <strong>"Quick Analysis"</strong> aus dem Dropdown-Menü</div>
    <div class="step"><span class="step-number">3</span> Klicke auf <strong>"Prompt kopieren"</strong></div>
    <div class="step"><span class="step-number">4</span> Öffne <a href="https://chat.openai.com">ChatGPT</a> in einem neuen Tab</div>
    <div class="step"><span class="step-number">5</span> Füge den Prompt ein (Ctrl+V / Cmd+V)</div>
    <div class="step"><span class="step-number">6</span> Drücke Enter und warte auf die Analyse</div>
    
    <div class="output">
      <strong>📊 Erwartete Ergebnisse:</strong>
      <ul>
        <li>TOP 3 Conversion-Killer</li>
        <li>Quick Wins (diese Woche umsetzbar)</li>
        <li>Mobile UX Probleme</li>
        <li>Priorisierte Action Items mit Aufwand</li>
      </ul>
    </div>
  </div>

  <div class="scenario">
    <h2>🔍 Szenario 2: Deep Audit (~10 Minuten)</h2>
    <p><strong>Ziel:</strong> Vollständige Funnel + SEO + Performance + Wettbewerbs-Analyse</p>
    
    <div class="step"><span class="step-number">1</span> Gehe zu <strong>/admin/ai-export</strong></div>
    <div class="step"><span class="step-number">2</span> Wähle <strong>"Deep Audit"</strong> aus dem Dropdown-Menü</div>
    <div class="step"><span class="step-number">3</span> Klicke auf <strong>"Prompt kopieren"</strong></div>
    <div class="step"><span class="step-number">4</span> Öffne ChatGPT, Claude oder Gemini</div>
    <div class="step"><span class="step-number">5</span> Füge den Prompt ein</div>
    <div class="step"><span class="step-number">6</span> Optional: Füge auch die Public URL hinzu für vollständige Analyse</div>
    
    <div class="output">
      <strong>📊 Erwartete Ergebnisse:</strong>
      <ul>
        <li>Executive Summary (2-3 Sätze)</li>
        <li>ICE-priorisierte Findings (Impact, Confidence, Effort)</li>
        <li>Wettbewerbs-Vergleich (movu.ch, comparis.ch)</li>
        <li>90-Tage Roadmap (Quick Wins → Medium → Strategic)</li>
        <li>KPIs zum Tracken</li>
      </ul>
    </div>
  </div>

  <div class="scenario">
    <h2>💻 Szenario 3: Code Review (~5 Minuten)</h2>
    <p><strong>Ziel:</strong> Technische Code-Qualität und Performance optimieren</p>
    
    <div class="step"><span class="step-number">1</span> Gehe zu <strong>/admin/ai-export</strong></div>
    <div class="step"><span class="step-number">2</span> Wähle <strong>"Code Review"</strong> aus dem Dropdown-Menü</div>
    <div class="step"><span class="step-number">3</span> Klicke auf <strong>"Prompt kopieren"</strong></div>
    <div class="step"><span class="step-number">4</span> Öffne ChatGPT oder Claude</div>
    <div class="step"><span class="step-number">5</span> Füge den Prompt ein</div>
    <div class="step"><span class="step-number">6</span> Optional: Füge spezifischen Code-Abschnitt hinzu</div>
    
    <div class="output">
      <strong>📊 Erwartete Ergebnisse:</strong>
      <ul>
        <li>Critical Issues (Bugs, Security, Performance-Blocker)</li>
        <li>Code Smells & Refactoring-Kandidaten</li>
        <li>Performance-Optimierungen mit Impact</li>
        <li>Best Practices Empfehlungen</li>
        <li>Vorher/Nachher Code-Snippets für TOP 3 Issues</li>
      </ul>
    </div>
  </div>

  <hr>

  <h2>📍 Zugriffspunkte</h2>
  <div class="access-point">🏠 <strong>Admin Dashboard</strong> → "KI-Analyse & Export" Card</div>
  <div class="access-point">📋 <strong>Admin Sidebar</strong> → "KI-Analyse" Link</div>
  <div class="access-point">📚 <strong>Kunden-Onboarding</strong> → Schritt 4 (/kunden-onboarding)</div>
  <div class="access-point">🛠️ <strong>Tools-Seite</strong> → ChatGPT Prompt Section</div>

  <div class="tip">
    <h3>💡 Pro-Tipps</h3>
    <ul>
      <li>Nutze <strong>GPT-4</strong> oder <strong>Claude</strong> für beste Ergebnisse</li>
      <li>Kombiniere die Public URL mit dem Prompt für vollständige Analyse</li>
      <li>Führe wöchentlich eine Quick Analysis durch, um Trends zu erkennen</li>
      <li>Deep Audits alle 2-4 Wochen für strategische Planung</li>
      <li>Code Reviews vor grösseren Releases durchführen</li>
    </ul>
  </div>

  <footer>
    <p>📅 Erstellt am: ${new Date().toLocaleDateString('de-CH')}</p>
    <p>🔗 <strong>Umzugscheck.ch</strong> - Swiss Moving Comparison Platform</p>
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    saveAs(blob, `KI-Analyse-Anleitung_${new Date().toISOString().split('T')[0]}.doc`);
    
    toast({
      title: "✅ Anleitung heruntergeladen",
      description: "Die Word-Datei wurde erfolgreich erstellt",
    });
  };
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
          <div className="flex flex-wrap gap-2">
            <Button variant="default" className="gap-2" onClick={downloadAnleitung}>
              <FileText className="h-4 w-4" />
              Anleitung herunterladen
            </Button>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Schnelle UX/Conversion-Analyse (~2 Min)
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• TOP 3 Conversion-Killer</li>
                <li>• Quick Wins</li>
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
              <p className="text-sm text-muted-foreground mb-3">
                Vollständige Funnel + SEO Analyse
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Conversion Funnel</li>
                <li>• SEO & Content</li>
                <li>• 90-Tage Roadmap</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-500" />
                Screenshot Analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Visuelles Design & UX Review
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Visual Hierarchy</li>
                <li>• Above the Fold</li>
                <li>• Design Consistency</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-pink-500" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                WCAG-Konformität prüfen
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Perceivable</li>
                <li>• Operable</li>
                <li>• Screenreader-Ready</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Additional Cards Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-5 w-5 text-green-500" />
                Code Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Technische Code-Qualität
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Performance Optimierung</li>
                <li>• TypeScript Best Practices</li>
                <li>• Security Audit</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-orange-500" />
                Regression Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Visuelle Änderungen analysieren
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Änderungstypen erkennen</li>
                <li>• Impact-Bewertung</li>
                <li>• Baseline-Empfehlung</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                SEO Deep Dive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Suchmaschinen-Optimierung
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• On-Page SEO</li>
                <li>• Technical SEO</li>
                <li>• Local SEO (CH)</li>
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

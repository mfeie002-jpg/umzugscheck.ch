import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Camera, 
  Copy, 
  Download, 
  Play, 
  Eye,
  FileCode,
  Sparkles,
  CheckCircle,
  Loader2,
  ExternalLink,
  Image,
  FileText
} from "lucide-react";

interface FlowStep {
  step: number;
  name: string;
  description: string;
  screenshotUrl?: string;
  html?: string;
}

export function CalculatorFlowReview() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedSteps, setCapturedSteps] = useState<FlowStep[]>([]);
  const [selectedCalculator, setSelectedCalculator] = useState("umzugsrechner");
  const [customPrompt, setCustomPrompt] = useState("");

  const calculatorOptions = [
    { value: "umzugsofferten", label: "Umzugsofferten-Flow", path: "/" },
    { value: "reinigung", label: "Reinigungsrechner", path: "/reinigungsrechner" },
    { value: "entsorgung", label: "Entsorgungsrechner", path: "/entsorgungsrechner" },
    { value: "firmenumzug", label: "Firmenumzug-Rechner", path: "/firmenumzug-rechner" },
  ];

  const defaultPromptTemplate = `## Umzugsofferten Flow Analyse

Ich möchte den folgenden Calculator-Flow analysieren lassen:

**Calculator:** ${calculatorOptions.find(c => c.value === selectedCalculator)?.label}

### Flow Steps:
${capturedSteps.map(step => `
**Step ${step.step}: ${step.name}**
${step.description}
${step.html ? `\`\`\`html\n${step.html.substring(0, 2000)}...\n\`\`\`` : ''}
`).join('\n')}

### Analyse-Aufgaben:
1. **UX-Analyse:** Bewerte die Benutzerführung und Conversion-Optimierung
2. **Design-Feedback:** Identifiziere Verbesserungspotenziale im UI
3. **Fehleranalyse:** Finde potenzielle Usability-Probleme
4. **Conversion-Tipps:** Gib konkrete Empfehlungen zur Steigerung der Abschlussrate
5. **Mobile-Optimierung:** Bewerte die mobile Nutzererfahrung

### Gewünschte Ausgabe:
- Übersichtliche Zusammenfassung
- Priorisierte Verbesserungsvorschläge
- Konkrete Code-Snippets wo hilfreich

${customPrompt ? `### Zusätzliche Anweisungen:\n${customPrompt}` : ''}`;

  const captureStep = async (stepNumber: number, name: string, description: string) => {
    setIsCapturing(true);
    
    try {
      // Capture current page HTML (simplified - in real scenario would use edge function)
      const html = document.documentElement.outerHTML;
      
      const newStep: FlowStep = {
        step: stepNumber,
        name,
        description,
        html: html.substring(0, 5000), // Limit for demo
      };
      
      setCapturedSteps(prev => [...prev.filter(s => s.step !== stepNumber), newStep].sort((a, b) => a.step - b.step));
      toast.success(`Step ${stepNumber} erfasst`);
    } catch (error) {
      toast.error("Fehler beim Erfassen");
    } finally {
      setIsCapturing(false);
    }
  };

  const generateMockSteps = () => {
    const mockSteps: FlowStep[] = selectedCalculator === "umzugsofferten" ? [
      {
        step: 1,
        name: "Adressen eingeben",
        description: "User gibt Von-PLZ/Stadt und Nach-PLZ/Stadt ein. Validierung der PLZ, Autocomplete für Schweizer Städte. CTA: Weiter-Button.",
        html: `<div class="step-1-addresses">
  <h2>Wohin soll der Umzug gehen?</h2>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <Label>Von PLZ</Label>
      <Input placeholder="z.B. 8001" />
      <Label>Von Stadt</Label>
      <Input placeholder="Zürich" />
    </div>
    <div>
      <Label>Nach PLZ</Label>
      <Input placeholder="z.B. 3011" />
      <Label>Nach Stadt</Label>
      <Input placeholder="Bern" />
    </div>
  </div>
  <Button>Weiter</Button>
</div>`
      },
      {
        step: 2,
        name: "Wohnungsdetails & Datum",
        description: "Auswahl Wohnungsgrösse (1-6+ Zimmer), Umzugsdatum (Pflichtfeld), optionale Services wie Packen, Reinigung, Entsorgung mit Preisaufschlägen. Live-Preisberechnung wird angezeigt.",
        html: `<div class="step-2-details">
  <h2>Details zu Ihrem Umzug</h2>
  <Select>
    <option>1-Zimmer Wohnung</option>
    <option>2-Zimmer Wohnung</option>
    <option>3-Zimmer Wohnung</option>
    ...
  </Select>
  <DatePicker label="Umzugsdatum" required />
  <div class="services-checkboxes">
    <Checkbox>Packen (+15%)</Checkbox>
    <Checkbox>Endreinigung (+CHF 450)</Checkbox>
    <Checkbox>Entsorgung (+CHF 200)</Checkbox>
  </div>
  <PriceDisplay min="1200" max="1800" />
</div>`
      },
      {
        step: 3,
        name: "Firmenauswahl",
        description: "Anzeige passender Umzugsfirmen basierend auf Region und Services. Gesponserte Firmen oben, dann nach Quality-Score sortiert. Filter: Rating, Preis, Verfügbarkeit. User wählt 1-5 Firmen aus. Paket-Rabatt bei Buchung mehrerer Services.",
        html: `<div class="step-3-companies">
  <h2>Passende Umzugsfirmen</h2>
  <FilterBar>
    <SortSelect>Empfohlen | Beste Bewertung | Günstigste</SortSelect>
    <RatingFilter />
    <PriceFilter />
  </FilterBar>
  <div class="company-grid">
    <CompanyCard sponsored name="Premium Umzug AG" rating="4.9" price="ab CHF 1400" />
    <CompanyCard name="Züri-Move GmbH" rating="4.7" price="ab CHF 1200" verified />
    <CompanyCard name="SwissMove" rating="4.5" price="ab CHF 1100" />
  </div>
  <SelectedCount>2 Firmen ausgewählt</SelectedCount>
</div>`
      },
      {
        step: 4,
        name: "Optionen wählen",
        description: "3 Optionen: (A) Direkt anfragen - Kontakt mit ausgewählten Firmen, (B) Ausschreibung publizieren - Umzug wird öffentlich, Firmen können bieten, (C) Beides - Kombination. Jede Option mit Vor-/Nachteilen erklärt.",
        html: `<div class="step-4-options">
  <h2>Wie möchten Sie fortfahren?</h2>
  <SubmitOptionsCard>
    <Option value="direct" title="Direkt anfragen" 
      description="Die ausgewählten Firmen kontaktieren Sie direkt" 
      benefits="Schnell, persönlich, gezielt" />
    <Option value="publish" title="Ausschreibung publizieren" 
      description="Ihr Umzug wird veröffentlicht, Firmen können Gebote abgeben"
      benefits="Wettbewerb, möglicherweise günstiger" badge="Neu" />
    <Option value="both" title="Beides" 
      description="Kombination aus beidem"
      benefits="Maximale Chancen" recommended />
  </SubmitOptionsCard>
</div>`
      },
      {
        step: 5,
        name: "Kontaktdaten & Absenden",
        description: "Formular: Name, Email, Telefon (optional), Bemerkungen. Datenschutz-Checkbox. Submit-Button erstellt Lead in DB und optional public_move_listing für Bieter-System.",
        html: `<div class="step-5-submit">
  <h2>Fast geschafft!</h2>
  <form>
    <Input label="Name" required />
    <Input label="Email" type="email" required />
    <Input label="Telefon" optional />
    <Textarea label="Bemerkungen" />
    <Checkbox>Ich akzeptiere die Datenschutzerklärung</Checkbox>
    <Button type="submit" size="lg">Offerten erhalten</Button>
  </form>
  <TrustBadges>
    <Badge>Kostenlos</Badge>
    <Badge>Unverbindlich</Badge>
    <Badge>Schweizer Firmen</Badge>
  </TrustBadges>
</div>`
      },
    ] : [
      {
        step: 1,
        name: "Start",
        description: "Einstieg in den Rechner",
        html: `<div class="calculator-step-1"><h2>Start</h2></div>`
      },
      {
        step: 2,
        name: "Details",
        description: "Details eingeben",
        html: `<div class="calculator-step-2"><h2>Details</h2></div>`
      },
      {
        step: 3,
        name: "Ergebnis",
        description: "Preisanzeige und Firmenauswahl",
        html: `<div class="calculator-step-3"><h2>Ergebnis</h2></div>`
      },
    ];
    
    setCapturedSteps(mockSteps);
    toast.success("Umzugsofferten-Flow Steps geladen");
  };

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(defaultPromptTemplate);
    toast.success("Prompt kopiert! Füge ihn in ChatGPT/Claude ein.");
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([defaultPromptTemplate], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calculator-review-${selectedCalculator}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown heruntergeladen");
  };

  const downloadAsHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Calculator Flow Review - ${calculatorOptions.find(c => c.value === selectedCalculator)?.label}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 40px; background: #f8fafc; }
    h1 { color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; }
    h2 { color: #1e3a8a; margin-top: 30px; }
    .step { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .step-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .step-number { background: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .step-title { font-size: 1.25rem; font-weight: 600; color: #1e293b; }
    .step-description { color: #64748b; margin-bottom: 16px; }
    .code-block { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: 'Monaco', 'Menlo', monospace; font-size: 13px; }
    .meta { background: #dbeafe; padding: 16px; border-radius: 8px; margin-top: 30px; }
    .instructions { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0; }
  </style>
</head>
<body>
  <h1>🔍 Calculator Flow Review</h1>
  <p><strong>Calculator:</strong> ${calculatorOptions.find(c => c.value === selectedCalculator)?.label}</p>
  <p><strong>Erstellt:</strong> ${new Date().toLocaleString('de-CH')}</p>
  
  <div class="instructions">
    <h3>📋 Anleitung für ChatGPT/Claude</h3>
    <p>1. Öffne ChatGPT oder Claude</p>
    <p>2. Kopiere den Inhalt dieser Seite (Strg+A, Strg+C)</p>
    <p>3. Füge ihn ein und bitte um eine UX-Analyse</p>
  </div>

  <h2>Flow Steps</h2>
  ${capturedSteps.map(step => `
  <div class="step">
    <div class="step-header">
      <div class="step-number">${step.step}</div>
      <div class="step-title">${step.name}</div>
    </div>
    <p class="step-description">${step.description}</p>
    ${step.html ? `<pre class="code-block"><code>${step.html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>` : ''}
  </div>
  `).join('')}

  <div class="meta">
    <h3>🎯 Analyse-Fokus</h3>
    <ul>
      <li>UX/UI-Verbesserungen</li>
      <li>Conversion-Optimierung</li>
      <li>Mobile Experience</li>
      <li>Performance-Hinweise</li>
    </ul>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calculator-review-${selectedCalculator}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML heruntergeladen");
  };

  const openInNewTab = (path: string) => {
    window.open(path, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Calculator Flow für ChatGPT/Claude Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Erfasse Screenshots und HTML des Calculator-Flows, um sie von ChatGPT oder Claude analysieren zu lassen.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Calculator auswählen</label>
              <Select value={selectedCalculator} onValueChange={setSelectedCalculator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {calculatorOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button 
                variant="outline"
                onClick={() => openInNewTab(calculatorOptions.find(c => c.value === selectedCalculator)?.path || '/')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Calculator öffnen
              </Button>
              <Button onClick={generateMockSteps}>
                <Play className="w-4 h-4 mr-2" />
                Demo-Steps laden
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Captured Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Erfasste Steps ({capturedSteps.length})
            </span>
            {capturedSteps.length > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Bereit für Export
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {capturedSteps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Noch keine Steps erfasst</p>
              <p className="text-sm mt-1">Klicke "Demo-Steps laden" oder erfasse manuell</p>
            </div>
          ) : (
            <div className="space-y-4">
              {capturedSteps.map(step => (
                <div key={step.step} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-primary">{step.step}</Badge>
                    <span className="font-medium">{step.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                  {step.html && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-primary hover:underline flex items-center gap-1">
                        <FileCode className="w-3 h-3" />
                        HTML anzeigen
                      </summary>
                      <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-x-auto max-h-32">
                        {step.html.substring(0, 500)}...
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Zusätzliche Anweisungen (optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="z.B. 'Fokussiere dich besonders auf Mobile UX' oder 'Analysiere die CTA-Platzierung'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Preview & Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Prompt Preview & Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono">
              {defaultPromptTemplate}
            </pre>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={copyPromptToClipboard} className="flex-1 md:flex-none">
              <Copy className="w-4 h-4 mr-2" />
              Prompt kopieren
            </Button>
            <Button variant="outline" onClick={downloadAsMarkdown}>
              <Download className="w-4 h-4 mr-2" />
              Als Markdown
            </Button>
            <Button variant="outline" onClick={downloadAsHTML}>
              <FileCode className="w-4 h-4 mr-2" />
              Als HTML
            </Button>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => window.open('https://chat.openai.com', '_blank')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" className="w-4 h-4 mr-2" alt="" />
              In ChatGPT öffnen
            </Button>
            <Button 
              variant="secondary"
              className="flex-1"
              onClick={() => window.open('https://claude.ai', '_blank')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              In Claude öffnen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            💡 Tipps für beste Ergebnisse
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Verwende GPT-4 oder Claude 3 für detaillierte Analysen</li>
            <li>• Füge Screenshots hinzu für visuelle Analyse</li>
            <li>• Frage nach konkreten Code-Verbesserungen</li>
            <li>• Lass die Conversion-Rate schätzen und Optimierungen vorschlagen</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

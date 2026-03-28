import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Copy, 
  Check, 
  Sparkles,
  Code,
  Database,
  Palette,
  BookOpen,
  Zap,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const ChatGPTExport = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success('In Zwischenablage kopiert!');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  const handleDownload = async (filename: string) => {
    setDownloading(true);
    try {
      const response = await fetch(`/${filename}`);
      if (!response.ok) throw new Error('File not found');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${filename} heruntergeladen!`);
    } catch (err) {
      toast.error('Download fehlgeschlagen - Datei muss zuerst generiert werden');
    } finally {
      setDownloading(false);
    }
  };

  const quickPrompts = [
    {
      title: 'Design System verstehen',
      prompt: `Analysiere das Design System von Umzugscheck.ch basierend auf dem Export. 
Fokussiere auf:
1. Farbpalette und CSS Tokens
2. Typography Scale
3. Spacing System
4. Component Patterns

Gib mir eine strukturierte Übersicht.`,
    },
    {
      title: 'Neue Seite erstellen',
      prompt: `Erstelle eine neue Seite für Umzugscheck.ch basierend auf dem Design System.
Die Seite soll [BESCHREIBUNG EINFÜGEN].

Verwende:
- Die existierenden CSS Tokens (--primary, --background, etc.)
- Shadcn/ui Komponenten
- Mobile-first Responsive Design
- Deutsche Texte
- Klare CTAs`,
    },
    {
      title: 'Komponente verbessern',
      prompt: `Verbessere die [KOMPONENTE] von Umzugscheck.ch.
Basierend auf dem Export:
1. Analysiere die aktuelle Implementation
2. Identifiziere UX-Verbesserungen
3. Verbessere die Conversion-Rate
4. Stelle Mobile-Optimierung sicher

Behalte das Design System bei.`,
    },
    {
      title: 'Funnel optimieren',
      prompt: `Analysiere die Funnel-Struktur von Umzugscheck.ch.
Basierend auf den 9+ Varianten:
1. Welche Patterns funktionieren gut?
2. Wo sind Conversion-Barrieren?
3. Wie kann der Lead-Flow verbessert werden?

Gib konkrete Code-Vorschläge.`,
    },
  ];

  const projectContext = `# Umzugscheck.ch - Projekt Kontext für ChatGPT

## Überblick
Umzugscheck.ch ist die führende Schweizer Umzugs-Vergleichsplattform.

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Lovable Cloud)
- Framer Motion

## Wichtige Konventionen
1. **Design System**: Immer semantic tokens verwenden (--primary, --background)
2. **Sprache**: Deutsche Texte für Schweizer Markt
3. **Mobile-first**: Responsive Design priorisieren
4. **CTAs**: "Offerten erhalten" ist der Haupt-CTA

## Navigation (nicht ändern!)
- Preisrechner
- Umzugsfirmen  
- Services
- Regionen
- Ratgeber
- Für Firmen
- [CTA] Offerten erhalten

## Kernfunktionen
1. Preisrechner (Umzug, Reinigung, Entsorgung)
2. Firmen-Ranking (beste/günstige nach Region)
3. Lead-Generierung (9+ Funnel-Varianten)
4. Regionale Seiten (Zürich, Bern, Basel, etc.)

## Dateien für tiefere Analyse
- /public/chatgpt-full-export.txt (vollständiger Code)
- /public/chatgpt-export-summary.md (Zusammenfassung)
`;

  return (
    <>
      <Helmet>
        <title>ChatGPT Export | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Collaboration
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              ChatGPT Export & Integration
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Exportiere alles was ChatGPT braucht um effektiv mit dem Umzugscheck.ch 
              Projekt zu arbeiten. Design System, Komponenten, Dokumentation und mehr.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Vollständiger Export
                </CardTitle>
                <CardDescription>
                  Kompletter Code-Export mit Design System, Pages und Komponenten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleDownload('chatgpt-full-export.txt')}
                  disabled={downloading}
                  className="w-full"
                >
                  {downloading ? 'Lädt...' : 'chatgpt-full-export.txt herunterladen'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Zusammenfassung
                </CardTitle>
                <CardDescription>
                  Kompakte Übersicht für schnellen Kontext
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline"
                  onClick={() => handleDownload('chatgpt-export-summary.md')}
                  disabled={downloading}
                  className="w-full"
                >
                  {downloading ? 'Lädt...' : 'Summary herunterladen'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="context" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="context" className="gap-1">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Kontext</span>
              </TabsTrigger>
              <TabsTrigger value="prompts" className="gap-1">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Prompts</span>
              </TabsTrigger>
              <TabsTrigger value="exports" className="gap-1">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Exports</span>
              </TabsTrigger>
              <TabsTrigger value="guide" className="gap-1">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Anleitung</span>
              </TabsTrigger>
            </TabsList>

            {/* Context Tab */}
            <TabsContent value="context">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Projekt-Kontext für ChatGPT</CardTitle>
                      <CardDescription>
                        Kopiere diesen Text am Anfang deiner ChatGPT-Konversation
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(projectContext, 'context')}
                    >
                      {copiedSection === 'context' ? (
                        <><Check className="h-4 w-4 mr-1" /> Kopiert</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" /> Kopieren</>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                    {projectContext}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prompts Tab */}
            <TabsContent value="prompts">
              <div className="space-y-4">
                {quickPrompts.map((prompt, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{prompt.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(prompt.prompt, `prompt-${index}`)}
                        >
                          {copiedSection === `prompt-${index}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-3 rounded text-sm whitespace-pre-wrap text-muted-foreground">
                        {prompt.prompt}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Exports Tab */}
            <TabsContent value="exports">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Design System
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm font-mono">src/index.css</span>
                      <Badge variant="secondary">CSS Tokens</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm font-mono">tailwind.config.ts</span>
                      <Badge variant="secondary">Theme Config</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Komponenten
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-muted rounded">src/pages/</div>
                      <div className="p-2 bg-muted rounded">src/components/homepage/</div>
                      <div className="p-2 bg-muted rounded">src/components/layout/</div>
                      <div className="p-2 bg-muted rounded">src/components/ui/</div>
                      <div className="p-2 bg-muted rounded">src/components/flows/</div>
                      <div className="p-2 bg-muted rounded">src/components/calculator/</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Backend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-muted rounded">supabase/functions/</div>
                      <div className="p-2 bg-muted rounded">src/integrations/supabase/</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Guide Tab */}
            <TabsContent value="guide">
              <Card>
                <CardHeader>
                  <CardTitle>So nutzt du den Export mit ChatGPT</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Badge>1</Badge> Kontext setzen
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Kopiere den Projekt-Kontext aus dem "Kontext" Tab und füge ihn am Anfang 
                      deiner ChatGPT-Konversation ein.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Badge>2</Badge> Export hochladen
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Lade <code className="bg-muted px-1 rounded">chatgpt-full-export.txt</code> als 
                      Datei in ChatGPT hoch für detaillierte Code-Analyse.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Badge>3</Badge> Spezifische Fragen stellen
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Nutze die vorgefertigten Prompts oder stelle spezifische Fragen zu 
                      Komponenten, Design-Patterns oder Verbesserungen.
                    </p>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">💡 Pro-Tipp</h4>
                    <p className="text-sm text-muted-foreground">
                      Für beste Ergebnisse: Starte jede neue ChatGPT-Konversation mit dem 
                      Projekt-Kontext und lade den Export einmal pro Session hoch.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Generate Button */}
          <Card className="mt-8 border-dashed">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Die Export-Dateien werden automatisch beim Build generiert.<br />
                  Oder manuell mit:
                </p>
                <code className="bg-muted px-4 py-2 rounded-lg text-sm">
                  node scripts/generate-full-chatgpt-export.js
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ChatGPTExport;

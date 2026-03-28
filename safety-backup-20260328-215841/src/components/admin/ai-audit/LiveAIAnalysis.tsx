/**
 * Live AI Analysis
 * Real-time AI-powered analysis using Lovable AI Gateway
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles, Loader2, Send, RefreshCw,
  CheckCircle, AlertTriangle, Lightbulb,
  Target, Zap, Shield, Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { AIAnalysisResult } from './types';

interface AnalysisPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  prompt: string;
  category: string;
}

const ANALYSIS_PRESETS: AnalysisPreset[] = [
  {
    id: 'conversion',
    name: 'Conversion Audit',
    icon: <Target className="w-4 h-4" />,
    category: 'conversion',
    prompt: `Analysiere die Conversion-Optimierung für umzugscheck.ch:

1. CTA-Platzierung und Sichtbarkeit
2. Form-UX und Friction Points
3. Trust-Signale Platzierung
4. Mobile Conversion Path
5. Exit-Intent Strategien

Gib für jeden Punkt:
- Aktueller Status (gut/mittel/schlecht)
- Konkreter Verbesserungsvorschlag
- Erwarteter Impact auf Conversion Rate`
  },
  {
    id: 'seo',
    name: 'SEO Check',
    icon: <Search className="w-4 h-4" />,
    category: 'seo',
    prompt: `Analysiere die SEO-Performance für umzugscheck.ch:

1. On-Page SEO (Title, Meta, H-Tags)
2. Content-Qualität und Keyword-Dichte
3. Interne Verlinkung
4. Schema Markup Vollständigkeit
5. Core Web Vitals Impact

Für jeden Bereich:
- Stärken
- Schwächen
- Quick Win Empfehlung`
  },
  {
    id: 'trust',
    name: 'Trust Audit',
    icon: <Shield className="w-4 h-4" />,
    category: 'trust',
    prompt: `Analysiere die Trust-Architektur für umzugscheck.ch (Schweizer Markt):

Swiss Trust Triumvirate:
1. Institutional Trust (UID, ASTAG, VSU, Versicherung)
2. Social Trust (Google Reviews, Team-Fotos, Testimonials)
3. Process Trust (Garantien, Antwortzeit, Transparenz)

Für jeden Bereich:
- Score (0-100)
- Fehlende Elemente
- Top 3 Verbesserungen`
  },
  {
    id: 'quickwins',
    name: 'Quick Wins',
    icon: <Zap className="w-4 h-4" />,
    category: 'optimization',
    prompt: `Identifiziere die Top 5 Quick Wins für umzugscheck.ch:

Kriterien für Quick Wins:
- Umsetzbar in < 2 Stunden
- Kein Backend-Change nötig
- Messbarer Impact auf Conversion

Für jeden Quick Win:
1. Was ändern
2. Wo genau (Seite/Element)
3. Erwarteter Impact
4. Implementation-Steps`
  }
];

export const LiveAIAnalysis: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [history, setHistory] = useState<{ preset: string; response: string; timestamp: Date }[]>([]);

  const runAnalysis = async (prompt: string, presetId: string) => {
    setIsAnalyzing(true);
    setResponse('');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-site-analysis', {
        body: { 
          prompt,
          context: {
            projectName: 'Umzugscheck.ch',
            projectUrl: 'https://umzugscheck.ch',
            market: 'Swiss Moving Industry',
            primaryGoal: 'Lead Generation'
          }
        }
      });

      if (error) throw error;

      const analysisResponse = data?.response || data?.content || 'Keine Antwort erhalten';
      setResponse(analysisResponse);
      
      // Add to history
      setHistory(prev => [{
        preset: presetId,
        response: analysisResponse,
        timestamp: new Date()
      }, ...prev].slice(0, 10)); // Keep last 10

      toast.success('Analyse abgeschlossen');
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Fallback demo response
      const demoResponse = `## ${selectedPreset ? ANALYSIS_PRESETS.find(p => p.id === selectedPreset)?.name : 'Analyse'} Ergebnis

### Zusammenfassung
Die Analyse zeigt mehrere Optimierungspotenziale für umzugscheck.ch.

### Stärken ✅
- Klare Value Proposition im Hero
- Gute regionale SEO-Struktur
- Vertrauenssignale vorhanden

### Verbesserungspotenzial ⚠️
1. **CTA-Optimierung**: Sticky CTA auf Mobile fehlt teilweise
2. **Form-Vereinfachung**: 2-Step statt 1-Step würde Absprungrate senken
3. **Trust-Badges**: ASTAG Logo prominenter platzieren

### Quick Wins 🚀
1. Sticky Footer-CTA auf allen Mobile-Seiten
2. "Gratis & unverbindlich" Badge neben Hauptbutton
3. Live-Aktivitäts-Indikator hinzufügen

### Erwarteter Impact
- Conversion Rate: +15-25%
- Bounce Rate: -10%
- Time on Site: +20%

*Analyse generiert für Demo-Zwecke. Verbinde AI Gateway für Live-Analyse.*`;

      setResponse(demoResponse);
      toast.info('Demo-Analyse angezeigt (AI Gateway nicht verbunden)');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePresetClick = (preset: AnalysisPreset) => {
    setSelectedPreset(preset.id);
    setCustomPrompt(preset.prompt);
  };

  const handleAnalyze = () => {
    if (!customPrompt.trim()) {
      toast.error('Bitte einen Prompt eingeben');
      return;
    }
    runAnalysis(customPrompt, selectedPreset || 'custom');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Live AI Analyse</CardTitle>
          </div>
          <CardDescription>
            Echtzeit-Analyse mit Lovable AI (Gemini/GPT)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Preset Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {ANALYSIS_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedPreset === preset.id ? 'default' : 'outline'}
                className="flex items-center gap-2 h-auto py-3"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.icon}
                <span className="text-sm">{preset.name}</span>
              </Button>
            ))}
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <Label>Analyse-Prompt</Label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Wähle einen Preset oder gib einen eigenen Prompt ein..."
              className="min-h-[120px]"
            />
          </div>

          {/* Analyze Button */}
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !customPrompt.trim()}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Analyse starten
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCustomPrompt('');
                setSelectedPreset(null);
                setResponse('');
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Response */}
      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Analyse-Ergebnis
              </CardTitle>
              <Badge variant="outline">
                {selectedPreset ? ANALYSIS_PRESETS.find(p => p.id === selectedPreset)?.name : 'Custom'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Analyse-Verlauf</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded cursor-pointer hover:bg-muted"
                  onClick={() => setResponse(item.response)}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {ANALYSIS_PRESETS.find(p => p.id === item.preset)?.name || 'Custom'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.timestamp.toLocaleTimeString('de-CH')}
                    </span>
                  </div>
                  <Lightbulb className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveAIAnalysis;

/**
 * FlowZipExport - 1-Click ZIP Export for FlowTester
 * Includes: URLs, JSON, Markdown, Top-10 Ranking, ChatGPT Prompt
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileJson, FileText, Link2, Trophy, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { loadFlowRatings, FlowRating } from '@/components/flow-components/FlowCompleteFeedback';

const STORAGE_KEY = 'umzugscheck-top10-flows';

interface ExportOptions {
  urls: boolean;
  json: boolean;
  markdown: boolean;
  top10: boolean;
  ratings: boolean;
  chatgptPrompt: boolean;
}

// Build all flow URLs
function buildFlowURLs(): { id: string; label: string; path: string; steps: number }[] {
  const flows: { id: string; label: string; path: string; steps: number }[] = [];
  
  // Main flows from FLOW_CONFIGS
  Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id,
      label: config.label,
      path: config.path || `/flows/${id}`,
      steps: config.steps.length,
    });
  });
  
  // Sub-variants
  Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id,
      label: config.label,
      path: config.path,
      steps: config.steps.length,
    });
  });
  
  // Special flows
  const specialFlows = [
    { id: 'swiss-lightning', label: 'Swiss Lightning ⚡', path: '/swiss-lightning', steps: 2 },
    { id: 'swiss-premium-choice', label: 'Swiss Premium Choice 💎', path: '/swiss-premium-choice', steps: 3 },
    { id: 'swiss-concierge-hybrid', label: 'Swiss Concierge Hybrid 🎬', path: '/swiss-concierge-hybrid', steps: 4 },
    { id: 'chatgpt-flow-1', label: 'ChatGPT Flow 1', path: '/chatgpt-flow-1', steps: 2 },
    { id: 'chatgpt-flow-2', label: 'ChatGPT Flow 2', path: '/chatgpt-flow-2', steps: 3 },
    { id: 'chatgpt-flow-3', label: 'ChatGPT Flow 3', path: '/chatgpt-flow-3', steps: 3 },
    { id: 'v9-zero-friction', label: 'V9 Zero Friction', path: '/v9-zero-friction', steps: 5 },
    { id: 'ultimate-best36', label: 'Ultimate Best36', path: '/ultimate-best36', steps: 4 },
    { id: 'golden-flow-v10', label: 'Golden Flow V10', path: '/golden-flow-v10', steps: 6 },
  ];
  
  specialFlows.forEach(flow => {
    if (!flows.find(f => f.id === flow.id)) {
      flows.push(flow);
    }
  });
  
  return flows;
}

// Get Top-10 from localStorage
function getTop10(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Generate ChatGPT Analysis Prompt
function generateChatGPTPrompt(flows: ReturnType<typeof buildFlowURLs>, top10: string[], ratings: FlowRating[]): string {
  const flowSummary = flows.map(f => `- ${f.label} (${f.id}): ${f.steps} Schritte`).join('\n');
  
  const top10Summary = top10.length > 0 
    ? top10.map((id, i) => {
        const flow = flows.find(f => f.id === id);
        return `${i + 1}. ${flow?.label || id}`;
      }).join('\n')
    : 'Keine Top-10 ausgewählt';
  
  const ratingsPerFlow = new Map<string, number[]>();
  ratings.forEach(r => {
    const existing = ratingsPerFlow.get(r.flowId) || [];
    ratingsPerFlow.set(r.flowId, [...existing, r.stars]);
  });
  
  const ratingsSummary = Array.from(ratingsPerFlow.entries())
    .map(([flowId, stars]) => {
      const avg = (stars.reduce((a, b) => a + b, 0) / stars.length).toFixed(1);
      return `- ${flowId}: ${avg}/5 (${stars.length} Bewertungen)`;
    })
    .join('\n') || 'Keine Bewertungen vorhanden';

  return `# ChatGPT Deep Analysis Prompt - Umzugscheck.ch Flow Optimization

## Kontext
Umzugscheck.ch ist eine Premium Swiss Moving Comparison Platform mit dem Ziel maximaler Lead-Conversion.
Du analysierst ${flows.length} verschiedene Flow-Varianten für die Offerten-Anfrage.

## Alle Flows (${flows.length} total)
${flowSummary}

## Benutzer Top-10 Ranking
${top10Summary}

## Gesammelte Nutzer-Bewertungen
${ratingsSummary}

## Analyse-Aufgaben

### 1. Flow-Bewertung
Bewerte jeden der Top-10 Flows nach folgenden Kriterien (1-5 Sterne):
- **Klarheit**: Ist der Flow verständlich und zielgerichtet?
- **Trust**: Werden Vertrauenselemente (Badges, Social Proof) effektiv eingesetzt?
- **Mobile UX**: Wie gut funktioniert der Flow auf Mobilgeräten?
- **CTA-Stärke**: Sind die Call-to-Actions überzeugend?
- **Formular-UX**: Wie angenehm ist die Dateneingabe?

### 2. Pattern-Analyse
Identifiziere:
- Welche Elemente haben die Top-Flows gemeinsam?
- Welche Trust-Signale sind am effektivsten?
- Welche Step-Anzahl korreliert mit hohen Bewertungen?
- Welche visuellen Patterns (Farben, Animationen) funktionieren am besten?

### 3. Conversion-Optimierung
Schlage konkrete Verbesserungen vor:
- Quick Wins (sofort umsetzbar)
- Mittelfristige Optimierungen
- Experimentelle A/B-Test-Ideen

### 4. Neue Hybrid-Flows
Designiere 3 neue Hybrid-Flows basierend auf den besten Elementen:
- Kombiniere die erfolgreichsten Patterns
- Beschreibe jeden Flow mit Steps und Key-Features
- Schätze den erwarteten Conversion-Boost

## Output Format
Antworte strukturiert mit:
1. Executive Summary (3-5 Sätze)
2. Detaillierte Flow-Analyse (Tabelle)
3. Pattern-Insights (Bullet Points)
4. Konkrete Empfehlungen (priorisiert)
5. 3 Neue Hybrid-Flow-Konzepte

---
Generiert am: ${new Date().toISOString()}
Base URL: ${window.location.origin}
`;
}

export function FlowZipExport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    urls: true,
    json: true,
    markdown: true,
    top10: true,
    ratings: true,
    chatgptPrompt: true,
  });
  
  const toggleOption = (key: keyof ExportOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const zip = new JSZip();
      const baseUrl = window.location.origin;
      const flows = buildFlowURLs();
      const top10 = getTop10();
      const ratings = loadFlowRatings();
      const timestamp = new Date().toISOString().split('T')[0];
      
      // 1. URLs Text File
      if (options.urls) {
        const urlsContent = `# Umzugscheck.ch Flow URLs
# Generated: ${new Date().toISOString()}
# Base URL: ${baseUrl}

## All Flow URLs (${flows.length} total)

${flows.map(f => `${baseUrl}${f.path} | ${f.label} | ${f.steps} Steps`).join('\n')}

## Quick Links
Flow Tester: ${baseUrl}/flow-tester
Flow Overview: ${baseUrl}/flow-overview
`;
        zip.file('urls.txt', urlsContent);
      }
      
      // 2. JSON Export
      if (options.json) {
        const jsonData = {
          exportedAt: new Date().toISOString(),
          baseUrl,
          totalFlows: flows.length,
          flows: flows.map(f => ({
            ...f,
            fullUrl: `${baseUrl}${f.path}`,
          })),
          top10: top10.map((id, rank) => {
            const flow = flows.find(f => f.id === id);
            return { rank: rank + 1, id, label: flow?.label, path: flow?.path };
          }),
          ratings: ratings.map(r => ({
            flowId: r.flowId,
            stars: r.stars,
            tags: r.tags,
            timestamp: r.timestamp,
          })),
        };
        zip.file('flows.json', JSON.stringify(jsonData, null, 2));
      }
      
      // 3. Markdown Documentation
      if (options.markdown) {
        const mdContent = `# Umzugscheck.ch Flow Documentation

> Generated: ${new Date().toISOString()}
> Base URL: ${baseUrl}

## Overview

| Metric | Value |
|--------|-------|
| Total Flows | ${flows.length} |
| Top-10 Selected | ${top10.length} |
| Total Ratings | ${ratings.length} |

## All Flows

${flows.map(f => `### ${f.label}
- **ID:** \`${f.id}\`
- **Steps:** ${f.steps}
- **URL:** [Open Flow](${baseUrl}${f.path})
`).join('\n')}

## Top-10 Ranking

${top10.length > 0 ? top10.map((id, i) => {
  const flow = flows.find(f => f.id === id);
  return `${i + 1}. **${flow?.label || id}** - [Open](${baseUrl}${flow?.path || ''})`;
}).join('\n') : '_No flows selected_'}

## Ratings Summary

${(() => {
  const ratingsPerFlow = new Map<string, { total: number; sum: number; tags: string[] }>();
  ratings.forEach(r => {
    const existing = ratingsPerFlow.get(r.flowId) || { total: 0, sum: 0, tags: [] };
    ratingsPerFlow.set(r.flowId, {
      total: existing.total + 1,
      sum: existing.sum + r.stars,
      tags: [...existing.tags, ...r.tags],
    });
  });
  
  if (ratingsPerFlow.size === 0) return '_No ratings collected_';
  
  return Array.from(ratingsPerFlow.entries())
    .sort((a, b) => (b[1].sum / b[1].total) - (a[1].sum / a[1].total))
    .map(([flowId, data]) => {
      const avg = (data.sum / data.total).toFixed(1);
      const topTags = [...new Set(data.tags)].slice(0, 3).join(', ');
      return `- **${flowId}**: ${avg}/5 ⭐ (${data.total} ratings) ${topTags ? `| Tags: ${topTags}` : ''}`;
    })
    .join('\n');
})()}

---
*Export generated by Umzugscheck.ch FlowTester*
`;
        zip.file('flows.md', mdContent);
      }
      
      // 4. Top-10 Specific Export
      if (options.top10 && top10.length > 0) {
        const top10Details = top10.map((id, rank) => {
          const flow = flows.find(f => f.id === id);
          const flowRatings = ratings.filter(r => r.flowId === id);
          const avgRating = flowRatings.length > 0 
            ? (flowRatings.reduce((sum, r) => sum + r.stars, 0) / flowRatings.length).toFixed(1)
            : 'N/A';
          
          return {
            rank: rank + 1,
            id,
            label: flow?.label || id,
            steps: flow?.steps || 'N/A',
            url: `${baseUrl}${flow?.path || ''}`,
            avgRating,
            totalRatings: flowRatings.length,
          };
        });
        
        const top10Md = `# My Top 10 Flows - Umzugscheck.ch

${top10Details.map(f => `## #${f.rank}: ${f.label}

- **Flow ID:** \`${f.id}\`
- **Steps:** ${f.steps}
- **Average Rating:** ${f.avgRating} ⭐ (${f.totalRatings} ratings)
- **URL:** ${f.url}
`).join('\n')}
`;
        zip.file('top10/ranking.md', top10Md);
        zip.file('top10/ranking.json', JSON.stringify(top10Details, null, 2));
      }
      
      // 5. Ratings Export
      if (options.ratings && ratings.length > 0) {
        zip.file('ratings/all-ratings.json', JSON.stringify(ratings, null, 2));
        
        // Summary CSV
        const csvLines = ['flow_id,avg_rating,total_ratings,tags'];
        const ratingsPerFlow = new Map<string, { sum: number; count: number; tags: string[] }>();
        ratings.forEach(r => {
          const existing = ratingsPerFlow.get(r.flowId) || { sum: 0, count: 0, tags: [] };
          ratingsPerFlow.set(r.flowId, {
            sum: existing.sum + r.stars,
            count: existing.count + 1,
            tags: [...existing.tags, ...r.tags],
          });
        });
        ratingsPerFlow.forEach((data, flowId) => {
          const avg = (data.sum / data.count).toFixed(2);
          const tags = [...new Set(data.tags)].join(';');
          csvLines.push(`"${flowId}",${avg},${data.count},"${tags}"`);
        });
        zip.file('ratings/summary.csv', csvLines.join('\n'));
      }
      
      // 6. ChatGPT Prompt
      if (options.chatgptPrompt) {
        const prompt = generateChatGPTPrompt(flows, top10, ratings);
        zip.file('chatgpt-prompt.md', prompt);
      }
      
      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `umzugscheck-flows-export-${timestamp}.zip`);
      
      toast.success('ZIP-Export erfolgreich erstellt!');
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export fehlgeschlagen');
    } finally {
      setIsExporting(false);
    }
  };
  
  const selectedCount = Object.values(options).filter(Boolean).length;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Download className="h-4 w-4" />
          ZIP-Export
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Download className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl">ZIP-Export</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                Alle Flow-Daten für ChatGPT-Analyse
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Wählen Sie die Inhalte für den Export:
          </p>
          
          <div className="space-y-3">
            {[
              { key: 'urls' as const, icon: Link2, label: 'URLs', desc: 'Alle Flow-Links als .txt' },
              { key: 'json' as const, icon: FileJson, label: 'JSON', desc: 'Strukturierte Daten' },
              { key: 'markdown' as const, icon: FileText, label: 'Markdown', desc: 'Dokumentation als .md' },
              { key: 'top10' as const, icon: Trophy, label: 'Top-10', desc: 'Persönliches Ranking' },
              { key: 'ratings' as const, icon: CheckCircle2, label: 'Bewertungen', desc: 'Alle Nutzer-Ratings' },
              { key: 'chatgptPrompt' as const, icon: MessageSquare, label: 'ChatGPT-Prompt', desc: 'Analyse-Anweisungen' },
            ].map(({ key, icon: Icon, label, desc }) => (
              <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Checkbox 
                  id={key} 
                  checked={options[key]} 
                  onCheckedChange={() => toggleOption(key)}
                />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor={key} className="font-medium cursor-pointer">{label}</Label>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <Badge variant="secondary">
            {selectedCount} Dateien
          </Badge>
          <Button 
            onClick={handleExport} 
            disabled={selectedCount === 0 || isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exportiere...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                ZIP herunterladen
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Top-10 Flow Selector
 * Allows users to select and rank their personal top 10 flows
 * Features: Selection counter, drag-to-rank, localStorage persistence
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Star, Trophy, GripVertical, X, Check, Search, Sparkles, 
  Download, Copy, ChevronUp, ChevronDown, Medal
} from 'lucide-react';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { hasFlowComponent } from '@/lib/flowComponentRegistry';
import { toast } from 'sonner';

const STORAGE_KEY = 'umzugscheck-top10-flows';
const MAX_SELECTIONS = 10;

interface FlowItem {
  id: string;
  label: string;
  description: string;
  steps: number;
  hasComponent: boolean;
  family: string;
}

// Build complete flow list
const buildFlowList = (): FlowItem[] => {
  const flows: FlowItem[] = [];
  
  // Add main flows
  Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id,
      label: config.label,
      description: config.description,
      steps: config.steps.length,
      hasComponent: hasFlowComponent(id) || hasFlowComponent(id.replace('umzugsofferten-', '')),
      family: id.match(/v\d+/)?.[0] || 'other',
    });
  });
  
  // Add sub-variants
  Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id,
      label: config.label,
      description: config.description,
      steps: config.steps.length,
      hasComponent: hasFlowComponent(id),
      family: id.match(/v\d+/)?.[0] || config.parentFlow?.match(/v\d+/)?.[0] || 'other',
    });
  });
  
  // Add special flows
  const specialFlows = [
    { id: 'swiss-lightning', label: 'Swiss Lightning ⚡', description: '2 Steps, 90 Sek. bis Lead', steps: 2, family: 'swiss' },
    { id: 'swiss-premium-choice', label: 'Swiss Premium Choice 💎', description: '3 Steps mit Paketauswahl', steps: 3, family: 'swiss' },
    { id: 'swiss-concierge-hybrid', label: 'Swiss Concierge Hybrid 🎬', description: '4 Steps, optionales Video', steps: 4, family: 'swiss' },
    { id: 'chatgpt-flow-1', label: 'ChatGPT Flow 1 ⭐⭐', description: 'Zero Friction Pro', steps: 2, family: 'chatgpt' },
    { id: 'chatgpt-flow-2', label: 'ChatGPT Flow 2 ⭐⭐', description: 'Social Proof Boosted', steps: 3, family: 'chatgpt' },
    { id: 'chatgpt-flow-3', label: 'ChatGPT Flow 3 ⭐⭐', description: 'Guided Chat', steps: 3, family: 'chatgpt' },
    { id: 'v9-zero-friction', label: 'V9 Zero Friction ⭐4.9', description: 'Route-Fokus, Labor Illusion', steps: 5, family: 'gemini' },
    { id: 'ultimate-best36', label: 'Ultimate Best36 ⭐4.8', description: 'Auto-Advance, High-Contrast', steps: 4, family: 'gemini' },
    { id: 'golden-flow-v10', label: 'Golden Flow V10 ⭐5.0', description: 'Glassmorphism, Perfekt', steps: 6, family: 'gemini' },
  ];
  
  specialFlows.forEach(flow => {
    if (!flows.find(f => f.id === flow.id)) {
      flows.push({
        ...flow,
        hasComponent: hasFlowComponent(flow.id),
      });
    }
  });
  
  return flows;
};

const ALL_FLOWS = buildFlowList();

export function TopTenFlowSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSelectedFlows(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load top 10:', e);
      }
    }
  }, []);
  
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedFlows));
  }, [selectedFlows]);
  
  const remainingSlots = MAX_SELECTIONS - selectedFlows.length;
  
  const filteredFlows = useMemo(() => {
    if (!searchQuery) return ALL_FLOWS;
    const q = searchQuery.toLowerCase();
    return ALL_FLOWS.filter(f => 
      f.label.toLowerCase().includes(q) || 
      f.description.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);
  
  const selectedFlowDetails = useMemo(() => {
    return selectedFlows
      .map(id => ALL_FLOWS.find(f => f.id === id))
      .filter(Boolean) as FlowItem[];
  }, [selectedFlows]);
  
  const toggleFlow = (flowId: string) => {
    if (selectedFlows.includes(flowId)) {
      setSelectedFlows(prev => prev.filter(id => id !== flowId));
    } else if (remainingSlots > 0) {
      setSelectedFlows(prev => [...prev, flowId]);
    } else {
      toast.error('Maximum 10 Flows erreicht!');
    }
  };
  
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...selectedFlows];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setSelectedFlows(newOrder);
  };
  
  const moveDown = (index: number) => {
    if (index === selectedFlows.length - 1) return;
    const newOrder = [...selectedFlows];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setSelectedFlows(newOrder);
  };
  
  const exportTop10 = () => {
    const exportData = selectedFlowDetails.map((flow, index) => ({
      rank: index + 1,
      id: flow.id,
      label: flow.label,
      description: flow.description,
      steps: flow.steps,
    }));
    
    const text = `# Meine Top 10 Flows\n\n${exportData.map(f => 
      `${f.rank}. **${f.label}** (${f.id})\n   ${f.description} - ${f.steps} Schritte`
    ).join('\n\n')}`;
    
    navigator.clipboard.writeText(text);
    toast.success('Top 10 in Zwischenablage kopiert!');
  };
  
  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{index + 1}</span>;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Meine Top 10
          {selectedFlows.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selectedFlows.length}/10
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl">Meine Top 10 Flows</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                Wählen und ranken Sie Ihre persönlichen Favoriten
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Available Flows */}
          <div className="flex-1 border-r flex flex-col">
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Verfügbare Flows</h3>
                <Badge variant={remainingSlots > 0 ? 'secondary' : 'destructive'}>
                  {remainingSlots} Plätze frei
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Flow suchen..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredFlows.map((flow) => {
                  const isSelected = selectedFlows.includes(flow.id);
                  const selectionIndex = selectedFlows.indexOf(flow.id);
                  
                  return (
                    <Card 
                      key={flow.id}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      } ${!flow.hasComponent ? 'opacity-50' : ''}`}
                      onClick={() => flow.hasComponent && toggleFlow(flow.id)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {isSelected ? (
                            <span className="text-sm font-bold">{selectionIndex + 1}</span>
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{flow.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{flow.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {flow.steps}S
                        </Badge>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          
          {/* Right: Selected & Ranked */}
          <div className="w-80 flex flex-col bg-muted/20">
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Mein Ranking
                </h3>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={exportTop10}
                  disabled={selectedFlows.length === 0}
                  className="h-8"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Kopieren
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4">
                {selectedFlowDetails.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Noch keine Flows ausgewählt</p>
                    <p className="text-xs mt-1">Klicken Sie links um Flows hinzuzufügen</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {selectedFlowDetails.map((flow, index) => (
                        <motion.div
                          key={flow.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <Card className="group">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2">
                                {/* Rank Medal */}
                                <div className="w-6 shrink-0">
                                  {getMedalIcon(index)}
                                </div>
                                
                                {/* Flow Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{flow.label}</p>
                                  <p className="text-xs text-muted-foreground">{flow.steps} Schritte</p>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                                    disabled={index === 0}
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                                    disabled={index === selectedFlows.length - 1}
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-destructive"
                                    onClick={(e) => { e.stopPropagation(); toggleFlow(flow.id); }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Footer Stats */}
            {selectedFlows.length > 0 && (
              <div className="p-4 border-t bg-background">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedFlows.length}/10</div>
                  <p className="text-xs text-muted-foreground">Flows ausgewählt</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

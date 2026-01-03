/**
 * Landing Pages View - City/Canton Pages Management
 * Similar to DashboardView but for landing pages instead of flows
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Globe,
  Camera,
  Play,
  Loader2,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  Sparkles,
  Copy,
  ExternalLink,
  History,
  GitCompare,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Trash2,
  Edit,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { ScoreRing } from '../components';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface LandingPage {
  id: string;
  page_type: string;
  slug: string;
  url_path: string;
  display_name: string;
  canton_code: string | null;
  city_name: string | null;
  is_active: boolean;
  priority: number;
  tags: string[];
  custom_instructions: string | null;
  created_at: string;
  updated_at: string;
}

interface LandingPageVersion {
  id: string;
  landing_page_id: string;
  version_number: number;
  version_name: string | null;
  desktop_screenshot_url: string | null;
  mobile_screenshot_url: string | null;
  html_snapshot: string | null;
  rendered_html: string | null;
  markdown_content: string | null;
  meta_data: any;
  seo_issues: any;
  created_at: string;
  created_by: string | null;
}

interface LandingPageAnalysis {
  id: string;
  landing_page_id: string;
  version_id: string | null;
  run_type: string;
  status: string;
  overall_score: number;
  seo_score: number;
  mobile_score: number;
  performance_score: number;
  conversion_score: number;
  trust_score: number;
  ux_score: number;
  accessibility_score: number;
  ai_summary: string | null;
  ai_recommendations: any[];
  strengths: any[];
  quick_wins: any[];
  issues: any[];
  chatgpt_feedback: string | null;
  chatgpt_feedback_date: string | null;
  created_at: string;
  completed_at: string | null;
}

interface LandingPageWithData extends LandingPage {
  latestVersion: LandingPageVersion | null;
  latestAnalysis: LandingPageAnalysis | null;
  versionCount: number;
  analysisCount: number;
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function PageCard({ 
  page, 
  onCapture, 
  onAnalyze, 
  onViewDetails,
  onAddFeedback,
  isCapturing,
  isAnalyzing 
}: { 
  page: LandingPageWithData;
  onCapture: (page: LandingPage) => void;
  onAnalyze: (page: LandingPage) => void;
  onViewDetails: (page: LandingPage) => void;
  onAddFeedback: (page: LandingPage) => void;
  isCapturing: boolean;
  isAnalyzing: boolean;
}) {
  const score = page.latestAnalysis?.overall_score || 0;
  const hasScreenshot = !!page.latestVersion?.desktop_screenshot_url;
  
  return (
    <Card className="group hover:border-primary/50 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Screenshot Preview */}
          <div 
            className="w-24 h-16 rounded bg-muted flex-shrink-0 overflow-hidden cursor-pointer"
            onClick={() => onViewDetails(page)}
          >
            {hasScreenshot ? (
              <img 
                src={page.latestVersion!.desktop_screenshot_url!} 
                alt={page.display_name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Camera className="h-5 w-5" />
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 
                  className="font-semibold truncate cursor-pointer hover:text-primary"
                  onClick={() => onViewDetails(page)}
                >
                  {page.display_name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{page.url_path}</p>
              </div>
              
              {/* Score */}
              {score > 0 && (
                <ScoreRing score={score} size="sm" />
              )}
            </div>
            
            {/* Tags & Status */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {page.page_type}
              </Badge>
              {page.canton_code && (
                <Badge variant="secondary" className="text-xs">
                  {page.canton_code}
                </Badge>
              )}
              {page.latestAnalysis?.chatgpt_feedback && (
                <Badge variant="default" className="text-xs gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Feedback
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {page.versionCount} Versionen
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCapture(page)}
              disabled={isCapturing}
              title="Screenshot aufnehmen"
            >
              {isCapturing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAnalyze(page)}
              disabled={isAnalyzing}
              title="Analysieren"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAddFeedback(page)}
              title="ChatGPT Feedback hinzufügen"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(page)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Details anzeigen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`https://www.umzugscheck.ch${page.url_path}`, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Seite öffnen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <History className="h-4 w-4 mr-2" />
                  Versionen
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Vergleichen
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Exportieren
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AddPageDialog({ 
  open, 
  onOpenChange, 
  onAdd 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onAdd: (data: Partial<LandingPage>) => void;
}) {
  const [formData, setFormData] = useState({
    display_name: '',
    url_path: '',
    page_type: 'city',
    canton_code: '',
    city_name: '',
    custom_instructions: ''
  });
  
  const handleSubmit = () => {
    if (!formData.display_name || !formData.url_path) {
      toast.error('Name und URL-Pfad sind erforderlich');
      return;
    }
    
    onAdd({
      ...formData,
      slug: formData.url_path.replace(/\//g, '-').replace(/^-/, ''),
      priority: 0,
      is_active: true,
      tags: []
    });
    
    setFormData({
      display_name: '',
      url_path: '',
      page_type: 'city',
      canton_code: '',
      city_name: '',
      custom_instructions: ''
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Neue Landing Page hinzufügen</DialogTitle>
          <DialogDescription>
            Füge eine City/Canton Landing Page zur Analyse hinzu
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Anzeigename</Label>
            <Input 
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="z.B. Umzugsfirmen Zürich"
            />
          </div>
          
          <div className="space-y-2">
            <Label>URL-Pfad</Label>
            <Input 
              value={formData.url_path}
              onChange={(e) => setFormData(prev => ({ ...prev, url_path: e.target.value }))}
              placeholder="z.B. /umzugsfirmen/zuerich"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Typ</Label>
              <Select 
                value={formData.page_type} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, page_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="canton">Canton</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Kanton</Label>
              <Input 
                value={formData.canton_code}
                onChange={(e) => setFormData(prev => ({ ...prev, canton_code: e.target.value.toUpperCase() }))}
                placeholder="z.B. ZH"
                maxLength={2}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Zusätzliche AI-Anweisungen (optional)</Label>
            <Textarea 
              value={formData.custom_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, custom_instructions: e.target.value }))}
              placeholder="Spezielle Anweisungen für die AI-Analyse dieser Seite..."
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit}>
            Hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FeedbackDialog({
  open,
  onOpenChange,
  page,
  onSave
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: LandingPage | null;
  onSave: (pageId: string, feedback: string) => void;
}) {
  const [feedback, setFeedback] = useState('');
  
  useEffect(() => {
    setFeedback('');
  }, [page]);
  
  if (!page) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>ChatGPT Feedback hinzufügen</DialogTitle>
          <DialogDescription>
            Füge das Feedback von ChatGPT für "{page.display_name}" ein
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>ChatGPT Analyse / Feedback</Label>
            <Textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Füge hier das Feedback von ChatGPT ein..."
              rows={12}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="font-medium mb-1">💡 Tipp</p>
            <p className="text-muted-foreground">
              Kopiere den HTML/Markdown Export dieser Seite, füge ihn in ChatGPT ein mit dem Prompt 
              "Analysiere diese Seite für UX, SEO und Conversion", und paste das Ergebnis hier.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={() => {
            onSave(page.id, feedback);
            onOpenChange(false);
          }}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PageDetailPanel({
  page,
  onClose,
  onCapture,
  onAnalyze,
  isCapturing,
  isAnalyzing
}: {
  page: LandingPageWithData | null;
  onClose: () => void;
  onCapture: (page: LandingPage) => void;
  onAnalyze: (page: LandingPage) => void;
  isCapturing: boolean;
  isAnalyzing: boolean;
}) {
  const [versions, setVersions] = useState<LandingPageVersion[]>([]);
  const [analyses, setAnalyses] = useState<LandingPageAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (page) {
      loadVersions();
      loadAnalyses();
    }
  }, [page?.id]);
  
  const loadVersions = async () => {
    if (!page) return;
    const { data } = await supabase
      .from('landing_page_versions')
      .select('*')
      .eq('landing_page_id', page.id)
      .order('version_number', { ascending: false });
    if (data) setVersions(data as LandingPageVersion[]);
  };
  
  const loadAnalyses = async () => {
    if (!page) return;
    const { data } = await supabase
      .from('landing_page_analyses')
      .select('*')
      .eq('landing_page_id', page.id)
      .order('created_at', { ascending: false });
    if (data) setAnalyses(data as LandingPageAnalysis[]);
  };
  
  if (!page) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Wähle eine Landing Page aus</p>
        </div>
      </Card>
    );
  }
  
  const latestAnalysis = page.latestAnalysis;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {page.display_name}
              {latestAnalysis && latestAnalysis.overall_score >= 80 && (
                <Badge variant="default" className="bg-green-600">Top</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <code className="text-xs">{page.url_path}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => window.open(`https://www.umzugscheck.ch${page.url_path}`, '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCapture(page)}
              disabled={isCapturing}
            >
              {isCapturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 mr-1" />}
              Capture
            </Button>
            <Button
              size="sm"
              onClick={() => onAnalyze(page)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
              Analysieren
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
            <TabsTrigger value="versions">Versionen</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="overview" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  {/* Scores Grid */}
                  {latestAnalysis && (
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Overall', score: latestAnalysis.overall_score },
                        { label: 'SEO', score: latestAnalysis.seo_score },
                        { label: 'Mobile', score: latestAnalysis.mobile_score },
                        { label: 'Conversion', score: latestAnalysis.conversion_score },
                        { label: 'Trust', score: latestAnalysis.trust_score },
                        { label: 'UX', score: latestAnalysis.ux_score },
                        { label: 'Performance', score: latestAnalysis.performance_score },
                        { label: 'A11y', score: latestAnalysis.accessibility_score },
                      ].map((item) => (
                        <div key={item.label} className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className={cn(
                            "text-2xl font-bold",
                            item.score >= 80 ? "text-green-600" : item.score >= 60 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {item.score}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick Wins */}
                  {latestAnalysis?.quick_wins && latestAnalysis.quick_wins.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        Quick Wins
                      </h4>
                      <ul className="space-y-2">
                        {latestAnalysis.quick_wins.map((win: any, i: number) => {
                          // Handle both string and object formats
                          const winText = typeof win === 'string' 
                            ? win 
                            : (win?.title || win?.description || JSON.stringify(win));
                          const winImpact = typeof win === 'object' && win?.impact ? win.impact : null;
                          
                          return (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span>{winText}</span>
                                {winImpact && (
                                  <span className="ml-2 text-xs text-muted-foreground">({winImpact})</span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  
                  {/* AI Summary */}
                  {latestAnalysis?.ai_summary && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-medium mb-2">AI Zusammenfassung</h4>
                      <p className="text-sm text-muted-foreground">{latestAnalysis.ai_summary}</p>
                    </div>
                  )}
                  
                  {/* Meta Info */}
                  <div className="text-xs text-muted-foreground">
                    <p>Erstellt: {new Date(page.created_at).toLocaleString('de-CH')}</p>
                    <p>Aktualisiert: {new Date(page.updated_at).toLocaleString('de-CH')}</p>
                    {latestAnalysis && (
                      <p>Letzte Analyse: {new Date(latestAnalysis.created_at).toLocaleString('de-CH')}</p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="screenshots" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 gap-4 pr-4">
                  {page.latestVersion?.desktop_screenshot_url && (
                    <div>
                      <h4 className="font-medium mb-2">Desktop</h4>
                      <img 
                        src={page.latestVersion.desktop_screenshot_url} 
                        alt="Desktop Screenshot"
                        className="w-full rounded-lg border"
                      />
                    </div>
                  )}
                  {page.latestVersion?.mobile_screenshot_url && (
                    <div>
                      <h4 className="font-medium mb-2">Mobile</h4>
                      <img 
                        src={page.latestVersion.mobile_screenshot_url} 
                        alt="Mobile Screenshot"
                        className="w-full rounded-lg border"
                      />
                    </div>
                  )}
                  {!page.latestVersion?.desktop_screenshot_url && !page.latestVersion?.mobile_screenshot_url && (
                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                      <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Noch keine Screenshots vorhanden</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => onCapture(page)}
                        disabled={isCapturing}
                      >
                        Jetzt erfassen
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="analysis" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  {analyses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Noch keine Analysen vorhanden</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => onAnalyze(page)}
                        disabled={isAnalyzing}
                      >
                        Jetzt analysieren
                      </Button>
                    </div>
                  ) : (
                    analyses.map((analysis) => (
                      <Card key={analysis.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant={analysis.status === 'completed' ? 'default' : 'secondary'}>
                              {analysis.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(analysis.created_at).toLocaleString('de-CH')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{analysis.overall_score}</div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        </div>
                        {analysis.ai_summary && (
                          <p className="text-sm text-muted-foreground">{analysis.ai_summary}</p>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="versions" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-4">
                  {versions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Noch keine Versionen vorhanden</p>
                    </div>
                  ) : (
                    versions.map((version) => (
                      <Card key={version.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              Version {version.version_number}
                              {version.version_name && ` - ${version.version_name}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(version.created_at).toLocaleString('de-CH')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {version.desktop_screenshot_url && (
                              <Badge variant="outline" className="text-xs">Screenshot</Badge>
                            )}
                            {version.html_snapshot && (
                              <Badge variant="outline" className="text-xs">HTML</Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="feedback" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  {latestAnalysis?.chatgpt_feedback ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">ChatGPT Feedback</h4>
                        <span className="text-xs text-muted-foreground">
                          {latestAnalysis.chatgpt_feedback_date && 
                            new Date(latestAnalysis.chatgpt_feedback_date).toLocaleString('de-CH')
                          }
                        </span>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {latestAnalysis.chatgpt_feedback}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Noch kein ChatGPT Feedback vorhanden</p>
                      <p className="text-sm mt-2">
                        Exportiere die Seite, analysiere sie mit ChatGPT und füge das Feedback hier ein.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function LandingPagesView() {
  const [pages, setPages] = useState<LandingPageWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<LandingPageWithData | null>(null);
  const [capturingPageId, setCapturingPageId] = useState<string | null>(null);
  const [analyzingPageId, setAnalyzingPageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState<LandingPage | null>(null);

  // Load pages with related data
  const loadPages = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get all pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('landing_pages')
        .select('*')
        .order('priority', { ascending: false });

      if (pagesError) throw pagesError;

      // Get latest versions for each page
      const { data: versionsData } = await supabase
        .from('landing_page_versions')
        .select('*')
        .order('version_number', { ascending: false });

      // Get latest analyses for each page
      const { data: analysesData } = await supabase
        .from('landing_page_analyses')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      // Combine data
      const pagesWithData = (pagesData || []).map((page) => {
        const pageVersions = versionsData?.filter(v => v.landing_page_id === page.id) || [];
        const pageAnalyses = analysesData?.filter(a => a.landing_page_id === page.id) || [];
        
        return {
          ...page,
          latestVersion: (pageVersions[0] as LandingPageVersion | undefined) || null,
          latestAnalysis: (pageAnalyses[0] as LandingPageAnalysis | undefined) || null,
          versionCount: pageVersions.length,
          analysisCount: pageAnalyses.length,
        } as LandingPageWithData;
      });

      setPages(pagesWithData);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error('Fehler beim Laden der Landing Pages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Capture screenshot for a page
  const handleCapture = async (page: LandingPage) => {
    setCapturingPageId(page.id);
    try {
      const fullUrl = `https://www.umzugscheck.ch${page.url_path}`;
      
      // Use screenshotmachine API
      const { data, error } = await supabase.functions.invoke('capture-landing-page', {
        body: {
          pageId: page.id,
          url: fullUrl,
          captureDesktop: true,
          captureMobile: true
        }
      });

      if (error) throw error;
      
      toast.success(`Screenshot für ${page.display_name} erstellt`);
      await loadPages();
    } catch (error) {
      console.error('Capture error:', error);
      toast.error('Screenshot fehlgeschlagen');
    } finally {
      setCapturingPageId(null);
    }
  };

  // Analyze a page
  const handleAnalyze = async (page: LandingPage) => {
    setAnalyzingPageId(page.id);
    try {
      const fullUrl = `https://www.umzugscheck.ch${page.url_path}`;
      
      const { data, error } = await supabase.functions.invoke('analyze-landing-page', {
        body: {
          pageId: page.id,
          url: fullUrl,
          customInstructions: page.custom_instructions
        }
      });

      if (error) throw error;
      
      toast.success(`Analyse für ${page.display_name} abgeschlossen`);
      await loadPages();
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analyse fehlgeschlagen');
    } finally {
      setAnalyzingPageId(null);
    }
  };

  // Add new page
  const handleAddPage = async (pageData: Partial<LandingPage>) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .insert([{
          display_name: pageData.display_name!,
          url_path: pageData.url_path!,
          slug: pageData.slug!,
          page_type: pageData.page_type || 'city',
          canton_code: pageData.canton_code || null,
          city_name: pageData.city_name || null,
          custom_instructions: pageData.custom_instructions || null,
          priority: pageData.priority || 0,
          is_active: pageData.is_active ?? true,
          tags: pageData.tags || []
        }]);

      if (error) throw error;
      
      toast.success('Landing Page hinzugefügt');
      await loadPages();
    } catch (error) {
      console.error('Add page error:', error);
      toast.error('Fehler beim Hinzufügen');
    }
  };

  // Save feedback
  const handleSaveFeedback = async (pageId: string, feedback: string) => {
    try {
      // Get or create analysis record
      const { data: existingAnalysis } = await supabase
        .from('landing_page_analyses')
        .select('id')
        .eq('landing_page_id', pageId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingAnalysis) {
        await supabase
          .from('landing_page_analyses')
          .update({
            chatgpt_feedback: feedback,
            chatgpt_feedback_date: new Date().toISOString()
          })
          .eq('id', existingAnalysis.id);
      } else {
        await supabase
          .from('landing_page_analyses')
          .insert({
            landing_page_id: pageId,
            status: 'completed',
            chatgpt_feedback: feedback,
            chatgpt_feedback_date: new Date().toISOString()
          });
      }

      toast.success('Feedback gespeichert');
      await loadPages();
    } catch (error) {
      console.error('Save feedback error:', error);
      toast.error('Fehler beim Speichern');
    }
  };

  // Filtered pages
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch = !searchQuery || 
        page.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.url_path.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || page.page_type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [pages, searchQuery, filterType]);

  // Stats
  const stats = useMemo(() => {
    const analyzed = pages.filter(p => p.latestAnalysis).length;
    const avgScore = pages.reduce((acc, p) => acc + (p.latestAnalysis?.overall_score || 0), 0) / (analyzed || 1);
    const withFeedback = pages.filter(p => p.latestAnalysis?.chatgpt_feedback).length;
    
    return {
      total: pages.length,
      analyzed,
      avgScore: Math.round(avgScore),
      withFeedback,
      withScreenshots: pages.filter(p => p.latestVersion?.desktop_screenshot_url).length
    };
  }, [pages]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Landing Pages</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.analyzed}</div>
          <div className="text-sm text-muted-foreground">Analysiert</div>
        </Card>
        <Card className="p-4">
          <div className={cn(
            "text-2xl font-bold",
            stats.avgScore >= 80 ? "text-green-600" : stats.avgScore >= 60 ? "text-yellow-600" : "text-red-600"
          )}>
            {stats.avgScore}
          </div>
          <div className="text-sm text-muted-foreground">Ø Score</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.withScreenshots}</div>
          <div className="text-sm text-muted-foreground">Mit Screenshots</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.withFeedback}</div>
          <div className="text-sm text-muted-foreground">Mit Feedback</div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Suchen..."
            className="pl-9"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="city">City</SelectItem>
            <SelectItem value="canton">Canton</SelectItem>
            <SelectItem value="regional">Regional</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={loadPages} disabled={isLoading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Aktualisieren
        </Button>
        
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Seite hinzufügen
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pages List */}
        <div className="space-y-3">
          <h3 className="font-semibold">Pages ({filteredPages.length})</h3>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 pr-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Landing Pages gefunden</p>
                </div>
              ) : (
                filteredPages.map((page) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <PageCard
                      page={page}
                      onCapture={handleCapture}
                      onAnalyze={handleAnalyze}
                      onViewDetails={(p) => setSelectedPage(page)}
                      onAddFeedback={(p) => setFeedbackPage(p)}
                      isCapturing={capturingPageId === page.id}
                      isAnalyzing={analyzingPageId === page.id}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Detail Panel */}
        <PageDetailPanel
          page={selectedPage}
          onClose={() => setSelectedPage(null)}
          onCapture={handleCapture}
          onAnalyze={handleAnalyze}
          isCapturing={capturingPageId === selectedPage?.id}
          isAnalyzing={analyzingPageId === selectedPage?.id}
        />
      </div>

      {/* Dialogs */}
      <AddPageDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddPage}
      />
      
      <FeedbackDialog
        open={!!feedbackPage}
        onOpenChange={(open) => !open && setFeedbackPage(null)}
        page={feedbackPage}
        onSave={handleSaveFeedback}
      />
    </div>
  );
}

export default LandingPagesView;

/**
 * ARCHETYP COMMAND CENTER - Context Panel
 * 
 * Right panel: Shows details, versions, feedback for selected asset.
 * Actions: Screenshot, Analyze, Add Feedback
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Sparkles,
  MessageSquare,
  ExternalLink,
  Loader2,
  History,
  TrendingUp,
  Download,
  Copy,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { Asset, AssetVersion, AISource, AI_SOURCES } from './types';
import { FeedbackDialog } from './FeedbackDialog';

interface ContextPanelProps {
  asset: Asset | null;
  onAssetUpdate: () => void;
}

export function ContextPanel({ asset, onAssetUpdate }: ContextPanelProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [versions, setVersions] = useState<AssetVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<AssetVersion | null>(null);

  // Load versions when asset changes
  useEffect(() => {
    if (asset?.type === 'landing-page') {
      loadVersions(asset.id);
    } else {
      setVersions([]);
    }
  }, [asset?.id]);

  const loadVersions = async (assetId: string) => {
    setIsLoadingVersions(true);
    try {
      const { data } = await supabase
        .from('landing_page_versions')
        .select('*')
        .eq('landing_page_id', assetId)
        .order('version_number', { ascending: false });

      const mapped: AssetVersion[] = (data || []).map(v => ({
        id: v.id,
        assetId: v.landing_page_id,
        versionNumber: v.version_number,
        versionName: v.version_name,
        desktopScreenshot: v.desktop_screenshot_url,
        mobileScreenshot: v.mobile_screenshot_url,
        aiFeedback: v.ai_feedback,
        aiFeedbackSource: v.ai_feedback_source as AISource,
        aiFeedbackDate: v.ai_feedback_date,
        score: null, // Will be enhanced later
        createdAt: v.created_at,
      }));
      
      setVersions(mapped);
    } catch (err) {
      console.error('Failed to load versions:', err);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  // PUBLIC URL - this is the published URL without auth
  const PUBLIC_BASE_URL = 'https://umzugscheckv2.lovable.app';

  const handleCapture = async () => {
    if (!asset || asset.type !== 'landing-page') return;
    
    setIsCapturing(true);
    try {
      // Use PUBLIC URL (published, no auth required)
      const captureUrl = `${PUBLIC_BASE_URL}${asset.path}`;
      console.log('Capturing screenshot from PUBLIC URL:', captureUrl);
      
      const { data, error } = await supabase.functions.invoke('capture-landing-page', {
        body: { 
          pageId: asset.id,  // Fixed: was 'landingPageId'
          url: captureUrl    // Added: the actual URL to capture
        },
      });
      
      if (error) throw error;
      
      toast.success('Screenshot erstellt!');
      loadVersions(asset.id);
      onAssetUpdate();
    } catch (err: any) {
      toast.error('Fehler beim Screenshot: ' + (err.message || 'Unbekannt'));
    } finally {
      setIsCapturing(false);
    }
  };

  const handleAddFeedback = (version: AssetVersion) => {
    setSelectedVersion(version);
    setShowFeedbackDialog(true);
  };

  const handleSaveFeedback = async (feedback: string, source: AISource) => {
    if (!selectedVersion) return;
    
    try {
      const { error } = await supabase
        .from('landing_page_versions')
        .update({
          ai_feedback: feedback,
          ai_feedback_source: source,
          ai_feedback_date: new Date().toISOString(),
        })
        .eq('id', selectedVersion.id);
      
      if (error) throw error;
      
      toast.success('Feedback gespeichert!');
      setShowFeedbackDialog(false);
      loadVersions(asset!.id);
      onAssetUpdate();
    } catch (err: any) {
      toast.error('Fehler: ' + (err.message || 'Unbekannt'));
    }
  };

  // Empty state
  if (!asset) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-lg font-medium">Wähle ein Asset</p>
          <p className="text-sm">Flow oder Landing Page auswählen</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={asset.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{asset.name}</h2>
              {asset.score !== null && (
                <Badge 
                  variant={asset.score >= 80 ? 'default' : asset.score >= 60 ? 'secondary' : 'destructive'}
                >
                  {asset.score}/100
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{asset.path}</p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {asset.type === 'landing-page' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCapture}
                  disabled={isCapturing}
                >
                  {isCapturing ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 mr-1" />
                  )}
                  Screenshot
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`https://umzugscheck.ch${asset.path}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Öffnen
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Versions (for Landing Pages) */}
          {asset.type === 'landing-page' && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <History className="h-4 w-4" />
                Versionen ({versions.length})
              </h3>
              
              {isLoadingVersions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : versions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Keine Versionen vorhanden</p>
                    <p className="text-xs mt-1">Erstelle einen Screenshot um zu starten</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {versions.map((version) => (
                    <VersionCard
                      key={version.id}
                      version={version}
                      onAddFeedback={() => handleAddFeedback(version)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Flow specific content */}
          {asset.type === 'flow' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Flow Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Score: {asset.score !== null ? `${asset.score}/100` : 'Nicht analysiert'}
                </p>
                {asset.lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Letzte Analyse: {new Date(asset.lastUpdated).toLocaleString('de-CH')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        version={selectedVersion}
        onSave={handleSaveFeedback}
      />
    </motion.div>
  );
}

function VersionCard({ 
  version, 
  onAddFeedback 
}: { 
  version: AssetVersion;
  onAddFeedback: () => void;
}) {
  const [showFullFeedback, setShowFullFeedback] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        {/* Screenshots */}
        <div className="flex gap-1 p-2 bg-muted/30">
          {version.desktopScreenshot && (
            <div className="w-24 h-16 rounded overflow-hidden bg-muted">
              <img 
                src={version.desktopScreenshot} 
                alt="Desktop" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}
          {version.mobileScreenshot && (
            <div className="w-8 h-16 rounded overflow-hidden bg-muted">
              <img 
                src={version.mobileScreenshot} 
                alt="Mobile" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  Version {version.versionNumber}
                </span>
                {version.aiFeedback && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {version.aiFeedbackSource === 'chatgpt' ? '🤖' : 
                     version.aiFeedbackSource === 'gemini' ? '✨' :
                     version.aiFeedbackSource === 'claude' ? '🧠' : '💬'}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(version.createdAt).toLocaleString('de-CH')}
              </p>
            </div>
            
            <Button size="sm" variant="ghost" onClick={onAddFeedback}>
              <MessageSquare className="h-4 w-4 mr-1" />
              {version.aiFeedback ? 'Bearbeiten' : 'Feedback'}
            </Button>
          </div>
          
          {/* Feedback preview */}
          {version.aiFeedback && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p className={cn('line-clamp-2', showFullFeedback && 'line-clamp-none')}>
                {version.aiFeedback}
              </p>
              {version.aiFeedback.length > 150 && (
                <button 
                  onClick={() => setShowFullFeedback(!showFullFeedback)}
                  className="text-primary hover:underline mt-1"
                >
                  {showFullFeedback ? 'Weniger' : 'Mehr'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

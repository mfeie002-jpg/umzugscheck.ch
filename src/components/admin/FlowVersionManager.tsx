import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { useBackgroundScreenshotJob } from "@/hooks/useBackgroundScreenshotJob";
import { SUB_VARIANT_CONFIGS, FLOW_CONFIGS } from "@/data/flowConfigs";
import { SITE_CONFIG } from "@/data/constants";
import { 
  Save, 
  GitCompare, 
  History, 
  Plus, 
  Trash2, 
  Star, 
  Play, 
  MessageSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Camera,
  Loader2,
  CloudUpload,
  Download,
  Layers,
  CheckSquare
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Helper to ensure proper URL/data URL format for screenshots
const toPngDataUrl = (value: string) => {
  // If it's already a data URL, use as-is
  if (value.startsWith("data:")) return value;
  // If it's an HTTP(S) URL (e.g., Supabase Storage), use as-is
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  // Otherwise, treat as base64 and add data URL prefix
  return `data:image/png;base64,${value}`;
};

// Extract flow major version from the flowId used in admin tools.
// Examples:
// - "umzugsofferten" -> 1
// - "umzugsofferten-v3" -> 3
const getFlowMajorFromFlowId = (flowId: string): number | null => {
  if (flowId === "umzugsofferten") return 1;
  const match = flowId.match(/-v(\d+)/i);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
};

const parseMinorFromVersionNumber = (raw: string): number | null => {
  const cleaned = String(raw).trim().replace(/^v/i, "");
  const parts = cleaned.split(".");
  const minorRaw = parts.length > 1 ? parts[1] : parts[0];
  const n = Number.parseInt(minorRaw, 10);
  return Number.isFinite(n) ? n : null;
};

interface FlowVersion {
  id: string;
  flow_id: string;
  flow_code: string | null;
  version_number: string;
  version_name: string | null;
  description: string | null;
  created_at: string;
  step_configs: Json;
  screenshots: Json;
  html_snapshots: Json;
  ai_feedback: string | null;
  ai_feedback_source: string | null;
  ai_feedback_date: string | null;
  is_baseline: boolean;
  is_live: boolean;
  tags: string[];
}

interface FlowStep {
  step: number;
  name: string;
  description: string;
  screenshotDesktop?: string;
  screenshotMobile?: string;
  html?: string;
  url?: string;
}

interface FlowVersionManagerProps {
  flowId: string;
  currentSteps: FlowStep[];
  onVersionSelect?: (version: FlowVersion) => void;
  variantConfig?: {
    id: string;
    label: string;
    path: string;
    steps: { step: number; name: string; description: string }[];
    description: string;
    component?: string;
  } | null;
}

export function FlowVersionManager({ flowId, currentSteps, onVersionSelect, variantConfig }: FlowVersionManagerProps) {
  const [versions, setVersions] = useState<FlowVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [newVersionNumber, setNewVersionNumber] = useState("");
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionDescription, setNewVersionDescription] = useState("");
  const [selectedVersionA, setSelectedVersionA] = useState<FlowVersion | null>(null);
  const [selectedVersionB, setSelectedVersionB] = useState<FlowVersion | null>(null);
  const [compareStep, setCompareStep] = useState(1);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedVersionForFeedback, setSelectedVersionForFeedback] = useState<FlowVersion | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSource, setFeedbackSource] = useState("chatgpt");
  const [updateScreenshotsDialogOpen, setUpdateScreenshotsDialogOpen] = useState(false);
  const [selectedVersionForScreenshots, setSelectedVersionForScreenshots] = useState<FlowVersion | null>(null);
  const [isUpdatingScreenshots, setIsUpdatingScreenshots] = useState(false);
  const [backgroundScreenshotDialogOpen, setBackgroundScreenshotDialogOpen] = useState(false);
  const [selectedVersionForBackgroundScreenshots, setSelectedVersionForBackgroundScreenshots] = useState<FlowVersion | null>(null);
  const [autoRefreshedJobId, setAutoRefreshedJobId] = useState<string | null>(null);
  const { activeJob, isPolling, startJob, clearJob, checkPendingJobs } = useBackgroundScreenshotJob();
  
  // Batch screenshot state
  const [batchScreenshotDialogOpen, setBatchScreenshotDialogOpen] = useState(false);
  const [selectedVersionsForBatch, setSelectedVersionsForBatch] = useState<Set<string>>(new Set());
  const [batchQueue, setBatchQueue] = useState<FlowVersion[]>([]);
  const [batchCurrentIndex, setBatchCurrentIndex] = useState(0);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [flowId]);

  // If the dialog is opened (or after reload), try to resume any running screenshot job for this version
  useEffect(() => {
    if (backgroundScreenshotDialogOpen && selectedVersionForBackgroundScreenshots?.id) {
      checkPendingJobs(selectedVersionForBackgroundScreenshots.id);
    }
  }, [backgroundScreenshotDialogOpen, selectedVersionForBackgroundScreenshots?.id, checkPendingJobs]);

  // When a background job completes, auto-refresh versions so screenshots show up even if the dialog was closed.
  useEffect(() => {
    if (!activeJob || activeJob.status !== "completed") return;
    if (autoRefreshedJobId === activeJob.id) return;

    fetchVersions();
    setAutoRefreshedJobId(activeJob.id);
  }, [activeJob, autoRefreshedJobId]);

  // Handle batch job progression
  useEffect(() => {
    if (!isBatchRunning || !activeJob) return;
    
    if (activeJob.status === 'completed') {
      // Move to next version in batch
      const nextIndex = batchCurrentIndex + 1;
      if (nextIndex < batchQueue.length) {
        setBatchCurrentIndex(nextIndex);
        clearJob();
        // Start next job after a short delay
        setTimeout(() => {
          startBatchJob(batchQueue[nextIndex], nextIndex, batchQueue.length);
        }, 1000);
      } else {
        // Batch complete
        setBatchCurrentIndex(nextIndex);
        toast.success(`Alle ${batchQueue.length} Versionen erfolgreich erfasst!`);
      }
    } else if (activeJob.status === 'failed') {
      toast.error(`Fehler bei Version ${batchCurrentIndex + 1}: ${activeJob.error}`);
    }
  }, [activeJob?.status, isBatchRunning, batchCurrentIndex, batchQueue]);

  // Start a single batch job for a version
  const startBatchJob = async (version: FlowVersion, index: number, total: number) => {
    const dbStepConfigs = version.step_configs as Array<{ step: number; name: string; description?: string; url?: string }> | null;
    
    if (!dbStepConfigs || dbStepConfigs.length === 0) {
      toast.error(`Version ${formatVersion(version.version_number)}: Keine Step-Konfiguration`);
      return;
    }
    
    const isPreviewHost = window.location.hostname.includes('lovable.app') || 
                          window.location.hostname.includes('lovableproject.com');
    const publicBase = isPreviewHost ? SITE_CONFIG.url : window.location.origin;
    
    let baseUrl = `${publicBase}/umzugsofferten`;
    const firstStepUrl = dbStepConfigs[0]?.url;
    if (firstStepUrl) {
      try {
        const parsedUrl = new URL(firstStepUrl);
        const variant = parsedUrl.searchParams.get('variant');
        if (variant) {
          baseUrl = `${publicBase}/umzugsofferten?variant=${variant}`;
        }
      } catch (e) {
        // ignore
      }
    } else if (version.flow_code) {
      const variant = version.flow_code.toLowerCase().replace('.', '');
      baseUrl = `${publicBase}/umzugsofferten?variant=${variant}`;
    }
    
    await startJob({
      versionId: version.id,
      flowId: version.flow_id,
      steps: dbStepConfigs,
      baseUrl,
    });
  };

  const flowMajor = getFlowMajorFromFlowId(flowId);

  const formatVersion = (raw?: string | null): string => {
    if (!raw) return "";
    const cleaned = String(raw).trim().replace(/^v/i, "");
    const parts = cleaned.split(".");
    // if stored like "1.5" -> minor=5; if stored like "5" -> minor=5
    const minor = parts.length > 1 ? parts[1] : parts[0];

    // In the Admin Flow tools, we want the major version to follow the selected flow (V1..V9)
    // so comparisons don't accidentally show v1.x while reviewing V3.
    if (flowMajor !== null) return `v${flowMajor}.${minor}`;
    return `v${cleaned}`;
  };

  // Build alternative flow_id patterns to query
  // E.g., for "umzugsofferten-v9" also include "v9a", "v9b", "V9.a", etc.
  const getFlowIdPatterns = useCallback((baseFlowId: string): string[] => {
    const patterns: string[] = [baseFlowId];

    // Extract major version number
    const match = baseFlowId.match(/v(\d+)/i);
    if (match) {
      const majorVersion = match[1];
      // Add patterns for sub-variants
      const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
      letters.forEach((letter) => {
        patterns.push(`v${majorVersion}${letter}`);
        patterns.push(`V${majorVersion}.${letter}`);
      });
    }

    return patterns;
  }, []);

  async function fetchVersions() {
    try {
      const patterns = getFlowIdPatterns(flowId);

      const { data, error } = await supabase
        .from("flow_versions")
        .select("*")
        .in("flow_id", patterns)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (err) {
      console.error("Failed to fetch versions:", err);
      toast.error("Versionen konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  }

  const suggestNextVersion = (): string => {
    // If we're inside a specific V1..V9 flow in the admin tools, always suggest that major.
    if (flowMajor !== null) {
      const minors = versions
        .map((v) => parseMinorFromVersionNumber(v.version_number))
        .filter((n): n is number => n !== null);

      const nextMinor = (minors.length ? Math.max(...minors) : 0) + 1;
      let candidate = `${flowMajor}.${nextMinor}`;
      const existingVersions = new Set(versions.map((v) => v.version_number));
      // Ensure uniqueness (in case user mixed formats)
      while (existingVersions.has(candidate) || existingVersions.has(`v${candidate}`)) {
        const minor = (parseMinorFromVersionNumber(candidate) ?? nextMinor) + 1;
        candidate = `${flowMajor}.${minor}`;
      }
      return candidate;
    }

    if (versions.length === 0) return "1.0";

    // Find the highest version number and increment
    const versionNumbers = versions.map((v) => {
      const parts = v.version_number.split('.');
      const major = parseInt(parts[0]) || 1;
      const minor = parseInt(parts[1]) || 0;
      return { major, minor, raw: v.version_number };
    });

    // Sort by major then minor descending
    versionNumbers.sort((a, b) => {
      if (a.major !== b.major) return b.major - a.major;
      return b.minor - a.minor;
    });

    const highest = versionNumbers[0];
    let nextMajor = highest.major;
    let nextMinor = highest.minor + 1;

    // Check if this version already exists, if so increment until unique
    let candidate = `${nextMajor}.${nextMinor}`;
    const existingVersions = new Set(versions.map((v) => v.version_number));

    while (existingVersions.has(candidate)) {
      nextMinor++;
      candidate = `${nextMajor}.${nextMinor}`;
    }

    return candidate;
  };

  const saveVersion = async () => {
    if (!newVersionNumber.trim()) {
      toast.error('Versionsnummer erforderlich');
      return;
    }

    try {
      // Convert current steps to storage format
      const screenshots: Record<string, string> = {};
      const htmlSnapshots: Record<string, string> = {};
      
      currentSteps.forEach((step) => {
        if (step.screenshotDesktop) {
          screenshots[`step${step.step}Desktop`] = step.screenshotDesktop;
        }
        if (step.screenshotMobile) {
          screenshots[`step${step.step}Mobile`] = step.screenshotMobile;
        }
        if (step.html) {
          htmlSnapshots[`step${step.step}`] = step.html;
        }
      });

      // Build config that includes variant info if available
      const configData = variantConfig ? {
        variantId: variantConfig.id,
        variantLabel: variantConfig.label,
        variantPath: variantConfig.path,
        variantDescription: variantConfig.description,
        variantComponent: variantConfig.component,
        variantSteps: variantConfig.steps,
        isCodedVariant: !!variantConfig.component,
      } : null;

      // Check if version already exists
      const { data: existingVersion } = await supabase
        .from('flow_versions')
        .select('id')
        .eq('flow_id', flowId)
        .eq('version_number', newVersionNumber.trim())
        .maybeSingle();

      const versionPayload = {
        flow_id: flowId,
        version_number: newVersionNumber.trim(),
        version_name: newVersionName.trim() || (variantConfig?.label || null),
        description: newVersionDescription.trim() || (variantConfig?.description || null),
        step_configs: variantConfig?.steps || currentSteps.map(s => ({
          step: s.step,
          name: s.name,
          description: s.description,
          url: s.url
        })),
        screenshots,
        html_snapshots: htmlSnapshots,
        is_baseline: versions.length === 0,
        config: configData,
      };

      let error;
      if (existingVersion?.id) {
        // Update existing version
        const result = await supabase
          .from('flow_versions')
          .update(versionPayload)
          .eq('id', existingVersion.id);
        error = result.error;
      } else {
        // Insert new version
        const result = await supabase
          .from('flow_versions')
          .insert(versionPayload);
        error = result.error;
      }

      if (error) throw error;

      toast.success(`Version ${newVersionNumber} gespeichert${variantConfig ? ` (${variantConfig.label})` : ''}`);
      setSaveDialogOpen(false);
      setNewVersionNumber("");
      setNewVersionName("");
      setNewVersionDescription("");
      fetchVersions();
    } catch (err) {
      console.error('Failed to save version:', err);
      toast.error('Version konnte nicht gespeichert werden');
    }
  };

  // Update screenshots for an existing version
  const updateVersionScreenshots = async () => {
    if (!selectedVersionForScreenshots) return;
    
    const hasScreenshots = currentSteps.some(s => s.screenshotDesktop || s.screenshotMobile);
    if (!hasScreenshots) {
      toast.error("Keine Screenshots vorhanden. Erfasse zuerst Screenshots.");
      return;
    }
    
    setIsUpdatingScreenshots(true);
    try {
      // Convert current steps to storage format
      const screenshots: Record<string, string> = {};
      const htmlSnapshots: Record<string, string> = {};
      
      currentSteps.forEach((step) => {
        if (step.screenshotDesktop) {
          screenshots[`step${step.step}Desktop`] = step.screenshotDesktop;
        }
        if (step.screenshotMobile) {
          screenshots[`step${step.step}Mobile`] = step.screenshotMobile;
        }
        if (step.html) {
          htmlSnapshots[`step${step.step}`] = step.html;
        }
      });

      const { error } = await supabase
        .from('flow_versions')
        .update({
          screenshots,
          html_snapshots: htmlSnapshots,
          step_configs: currentSteps.map(s => ({
            step: s.step,
            name: s.name,
            description: s.description,
            url: s.url
          })),
        })
        .eq('id', selectedVersionForScreenshots.id);

      if (error) throw error;
      
      toast.success(`Screenshots für ${formatVersion(selectedVersionForScreenshots.version_number)} aktualisiert`);
      setUpdateScreenshotsDialogOpen(false);
      setSelectedVersionForScreenshots(null);
      fetchVersions();
    } catch (err) {
      console.error('Failed to update screenshots:', err);
      toast.error('Screenshots konnten nicht aktualisiert werden');
    } finally {
      setIsUpdatingScreenshots(false);
    }
  };

  const deleteVersion = async (version: FlowVersion) => {
    if (!confirm(`Version ${version.version_number} wirklich löschen?`)) return;

    try {
      const { error } = await supabase
        .from('flow_versions')
        .delete()
        .eq('id', version.id);

      if (error) throw error;
      toast.success('Version gelöscht');
      fetchVersions();
    } catch (err) {
      console.error('Failed to delete version:', err);
      toast.error('Löschen fehlgeschlagen');
    }
  };

  const setAsBaseline = async (version: FlowVersion) => {
    try {
      // Remove baseline from all other versions
      await supabase
        .from('flow_versions')
        .update({ is_baseline: false })
        .eq('flow_id', flowId);

      // Set this version as baseline
      const { error } = await supabase
        .from('flow_versions')
        .update({ is_baseline: true })
        .eq('id', version.id);

      if (error) throw error;
      toast.success(`Version ${version.version_number} als Baseline gesetzt`);
      fetchVersions();
    } catch (err) {
      console.error('Failed to set baseline:', err);
      toast.error('Baseline setzen fehlgeschlagen');
    }
  };

  const saveFeedback = async () => {
    if (!selectedVersionForFeedback || !feedbackText.trim()) return;

    try {
      const { error } = await supabase
        .from('flow_versions')
        .update({
          ai_feedback: feedbackText.trim(),
          ai_feedback_source: feedbackSource,
          ai_feedback_date: new Date().toISOString(),
        })
        .eq('id', selectedVersionForFeedback.id);

      if (error) throw error;
      toast.success('Feedback gespeichert');
      setFeedbackDialogOpen(false);
      setFeedbackText("");
      setSelectedVersionForFeedback(null);
      fetchVersions();
    } catch (err) {
      console.error('Failed to save feedback:', err);
      toast.error('Feedback speichern fehlgeschlagen');
    }
  };

  const openCompare = (versionA: FlowVersion, versionB?: FlowVersion) => {
    setSelectedVersionA(versionA);
    setSelectedVersionB(versionB || (versions.find(v => v.is_baseline) || versions[versions.length - 1]) || null);
    setCompareStep(1);
    setCompareDialogOpen(true);
  };

  // Export version as ZIP with all screenshots and HTML
  const exportVersionAsZip = async (version: FlowVersion) => {
    const screenshots = version.screenshots as Record<string, string> | null;
    const htmlSnapshots = version.html_snapshots as Record<string, string> | null;
    const stepConfigs = version.step_configs as { step: number; name: string; description?: string; url?: string }[] | null;

    if (!screenshots || Object.keys(screenshots).length === 0) {
      toast.error("Diese Version hat keine Screenshots zum Exportieren");
      return;
    }

    try {
      const zip = new JSZip();
      const versionLabel = formatVersion(version.version_number);
      const folderName = `${version.flow_id}-${versionLabel}-${new Date().toISOString().split('T')[0]}`;
      const rootFolder = zip.folder(folderName);
      if (!rootFolder) return;

      // Add metadata
      rootFolder.file('version-info.json', JSON.stringify({
        id: version.id,
        flow_id: version.flow_id,
        flow_code: version.flow_code,
        version_number: version.version_number,
        version_name: version.version_name,
        description: version.description,
        created_at: version.created_at,
        is_baseline: version.is_baseline,
        is_live: version.is_live,
        ai_feedback_source: version.ai_feedback_source,
        ai_feedback_date: version.ai_feedback_date,
        step_configs: stepConfigs,
        exportedAt: new Date().toISOString()
      }, null, 2));

      // Add AI feedback if available
      if (version.ai_feedback) {
        rootFolder.file('ai-feedback.md', `# AI Feedback für ${versionLabel}\n\n**Quelle:** ${version.ai_feedback_source || 'unknown'}\n**Datum:** ${version.ai_feedback_date || 'unknown'}\n\n---\n\n${version.ai_feedback}`);
      }

      // Add screenshots folder
      const screenshotsFolder = rootFolder.folder('screenshots');
      if (screenshotsFolder) {
        for (const [key, value] of Object.entries(screenshots)) {
          if (!value) continue;
          // Extract step number and type from key (e.g., "step1Desktop", "step2Mobile")
          const match = key.match(/step(\d+)(Desktop|Mobile)/i);
          if (match) {
            const stepNum = match[1];
            const deviceType = match[2].toLowerCase();
            const filename = `step-${stepNum}-${deviceType}.png`;
            
            // Handle data URL or raw base64
            let base64Data = value;
            if (value.startsWith('data:')) {
              base64Data = value.split(',')[1] || value;
            }
            screenshotsFolder.file(filename, base64Data, { base64: true });
          }
        }
      }

      // Add HTML snapshots if available
      if (htmlSnapshots && Object.keys(htmlSnapshots).length > 0) {
        const htmlFolder = rootFolder.folder('html');
        if (htmlFolder) {
          for (const [key, value] of Object.entries(htmlSnapshots)) {
            if (!value) continue;
            const match = key.match(/step(\d+)/i);
            if (match) {
              const stepNum = match[1];
              htmlFolder.file(`step-${stepNum}.html`, value);
            }
          }
        }
      }

      // Add README
      const stepsList = stepConfigs?.map(s => `- Step ${s.step}: ${s.name}${s.description ? ` - ${s.description}` : ''}`).join('\n') || 'Keine Step-Konfiguration verfügbar';
      rootFolder.file('README.md', `# ${version.flow_id} - ${versionLabel}

${version.version_name ? `## ${version.version_name}\n\n` : ''}${version.description || ''}

## Exportiert am
${new Date().toLocaleString('de-CH')}

## Steps
${stepsList}

## Dateien
- \`version-info.json\` - Alle Metadaten
- \`screenshots/\` - Desktop & Mobile Screenshots
- \`html/\` - Rendered HTML Snapshots
${version.ai_feedback ? '- `ai-feedback.md` - AI Analyse' : ''}

## Verwendung
Lade diese Dateien in ChatGPT, Claude oder Gemini hoch für eine detaillierte UX/Conversion-Analyse.
`);

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${folderName}.zip`);
      toast.success(`ZIP für ${versionLabel} heruntergeladen`);
    } catch (err) {
      console.error('Failed to export version as ZIP:', err);
      toast.error('ZIP-Export fehlgeschlagen');
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Lade Versionen...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Flow Versionen
          </CardTitle>
          <div className="flex gap-2">
            {versions.some(v => v.screenshots && Object.keys(v.screenshots as Record<string, string> || {}).length > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const versionsWithScreenshots = versions.filter(v => v.screenshots && Object.keys(v.screenshots as Record<string, string> || {}).length > 0);
                  if (versionsWithScreenshots.length === 0) {
                    toast.error("Keine Versionen mit Screenshots vorhanden");
                    return;
                  }
                  
                  try {
                    const zip = new JSZip();
                    const exportDate = new Date().toISOString().split('T')[0];
                    
                    for (const version of versionsWithScreenshots) {
                      const versionLabel = formatVersion(version.version_number);
                      const versionFolder = zip.folder(`${versionLabel}${version.version_name ? `-${version.version_name.replace(/\s+/g, '-')}` : ''}`);
                      if (!versionFolder) continue;
                      
                      const screenshots = version.screenshots as Record<string, string>;
                      const htmlSnapshots = version.html_snapshots as Record<string, string> | null;
                      
                      // Add screenshots
                      for (const [key, value] of Object.entries(screenshots)) {
                        if (!value) continue;
                        const match = key.match(/step(\d+)(Desktop|Mobile)/i);
                        if (match) {
                          const filename = `step-${match[1]}-${match[2].toLowerCase()}.png`;
                          let base64Data = value;
                          if (value.startsWith('data:')) {
                            base64Data = value.split(',')[1] || value;
                          }
                          versionFolder.file(filename, base64Data, { base64: true });
                        }
                      }
                      
                      // Add HTML if available
                      if (htmlSnapshots) {
                        for (const [key, value] of Object.entries(htmlSnapshots)) {
                          if (!value) continue;
                          const match = key.match(/step(\d+)/i);
                          if (match) {
                            versionFolder.file(`step-${match[1]}.html`, value);
                          }
                        }
                      }
                      
                      // Add version info
                      versionFolder.file('info.json', JSON.stringify({
                        version_number: version.version_number,
                        version_name: version.version_name,
                        flow_code: version.flow_code,
                        ai_feedback_source: version.ai_feedback_source,
                        created_at: version.created_at
                      }, null, 2));
                      
                      if (version.ai_feedback) {
                        versionFolder.file('ai-feedback.md', version.ai_feedback);
                      }
                    }
                    
                    const blob = await zip.generateAsync({ type: 'blob' });
                    saveAs(blob, `${flowId}-all-versions-${exportDate}.zip`);
                    toast.success(`${versionsWithScreenshots.length} Versionen als ZIP heruntergeladen`);
                  } catch (err) {
                    console.error('Failed to export all versions:', err);
                    toast.error('ZIP-Export fehlgeschlagen');
                  }
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Alle als ZIP
              </Button>
            )}
            {versions.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (isBatchRunning) {
                      // If batch is running, just open the dialog to show progress
                      setBatchScreenshotDialogOpen(true);
                    } else {
                      setSelectedVersionsForBatch(new Set());
                      setBatchQueue([]);
                      setBatchCurrentIndex(0);
                      setBatchScreenshotDialogOpen(true);
                    }
                  }}
                >
                  {isBatchRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Batch: {batchCurrentIndex + 1}/{batchQueue.length}
                    </>
                  ) : (
                    <>
                      <Layers className="h-4 w-4 mr-1" />
                      Batch-Capture
                    </>
                  )}
                </Button>
                {isBatchRunning && activeJob && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded-md border border-primary/30">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${activeJob.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{activeJob.progress}%</span>
                  </div>
                )}
              </>
            )}
            {versions.length >= 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCompare(versions[0], versions[1])}
              >
                <GitCompare className="h-4 w-4 mr-1" />
                Vergleichen
              </Button>
            )}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => {
                    // Pre-fill from variant config if available
                    if (variantConfig) {
                      // Extract version from variant ID (e.g., "v9a" → "9.a", "v9a__wf__xxx" → "9.a")
                      const cleanId = variantConfig.id.split('__')[0]; // Remove __wf__ suffix if present
                      const match = cleanId.match(/v(\d+)([a-z])?/i);
                      if (match) {
                        const major = match[1];
                        const letter = match[2]?.toLowerCase() || '';
                        setNewVersionNumber(`${major}.${letter}`);
                      } else {
                        setNewVersionNumber(suggestNextVersion());
                      }
                      // Extract name from label (e.g., "V9.A - Gemini (Workflow)" → "Gemini")
                      const labelMatch = variantConfig.label.match(/V\d+\.[A-Z]\s*-\s*(.+?)(?:\s*\(|$)/i);
                      const extractedName = labelMatch ? labelMatch[1].trim() : variantConfig.label;
                      setNewVersionName(extractedName);
                      setNewVersionDescription(variantConfig.description || '');
                    } else {
                      setNewVersionNumber(suggestNextVersion());
                    }
                  }}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Version speichern
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neue Version speichern</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Versionsnummer *</Label>
                    <Input
                      value={newVersionNumber}
                      onChange={(e) => setNewVersionNumber(e.target.value)}
                      placeholder="z.B. 1.1"
                    />
                  </div>
                  <div>
                    <Label>Name (optional)</Label>
                    <Input
                      value={newVersionName}
                      onChange={(e) => setNewVersionName(e.target.value)}
                      placeholder="z.B. Mit ChatGPT Feedback"
                    />
                  </div>
                  <div>
                    <Label>Beschreibung (optional)</Label>
                    <Textarea
                      value={newVersionDescription}
                      onChange={(e) => setNewVersionDescription(e.target.value)}
                      placeholder="Was wurde geändert?"
                      rows={3}
                    />
                  </div>
                  {variantConfig && (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">Coded Variant</Badge>
                        <span className="font-medium text-sm">{variantConfig.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{variantConfig.description}</p>
                      {variantConfig.component && (
                        <p className="text-xs font-mono text-primary mt-1">Component: {variantConfig.component}</p>
                      )}
                    </div>
                  )}
                  {currentSteps.filter(s => s.screenshotDesktop || s.screenshotMobile).length === 0 ? (
                    <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive">
                      <div className="font-medium text-sm mb-1">⚠️ Keine Screenshots vorhanden!</div>
                      <p className="text-xs">
                        Du musst zuerst Screenshots für diese Variante aufnehmen (Capture-Button), 
                        sonst werden leere oder alte Screenshots gespeichert.
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {variantConfig?.steps?.length || currentSteps.length} Steps mit {currentSteps.filter(s => s.screenshotDesktop || s.screenshotMobile).length} Screenshots werden gespeichert
                    </div>
                  )}
                  <Button 
                    onClick={saveVersion} 
                    className="w-full"
                    variant={currentSteps.filter(s => s.screenshotDesktop || s.screenshotMobile).length === 0 ? "outline" : "default"}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {currentSteps.filter(s => s.screenshotDesktop || s.screenshotMobile).length === 0 
                      ? "Trotzdem speichern (ohne Screenshots)" 
                      : "Speichern"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Noch keine Versionen gespeichert</p>
            <p className="text-sm">Erfasse zuerst die Flow Steps und speichere dann eine Version</p>
          </div>
        ) : (
          <div className="space-y-2">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg font-semibold">
                    {formatVersion(version.version_number)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {version.version_name && (
                        <span className="font-medium">{version.version_name}</span>
                      )}
                      {version.is_baseline && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Baseline
                        </Badge>
                      )}
                      {version.is_live && (
                        <Badge className="text-xs bg-green-600">
                          <Play className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      )}
                      {version.ai_feedback && (
                        <Badge variant="outline" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {version.ai_feedback_source}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(version.created_at).toLocaleDateString('de-CH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {version.description && ` • ${version.description.substring(0, 50)}${version.description.length > 50 ? '...' : ''}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => exportVersionAsZip(version)}
                    title="Als ZIP herunterladen (Screenshots + HTML + Metadata)"
                    disabled={!version.screenshots || Object.keys(version.screenshots as Record<string, string> || {}).length === 0}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedVersionForBackgroundScreenshots(version);
                      setBackgroundScreenshotDialogOpen(true);
                    }}
                    title="Background Screenshot-Erfassung (Seite kann geschlossen werden)"
                  >
                    <CloudUpload className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedVersionForScreenshots(version);
                      setUpdateScreenshotsDialogOpen(true);
                    }}
                    title={currentSteps.length === 0 ? "Zuerst Screenshots erfassen" : "Screenshots aktualisieren (aus aktueller Session)"}
                  >
                    <Camera className={`h-4 w-4 ${currentSteps.length === 0 ? 'text-muted-foreground' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedVersionForFeedback(version);
                      setFeedbackText(version.ai_feedback || "");
                      setFeedbackSource(version.ai_feedback_source || "chatgpt");
                      setFeedbackDialogOpen(true);
                    }}
                    title="AI Feedback hinzufügen"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openCompare(version)}
                    title="Mit Baseline vergleichen"
                  >
                    <GitCompare className="h-4 w-4" />
                  </Button>
                  {!version.is_baseline && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAsBaseline(version)}
                      title="Als Baseline setzen"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteVersion(version)}
                    className="text-destructive hover:text-destructive"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feedback Dialog */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                AI Feedback für {selectedVersionForFeedback ? formatVersion(selectedVersionForFeedback.version_number) : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Quelle</Label>
                <Select value={feedbackSource} onValueChange={setFeedbackSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatgpt">ChatGPT</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="other">Andere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>AI Analyse / Feedback</Label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Füge hier das AI Feedback ein..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={saveFeedback} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Feedback speichern
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Screenshots Dialog */}
        <Dialog open={updateScreenshotsDialogOpen} onOpenChange={setUpdateScreenshotsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Screenshots aktualisieren
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedVersionForScreenshots && (
                <>
                  <div className="p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold">{formatVersion(selectedVersionForScreenshots.version_number)}</span>
                      {selectedVersionForScreenshots.version_name && (
                        <span className="text-muted-foreground">- {selectedVersionForScreenshots.version_name}</span>
                      )}
                      {selectedVersionForScreenshots.is_baseline && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Baseline
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Die aktuell erfassten Screenshots werden in diese Version gespeichert.
                    </p>
                  </div>
                  
                  {currentSteps.filter(s => s.screenshotDesktop || s.screenshotMobile).length === 0 ? (
                    <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive">
                      <div className="font-medium text-sm mb-1">⚠️ Keine Screenshots vorhanden!</div>
                      <p className="text-xs">
                        Du musst zuerst Screenshots für diese Variante aufnehmen (Capture-Button),
                        bevor du sie in eine Version speichern kannst.
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {currentSteps.filter(s => s.screenshotDesktop || s.screenshotMobile).length} Screenshots werden gespeichert
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setUpdateScreenshotsDialogOpen(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button 
                      onClick={updateVersionScreenshots}
                      className="flex-1"
                      disabled={isUpdatingScreenshots || currentSteps.filter(s => s.screenshotDesktop || s.screenshotMobile).length === 0}
                    >
                      {isUpdatingScreenshots ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Aktualisiere...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Screenshots speichern
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Background Screenshot Dialog */}
        <Dialog open={backgroundScreenshotDialogOpen} onOpenChange={setBackgroundScreenshotDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Background Screenshot-Erfassung
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedVersionForBackgroundScreenshots && (
                <>
                  <div className="p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold">{formatVersion(selectedVersionForBackgroundScreenshots.version_number)}</span>
                      {selectedVersionForBackgroundScreenshots.version_name && (
                        <span className="text-muted-foreground">- {selectedVersionForBackgroundScreenshots.version_name}</span>
                      )}
                      {selectedVersionForBackgroundScreenshots.is_baseline && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Baseline
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Screenshots werden im Hintergrund erfasst. Du kannst diese Seite schliessen.
                    </p>
                  </div>
                  
                  {(() => {
                    // Always prefer DB step_configs - they are the source of truth for the saved version
                    const dbStepConfigs = selectedVersionForBackgroundScreenshots.step_configs as Array<{ step: number; name: string; description?: string }> | null;
                    const hasStepConfigs = dbStepConfigs && Array.isArray(dbStepConfigs) && dbStepConfigs.length > 0;
                    
                    if (!hasStepConfigs) {
                      return (
                        <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive">
                          <div className="font-medium text-sm mb-1">⚠️ Keine Step-Konfiguration vorhanden!</div>
                          <p className="text-xs">
                            Diese Version hat keine Step-Konfiguration. Background-Screenshots können nur für Versionen mit Steps erfasst werden.
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="text-sm text-muted-foreground">
                        {dbStepConfigs.length} Steps werden im Hintergrund erfasst (Desktop + Mobile)
                      </div>
                    );
                  })()}
                  
                  {activeJob && (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {activeJob.status === 'pending' && 'Job wird gestartet...'}
                          {activeJob.status === 'processing' && 'Screenshots werden erfasst...'}
                          {activeJob.status === 'completed' && 'Fertig!'}
                          {activeJob.status === 'failed' && 'Fehler!'}
                        </span>
                        <span className="text-sm text-muted-foreground">{activeJob.progress}%</span>
                      </div>
                      <Progress value={activeJob.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">{activeJob.progressMessage}</p>
                      {activeJob.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => {
                            clearJob();
                            fetchVersions();
                            setBackgroundScreenshotDialogOpen(false);
                          }}
                        >
                          Schliessen & Aktualisieren
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {!activeJob && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setBackgroundScreenshotDialogOpen(false)}
                      >
                        Abbrechen
                      </Button>
                      <Button 
                        onClick={async () => {
                          // Always use DB step_configs - they are the source of truth
                          const dbStepConfigs = selectedVersionForBackgroundScreenshots.step_configs as Array<{ step: number; name: string; description?: string; url?: string }> | null;
                          
                          if (!dbStepConfigs || dbStepConfigs.length === 0) {
                            toast.error('Keine Step-Konfiguration vorhanden');
                            return;
                          }
                          
                          // Use production URL to avoid auth-bridge redirect on preview hosts
                          const isPreviewHost = window.location.hostname.includes('lovable.app') || 
                                                window.location.hostname.includes('lovableproject.com');
                          const publicBase = isPreviewHost ? SITE_CONFIG.url : window.location.origin;
                          
                          // Determine the base URL from flow_code or first step's url
                          let baseUrl = `${publicBase}/umzugsofferten`;
                          
                          // Check if step has a URL and extract the variant
                          const firstStepUrl = dbStepConfigs[0]?.url;
                          if (firstStepUrl) {
                            try {
                              const parsedUrl = new URL(firstStepUrl);
                              const variant = parsedUrl.searchParams.get('variant');
                              if (variant) {
                                baseUrl = `${publicBase}/umzugsofferten?variant=${variant}`;
                              }
                            } catch (e) {
                              console.warn('Could not parse step URL, using default baseUrl');
                            }
                          } else {
                            // Fallback: construct from flow_code if available
                            const flowCode = selectedVersionForBackgroundScreenshots.flow_code;
                            if (flowCode) {
                              // e.g. "V3.a" -> "v3a"
                              const variant = flowCode.toLowerCase().replace('.', '');
                              baseUrl = `${publicBase}/umzugsofferten?variant=${variant}`;
                            }
                          }
                          
                          await startJob({
                            versionId: selectedVersionForBackgroundScreenshots.id,
                            flowId: selectedVersionForBackgroundScreenshots.flow_id,
                            steps: dbStepConfigs,
                            baseUrl,
                          });
                        }}
                        className="flex-1"
                        disabled={(() => {
                          const stepConfigs = selectedVersionForBackgroundScreenshots.step_configs as Array<{ step: number; name: string; description?: string }> | null;
                          return !stepConfigs || !Array.isArray(stepConfigs) || stepConfigs.length === 0;
                        })()}
                      >
                        <CloudUpload className="h-4 w-4 mr-2" />
                        Background-Erfassung starten
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Batch Screenshot Dialog */}
        <Dialog open={batchScreenshotDialogOpen} onOpenChange={setBatchScreenshotDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Batch Screenshot-Erfassung
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!isBatchRunning ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Wähle mehrere Versionen aus, um deren Screenshots nacheinander zu erfassen:
                  </p>
                  <ScrollArea className="h-64 border rounded-lg p-2">
                    <div className="space-y-2">
                      {versions.filter(v => {
                        const sc = v.step_configs as Array<{ step: number }> | null;
                        return sc && Array.isArray(sc) && sc.length > 0;
                      }).map(version => {
                        const isSelected = selectedVersionsForBatch.has(version.id);
                        return (
                          <div 
                            key={version.id}
                            className={`p-2 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-accent'}`}
                            onClick={() => {
                              const newSet = new Set(selectedVersionsForBatch);
                              if (isSelected) {
                                newSet.delete(version.id);
                              } else {
                                newSet.add(version.id);
                              }
                              setSelectedVersionsForBatch(newSet);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <CheckSquare className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="font-mono font-bold">{formatVersion(version.version_number)}</span>
                              {version.version_name && (
                                <span className="text-sm text-muted-foreground">- {version.version_name}</span>
                              )}
                              {version.is_baseline && (
                                <Badge variant="secondary" className="text-xs">Baseline</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedVersionsForBatch.size} Versionen ausgewählt
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const allIds = versions
                            .filter(v => {
                              const sc = v.step_configs as Array<{ step: number }> | null;
                              return sc && Array.isArray(sc) && sc.length > 0;
                            })
                            .map(v => v.id);
                          setSelectedVersionsForBatch(new Set(allIds));
                        }}
                      >
                        Alle auswählen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVersionsForBatch(new Set())}
                      >
                        Keine
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setBatchScreenshotDialogOpen(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={selectedVersionsForBatch.size === 0}
                      onClick={async () => {
                        const queue = versions.filter(v => selectedVersionsForBatch.has(v.id));
                        setBatchQueue(queue);
                        setBatchCurrentIndex(0);
                        setIsBatchRunning(true);
                        
                        // Start first job
                        if (queue.length > 0) {
                          await startBatchJob(queue[0], 0, queue.length);
                        }
                      }}
                    >
                      <CloudUpload className="h-4 w-4 mr-2" />
                      {selectedVersionsForBatch.size} Versionen erfassen
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Batch-Erfassung: {batchCurrentIndex + 1} / {batchQueue.length}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(((batchCurrentIndex) / batchQueue.length) * 100)}%
                      </span>
                    </div>
                    <Progress value={(batchCurrentIndex / batchQueue.length) * 100} className="h-2 mb-2" />
                    {batchQueue[batchCurrentIndex] && (
                      <p className="text-sm">
                        Aktuell: <span className="font-mono font-bold">{formatVersion(batchQueue[batchCurrentIndex].version_number)}</span>
                        {batchQueue[batchCurrentIndex].version_name && ` - ${batchQueue[batchCurrentIndex].version_name}`}
                      </p>
                    )}
                  </div>
                  
                  {activeJob && (
                    <div className="p-3 bg-accent rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">
                          {activeJob.status === 'pending' && 'Job wird gestartet...'}
                          {activeJob.status === 'processing' && 'Screenshots werden erfasst...'}
                          {activeJob.status === 'completed' && 'Version fertig!'}
                          {activeJob.status === 'failed' && 'Fehler!'}
                        </span>
                        <span className="text-sm text-muted-foreground">{activeJob.progress}%</span>
                      </div>
                      <Progress value={activeJob.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{activeJob.progressMessage}</p>
                    </div>
                  )}
                  
                  {batchCurrentIndex >= batchQueue.length && (
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-sm text-green-700 font-medium">
                        Alle {batchQueue.length} Versionen erfolgreich erfasst!
                      </p>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      clearJob();
                      setIsBatchRunning(false);
                      setBatchScreenshotDialogOpen(false);
                      fetchVersions();
                    }}
                  >
                    {batchCurrentIndex >= batchQueue.length ? 'Schliessen' : 'Abbrechen'}
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Compare Dialog */}
        <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <GitCompare className="h-5 w-5" />
                Version Vergleich
                <div className="flex items-center gap-2 ml-4">
                  <Select
                    value={selectedVersionA?.id || ""}
                    onValueChange={(id) => setSelectedVersionA(versions.find(v => v.id === id) || null)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Version A" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {formatVersion(v.version_number)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">vs</span>
                  <Select
                    value={selectedVersionB?.id || ""}
                    onValueChange={(id) => setSelectedVersionB(versions.find(v => v.id === id) || null)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Version B" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          v{v.version_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedVersionA && selectedVersionB && (
              <div className="mt-4">
                <Tabs defaultValue="visual">
                  <TabsList>
                    <TabsTrigger value="visual">Screenshots</TabsTrigger>
                    <TabsTrigger value="config">Konfiguration</TabsTrigger>
                    <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="visual" className="mt-4">
                    {(() => {
                      // Calculate max steps - prioritize step_configs, then fall back to screenshots
                      const getMaxSteps = (version: FlowVersion): number => {
                        // First check step_configs (source of truth for step count)
                        const stepConfigs = version.step_configs as Array<{ step: number; name?: string }> | null;
                        if (stepConfigs && Array.isArray(stepConfigs) && stepConfigs.length > 0) {
                          return stepConfigs.length;
                        }
                        
                        // Fall back to counting screenshots if no step_configs
                        const screenshots = version.screenshots as Record<string, string> | null;
                        if (!screenshots) return 0;
                        let max = 0;
                        Object.keys(screenshots).forEach(key => {
                          const match = key.match(/step(\d+)/i);
                          if (match) {
                            const stepNum = parseInt(match[1], 10);
                            if (stepNum > max) max = stepNum;
                          }
                        });
                        return max;
                      };
                      
                      const maxStepsA = getMaxSteps(selectedVersionA);
                      const maxStepsB = getMaxSteps(selectedVersionB);
                      const maxSteps = Math.max(maxStepsA, maxStepsB, 1);
                      
                      return (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCompareStep(Math.max(1, compareStep - 1))}
                              disabled={compareStep <= 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Vorheriger Step
                            </Button>
                            <span className="font-medium">Step {compareStep} / {maxSteps}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCompareStep(Math.min(maxSteps, compareStep + 1))}
                              disabled={compareStep >= maxSteps}
                            >
                              Nächster Step
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                    
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-center font-medium mb-2">
                                {formatVersion(selectedVersionA.version_number)}
                                {selectedVersionA.is_baseline && " (Baseline)"}
                              </div>
                              <div className="border rounded-lg overflow-hidden bg-muted/30">
                                {(selectedVersionA.screenshots as Record<string, string>)?.[`step${compareStep}Desktop`] ? (
                                  <img
                                    src={toPngDataUrl((selectedVersionA.screenshots as Record<string, string>)[`step${compareStep}Desktop`])}
                                    alt={`Version A Step ${compareStep}`}
                                    className="w-full"
                                  />
                                ) : (
                                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    Kein Screenshot für Step {compareStep}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-center font-medium mb-2">
                                {formatVersion(selectedVersionB.version_number)}
                                {selectedVersionB.is_baseline && " (Baseline)"}
                              </div>
                              <div className="border rounded-lg overflow-hidden bg-muted/30">
                                {(selectedVersionB.screenshots as Record<string, string>)?.[`step${compareStep}Desktop`] ? (
                                  <img
                                    src={toPngDataUrl((selectedVersionB.screenshots as Record<string, string>)[`step${compareStep}Desktop`])}
                                    alt={`Version B Step ${compareStep}`}
                                    className="w-full"
                                  />
                                ) : (
                                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    Kein Screenshot für Step {compareStep}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </TabsContent>
                  
                  <TabsContent value="config" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionA.version_number)} Konfiguration
                        </div>
                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                          <pre className="text-xs font-mono whitespace-pre-wrap">
                            {JSON.stringify(selectedVersionA.step_configs, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionB.version_number)} Konfiguration
                        </div>
                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                          <pre className="text-xs font-mono whitespace-pre-wrap">
                            {JSON.stringify(selectedVersionB.step_configs, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="feedback" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionA.version_number)} Feedback
                          {selectedVersionA.ai_feedback_source && (
                            <Badge variant="outline" className="ml-2">
                              {selectedVersionA.ai_feedback_source}
                            </Badge>
                          )}
                        </div>
                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                          {selectedVersionA.ai_feedback ? (
                            <pre className="text-sm whitespace-pre-wrap">
                              {selectedVersionA.ai_feedback}
                            </pre>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              Kein Feedback vorhanden
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionB.version_number)} Feedback
                          {selectedVersionB.ai_feedback_source && (
                            <Badge variant="outline" className="ml-2">
                              {selectedVersionB.ai_feedback_source}
                            </Badge>
                          )}
                        </div>
                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                          {selectedVersionB.ai_feedback ? (
                            <pre className="text-sm whitespace-pre-wrap">
                              {selectedVersionB.ai_feedback}
                            </pre>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              Kein Feedback vorhanden
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

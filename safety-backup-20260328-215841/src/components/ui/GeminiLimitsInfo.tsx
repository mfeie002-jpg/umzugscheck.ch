import { Info, FileVideo, FileAudio, File, Archive, FolderCode, Sparkles } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getGeminiLimitInfo, GEMINI_LIMITS } from '@/lib/gemini-limits';

interface GeminiLimitsInfoProps {
  compact?: boolean;
  className?: string;
  showChatGPT?: boolean;
}

export function GeminiLimitsInfo({ compact = false, className = '', showChatGPT = true }: GeminiLimitsInfoProps) {
  const limits = getGeminiLimitInfo();

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-help ${className}`}>
              <Info className="h-3.5 w-3.5" />
              <span>Upload Limits</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm">
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-medium text-orange-500">🔶 Gemini Limits</p>
                <ul className="space-y-1 mt-1">
                  <li>• Max. {limits.maxFiles} Dateien pro Prompt</li>
                  <li>• Videos: bis {limits.maxVideoSize}, max. {limits.maxVideoDuration}</li>
                  <li>• Andere Dateien: bis {limits.maxOtherSize}</li>
                  <li>• Audio: max. {limits.maxAudioDuration}</li>
                </ul>
              </div>
              {showChatGPT && (
                <div>
                  <p className="font-medium text-green-500">🟢 ChatGPT Limits</p>
                  <ul className="space-y-1 mt-1">
                    <li>• Keine Datei-Anzahl Beschränkung</li>
                    <li>• Bis zu 512MB pro Datei</li>
                    <li>• PDFs: Bis zu 2000 Seiten</li>
                    <li>• Längere Audio/Video möglich</li>
                  </ul>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`rounded-lg border bg-card p-4 space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium">Upload-Limits nach Modell</h4>
      </div>
      
      {/* Gemini Limits */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-orange-500">🔶</span>
          <span className="text-sm font-medium">Gemini</span>
          <Badge variant="outline" className="text-xs">Striktere Limits</Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pl-6">
          <div className="flex items-start gap-2">
            <File className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Dateien pro Prompt</p>
              <p className="text-muted-foreground">Max. {limits.maxFiles} Dateien</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileVideo className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Videos</p>
              <p className="text-muted-foreground">
                Bis {limits.maxVideoSize}, max. {limits.maxVideoDuration}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileAudio className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Audio</p>
              <p className="text-muted-foreground">Max. {limits.maxAudioDuration}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Archive className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">ZIP-Dateien</p>
              <p className="text-muted-foreground">
                Max. {GEMINI_LIMITS.ZIP_MAX_FILES} Dateien, {limits.maxOtherSize}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:col-span-2">
            <FolderCode className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Code-Ordner / GitHub</p>
              <p className="text-muted-foreground">
                Max. {GEMINI_LIMITS.CODE_MAX_FILES.toLocaleString()} Dateien, {limits.maxOtherSize}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ChatGPT Limits */}
      {showChatGPT && (
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <span className="text-green-500">🟢</span>
            <span className="text-sm font-medium">ChatGPT</span>
            <Badge variant="secondary" className="text-xs">Flexibler</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pl-6">
            <div className="flex items-start gap-2">
              <File className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Dateien pro Prompt</p>
                <p className="text-muted-foreground">Keine strikte Beschränkung</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Archive className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Dateigrösse</p>
                <p className="text-muted-foreground">Bis zu 512MB pro Datei</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">PDFs</p>
                <p className="text-muted-foreground">Bis zu 2000 Seiten</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileVideo className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Audio/Video</p>
                <p className="text-muted-foreground">Längere Dateien möglich</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 border-t">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            Gemini: {limits.maxOtherSize} max
          </Badge>
          <Badge variant="secondary" className="text-xs">
            ChatGPT: 512MB max
          </Badge>
        </div>
      </div>
    </div>
  );
}

import { Info, FileVideo, FileAudio, File, Archive, FolderCode } from 'lucide-react';
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
}

export function GeminiLimitsInfo({ compact = false, className = '' }: GeminiLimitsInfoProps) {
  const limits = getGeminiLimitInfo();

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-help ${className}`}>
              <Info className="h-3.5 w-3.5" />
              <span>Gemini Limits</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm">
            <div className="space-y-2 text-xs">
              <p className="font-medium">Datei-Upload Limits (Gemini)</p>
              <ul className="space-y-1">
                <li>• Max. {limits.maxFiles} Dateien pro Prompt</li>
                <li>• Videos: bis {limits.maxVideoSize}, max. {limits.maxVideoDuration}</li>
                <li>• Andere Dateien: bis {limits.maxOtherSize}</li>
                <li>• Audio: max. {limits.maxAudioDuration}</li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`rounded-lg border bg-card p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium">Gemini Upload-Limits</h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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

      <div className="pt-2 border-t">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            Andere Dateien: {limits.maxOtherSize}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            ZIP: Keine Videos/Audio
          </Badge>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

interface CompanyVideoShowcaseProps {
  companyName: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export const CompanyVideoShowcase = ({ 
  companyName, 
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnailUrl 
}: CompanyVideoShowcaseProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <div className="relative aspect-video bg-muted">
        {!isPlaying ? (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer group"
            onClick={() => setIsPlaying(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-primary-foreground ml-1" />
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <Badge variant="secondary" className="mb-2">Video</Badge>
              <p className="font-semibold">{companyName}</p>
              <p className="text-sm opacity-80">Unternehmensvorstellung</p>
            </div>
          </div>
        ) : (
          <>
            <iframe
              src={`${videoUrl}?autoplay=1&mute=${isMuted ? 1 : 0}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 opacity-80 hover:opacity-100"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 opacity-80 hover:opacity-100"
                onClick={() => setIsPlaying(false)}
              >
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default CompanyVideoShowcase;

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, Share2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface QRCodeShareProps {
  estimateData: {
    rooms: number;
    distance: number;
    floor: number;
    hasLift: boolean;
    moveType: string;
    price: number;
    packing: boolean;
    assembly: boolean;
    storage: boolean;
  };
}

const QRCodeShare = ({ estimateData }: QRCodeShareProps) => {
  const [copied, setCopied] = useState(false);

  // Generate a shareable URL with estimate data encoded
  const shareUrl = useMemo(() => {
    const params = new URLSearchParams({
      r: estimateData.rooms.toString(),
      d: estimateData.distance.toString(),
      f: estimateData.floor.toString(),
      l: estimateData.hasLift ? '1' : '0',
      t: estimateData.moveType,
      p: estimateData.packing ? '1' : '0',
      a: estimateData.assembly ? '1' : '0',
      s: estimateData.storage ? '1' : '0',
    });
    
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/calculator`
      : 'https://umzugscheck.ch/calculator';
    
    return `${baseUrl}?${params.toString()}`;
  }, [estimateData]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link kopiert",
        description: "Der Link wurde in die Zwischenablage kopiert.",
      });
    } catch {
      toast({
        title: "Fehler",
        description: "Link konnte nicht kopiert werden.",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meine Umzugsschätzung - Umzugscheck.ch',
          text: `Geschätzte Kosten: CHF ${estimateData.price.toLocaleString('de-CH')} für ${estimateData.rooms} Zimmer`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-4">
      {/* QR Code Placeholder - using icon since qrcode.react may not be installed */}
      <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed border-muted">
        <div className="text-center">
          <QrCode className="w-24 h-24 mx-auto text-primary/60" />
          <p className="text-xs text-muted-foreground mt-2">QR-Code</p>
        </div>
      </div>

      {/* Price badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
          CHF {estimateData.price.toLocaleString('de-CH')}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {estimateData.rooms} Zimmer • {estimateData.distance} km • {
            estimateData.moveType === 'standard' ? 'Standard' : 
            estimateData.moveType === 'express' ? 'Express' : 'Premium'
          }
        </p>
      </div>

      {/* Share URL */}
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 bg-transparent text-xs truncate focus:outline-none"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="shrink-0 h-8 w-8 p-0"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Link kopieren
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Teilen
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Teilen Sie diesen Link um die Schätzung auf einem anderen Gerät zu öffnen
      </p>
    </div>
  );
};

export default QRCodeShare;

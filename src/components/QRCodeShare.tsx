import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Download, Share2 } from "lucide-react";
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
    
    // Use the current origin or fallback
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/calculator`
      : 'https://feierabend-umzuege.ch/calculator';
    
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

  const handleDownloadQR = () => {
    const svg = document.getElementById('estimate-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'umzugsschaetzung-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast({
        title: "QR-Code heruntergeladen",
        description: "Der QR-Code wurde als PNG gespeichert.",
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meine Umzugsschätzung - Feierabend Umzüge',
          text: `Geschätzte Kosten: CHF ${estimateData.price.toLocaleString('de-CH')} für ${estimateData.rooms} Zimmer`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-4">
      {/* QR Code */}
      <div className="flex justify-center p-4 bg-white rounded-lg">
        <QRCodeSVG
          id="estimate-qr-code"
          value={shareUrl}
          size={160}
          level="M"
          includeMargin
          bgColor="#ffffff"
          fgColor="#1e3a5f"
        />
      </div>

      {/* Price badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-alpine/10 text-alpine font-semibold">
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
          onClick={handleDownloadQR}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          QR speichern
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
        Scannen Sie den QR-Code um die Schätzung auf einem anderen Gerät zu öffnen
      </p>
    </div>
  );
};

export default QRCodeShare;

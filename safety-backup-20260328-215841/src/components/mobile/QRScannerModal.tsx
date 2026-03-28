import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQRScanner } from '@/hooks/useQRScanner';
import { useHaptic } from '@/hooks/use-haptic';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export const QRScannerModal = ({ isOpen, onClose, onScan }: QRScannerModalProps) => {
  const { isScanning, result, error, startScanning, stopScanning, videoRef } = useQRScanner();
  const { trigger } = useHaptic();

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanning();
    }
    return () => {
      stopScanning();
    };
  }, [isOpen]);

  useEffect(() => {
    if (result) {
      trigger('success');
      onScan(result);
      onClose();
    }
  }, [result, onScan, onClose, trigger]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
        >
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex items-center gap-2 text-white">
                <QrCode className="w-5 h-5" />
                <span className="font-medium">QR-Code scannen</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Scanner View */}
            <div className="flex-1 relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />

              {/* Scanning Frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                  
                  {/* Scanning line animation */}
                  {isScanning && (
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-primary"
                      initial={{ top: 0 }}
                      animate={{ top: '100%' }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black/40" style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, calc(50% - 128px) calc(50% - 128px), calc(50% - 128px) calc(50% + 128px), calc(50% + 128px) calc(50% + 128px), calc(50% + 128px) calc(50% - 128px), calc(50% - 128px) calc(50% - 128px))',
                }} />
              </div>

              {/* Error State */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
                  <AlertCircle className="w-12 h-12 mb-4 text-destructive" />
                  <p className="text-lg font-medium mb-2">Scanner nicht verfügbar</p>
                  <p className="text-sm text-muted-foreground mb-4 text-center px-8">{error}</p>
                  <Button onClick={onClose} variant="outline" className="text-white border-white">
                    Schließen
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-center text-sm">
                Richte die Kamera auf einen QR-Code
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

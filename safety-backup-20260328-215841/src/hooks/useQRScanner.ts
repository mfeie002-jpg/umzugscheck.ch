import { useState, useCallback, useRef, useEffect } from 'react';

interface UseQRScannerReturn {
  isScanning: boolean;
  result: string | null;
  error: string | null;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useQRScanner = (): UseQRScannerReturn => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsScanning(false);
  }, []);

  const startScanning = useCallback(async () => {
    try {
      setError(null);
      setResult(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        
        // Use BarcodeDetector if available
        if ('BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({
            formats: ['qr_code'],
          });
          
          const scan = async () => {
            if (!videoRef.current || !isScanning) return;
            
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                setResult(barcodes[0].rawValue);
                stopScanning();
                return;
              }
            } catch {
              // Continue scanning
            }
            
            animationRef.current = requestAnimationFrame(scan);
          };
          
          scan();
        } else {
          setError('QR scanning not supported on this device');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Camera access denied');
      setIsScanning(false);
    }
  }, [stopScanning]);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    isScanning,
    result,
    error,
    startScanning,
    stopScanning,
    videoRef,
  };
};

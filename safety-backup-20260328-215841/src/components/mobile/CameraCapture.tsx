import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Check, SwitchCamera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCamera } from '@/hooks/useCamera';
import { useHaptic } from '@/hooks/use-haptic';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { trigger } = useHaptic();
  
  const { isStreaming, error, startCamera, stopCamera, takePhoto, videoRef, canvasRef } = useCamera({
    facingMode,
  });

  const handleStart = async () => {
    await startCamera();
    trigger('light');
  };

  const handleCapture = () => {
    const photo = takePhoto();
    if (photo) {
      setCapturedImage(photo);
      trigger('success');
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    trigger('light');
  };

  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(startCamera, 100);
    trigger('light');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
          
          {isStreaming && !capturedImage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCamera}
              className="text-white hover:bg-white/20"
            >
              <SwitchCamera className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* Camera View */}
        <div className="flex-1 relative overflow-hidden">
          {!isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Camera className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg mb-4">Kamera bereit</p>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <Button onClick={handleStart} variant="outline" className="text-white border-white">
                Kamera starten
              </Button>
            </div>
          )}

          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${capturedImage ? 'hidden' : ''}`}
            playsInline
            muted
          />
          
          <canvas ref={canvasRef} className="hidden" />

          <AnimatePresence>
            {capturedImage && (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={capturedImage}
                alt="Captured"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          {isStreaming && !capturedImage && (
            <div className="flex justify-center">
              <button
                onClick={handleCapture}
                className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-full bg-white" />
              </button>
            </div>
          )}

          {capturedImage && (
            <div className="flex justify-center gap-8">
              <Button
                onClick={handleRetake}
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white/20"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Wiederholen
              </Button>
              <Button
                onClick={handleConfirm}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Check className="w-5 h-5 mr-2" />
                Verwenden
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

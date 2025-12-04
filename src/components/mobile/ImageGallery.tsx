import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageGallery } from '@/hooks/useImageGallery';
import { usePinchZoom } from '@/hooks/usePinchZoom';
import { useHaptic } from '@/hooks/use-haptic';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

interface GalleryImage {
  id: string;
  src: string;
  alt?: string;
  thumbnail?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageGallery = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageGalleryProps) => {
  const { trigger } = useHaptic();
  const {
    currentIndex,
    currentImage,
    scale,
    totalImages,
    next,
    previous,
    goTo,
    zoomIn,
    zoomOut,
    resetZoom,
    setScale,
  } = useImageGallery(images);

  const pinchHandlers = usePinchZoom({
    minScale: 1,
    maxScale: 4,
    onZoomChange: setScale,
  });

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (scale === 1) {
        next();
        trigger('light');
      }
    },
    onSwipeRight: () => {
      if (scale === 1) {
        previous();
        trigger('light');
      }
    },
    threshold: 50,
  });

  useEffect(() => {
    if (isOpen) {
      goTo(initialIndex);
    }
  }, [isOpen, initialIndex, goTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          previous();
          break;
        case 'ArrowRight':
          next();
          break;
        case 'Escape':
          onClose();
          break;
        case '+':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, next, previous, onClose, zoomIn, zoomOut]);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {totalImages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomOut}
                disabled={scale <= 1}
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomIn}
                disabled={scale >= 4}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetZoom}
                disabled={scale === 1}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Main Image */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            {...swipeHandlers}
            {...pinchHandlers.handlers}
          >
            <motion.img
              key={currentImage.id}
              src={currentImage.src}
              alt={currentImage.alt || ''}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Navigation Arrows */}
          {totalImages > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  previous();
                  trigger('light');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 hidden sm:flex"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  next();
                  trigger('light');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 hidden sm:flex"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Thumbnails */}
          {totalImages > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      goTo(idx);
                      trigger('light');
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentIndex
                        ? 'border-white opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-75'
                    }`}
                  >
                    <img
                      src={img.thumbnail || img.src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

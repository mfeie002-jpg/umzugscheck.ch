import { useState, useCallback } from 'react';

interface GalleryImage {
  id: string;
  src: string;
  alt?: string;
  thumbnail?: string;
}

export const useImageGallery = (images: GalleryImage[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const open = useCallback((index: number = 0) => {
    setCurrentIndex(index);
    setScale(1);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setScale(1);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
    setScale(1);
  }, [images.length]);

  const previous = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    setScale(1);
  }, [images.length]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
    setScale(1);
  }, [images.length]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.5, 4));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.5, 1));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  return {
    currentIndex,
    currentImage: images[currentIndex],
    isOpen,
    scale,
    totalImages: images.length,
    open,
    close,
    next,
    previous,
    goTo,
    zoomIn,
    zoomOut,
    resetZoom,
    setScale,
  };
};

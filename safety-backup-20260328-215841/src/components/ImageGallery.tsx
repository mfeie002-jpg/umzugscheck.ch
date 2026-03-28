import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const ImageGallery = ({ images, columns = 3, className = "" }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const nextImage = () => setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
  const prevImage = () => setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openLightbox(index)}
            className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              {image.caption && (
                <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                  {image.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <motion.img
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 text-white hover:bg-white/20"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {images[selectedIndex].caption && (
            <p className="absolute bottom-8 left-0 right-0 text-center text-white text-lg">
              {images[selectedIndex].caption}
            </p>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ImageGallery;

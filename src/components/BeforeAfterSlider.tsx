import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

interface BeforeAfterItem {
  id: number;
  title: string;
  before: string;
  after: string;
  location: string;
}

const items: BeforeAfterItem[] = [
  {
    id: 1,
    title: 'Wohnzimmer-Umzug',
    before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    after: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    location: 'Zürich → Winterthur'
  },
  {
    id: 2,
    title: 'Büro-Umzug',
    before: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    after: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    location: 'Basel → Bern'
  },
  {
    id: 3,
    title: 'Küche',
    before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    after: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800',
    location: 'Luzern'
  }
];

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeItem, setActiveItem] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const item = items[activeItem];

  return (
    <AnimatedSection>
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <ArrowLeftRight className="w-3 h-3 mr-1" />
              Vorher / Nachher
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unsere Arbeit im Vergleich
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Schieben Sie den Regler, um den Unterschied zu sehen
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Item Selector */}
            <div className="flex justify-center gap-2 mb-8">
              {items.map((i, index) => (
                <button
                  key={i.id}
                  onClick={() => setActiveItem(index)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeItem === index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {i.title}
                </button>
              ))}
            </div>

            {/* Slider Container */}
            <Card className="overflow-hidden">
              <div
                ref={containerRef}
                className="relative aspect-[16/10] cursor-ew-resize select-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* After Image (Background) */}
                <div className="absolute inset-0">
                  <img
                    src={item.after}
                    alt="Nachher"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">Nachher</Badge>
                  </div>
                </div>

                {/* Before Image (Clipped) */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={item.before}
                    alt="Vorher"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">Vorher</Badge>
                  </div>
                </div>

                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {item.location}
                  </Badge>
                </div>
              </div>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-4">
              💡 Tipp: Ziehen Sie den Regler nach links oder rechts
            </p>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default BeforeAfterSlider;

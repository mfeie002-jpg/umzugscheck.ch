import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Eye, RotateCcw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Home, Bed, UtensilsCrossed, Bath, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Room {
  id: string;
  name: string;
  icon: React.ReactNode;
  imageUrl: string;
  hotspots: Array<{
    id: string;
    x: number;
    y: number;
    label: string;
    category: string;
  }>;
}

const VirtualRoomTour = () => {
  const { language } = useLanguage();
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedHotspots, setSelectedHotspots] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const translations = {
    de: {
      title: 'Virtueller Rundgang',
      subtitle: 'Laden Sie 360°-Fotos hoch oder erkunden Sie Beispielräume',
      uploadPhotos: '360° Fotos hochladen',
      rooms: {
        living: 'Wohnzimmer',
        bedroom: 'Schlafzimmer',
        kitchen: 'Küche',
        bathroom: 'Badezimmer',
        office: 'Büro'
      },
      controls: {
        zoomIn: 'Vergrössern',
        zoomOut: 'Verkleinern',
        rotate: 'Drehen',
        reset: 'Zurücksetzen'
      },
      hotspotSelected: 'Ausgewählt',
      itemsMarked: 'Gegenstände markiert',
      clickToMark: 'Klicken Sie auf Objekte zum Markieren',
      estimatedWeight: 'Geschätztes Gewicht'
    },
    en: {
      title: 'Virtual Room Tour',
      subtitle: 'Upload 360° photos or explore sample rooms',
      uploadPhotos: 'Upload 360° Photos',
      rooms: {
        living: 'Living Room',
        bedroom: 'Bedroom',
        kitchen: 'Kitchen',
        bathroom: 'Bathroom',
        office: 'Office'
      },
      controls: {
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        rotate: 'Rotate',
        reset: 'Reset'
      },
      hotspotSelected: 'Selected',
      itemsMarked: 'Items marked',
      clickToMark: 'Click on objects to mark them',
      estimatedWeight: 'Estimated weight'
    },
    fr: {
      title: 'Visite virtuelle',
      subtitle: 'Téléchargez des photos 360° ou explorez des pièces exemples',
      uploadPhotos: 'Télécharger photos 360°',
      rooms: {
        living: 'Salon',
        bedroom: 'Chambre',
        kitchen: 'Cuisine',
        bathroom: 'Salle de bain',
        office: 'Bureau'
      },
      controls: {
        zoomIn: 'Agrandir',
        zoomOut: 'Réduire',
        rotate: 'Rotation',
        reset: 'Réinitialiser'
      },
      hotspotSelected: 'Sélectionné',
      itemsMarked: 'Objets marqués',
      clickToMark: 'Cliquez sur les objets pour les marquer',
      estimatedWeight: 'Poids estimé'
    },
    it: {
      title: 'Tour virtuale',
      subtitle: 'Carica foto 360° o esplora stanze di esempio',
      uploadPhotos: 'Carica foto 360°',
      rooms: {
        living: 'Soggiorno',
        bedroom: 'Camera',
        kitchen: 'Cucina',
        bathroom: 'Bagno',
        office: 'Ufficio'
      },
      controls: {
        zoomIn: 'Ingrandisci',
        zoomOut: 'Riduci',
        rotate: 'Ruota',
        reset: 'Reimposta'
      },
      hotspotSelected: 'Selezionato',
      itemsMarked: 'Oggetti segnati',
      clickToMark: 'Clicca sugli oggetti per segnarli',
      estimatedWeight: 'Peso stimato'
    }
  };

  const t = translations[language] || translations.de;

  const rooms: Room[] = [
    {
      id: 'living',
      name: t.rooms.living,
      icon: <Home className="h-4 w-4" />,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
      hotspots: [
        { id: '1', x: 20, y: 60, label: 'Sofa', category: 'furniture' },
        { id: '2', x: 45, y: 40, label: 'TV', category: 'electronics' },
        { id: '3', x: 70, y: 70, label: 'Couchtisch', category: 'furniture' },
        { id: '4', x: 85, y: 30, label: 'Stehlampe', category: 'decor' }
      ]
    },
    {
      id: 'bedroom',
      name: t.rooms.bedroom,
      icon: <Bed className="h-4 w-4" />,
      imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=400&fit=crop',
      hotspots: [
        { id: '5', x: 50, y: 55, label: 'Bett', category: 'furniture' },
        { id: '6', x: 15, y: 45, label: 'Nachttisch', category: 'furniture' },
        { id: '7', x: 80, y: 35, label: 'Kleiderschrank', category: 'furniture' }
      ]
    },
    {
      id: 'kitchen',
      name: t.rooms.kitchen,
      icon: <UtensilsCrossed className="h-4 w-4" />,
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
      hotspots: [
        { id: '8', x: 30, y: 60, label: 'Kühlschrank', category: 'appliances' },
        { id: '9', x: 60, y: 50, label: 'Esstisch', category: 'furniture' },
        { id: '10', x: 75, y: 40, label: 'Mikrowelle', category: 'appliances' }
      ]
    },
    {
      id: 'bathroom',
      name: t.rooms.bathroom,
      icon: <Bath className="h-4 w-4" />,
      imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=400&fit=crop',
      hotspots: [
        { id: '11', x: 40, y: 65, label: 'Waschmaschine', category: 'appliances' },
        { id: '12', x: 70, y: 45, label: 'Badschrank', category: 'furniture' }
      ]
    },
    {
      id: 'office',
      name: t.rooms.office,
      icon: <Briefcase className="h-4 w-4" />,
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
      hotspots: [
        { id: '13', x: 50, y: 55, label: 'Schreibtisch', category: 'furniture' },
        { id: '14', x: 25, y: 40, label: 'Bürostuhl', category: 'furniture' },
        { id: '15', x: 80, y: 50, label: 'Regal', category: 'furniture' }
      ]
    }
  ];

  const currentRoom = rooms[currentRoomIndex];

  const toggleHotspot = (id: string) => {
    setSelectedHotspots(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const getTotalWeight = () => {
    const weights: Record<string, number> = {
      furniture: 50,
      electronics: 15,
      appliances: 40,
      decor: 5
    };
    return selectedHotspots.reduce((total, id) => {
      const hotspot = rooms.flatMap(r => r.hotspots).find(h => h.id === id);
      return total + (hotspot ? weights[hotspot.category] || 10 : 0);
    }, 0);
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Room Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide snap-x touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
          {rooms.map((room, index) => (
            <Button
              key={room.id}
              variant={currentRoomIndex === index ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0 gap-1.5"
              onClick={() => setCurrentRoomIndex(index)}
            >
              {room.icon}
              <span className="hidden sm:inline">{room.name}</span>
            </Button>
          ))}
        </div>

        {/* 360 Viewer */}
        <div className="relative rounded-lg overflow-hidden bg-muted">
          <motion.div
            className="relative aspect-video"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src={currentRoom.imageUrl}
              alt={currentRoom.name}
              className="w-full h-full object-cover"
            />
            
            {/* Hotspots */}
            <AnimatePresence>
              {currentRoom.hotspots.map(hotspot => (
                <motion.button
                  key={hotspot.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-all ${
                    selectedHotspots.includes(hotspot.id)
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                      : 'bg-white/90 text-foreground hover:bg-primary hover:text-primary-foreground'
                  }`}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  onClick={() => toggleHotspot(hotspot.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {selectedHotspots.includes(hotspot.id) ? '✓' : '+'}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Navigation Arrows */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
            onClick={() => setCurrentRoomIndex(prev => (prev - 1 + rooms.length) % rooms.length)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
            onClick={() => setCurrentRoomIndex(prev => (prev + 1) % rooms.length)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Room Label */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {currentRoom.icon}
              <span className="ml-1">{currentRoom.name}</span>
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setRotation(prev => prev + 90)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => { setZoom(1); setRotation(0); }}
            >
              <span className="text-xs">↺</span>
            </Button>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">{selectedHotspots.length} {t.itemsMarked}</p>
            <p className="text-xs text-muted-foreground">{t.estimatedWeight}: ~{getTotalWeight()} kg</p>
          </div>
        </div>

        {/* Selected Items */}
        {selectedHotspots.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="flex flex-wrap gap-1"
          >
            {selectedHotspots.map(id => {
              const hotspot = rooms.flatMap(r => r.hotspots).find(h => h.id === id);
              if (!hotspot) return null;
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => toggleHotspot(id)}
                >
                  {hotspot.label} ×
                </Badge>
              );
            })}
          </motion.div>
        )}

        {/* Upload Button */}
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={() => setIsUploading(true)}
          />
          <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4 transition-colors hover:border-primary/50 hover:bg-primary/10">
            <Camera className="h-5 w-5 text-primary/60" />
            <span className="text-sm font-medium text-primary/80">{t.uploadPhotos}</span>
          </div>
        </label>
      </CardContent>
    </Card>
  );
};

export default VirtualRoomTour;

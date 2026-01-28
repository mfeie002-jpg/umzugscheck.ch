import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, Package, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ScannedItem {
  id: string;
  name: string;
  category: string;
  estimatedWeight: number;
  fragile: boolean;
  confidence: number;
}

interface AIInventoryScannerProps {
  onItemsDetected?: (items: ScannedItem[]) => void;
}

const AIInventoryScanner = ({ onItemsDetected }: AIInventoryScannerProps) => {
  const { language } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const translations = {
    de: {
      title: 'KI Inventar-Scanner',
      subtitle: 'Fotografieren Sie Ihre Räume für automatische Inventarerkennung',
      uploadPhoto: 'Foto hochladen',
      takePhoto: 'Foto aufnehmen',
      scanning: 'Analysiere mit KI...',
      itemsDetected: 'Erkannte Gegenstände',
      category: 'Kategorie',
      weight: 'Geschätztes Gewicht',
      fragile: 'Zerbrechlich',
      confidence: 'Erkennungssicherheit',
      addToInventory: 'Zum Inventar hinzufügen',
      scanAnother: 'Weiteres Foto scannen',
      categories: {
        furniture: 'Möbel',
        electronics: 'Elektronik',
        decor: 'Dekoration',
        kitchen: 'Küche',
        bedroom: 'Schlafzimmer',
        office: 'Büro'
      }
    },
    en: {
      title: 'AI Inventory Scanner',
      subtitle: 'Photograph your rooms for automatic inventory detection',
      uploadPhoto: 'Upload Photo',
      takePhoto: 'Take Photo',
      scanning: 'Analyzing with AI...',
      itemsDetected: 'Detected Items',
      category: 'Category',
      weight: 'Estimated Weight',
      fragile: 'Fragile',
      confidence: 'Detection Confidence',
      addToInventory: 'Add to Inventory',
      scanAnother: 'Scan Another Photo',
      categories: {
        furniture: 'Furniture',
        electronics: 'Electronics',
        decor: 'Decor',
        kitchen: 'Kitchen',
        bedroom: 'Bedroom',
        office: 'Office'
      }
    },
    fr: {
      title: 'Scanner d\'inventaire IA',
      subtitle: 'Photographiez vos pièces pour une détection automatique',
      uploadPhoto: 'Télécharger une photo',
      takePhoto: 'Prendre une photo',
      scanning: 'Analyse avec IA...',
      itemsDetected: 'Objets détectés',
      category: 'Catégorie',
      weight: 'Poids estimé',
      fragile: 'Fragile',
      confidence: 'Confiance de détection',
      addToInventory: 'Ajouter à l\'inventaire',
      scanAnother: 'Scanner une autre photo',
      categories: {
        furniture: 'Meubles',
        electronics: 'Électronique',
        decor: 'Décoration',
        kitchen: 'Cuisine',
        bedroom: 'Chambre',
        office: 'Bureau'
      }
    },
    it: {
      title: 'Scanner inventario IA',
      subtitle: 'Fotografa le tue stanze per il rilevamento automatico',
      uploadPhoto: 'Carica foto',
      takePhoto: 'Scatta foto',
      scanning: 'Analisi con IA...',
      itemsDetected: 'Oggetti rilevati',
      category: 'Categoria',
      weight: 'Peso stimato',
      fragile: 'Fragile',
      confidence: 'Confidenza rilevamento',
      addToInventory: 'Aggiungi all\'inventario',
      scanAnother: 'Scansiona un\'altra foto',
      categories: {
        furniture: 'Mobili',
        electronics: 'Elettronica',
        decor: 'Decorazione',
        kitchen: 'Cucina',
        bedroom: 'Camera',
        office: 'Ufficio'
      }
    }
  };

  const t = translations[language] || translations.de;

  const simulateAIScan = () => {
    setIsScanning(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockItems: ScannedItem[] = [
        { id: '1', name: 'Sofa 3-Sitzer', category: 'furniture', estimatedWeight: 45, fragile: false, confidence: 94 },
        { id: '2', name: 'Couchtisch Glas', category: 'furniture', estimatedWeight: 25, fragile: true, confidence: 88 },
        { id: '3', name: 'Stehlampe', category: 'decor', estimatedWeight: 8, fragile: true, confidence: 91 },
        { id: '4', name: 'TV 55 Zoll', category: 'electronics', estimatedWeight: 18, fragile: true, confidence: 96 },
        { id: '5', name: 'Bücherregal', category: 'furniture', estimatedWeight: 35, fragile: false, confidence: 89 },
        { id: '6', name: 'Teppich gross', category: 'decor', estimatedWeight: 12, fragile: false, confidence: 85 }
      ];
      
      setScannedItems(mockItems);
      setIsScanning(false);
    }, 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        simulateAIScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      furniture: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      electronics: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      decor: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      kitchen: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      bedroom: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      office: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[category] || colors.furniture;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedImage && !isScanning && scannedItems.length === 0 && (
          <div className="flex flex-col gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-8 transition-colors hover:border-primary/50 hover:bg-primary/10">
                <Camera className="h-8 w-8 text-primary/60" />
                <span className="font-medium text-primary/80">{t.uploadPhoto}</span>
              </div>
            </label>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="relative">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Scanning"
                    className="h-48 w-full rounded-lg object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <span className="font-medium text-primary">{t.scanning}</span>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 border-2 border-primary/50"
                  animate={{
                    boxShadow: ['0 0 0 0 rgba(var(--primary), 0.4)', '0 0 0 20px rgba(var(--primary), 0)']
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}

          {scannedItems.length > 0 && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Scanned room"
                  className="h-40 w-full rounded-lg object-cover"
                />
              )}
              
              <div className="flex items-center gap-2">
                <Scan className="h-4 w-4 text-primary" />
                <span className="font-semibold">{t.itemsDetected}: {scannedItems.length}</span>
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
                {scannedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
                            {t.categories[item.category as keyof typeof t.categories] || item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">~{item.estimatedWeight} kg</span>
                          {item.fragile && (
                            <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {t.fragile}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className={`h-4 w-4 ${getConfidenceColor(item.confidence)}`} />
                      <span className={`text-sm font-medium ${getConfidenceColor(item.confidence)}`}>
                        {item.confidence}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => onItemsDetected?.(scannedItems)}
                  className="flex-1"
                >
                  {t.addToInventory}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setScannedItems([]);
                    setSelectedImage(null);
                  }}
                >
                  {t.scanAnother}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AIInventoryScanner;

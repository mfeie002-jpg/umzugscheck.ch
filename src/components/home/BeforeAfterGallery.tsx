import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  rooms: string;
  location: string;
  beforeEmoji: string;
  afterEmoji: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Familienwohnung Zürich",
    category: "Wohnungsumzug",
    rooms: "4.5 Zimmer",
    location: "Zürich → Winterthur",
    beforeEmoji: "📦🏠",
    afterEmoji: "✨🏡",
    description: "Kompletter Umzug einer 4.5-Zimmer-Wohnung mit Möbelmontage",
  },
  {
    id: 2,
    title: "Büroumzug Basel",
    category: "Geschäftsumzug",
    rooms: "200 m²",
    location: "Basel Innenstadt",
    beforeEmoji: "🏢💼",
    afterEmoji: "🏢✅",
    description: "Professioneller Büroumzug über Wochenende",
  },
  {
    id: 3,
    title: "Villa Genf",
    category: "Hausumzug",
    rooms: "8 Zimmer",
    location: "Genf → Lausanne",
    beforeEmoji: "🏰📦",
    afterEmoji: "🏰✨",
    description: "Luxus-Villa mit antiken Möbeln und Kunstwerken",
  },
  {
    id: 4,
    title: "Studio Bern",
    category: "Kleinumzug",
    rooms: "1.5 Zimmer",
    location: "Bern",
    beforeEmoji: "🎒🏠",
    afterEmoji: "🏠🎉",
    description: "Schneller und günstiger Studio-Umzug",
  },
];

export const BeforeAfterGallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");

  const categories = ["Alle", "Wohnungsumzug", "Hausumzug", "Geschäftsumzug", "Kleinumzug"];

  const filteredItems = selectedCategory === "Alle" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Images className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Erfolgreiche Umzüge
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sehen Sie, wie wir unseren Kunden zu einem stressfreien Umzug verholfen haben
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card
                className="cursor-pointer h-full border-2 border-border hover:border-primary transition-all overflow-hidden group"
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-6">
                  {/* Before/After Visual */}
                  <div className="relative mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-4xl">{item.beforeEmoji}</div>
                      <ChevronRight className="w-6 h-6 text-primary" />
                      <div className="text-4xl">{item.afterEmoji}</div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gray-300 via-primary to-green-500 rounded-full"></div>
                  </div>

                  {/* Info */}
                  <Badge variant="secondary" className="mb-2">
                    {item.category}
                  </Badge>
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{item.rooms}</p>
                    <p>{item.location}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-2xl w-full"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-12 right-0 text-white hover:text-white hover:bg-white/20"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                <Card>
                  <CardContent className="p-8">
                    {/* Before/After Large */}
                    <div className="mb-6">
                      <div className="flex items-center justify-around mb-4">
                        <div className="text-center">
                          <div className="text-6xl mb-2">{selectedItem.beforeEmoji}</div>
                          <p className="text-sm font-semibold text-muted-foreground">Vorher</p>
                        </div>
                        <ChevronRight className="w-8 h-8 text-primary" />
                        <div className="text-center">
                          <div className="text-6xl mb-2">{selectedItem.afterEmoji}</div>
                          <p className="text-sm font-semibold text-muted-foreground">Nachher</p>
                        </div>
                      </div>
                      <div className="h-2 bg-gradient-to-r from-gray-300 via-primary to-green-500 rounded-full"></div>
                    </div>

                    {/* Details */}
                    <Badge variant="secondary" className="mb-3">
                      {selectedItem.category}
                    </Badge>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {selectedItem.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Größe</p>
                        <p className="font-semibold">{selectedItem.rooms}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Standort</p>
                        <p className="font-semibold">{selectedItem.location}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{selectedItem.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

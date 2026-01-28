import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SwipeableGallery from "@/components/SwipeableGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import galleryPacking from "@/assets/gallery-packing-pro.jpg";
import galleryOffice from "@/assets/gallery-office-move.jpg";
import galleryDelivery from "@/assets/gallery-delivery.jpg";
import gallerySenior from "@/assets/gallery-senior-service.jpg";
import galleryStorage from "@/assets/gallery-storage.jpg";
import galleryVip from "@/assets/gallery-vip-penthouse.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const projects = [
    {
      image: galleryPacking,
      title: "Professioneller Packservice",
      category: "Packservice",
      description: "Sorgfältige Verpackung wertvoller Antiquitäten"
    },
    {
      image: galleryOffice,
      title: "Büroumzug Basel",
      category: "Büroumzug",
      description: "Kompletter Office-Move in Rekordzeit"
    },
    {
      image: galleryDelivery,
      title: "Lieferung & Einzug",
      category: "Privatumzug",
      description: "Pünktliche Lieferung in der Schweiz"
    },
    {
      image: gallerySenior,
      title: "Seniorenumzug Bern",
      category: "Seniorenumzug",
      description: "Einfühlsamer Service für ältere Menschen"
    },
    {
      image: galleryStorage,
      title: "Einlagerung Zürich",
      category: "Lagerung",
      description: "Klimatisierte Lagerflächen für Ihre Möbel"
    },
    {
      image: galleryVip,
      title: "VIP-Umzug Penthouse",
      category: "VIP Service",
      description: "White-Glove Service für Luxus-Immobilien"
    },
    {
      image: gallery1,
      title: "Privatumzug Zürich",
      category: "Privatumzug",
      description: "Modernes Apartment perfekt eingerichtet"
    },
    {
      image: gallery2,
      title: "Firmenumzug Genf",
      category: "Büroumzug",
      description: "Internationales Unternehmen erfolgreich umgezogen"
    },
    {
      image: gallery3,
      title: "Internationaler Umzug",
      category: "International",
      description: "Professioneller Export mit Zollabwicklung"
    },
    {
      image: gallery4,
      title: "Möbelmontage",
      category: "Montage",
      description: "Fachgerechte Küchenmontage durch Profis"
    },
    {
      image: gallery5,
      title: "Lagerhalle Zürich",
      category: "Lagerung",
      description: "Klimatisierte und sichere Lagerräume"
    },
    {
      image: gallery6,
      title: "Verpackungsservice",
      category: "Packservice",
      description: "Sorgfältiger Schutz für Antiquitäten"
    },
  ];

  const categories = ["Alle", "Privatumzug", "Büroumzug", "VIP Service", "International", "Seniorenumzug", "Packservice", "Lagerung", "Montage"];
  const [activeCategory, setActiveCategory] = useState("Alle");

  const filteredProjects = activeCategory === "Alle" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && selectedImage !== null && selectedImage < filteredProjects.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToPrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null && selectedImage < filteredProjects.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredProjects]);

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Galerie - Erfolgreiche Umzugsprojekte"
        description="Entdecken Sie unsere Projekt-Galerie mit Bildern von erfolgreichen Umzügen in der ganzen Schweiz. Privatumzüge, Büroumzüge und VIP-Service."
        canonical="/gallery"
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: 'https://feierabend-umzuege.ch/' },
          { name: 'Galerie', url: 'https://feierabend-umzuege.ch/gallery' }
        ]}
      />
      <Header />
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Unsere Arbeit
            </span>
            <h1 className="text-balance font-display">
              Projekt-<span className="text-gradient">Galerie</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground">
              Ein Einblick in unsere Arbeit – erfolgreiche Umzüge für zufriedene Kunden 
              in der ganzen Schweiz und darüber hinaus.
            </p>
          </div>
        </AnimatedSection>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-gradient-hero text-primary-foreground shadow-medium"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </AnimatedSection>

          {isMobile && (
            <div className="mb-8">
              <SwipeableGallery
                images={filteredProjects.map(p => p.image)}
                titles={filteredProjects.map(p => p.title)}
                onImageClick={(index) => setSelectedImage(projects.findIndex(p => p === filteredProjects[index]))}
              />
            </div>
          )}

          <motion.div 
            layout
            className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ${isMobile ? 'hidden' : ''}`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    className="overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(projects.findIndex(p => p === project))}
                  >
                    <div className="relative h-72 lg:h-80 overflow-hidden">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            className="w-14 h-14 rounded-full bg-alpine/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ZoomIn className="h-6 w-6 text-alpine-foreground" />
                          </motion.div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="text-sm font-medium text-alpine mb-2">{project.category}</div>
                          <h3 className="text-xl font-display font-semibold mb-2">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:hidden">
                      <div className="text-sm font-medium text-alpine mb-2">{project.category}</div>
                      <h3 className="text-lg font-display font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-white" />
            </motion.button>

            {selectedImage > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </motion.button>
            )}

            {selectedImage < projects.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </motion.button>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center p-4"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                src={projects[selectedImage].image}
                alt={projects[selectedImage].title}
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white px-4 max-w-2xl"
            >
              <div className="text-sm font-medium text-alpine mb-2">{projects[selectedImage].category}</div>
              <h3 className="text-xl font-display font-semibold mb-2">{projects[selectedImage].title}</h3>
              <p className="text-sm opacity-80 mb-3">{projects[selectedImage].description}</p>
              <div className="flex items-center justify-center gap-2">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImage === idx ? "bg-alpine w-6" : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-16 lg:py-20 bg-gradient-premium text-primary-foreground">
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6 font-display">Ihr Projekt könnte hier sein</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Lassen Sie uns gemeinsam Ihren Umzug zu einem Erfolg machen. 
            Kontaktieren Sie uns für eine persönliche Beratung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors min-h-[52px]"
              >
                Offerte anfragen
              </motion.button>
            </a>
            <a href="tel:+41765681302">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3.5 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors min-h-[52px]"
              >
                Anrufen
              </motion.button>
            </a>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
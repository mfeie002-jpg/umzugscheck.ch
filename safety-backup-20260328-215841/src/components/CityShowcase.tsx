import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Users, Truck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import zurichImage from '@/assets/city-zurich-new.jpg';
import baselImage from '@/assets/city-basel-new.jpg';
import bernImage from '@/assets/city-bern-new.jpg';
import genevaImage from '@/assets/city-geneva-new.jpg';
import lausanneImage from '@/assets/city-lausanne-new.jpg';
import stgallenImage from '@/assets/city-stgallen-new.jpg';

interface City {
  id: string;
  name: string;
  image: string;
  moves: number;
  rating: number;
  link: string;
}

const cities: City[] = [
  { id: 'zurich', name: 'Zürich', image: zurichImage, moves: 4500, rating: 4.9, link: '/area/zurich' },
  { id: 'basel', name: 'Basel', image: baselImage, moves: 2800, rating: 4.9, link: '/area/basel' },
  { id: 'bern', name: 'Bern', image: bernImage, moves: 2200, rating: 4.8, link: '/area/bern' },
  { id: 'geneva', name: 'Genf', image: genevaImage, moves: 1800, rating: 4.9, link: '/area/geneva' },
  { id: 'lausanne', name: 'Lausanne', image: lausanneImage, moves: 1500, rating: 4.8, link: '/area/lausanne' },
  { id: 'stgallen', name: 'St. Gallen', image: stgallenImage, moves: 1200, rating: 4.9, link: '/area/stgallen' },
];

const CityShowcase = () => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city, index) => (
        <motion.div
          key={city.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onHoverStart={() => setHoveredCity(city.id)}
          onHoverEnd={() => setHoveredCity(null)}
        >
          <Link to={city.link}>
            <Card className="relative h-64 overflow-hidden group cursor-pointer">
              {/* Background Image */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${city.image})` }}
                animate={{ scale: hoveredCity === city.id ? 1.1 : 1 }}
                transition={{ duration: 0.4 }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-white/80" />
                  <span className="text-white/80 text-sm">Schweiz</span>
                </div>
                
                <h3 className="text-2xl font-display font-bold text-white mb-3">
                  {city.name}
                </h3>
                
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>{city.moves.toLocaleString('de-CH')}+ Umzüge</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warm text-warm" />
                    <span>{city.rating}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {hoveredCity === city.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-4"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-0"
                      >
                        Mehr erfahren
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CityShowcase;

/**
 * Moving Moments Gallery
 * Celebrates emotional moving moments with real photos
 * Shows the human side of what we're building
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionMovingMomentsProps {
  language: VisionLanguage;
}

const content = {
  de: {
    title: "Momente, die zählen",
    subtitle: "Umziehen bedeutet Neuanfang. Wir helfen dabei, diese Momente stressfrei zu erleben.",
    
    moments: [
      {
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
        quote: "Der Moment, wenn die Türe zum neuen Zuhause aufgeht",
        category: "Neues Zuhause"
      },
      {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
        quote: "Das erste Frühstück in der neuen Küche",
        category: "Erster Morgen"
      },
      {
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
        quote: "Die Kinder entdecken ihr neues Zimmer",
        category: "Kinderzimmer"
      },
      {
        image: "https://images.unsplash.com/photo-1600573472591-ee6e7e3c7c8e?w=600&q=80",
        quote: "Gemeinsam den letzten Karton auspacken",
        category: "Geschafft!"
      }
    ],
    
    stats: {
      title: "Was Umziehen wirklich bedeutet",
      items: [
        { emoji: "💒", label: "Hochzeiten & Zusammenziehen" },
        { emoji: "👶", label: "Familienzuwachs" },
        { emoji: "🎓", label: "Erster eigener Haushalt" },
        { emoji: "💼", label: "Neue Karriere, neue Stadt" },
        { emoji: "🏔️", label: "Traumwohnung gefunden" },
        { emoji: "👨‍👩‍👧‍👦", label: "Mehr Platz für die Familie" }
      ]
    }
  },
  bg: {
    title: "Моменти, които имат значение",
    subtitle: "Преместването означава ново начало. Ние помагаме тези моменти да бъдат безстресови.",
    
    moments: [
      {
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
        quote: "Моментът, когато вратата към новия дом се отваря",
        category: "Нов дом"
      },
      {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
        quote: "Първата закуска в новата кухня",
        category: "Първа сутрин"
      },
      {
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
        quote: "Децата откриват новата си стая",
        category: "Детска стая"
      },
      {
        image: "https://images.unsplash.com/photo-1600573472591-ee6e7e3c7c8e?w=600&q=80",
        quote: "Заедно разопаковаме последния кашон",
        category: "Успяхме!"
      }
    ],
    
    stats: {
      title: "Какво наистина означава преместването",
      items: [
        { emoji: "💒", label: "Сватби & съжителство" },
        { emoji: "👶", label: "Разширяване на семейството" },
        { emoji: "🎓", label: "Първо собствено жилище" },
        { emoji: "💼", label: "Нова кариера, нов град" },
        { emoji: "🏔️", label: "Мечтан апартамент" },
        { emoji: "👨‍👩‍👧‍👦", label: "Повече място за семейството" }
      ]
    }
  }
};

export const VisionMovingMoments = memo(({ language }: VisionMovingMomentsProps) => {
  const t = content[language];
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-4">
            <Heart className="w-4 h-4" />
            ❤️
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-3">
            {t.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Photo Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {t.moments.map((moment, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src={moment.image}
                  alt={moment.quote}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              
              {/* Quote overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <span className="inline-block px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-bold mb-1">
                  {moment.category}
                </span>
                <p className="text-white text-xs md:text-sm font-medium leading-tight flex items-start gap-1">
                  <Quote className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-60" />
                  {moment.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Life Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
            <h3 className="text-lg md:text-xl font-bold text-center mb-6">
              {t.stats.title}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {t.stats.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="text-center p-3 rounded-xl bg-background/50 hover:bg-background transition-colors"
                >
                  <span className="text-2xl md:text-3xl block mb-1">{item.emoji}</span>
                  <p className="text-xs text-muted-foreground leading-tight">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
        
      </div>
    </section>
  );
});

VisionMovingMoments.displayName = 'VisionMovingMoments';

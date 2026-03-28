/**
 * VisionMovingMoments
 * Human, emotional "Momente die zählen" section with unique images per moment
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Home, Package, Key, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VisionLanguage } from "@/lib/vision-translations";

// Unique images for each moment
import momentNewBeginning from "@/assets/vision/moment-new-beginning.jpg";
import momentPeaceOfMind from "@/assets/vision/moment-peace-of-mind.jpg";
import momentNewDoor from "@/assets/vision/moment-new-door.jpg";

interface VisionMovingMomentsProps {
  language: VisionLanguage;
}

const content = {
  de: {
    title: "Momente die zählen.",
    subtitle: "Ein Umzug ist nicht nur Logistik – es ist ein Neustart. Wir machen ihn ruhig, planbar und sicher.",
    moments: [
      {
        title: "Der Moment, wenn es plötzlich leicht wird",
        description: "In wenigen Schritten zur passenden Offerte – ohne Telefonmarathon.",
        imageAlt: "Glückliche Familie trägt Umzugskartons ins neue Zuhause",
        image: momentNewBeginning,
        icon: Package,
        color: "text-primary",
      },
      {
        title: "Der Moment, wenn man wieder atmen kann",
        description: "Geprüfte Partner, klare Preise, echte Vergleichbarkeit.",
        imageAlt: "Professionelles Umzugsteam verpackt Möbel sorgfältig",
        image: momentPeaceOfMind,
        icon: Users,
        color: "text-secondary",
      },
      {
        title: "Der Moment, wenn die neue Tür aufgeht",
        description: "Einfach ankommen – wir kümmern uns um den Rest.",
        imageAlt: "Paar am Eingang ihres neuen Hauses mit Schlüssel",
        image: momentNewDoor,
        icon: Key,
        color: "text-primary",
      },
    ],
    kicker: "Echte Momente, echte Menschen",
  },
  bg: {
    title: "Моменти, които имат значение.",
    subtitle: "Преместването не е само логистика – това е ново начало. Ние го правим спокойно, предвидимо и сигурно.",
    moments: [
      {
        title: "Моментът, когато става лесно",
        description: "Само няколко стъпки до правилната оферта – без безкрайни обаждания.",
        imageAlt: "Щастливо семейство носи кашони в новия си дом",
        image: momentNewBeginning,
        icon: Package,
        color: "text-primary",
      },
      {
        title: "Моментът, когато можеш да си поемеш дъх",
        description: "Проверени партньори, ясни цени, реално сравнение.",
        imageAlt: "Професионален екип опакова мебели внимателно",
        image: momentPeaceOfMind,
        icon: Users,
        color: "text-secondary",
      },
      {
        title: "Моментът, когато новата врата се отвори",
        description: "Просто пристигаш – ние се грижим за останалото.",
        imageAlt: "Двойка на входа на новия си дом с ключ",
        image: momentNewDoor,
        icon: Key,
        color: "text-primary",
      },
    ],
    kicker: "Истински моменти, истински хора",
  },
  it: {
    title: "Momenti che contano.",
    subtitle: "Un trasloco non è solo logistica – è un nuovo inizio. Noi lo rendiamo calmo, prevedibile e sicuro.",
    moments: [
      {
        title: "Il momento in cui diventa facile",
        description: "Pochi step fino al preventivo giusto – senza telefonate infinite.",
        imageAlt: "Famiglia felice porta scatole nella nuova casa",
        image: momentNewBeginning,
        icon: Package,
        color: "text-primary",
      },
      {
        title: "Il momento in cui puoi respirare",
        description: "Partner verificati, prezzi chiari, confronto reale.",
        imageAlt: "Team professionale imballa mobili con cura",
        image: momentPeaceOfMind,
        icon: Users,
        color: "text-secondary",
      },
      {
        title: "Il momento in cui si apre la nuova porta",
        description: "Arrivi e basta – al resto pensiamo noi.",
        imageAlt: "Coppia all'ingresso della nuova casa con le chiavi",
        image: momentNewDoor,
        icon: Key,
        color: "text-primary",
      },
    ],
    kicker: "Momenti veri, persone vere",
  }
};

export const VisionMovingMoments = memo(({ language }: VisionMovingMomentsProps) => {
  const t = content[language] || content.de;
  
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-4">
            <Heart className="w-4 h-4" />
            {t.kicker}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Moments grid - Large cards with prominent images */}
        <div className="grid md:grid-cols-3 gap-6">
          {t.moments.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden border-2 border-border bg-card group hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={m.image}
                      alt={m.imageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Icon badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">{m.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{m.description}</p>
                    
                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary font-medium">
                      <Sparkles className="w-4 h-4" />
                      <span>Umzugscheck.ch</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
});

VisionMovingMoments.displayName = 'VisionMovingMoments';

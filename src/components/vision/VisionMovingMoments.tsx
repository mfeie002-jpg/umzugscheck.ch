/**
 * VisionMovingMoments
 * Human, emotional "Momente die zählen" section + Testimonials
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Home, ArrowRight, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VisionLanguage } from "@/lib/vision-translations";

import movingFamily from "@/assets/vision-family-moving.jpg";
import movingTeam from "@/assets/vision-moving-team.jpg";
import { VisionTestimonials } from "@/components/vision/VisionTestimonials";

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
        imageAlt: "Familie packt Umzugskartons in einem hellen Wohnzimmer",
        image: movingFamily,
      },
      {
        title: "Der Moment, wenn man wieder atmen kann",
        description: "Geprüfte Partner, klare Preise, echte Vergleichbarkeit.",
        imageAlt: "Professionelles Umzugsteam trägt Kartons sorgfältig",
        image: movingTeam,
      },
      {
        title: "Der Moment, wenn die neue Tür aufgeht",
        description: "Einfach ankommen – wir kümmern uns um den Rest.",
        imageAlt: "Einzug in ein neues Zuhause in der Schweiz",
        image: movingFamily,
      },
    ],
    kicker: "Echte Stimmen statt Versprechen",
  },
  bg: {
    title: "Моменти, които имат значение.",
    subtitle: "Преместването не е само логистика – това е ново начало. Ние го правим спокойно, предвидимо и сигурно.",
    moments: [
      {
        title: "Моментът, когато става лесно",
        description: "Само няколко стъпки до правилната оферта – без безкрайни обаждания.",
        imageAlt: "Семейство опакова кашони в светла стая",
        image: movingFamily,
      },
      {
        title: "Моментът, когато можеш да си поемеш дъх",
        description: "Проверени партньори, ясни цени, реално сравнение.",
        imageAlt: "Професионален екип за преместване носи кашони",
        image: movingTeam,
      },
      {
        title: "Моментът, когато новата врата се отвори",
        description: "Просто пристигаш – ние се грижим за останалото.",
        imageAlt: "Ново жилище в Швейцария",
        image: movingFamily,
      },
    ],
    kicker: "Истински гласове вместо обещания",
  },
  it: {
    title: "Momenti che contano.",
    subtitle: "Un trasloco non è solo logistica – è un nuovo inizio. Noi lo rendiamo calmo, prevedibile e sicuro.",
    moments: [
      {
        title: "Il momento in cui diventa facile",
        description: "Pochi step fino al preventivo giusto – senza telefonate infinite.",
        imageAlt: "Famiglia che prepara scatoloni in un soggiorno luminoso",
        image: movingFamily,
      },
      {
        title: "Il momento in cui puoi respirare",
        description: "Partner verificati, prezzi chiari, confronto reale.",
        imageAlt: "Team di trasloco professionale che trasporta scatole",
        image: movingTeam,
      },
      {
        title: "Il momento in cui si apre la nuova porta",
        description: "Arrivi e basta – al resto pensiamo noi.",
        imageAlt: "Nuova casa in Svizzera",
        image: movingFamily,
      },
    ],
    kicker: "Voci reali, risultati concreti",
  }
};

export const VisionMovingMoments = memo(({ language }: VisionMovingMomentsProps) => {
  const t = content[language] || content.de;
  
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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" />
              {t.kicker}
            </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-3">
            {t.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Moments grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {t.moments.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="overflow-hidden border border-border bg-card">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.imageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span>Umzugscheck</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials (requested) */}
        <div className="mt-10">
          <VisionTestimonials language={language} />
        </div>
        
      </div>
    </section>
  );
});

VisionMovingMoments.displayName = 'VisionMovingMoments';

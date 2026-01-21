import { memo } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionTestimonialsProps {
  language: VisionLanguage;
}

const content = {
  de: {
    title: "Was Kund:innen berichten",
    subtitle: "Kurz, konkret – mit Resultat.",
    items: [
      {
        quote: "Wir haben rund 40% gespart und waren in 48h organisiert – ohne Stress.",
        name: "Sarah M.",
        city: "Zürich",
      },
      {
        quote: "3 Offerten in einem Tag, klare Unterschiede – wir haben die beste Firma sofort erkannt.",
        name: "Lukas R.",
        city: "Bern",
      },
      {
        quote: "Keine Telefonmarathons. Formular ausgefüllt, Angebot verglichen, erledigt.",
        name: "Nadine K.",
        city: "Basel",
      },
    ],
  },
  it: {
    title: "Cosa dicono i clienti",
    subtitle: "Breve, concreto – con risultato.",
    items: [
      {
        quote: "Abbiamo risparmiato circa il 40% e in 48h era tutto organizzato – senza stress.",
        name: "Sarah M.",
        city: "Zurigo",
      },
      {
        quote: "3 preventivi in un giorno, differenze chiare – abbiamo scelto subito.",
        name: "Lukas R.",
        city: "Berna",
      },
      {
        quote: "Niente telefonate infinite. Compili, confronti, fatto.",
        name: "Nadine K.",
        city: "Basilea",
      },
    ],
  },
  bg: {
    title: "Какво казват клиентите",
    subtitle: "Кратко, конкретно – с резултат.",
    items: [
      {
        quote: "Спестихме около 40% и за 48ч всичко беше организирано – без стрес.",
        name: "Sarah M.",
        city: "Цюрих",
      },
      {
        quote: "3 оферти за един ден, ясни разлики – избрахме веднага.",
        name: "Lukas R.",
        city: "Берн",
      },
      {
        quote: "Без телефонни маратони. Попълних, сравних, готово.",
        name: "Nadine K.",
        city: "Базел",
      },
    ],
  },
} as const;

export const VisionTestimonials = memo(function VisionTestimonials({ language }: VisionTestimonialsProps) {
  const t = content[language] ?? content.de;

  return (
    <section aria-label="Testimonials" className="py-2">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-foreground">{t.title}</h3>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {t.items.map((item, idx) => (
          <motion.div
            key={`${item.name}-${idx}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06 }}
          >
            <Card className="p-5 border border-border bg-card h-full">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="inline-flex items-center gap-1 text-primary">
                  <Star className="w-4 h-4" aria-hidden="true" />
                  <Star className="w-4 h-4" aria-hidden="true" />
                  <Star className="w-4 h-4" aria-hidden="true" />
                  <Star className="w-4 h-4" aria-hidden="true" />
                  <Star className="w-4 h-4" aria-hidden="true" />
                </div>
                <Quote className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </div>

              <p className="text-sm text-foreground leading-relaxed">“{item.quote}”</p>

              <div className="mt-4 text-sm">
                <span className="font-semibold text-foreground">{item.name}</span>
                <span className="text-muted-foreground"> · {item.city}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

/**
 * Vision Light Break Component
 * Gemini Feedback: "Rhythmus durch Light Breaks" - breathing space between dense sections
 * Alternates between light/dark/visual sections for better visual rhythm
 */

import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionLightBreakProps {
  variant: 'light' | 'dark' | 'gradient' | 'quote';
  language: VisionLanguage;
  headline?: string;
  subheadline?: string;
  icon?: ReactNode;
  image?: string;
  className?: string;
}

const quotes = {
  de: [
    { text: "Der Umzug war der einfachste, den wir je hatten.", author: "Familie Müller, Zürich" },
    { text: "Endlich eine Plattform, die Schweizer Qualität versteht.", author: "Thomas K., Bern" },
    { text: "In 2 Minuten 5 faire Offerten – genau was wir brauchten.", author: "Sarah W., Basel" }
  ],
  bg: [
    { text: "Преместването беше най-лесното, което сме имали.", author: "Семейство Мюлер, Цюрих" },
    { text: "Най-накрая платформа, която разбира швейцарско качество.", author: "Томас К., Берн" },
    { text: "За 2 минути 5 честни оферти – точно това ни трябваше.", author: "Сара В., Базел" }
  ],
  it: [
    { text: "Il trasloco più semplice che abbiamo mai fatto.", author: "Famiglia Müller, Zurigo" },
    { text: "Finalmente una piattaforma che capisce la qualità svizzera.", author: "Thomas K., Berna" },
    { text: "In 2 minuti 5 preventivi equi – esattamente quello di cui avevamo bisogno.", author: "Sarah W., Basilea" }
  ]
};

export const VisionLightBreak = memo(({ 
  variant, 
  language, 
  headline, 
  subheadline, 
  icon,
  image,
  className 
}: VisionLightBreakProps) => {
  const randomQuote = quotes[language][Math.floor(Math.random() * quotes[language].length)];

  if (variant === 'quote') {
    return (
      <section className={cn("py-12 md:py-16 bg-muted/30", className)}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-foreground italic mb-4">
              "{randomQuote.text}"
            </blockquote>
            <cite className="text-sm text-muted-foreground not-italic">
              — {randomQuote.author}
            </cite>
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'light') {
    return (
      <section className={cn("py-16 md:py-24 bg-background", className)}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            {icon && <div className="mb-4 text-primary">{icon}</div>}
            {headline && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="text-lg text-muted-foreground">
                {subheadline}
              </p>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'dark') {
    return (
      <section className={cn("py-16 md:py-24 bg-slate-900 text-white", className)}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            {icon && <div className="mb-4 text-primary">{icon}</div>}
            {headline && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="text-lg text-slate-300">
                {subheadline}
              </p>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // gradient variant with optional background image
  return (
    <section 
      className={cn(
        "py-20 md:py-32 relative overflow-hidden",
        className
      )}
    >
      {image && (
        <>
          <img 
            src={image} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/90" />
        </>
      )}
      {!image && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      )}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {icon && <div className="mb-4">{icon}</div>}
          {headline && (
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4">
              {headline}
            </h2>
          )}
          {subheadline && (
            <p className="text-lg md:text-xl text-white/90">
              {subheadline}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
});

VisionLightBreak.displayName = 'VisionLightBreak';

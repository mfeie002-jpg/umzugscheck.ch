/**
 * VisionKeyVisuals - Additional visual sections for /vision page
 * Adds more emotional imagery between text-heavy sections
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Heart, TrendingUp } from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

// Import unique images
import aiTechnology from "@/assets/vision/ai-technology.jpg";
import customerHappyCall from "@/assets/vision/customer-happy-call.jpg";

interface VisionKeyVisualsProps {
  language: VisionLanguage;
  variant: 'ai' | 'customer' | 'trust';
}

const content = {
  de: {
    ai: {
      title: "KI, die versteht",
      description: "Unsere KI analysiert Umzugsvideos, erkennt Volumen und Komplexität – in Sekunden statt Stunden.",
      image: aiTechnology,
    },
    customer: {
      title: "Zufriedene Kunden",
      description: "Ein Anruf genügt: Offerten verglichen, beste Firma gefunden, Termin gebucht.",
      image: customerHappyCall,
    },
    trust: {
      title: "Schweizer Vertrauen",
      description: "Escrow-Schutz, geprüfte Partner, transparente Preise. Sicherheit auf höchstem Niveau.",
      image: customerHappyCall,
    },
  },
  bg: {
    ai: {
      title: "AI, който разбира",
      description: "Нашият AI анализира видеоклипове за преместване, разпознава обем и сложност – за секунди.",
      image: aiTechnology,
    },
    customer: {
      title: "Доволни клиенти",
      description: "Едно обаждане е достатъчно: оферти сравнени, най-добрата фирма намерена, среща резервирана.",
      image: customerHappyCall,
    },
    trust: {
      title: "Швейцарско доверие",
      description: "Escrow защита, проверени партньори, прозрачни цени. Сигурност на най-високо ниво.",
      image: customerHappyCall,
    },
  },
  it: {
    ai: {
      title: "AI che capisce",
      description: "La nostra AI analizza video di trasloco, riconosce volume e complessità – in secondi.",
      image: aiTechnology,
    },
    customer: {
      title: "Clienti soddisfatti",
      description: "Una chiamata basta: preventivi confrontati, migliore azienda trovata, appuntamento prenotato.",
      image: customerHappyCall,
    },
    trust: {
      title: "Fiducia svizzera",
      description: "Protezione Escrow, partner verificati, prezzi trasparenti. Sicurezza al massimo livello.",
      image: customerHappyCall,
    },
  }
};

const icons = {
  ai: Zap,
  customer: Heart,
  trust: Shield,
};

export const VisionKeyVisuals = memo(({ language, variant }: VisionKeyVisualsProps) => {
  const t = content[language]?.[variant] || content.de[variant];
  const Icon = icons[variant];
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={t.image}
              alt={t.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            
            {/* Icon badge */}
            <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          
          {/* Text */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">
              {t.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.description}
            </p>
            
            <div className="mt-6 flex items-center gap-2 justify-center md:justify-start">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary">Umzugscheck.ch</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

VisionKeyVisuals.displayName = 'VisionKeyVisuals';

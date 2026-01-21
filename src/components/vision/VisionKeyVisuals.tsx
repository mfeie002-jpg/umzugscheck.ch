/**
 * VisionKeyVisuals - Unique Visual Sections for /vision, /family, /investoren
 * Each variant uses a unique, contextual image
 * Full DE/BG/IT translation support
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Heart, TrendingUp, Users, Truck, Home, FileCheck } from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

// Import unique images for each variant
import movingTruckSwiss from "@/assets/vision/moving-truck-swiss.jpg";
import familyMovingHome from "@/assets/vision/family-moving-home.jpg";
import professionalMovers from "@/assets/vision/professional-movers.jpg";
import seniorCoupleKeys from "@/assets/vision/senior-couple-keys.jpg";
import youngProfessionalUnpacking from "@/assets/vision/young-professional-unpacking.jpg";
import investorMeetingRoom from "@/assets/vision/investor-meeting-room.jpg";

interface VisionKeyVisualsProps {
  language: VisionLanguage;
  variant: 'ai' | 'customer' | 'trust' | 'family' | 'investor' | 'service';
}

const content = {
  de: {
    ai: {
      title: "KI, die versteht",
      description: "Unsere KI analysiert Umzugsvideos, erkennt Volumen und Komplexität – in Sekunden statt Stunden.",
      image: movingTruckSwiss,
      icon: Zap,
    },
    customer: {
      title: "Zufriedene Kunden",
      description: "Ein Anruf genügt: Offerten verglichen, beste Firma gefunden, Termin gebucht.",
      image: familyMovingHome,
      icon: Heart,
    },
    trust: {
      title: "Schweizer Vertrauen",
      description: "Escrow-Schutz, geprüfte Partner, transparente Preise. Sicherheit auf höchstem Niveau.",
      image: seniorCoupleKeys,
      icon: Shield,
    },
    family: {
      title: "Familien in Bewegung",
      description: "Jeder Umzug ist ein neues Kapitel. Wir sorgen dafür, dass es ein gutes wird.",
      image: familyMovingHome,
      icon: Users,
    },
    investor: {
      title: "Profitables Wachstum",
      description: "10 Einnahmequellen, 90%+ Marge, skalierbare Technologie. Die Zahlen sprechen für sich.",
      image: investorMeetingRoom,
      icon: TrendingUp,
    },
    service: {
      title: "Professioneller Service",
      description: "Geprüfte Umzugsfirmen, erfahrene Teams, zuverlässige Ausführung – garantiert.",
      image: professionalMovers,
      icon: Truck,
    },
  },
  bg: {
    ai: {
      title: "AI, който разбира",
      description: "Нашият AI анализира видеоклипове за преместване, разпознава обем и сложност – за секунди.",
      image: movingTruckSwiss,
      icon: Zap,
    },
    customer: {
      title: "Доволни клиенти",
      description: "Едно обаждане е достатъчно: оферти сравнени, най-добрата фирма намерена, среща резервирана.",
      image: familyMovingHome,
      icon: Heart,
    },
    trust: {
      title: "Швейцарско доверие",
      description: "Escrow защита, проверени партньори, прозрачни цени. Сигурност на най-високо ниво.",
      image: seniorCoupleKeys,
      icon: Shield,
    },
    family: {
      title: "Семейства в движение",
      description: "Всяко преместване е нова глава. Ние се грижим тя да бъде добра.",
      image: familyMovingHome,
      icon: Users,
    },
    investor: {
      title: "Печелещ растеж",
      description: "10 източника на приходи, 90%+ марж, скалируема технология. Цифрите говорят сами.",
      image: investorMeetingRoom,
      icon: TrendingUp,
    },
    service: {
      title: "Професионална услуга",
      description: "Проверени фирми за преместване, опитни екипи, надеждно изпълнение – гарантирано.",
      image: professionalMovers,
      icon: Truck,
    },
  },
  it: {
    ai: {
      title: "AI che capisce",
      description: "La nostra AI analizza video di trasloco, riconosce volume e complessità – in secondi.",
      image: movingTruckSwiss,
      icon: Zap,
    },
    customer: {
      title: "Clienti soddisfatti",
      description: "Una chiamata basta: preventivi confrontati, migliore azienda trovata, appuntamento prenotato.",
      image: familyMovingHome,
      icon: Heart,
    },
    trust: {
      title: "Fiducia svizzera",
      description: "Protezione Escrow, partner verificati, prezzi trasparenti. Sicurezza al massimo livello.",
      image: seniorCoupleKeys,
      icon: Shield,
    },
    family: {
      title: "Famiglie in movimento",
      description: "Ogni trasloco è un nuovo capitolo. Ci assicuriamo che sia uno buono.",
      image: familyMovingHome,
      icon: Users,
    },
    investor: {
      title: "Crescita redditizia",
      description: "10 fonti di reddito, margine 90%+, tecnologia scalabile. I numeri parlano da soli.",
      image: investorMeetingRoom,
      icon: TrendingUp,
    },
    service: {
      title: "Servizio professionale",
      description: "Aziende di trasloco verificate, team esperti, esecuzione affidabile – garantita.",
      image: professionalMovers,
      icon: Truck,
    },
  }
};

export const VisionKeyVisuals = memo(({ language, variant }: VisionKeyVisualsProps) => {
  const t = content[language]?.[variant] || content.de[variant];
  const Icon = t.icon;
  
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

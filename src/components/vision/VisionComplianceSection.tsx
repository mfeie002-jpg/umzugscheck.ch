/**
 * Compliance & Regulatory Section
 * Addresses Fintech/Escrow regulatory concerns - CRITICAL for investor trust
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Lock, Building, FileCheck, 
  Scale, Server, AlertTriangle, CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionComplianceSectionProps {
  language: VisionLanguage;
}

const content = {
  de: {
    badge: "Compliance & Sicherheit",
    title: "Regulatorische Klarheit",
    subtitle: "Wie wir Fintech-Anforderungen erfüllen",
    
    // Main compliance areas
    areas: [
      {
        icon: Lock,
        title: "Escrow/Treuhand-Strategie",
        status: "Geplant",
        statusColor: "bg-amber-100 text-amber-700",
        description: "Partnerschaft mit lizenzierter Schweizer Bank für segregierte Kundengelder. Alternativ: Stripe Connect als Payment-Facilitator (kein Banklizenz nötig).",
        details: [
          "Kundengelder auf separaten Konten",
          "Keine FINMA-Lizenz nötig bei Stripe Connect",
          "Automatische Auszahlung nach Bestätigung"
        ]
      },
      {
        icon: FileCheck,
        title: "Datenschutz (DSGVO/nDSG)",
        status: "Konform",
        statusColor: "bg-green-100 text-green-700",
        description: "Vollständige Compliance mit EU-DSGVO und neuem Schweizer Datenschutzgesetz (nDSG, ab Sept. 2023).",
        details: [
          "Datenspeicherung in der Schweiz",
          "Verschlüsselung (AES-256, TLS 1.3)",
          "Recht auf Löschung implementiert"
        ]
      },
      {
        icon: Building,
        title: "Versicherungs-Vermittlung",
        status: "Partnermodell",
        statusColor: "bg-blue-100 text-blue-700",
        description: "Vermittlung über lizenzierte Partner. Keine eigene Versicherungslizenz erforderlich bei Affiliate-Modell.",
        details: [
          "Kooperation mit CH-Versicherern",
          "Affiliate-Provision statt Underwriting",
          "Keine Kapitalbindung notwendig"
        ]
      },
      {
        icon: Server,
        title: "Swiss Hosting",
        status: "Aktiv",
        statusColor: "bg-green-100 text-green-700",
        description: "100% Schweizer Cloud-Infrastruktur für maximale Datensouveränität.",
        details: [
          "Server-Standort: Schweiz",
          "Backup in CH-Rechenzentren",
          "Keine US Cloud Act Exposition"
        ]
      }
    ],
    
    // Investor reassurance
    reassurance: {
      title: "Für Investoren",
      points: [
        "Kein FINMA-Lizenzrisiko durch Stripe Connect Architektur",
        "Skalierbares Modell ohne regulatorische Kapitalanforderungen",
        "Partnermodell für Versicherung eliminiert Underwriting-Risiko"
      ]
    },
    
    disclaimer: "Die regulatorische Strategie wurde mit Fokus auf Skalierbarkeit und Risikominimierung entwickelt. Finale rechtliche Prüfung vor Go-Live empfohlen."
  },
  bg: {
    badge: "Съответствие & Сигурност",
    title: "Регулаторна яснота",
    subtitle: "Как изпълняваме Fintech изискванията",
    
    areas: [
      {
        icon: Lock,
        title: "Escrow/Доверителна сметка стратегия",
        status: "Планирано",
        statusColor: "bg-amber-100 text-amber-700",
        description: "Партньорство с лицензирана швейцарска банка за сегрегирани клиентски средства. Алтернатива: Stripe Connect като Payment-Facilitator.",
        details: [
          "Клиентски средства в отделни сметки",
          "Не е нужен FINMA лиценз при Stripe Connect",
          "Автоматично изплащане след потвърждение"
        ]
      },
      {
        icon: FileCheck,
        title: "Защита на данните (GDPR/nDSG)",
        status: "Съответства",
        statusColor: "bg-green-100 text-green-700",
        description: "Пълно съответствие с EU-GDPR и новия швейцарски закон за защита на данните (nDSG).",
        details: [
          "Съхранение на данни в Швейцария",
          "Криптиране (AES-256, TLS 1.3)",
          "Право на изтриване имплементирано"
        ]
      },
      {
        icon: Building,
        title: "Застрахователно посредничество",
        status: "Партньорски модел",
        statusColor: "bg-blue-100 text-blue-700",
        description: "Посредничество чрез лицензирани партньори. Не е необходим собствен застрахователен лиценз.",
        details: [
          "Сътрудничество с CH застрахователи",
          "Affiliate комисионна вместо Underwriting",
          "Не е необходимо капиталово обвързване"
        ]
      },
      {
        icon: Server,
        title: "Swiss Hosting",
        status: "Активен",
        statusColor: "bg-green-100 text-green-700",
        description: "100% швейцарска облачна инфраструктура за максимален суверенитет на данните.",
        details: [
          "Местоположение на сървъра: Швейцария",
          "Backup в CH центрове за данни",
          "Без US Cloud Act експозиция"
        ]
      }
    ],
    
    reassurance: {
      title: "За инвеститори",
      points: [
        "Без FINMA лицензен риск чрез Stripe Connect архитектура",
        "Мащабируем модел без регулаторни капиталови изисквания",
        "Партньорски модел за застраховка елиминира Underwriting риск"
      ]
    },
    
    disclaimer: "Регулаторната стратегия е разработена с фокус върху мащабируемост и минимизиране на риска. Препоръчва се финална правна проверка преди Go-Live."
  }
};

export const VisionComplianceSection = memo(({ language }: VisionComplianceSectionProps) => {
  const t = content[language];
  
  return (
    <section className="py-8 md:py-12 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-10"
          >
            <Badge className="mb-2 md:mb-3 bg-primary/10 text-primary text-xs">
              <Shield className="w-3 h-3 mr-1" />
              {t.badge}
            </Badge>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{t.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{t.subtitle}</p>
          </motion.div>
          
          {/* Compliance Areas Grid */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-6 md:mb-8">
            {t.areas.map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-4 md:p-5 h-full">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <area.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                        <h3 className="font-bold text-sm md:text-base text-foreground">{area.title}</h3>
                        <Badge className={`${area.statusColor} text-[10px] md:text-xs`} variant="secondary">
                          {area.status}
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                        {area.description}
                      </p>
                      <ul className="space-y-1 md:space-y-1.5">
                        {area.details.map((detail, j) => (
                          <li key={j} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Investor Reassurance Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-4 md:p-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-2 md:mb-3 text-sm md:text-base">
                    {t.reassurance.title}
                  </h4>
                  <ul className="space-y-1.5 md:space-y-2">
                    {t.reassurance.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm text-green-700 dark:text-green-400">
                        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-6 flex items-start gap-2 text-[10px] md:text-xs text-muted-foreground max-w-2xl mx-auto"
          >
            <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 mt-0.5" />
            <p>{t.disclaimer}</p>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
});

VisionComplianceSection.displayName = 'VisionComplianceSection';

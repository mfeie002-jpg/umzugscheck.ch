/**
 * Vision Uniqueness Component
 * Explains why this doesn't exist anywhere in the world (not just Switzerland)
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Globe, AlertTriangle, CheckCircle2, 
  X, Lightbulb, Zap, Shield
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionUniquenessProps {
  language: VisionLanguage;
}

const content = {
  de: {
    badge: "Warum gibt es das noch nicht?",
    title: "Weltweit einzigartig – nicht nur in der Schweiz",
    subtitle: "Warum hat das noch niemand gebaut, obwohl es so offensichtlich scheint?",
    
    challenges: {
      title: "Die 4 Haupthürden, die andere scheitern lassen",
      items: [
        {
          icon: "💰",
          title: "Hohe Anfangsinvestition",
          problem: "Man braucht gleichzeitig: Tech-Team, Provider-Netzwerk, Marketing, Compliance",
          why: "Klassische Startups fokussieren auf eines – wir machen alles parallel mit KI"
        },
        {
          icon: "🤝",
          title: "Henne-Ei-Problem",
          problem: "Kunden wollen viele Anbieter, Anbieter wollen viele Kunden",
          why: "Wir lösen es durch SEO-First: erst Traffic, dann Anbieter onboarden"
        },
        {
          icon: "🏛️",
          title: "Regulatorische Komplexität",
          problem: "Behörden-APIs, Datenschutz, Finanzaufsicht (Treuhand = reguliert)",
          why: "Schweiz ist klein genug, um alle Kantone einzeln zu erschliessen"
        },
        {
          icon: "🧠",
          title: "Know-how Kombination",
          problem: "Man braucht: PropTech + FinTech + AI + Logistics + Marketing-Expertise",
          why: "Selten vereint in einem Team – wir haben alles durch KI-Automatisierung"
        }
      ]
    },
    
    competitors: {
      title: "Warum existierende Lösungen scheitern",
      items: [
        {
          name: "MOVU (Schweiz)",
          problem: "Nur Lead-Verkauf, keine echte Plattform-Kontrolle",
          icon: "🇨🇭"
        },
        {
          name: "Movinga (Deutschland)",
          problem: "Zu schnell skaliert ohne Unit Economics → Insolvenz",
          icon: "🇩🇪"
        },
        {
          name: "HomeAdvisor (USA)",
          problem: "Generisches Lead-Gen, kein Umzugs-Fokus, keine Escrow",
          icon: "🇺🇸"
        },
        {
          name: "TaskRabbit (Global)",
          problem: "Nur kleine Jobs, kein End-to-End Umzugsservice",
          icon: "🌍"
        }
      ]
    },
    
    uniqueFactors: {
      title: "Was uns wirklich einzigartig macht",
      items: [
        {
          title: "10 Revenue Streams statt 1",
          desc: "Niemand kombiniert: Lead-Gen + Provision + Escrow + Insurance + SaaS + Affiliate",
          color: "bg-green-500"
        },
        {
          title: "95% KI-Automatisierung",
          desc: "Von Video-Analyse bis Behörden-Bot – minimale Personalkosten",
          color: "bg-blue-500"
        },
        {
          title: "Fintech-Layer (Escrow)",
          desc: "Wir kontrollieren den Geldfluss – das macht uns zur Plattform, nicht zum Makler",
          color: "bg-purple-500"
        },
        {
          title: "Schweiz als Proof-of-Concept",
          desc: "Klein genug zum Dominieren, reich genug für Premium-Preise, skalierbar auf DACH",
          color: "bg-amber-500"
        }
      ]
    },
    
    conclusion: {
      title: "Zusammenfassung",
      text: "Es gibt weltweit keine Plattform, die alle 10 Services (Umzug, Reinigung, Versicherung, Behörden, Entsorgung...) mit KI-Automatisierung, Treuhand-Sicherheit und 90%+ Marge kombiniert. Wir bauen nicht 'noch ein Umzugsportal' – wir bauen das 'Stripe für Umzüge'."
    }
  },
  bg: {
    badge: "Защо това още не съществува?",
    title: "Уникално в световен мащаб – не само в Швейцария",
    subtitle: "Защо никой не е построил това, въпреки че изглежда толкова очевидно?",
    
    challenges: {
      title: "4-те основни пречки, които провалят другите",
      items: [
        {
          icon: "💰",
          title: "Висока начална инвестиция",
          problem: "Нужни са едновременно: Tech екип, мрежа от партньори, маркетинг, compliance",
          why: "Класическите стартъпи се фокусират върху едно – ние правим всичко паралелно с AI"
        },
        {
          icon: "🤝",
          title: "Проблем кокошка-яйце",
          problem: "Клиентите искат много доставчици, доставчиците искат много клиенти",
          why: "Решаваме го чрез SEO-First: първо трафик, после onboarding на партньори"
        },
        {
          icon: "🏛️",
          title: "Регулаторна сложност",
          problem: "APIs за власти, защита на данни, финансов надзор (Escrow = регулиран)",
          why: "Швейцария е достатъчно малка, за да обхванем всички кантони поотделно"
        },
        {
          icon: "🧠",
          title: "Комбинация от know-how",
          problem: "Нужни са: PropTech + FinTech + AI + Logistics + Marketing експертиза",
          why: "Рядко обединени в един екип – ние имаме всичко чрез AI автоматизация"
        }
      ]
    },
    
    competitors: {
      title: "Защо съществуващите решения се провалят",
      items: [
        { name: "MOVU (Швейцария)", problem: "Само продажба на leads, без реален контрол на платформата", icon: "🇨🇭" },
        { name: "Movinga (Германия)", problem: "Твърде бързо мащабиране без Unit Economics → Несъстоятелност", icon: "🇩🇪" },
        { name: "HomeAdvisor (САЩ)", problem: "Генеричен Lead-Gen, без фокус върху преместване, без Escrow", icon: "🇺🇸" },
        { name: "TaskRabbit (Глобален)", problem: "Само малки задачи, без пълна услуга за преместване", icon: "🌍" }
      ]
    },
    
    uniqueFactors: {
      title: "Какво наистина ни прави уникални",
      items: [
        { title: "10 източника на приходи вместо 1", desc: "Никой не комбинира: Lead-Gen + Комисионна + Escrow + Застраховка + SaaS + Affiliate", color: "bg-green-500" },
        { title: "95% AI автоматизация", desc: "От видео анализ до бот за власти – минимални разходи за персонал", color: "bg-blue-500" },
        { title: "Fintech слой (Escrow)", desc: "Контролираме паричния поток – това ни прави платформа, не посредник", color: "bg-purple-500" },
        { title: "Швейцария като Proof-of-Concept", desc: "Достатъчно малка за доминиране, достатъчно богата за премиум цени, мащабируема към DACH", color: "bg-amber-500" }
      ]
    },
    
    conclusion: {
      title: "Обобщение",
      text: "Няма платформа в света, която комбинира всички 10 услуги (преместване, почистване, застраховка, власти, изхвърляне...) с AI автоматизация, Escrow сигурност и 90%+ марж. Не строим 'още един портал за преместване' – строим 'Stripe за преместване'."
    }
  }
};

export const VisionUniqueness = memo(({ language }: VisionUniquenessProps) => {
  const t = content[language];
  
  return (
    <section className="py-12 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-3 bg-white/10 text-white hover:bg-white/20">
            <Globe className="w-3 h-3 mr-1" />
            {t.badge}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t.title}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Challenges Grid */}
        <div className="max-w-5xl mx-auto mb-10">
          <h3 className="text-lg font-bold mb-4 text-center">{t.challenges.title}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {t.challenges.items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-4 bg-white/5 border-white/10 h-full">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-red-400 mb-2 flex items-start gap-1">
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {item.problem}
                      </p>
                      <p className="text-sm text-green-400 flex items-start gap-1">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {item.why}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Competitors */}
        <div className="max-w-4xl mx-auto mb-10">
          <h3 className="text-lg font-bold mb-4 text-center">{t.competitors.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {t.competitors.items.map((comp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-3 bg-red-950/30 border-red-800/50 h-full">
                  <div className="text-center">
                    <span className="text-xl mb-1 block">{comp.icon}</span>
                    <p className="font-bold text-sm text-white mb-1">{comp.name}</p>
                    <p className="text-xs text-red-300">{comp.problem}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Unique Factors */}
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-lg font-bold mb-4 text-center">{t.uniqueFactors.title}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {t.uniqueFactors.items.map((factor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -10 : 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-4 bg-white/5 border-white/10 h-full">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full ${factor.color} mt-1.5 flex-shrink-0`} />
                    <div>
                      <h4 className="font-bold text-white text-sm">{factor.title}</h4>
                      <p className="text-xs text-slate-400">{factor.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-3xl mx-auto p-5 bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/50">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-2">{t.conclusion.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t.conclusion.text}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
});

VisionUniqueness.displayName = 'VisionUniqueness';
